import { readdirSync, statSync, createReadStream, readFileSync } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'
import { scheduleJob } from 'node-schedule'
import { cloneDeep } from 'lodash'
import { detect } from 'jschardet'
import { decodeStream } from 'iconv-lite'
import { originMachineTimeExcelData } from '../constants'
import {
  getYesterdayDate,
  getTodayDate,
  checkPathExists,
  write2Excel,
} from '../utils'

let filePathObj
let task
let isFirstRun = true
let win
let excelDate

async function runGenMachineTimeFileTask(event, obj, mainWindow) {
  win = mainWindow
  filePathObj = obj
  win.webContents.send('log', 'MachineTime定時任務啓動')
  if (isFirstRun) {
    task = scheduleJob('5 0 * * *', () => {
      excelDate = getTodayDate('_')
      genMachineTimeFileTask(obj, excelDate)
    })
    isFirstRun = false
  }
  excelDate = getTodayDate('_')
  genMachineTimeFileTask(obj, excelDate)
}

let machineTimeExcelData

// 用来跟踪两个路径的文件处理是否完成
const doubleCheck = {
  _path1Done: false,
  get path1Done() {
    return this._path1Done
  },
  set path1Done(isDone) {
    this._path1Done = isDone
    if (this._path2Done && this._path1Done) {
      write2Excel(
        'mt',
        filePathObj,
        machineTimeExcelData,
        getYesterdayDate(''),
        win,
      )
      machineTimeExcelData = cloneDeep(originMachineTimeExcelData)
      this._path1Done = false
      this._path2Done = false
    }
  },
  _path2Done: false,
  get path2Done() {
    return this._path2Done
  },
  set path2Done(isDone) {
    this._path2Done = isDone
    if (this._path2Done && this._path1Done) {
      write2Excel(
        'mt',
        filePathObj,
        machineTimeExcelData,
        getYesterdayDate(''),
        win,
      )
      machineTimeExcelData = cloneDeep(originMachineTimeExcelData)
      this._path1Done = false
      this._path2Done = false
    }
  },
}

let fileCount = 0

function genMachineTimeFileTask(obj, executionDate) {
  machineTimeExcelData = cloneDeep(originMachineTimeExcelData)
  const mtFilePath1 = obj.mtFilePath1
  const mtFilePath2 = obj.mtFilePath2
  if (mtFilePath1 === undefined) {
    doubleCheck.path1Done = true
  }
  if (mtFilePath2 === undefined) {
    doubleCheck.path2Done = true
  }
  if (mtFilePath1) {
    readFile(mtFilePath1, executionDate)
  }
  if (mtFilePath2) {
    readFile(mtFilePath2, executionDate)
  }
  if (fileCount === 0) {
    win.webContents.send('log', `${executionDate} MachineTime沒有符合的檔案`)
  } else {
    fileCount = 0
  }
}

function readFile(dirPath, executionDate) {
  const files = readdirSync(dirPath)
  files.forEach((file) => {
    const completePath = join(dirPath, file)
    if (checkPathExists(completePath) === 'not exists') {
      win.send('log', `該路徑下找不到文件：${completePath}`)
      return
    }
    const stats = statSync(completePath)
    if (
      stats.isFile &&
      file.includes(executionDate) &&
      file.includes('MachineReport')
    ) {
      fileCount++
      win.send('mtCurrentProcessFile', file)
      handleMachieReport(completePath, file)
    } else if (
      stats.isFile &&
      file.includes(executionDate) &&
      file.includes('AlarmReport')
    ) {
      fileCount++
      win.send('mtCurrentProcessFile', file)
      handleAlarmReport(completePath, file)
    }
  })
}

function handleMachieReport(path, fileName) {
  const arrary = fileName.split('_')
  const formatTime = `${arrary[2]}/${arrary[3]}/${arrary[4]} ${arrary[5]}:${arrary[6]}`
  machineTimeExcelData[0].data[1].push(formatTime)
  machineTimeExcelData[0].data[1].push(arrary[1])

  const rl = createInterface({
    input: createReadStream(path),
    output: process.stdout,
    terminal: false,
  })
  let isFirstLine = true
  let sumDieBonded = 0
  let idleTimeArray = [],
    upTimeArray = [],
    runTimeArray = [],
    downTimeArray = [],
    alarmTimeArray = []
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
    machineTimeExcelData[0].data[1].push(sumDieBonded)
    machineTimeExcelData[0].data[1].push(sumTime(idleTimeArray))
    const upTime = sumTime(upTimeArray)
    machineTimeExcelData[0].data[1].push(upTime)
    const runTime = sumTime(runTimeArray)
    machineTimeExcelData[0].data[1].push(runTime)
    machineTimeExcelData[0].data[1].push(sumTime(downTimeArray))
    machineTimeExcelData[0].data[1].push(sumTime(alarmTimeArray))
    const daliyCapacity = Math.round((sumDieBonded * 24) / 1000)
    machineTimeExcelData[0].data[1].push(daliyCapacity + 'K')
    const achineUtilization =
      (getTotalSeconds(runTime) / getTotalSeconds(upTime)) * 100
    machineTimeExcelData[0].data[1].push(achineUtilization.toFixed(2) + '%')
    doubleCheck.path1Done = true
    isFirstLine = true
    sumDieBonded =
      idleTimeArray.length =
      upTimeArray.length =
      downTimeArray.length =
      alarmTimeArray.length =
        0
    win.send('mtCurrentProcessFile', '')
  })
}

function sumTime(times) {
  let totalSeconds = 0
  // 遍历时间数组，将每个时间转换为秒数并累加
  times.forEach((time) => {
    totalSeconds += getTotalSeconds(time)
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

function handleAlarmReport(path, fileName) {
  // 获取文件编码
  const binary = readFileSync(path, { encoding: 'binary' })
  const txt = detect(binary)
  // 创建文件流逐行读取
  const rl = createInterface({
    input: createReadStream(path).pipe(decodeStream(txt.encoding)),
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
    machineTimeExcelData[0].data.push(array)
  })
  rl.on('close', () => {
    doubleCheck.path2Done = true
    isFirstLine = true
    win.send('wrCurrentProcessFile', '')
  })
}

export default runGenMachineTimeFileTask
