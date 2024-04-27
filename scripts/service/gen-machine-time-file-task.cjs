const fs = require('fs')
const path = require('path')
const readline = require('readline')
const schedule = require('node-schedule')
const _ = require('lodash')
const { originMachineReportExcelData } = require('./constants.cjs')
const write2Excel = require('./write2excel.cjs')

let filePathObj
let task
let isFirstRun = true
let win

async function runGenMachineTimeFileTask(event, obj, mainWindow) {
  win = mainWindow
  filePathObj = obj
  if (isFirstRun) {
    task = schedule.scheduleJob('1 0 * * *', () => {
      genMachineTimeFileTask(obj, getYesterdayDate())
    })
    isFirstRun = false
  }
  genMachineTimeFileTask(obj, getCurrentDate())
}

function getCurrentDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0') // 补齐前导零
  return `${year}_${month}_${day}`
}

function getYesterdayDate() {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const year = yesterday.getFullYear()
  const month = String(yesterday.getMonth() + 1).padStart(2, '0')
  const day = String(yesterday.getDate()).padStart(2, '0') // 补齐前导零
  return `${year}_${month}_${day}`
}

let machineReportExcelData

function genMachineTimeFileTask(obj, executionDate) {
  machineReportExcelData = _.cloneDeep(originMachineReportExcelData)
  if (obj.mtFilePath1) {
    readFile(obj.mtFilePath1)
  }
  if (obj.mtFilePath2) {
    readFile(obj.mtFilePath2)
  }
  // TODO 两个文件都读完再写入Excel
}

function readFile(dirPath, executionDate) {
  const files = fs.readdirSync(dirPath)
  files.forEach((file) => {
    const completePath = path.join(dirPath, file)
    const stats = fs.statSync(completePath)
    if (stats.isFile && file.includes(executionDate) && file.includes('MachineReport')) {
      win.send('mtCurrentProcessFile', file)
      handleMachieReport(completePath, file)
    } else if (stats.isFile && file.includes(executionDate) && file.includes('AlarmReport')) {
      win.send('wrCurrentProcessFile', file)
      handleAlarmReport(completePath, file)
    }
  })
}

function handleMachieReport(path, file) {
  const arrary = file.split('_')
  const formatTime = `${arrary[2]}/${arrary[3]}/${arrary[4]} ${arrary[5]}:${arrary[6]}`
  machineReportExcelData[0].data[1].push(formatTime)
  machineReportExcelData[0].data[1].push(arrary[1])

  const rl = readline.createInterface({
    input: fs.createReadStream(path),
    output: process.stdout,
    terminal: false,
  })
  let isFirstLine = true
  let sumDieBonded = 0
  let idleTimeArray = [], upTimeArray = [], runTimeArray = [], downTimeArray = [], alarmTimeArray = []
  rl.on('line', (line) => {
    if (isFirstLine) {
      isFirstLine = false
      return
    }
    const tmpArray = line.split(',')
    sumDieBonded += parseInt(tmpArray[2])
    idleTimeArray.push(tmpArray[3])
    upTimeArray.push(tmpArray[4])
    runTimeArray.push(tmpArray[5])
    downTimeArray.push(tmpArray[6])
    alarmTimeArray.push(tmpArray[7])
  })
  rl.on('close', () => {
    machineReportExcelData[0].data[1].push(sumDieBonded)
    machineReportExcelData[0].data[1].push(sumTime(idleTimeArray))
    const upTime = sumTime(upTimeArray)
    machineReportExcelData[0].data[1].push(upTime)
    const runTime = sumTime(runTimeArray)
    machineReportExcelData[0].data[1].push(runTime)
    machineReportExcelData[0].data[1].push(sumTime(downTimeArray))
    machineReportExcelData[0].data[1].push(sumTime(alarmTimeArray))
    const daliyCapacity = Math.round((sumDieBonded * 24) / 1000)
    machineReportExcelData[0].data[1].push(daliyCapacity + 'K')
    const achineUtilization =
      (getTotalSeconds(runTime) / getTotalSeconds(upTime)) * 100
    machineReportExcelData[0].data[1].push(achineUtilization.toFixed(2) + '%')
    write2Excel(filePathObj, machineReportExcelData)
    isFirstLine = true
    sumDieBonded = idleTimeArray.length = upTimeArray.length = downTimeArray.length = alarmTimeArray.length = 0
    win.send('mtCurrentProcessFile', '')
  })
}

function sumTime(times) {
  let totalSeconds = 0
  // 遍历时间数组，将每个时间转换为秒数并累加
  times.forEach((time) => {
    totalSeconds = getTotalSeconds(time)
  })
  // 计算总的小时、分钟、秒数
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  // 格式化时间字符串
  const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  return formattedTime
}

function getTotalSeconds(time) {
  let totalSeconds = 0
  const [hours, minutes, seconds] = time.split(':').map(Number)
  totalSeconds += hours * 3600 + minutes * 60 + seconds
  return totalSeconds
}

function handleAlarmReport(path, file) {
  const rl = readline.createInterface({
    input: fs.createReadStream(path),
    output: process.stdout,
    terminal: false,
  })
  let isFirstLine = true
  rl.on('line', (line) => {
    if (isFirstLine) {
      isFirstLine = false
      return
    }
    const array = line.split(',')
  })
}

module.exports = runGenMachineTimeFileTask
