const { ipcMain, dialog } = require('electron/main')
const schedule = require('node-schedule')
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const xlsx = require('node-xlsx')
const _ = require('lodash')

const { originMachineReportExcelData } = require('./constants')

let win
let task

function service(mainWindow) {
  win = mainWindow

  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.on('genMachineTimeFileTask', runGenMachineTimeFileTask)
}

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (!canceled) {
    return filePaths[0]
  }
}

let filePathObj

async function runGenMachineTimeFileTask(event, obj) {
  filePathObj = obj
  task = schedule.scheduleJob('1 0 * * *', () => {
    console.log('run task')
  })
  if (obj.mtFilePath1) {
    const files = fs.readdirSync(obj.mtFilePath1)
    files.forEach(file => {
      const filePath = path.join(obj.mtFilePath1, file)
      const stats = fs.statSync(filePath)
      if(stats.isFile) {
        readFile(filePath, file)
      }
    })
  }
}

let machineReportExcelData = _.cloneDeep(originMachineReportExcelData)

function readFile(path, file) {
  if (file.includes('MachineReport')) {
    handleMachieReport(path, file)
  } else if (file.includes('AlarmReport')) {
    handleAlarmReport(path, file)
  }
}


function handleMachieReport(path, file) {
  const arrary = file.split('_')
  const formatTime = `${arrary[2]}/${arrary[3]}/${arrary[4]} ${arrary[5]}:${arrary[6]}`
  machineReportExcelData[0].data.push([formatTime])
  machineReportExcelData[0].data[1].push(arrary[1])

  const rl = readline.createInterface({
    input: fs.createReadStream(path),
    output: process.stdout,
    terminal: false
  })
  let isFirstLine = true
  let sumDieBonded = 0
  let idleTimeArray = [], upTimeArray = [], runTimeArray= [], downTimeArray = [], alarmTimeArray = []
  rl.on('line', (line) => {
    if(isFirstLine) {
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
    machineReportExcelData[0].data[1].push(sumTime(upTimeArray))
    machineReportExcelData[0].data[1].push(sumTime(runTimeArray))
    machineReportExcelData[0].data[1].push(sumTime(downTimeArray))
    machineReportExcelData[0].data[1].push(sumTime(alarmTimeArray))
    write2Excel(machineReportExcelData)
    isFirstLine = true
    machineReportExcelData = _.cloneDeep(originMachineReportExcelData)
    sumDieBonded = idleTimeArray.length = upTimeArray.length = downTimeArray.length = alarmTimeArray.length = 0
  })
}

function sumTime(times) {
  let totalSeconds = 0

  // 遍历时间数组，将每个时间转换为秒数并累加
  times.forEach(time => {
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
    terminal: false
  })
  rl.on('line', (line) => {
    
  })
}

function write2Excel(data) {
  let path = filePathObj.mtOutputPath ? filePathObj.mtOutputPath : filePathObj.mtFilePath1
  path += `\\MachineTime_test.xlsx`
  const buffer = xlsx.build(data)
  fs.writeFile(path, buffer, function (err) {
    if (err) {
      console.log(err, '导出excel失败')
    } else {
      console.log('导出excel成功!')
    }
  })
}

module.exports = service
