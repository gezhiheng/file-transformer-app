import type { BrowserWindow } from 'electron'
import type { WorkSheet } from 'node-xlsx'
import { scheduleJob } from 'node-schedule'
import { readdirSync, renameSync, createReadStream, readFileSync } from 'fs'
import { createInterface } from 'readline'
import { detect } from 'jschardet'
import { decodeStream } from 'iconv-lite'
import { join } from 'path'
import { cloneDeep } from 'lodash'
import { checkPathExists, write2excel } from 'e/utils'
import originMachineTimeExcelData from './origin-machine-time-excel-data'

let isFirstRun = true
let win: BrowserWindow
let filePathObj: ProbeMachineTimeFilePathObj
let machineTimeExcel: WorkSheet[]

function runGenMachineTimeFileTask(
  obj: ProbeMachineTimeFilePathObj,
  browserWindow: BrowserWindow,
) {
  win = browserWindow
  filePathObj = obj
  if (isFirstRun) {
    win.webContents.send('probe:log', 'MachineTime監控任務啓動')
    scheduleJob('0/3 * * * * ?', () => {
      genMachineTimeFileTask()
    }).invoke()
    isFirstRun = false
  }
}

let fileNameDate: string
let machineNo: string
let sheet: WorkSheet

function genMachineTimeFileTask() {
  machineTimeExcel = cloneDeep(originMachineTimeExcelData)
  sheet = machineTimeExcel[0]
  handleMachineTimeMonitorPath()
}

function handleMachineTimeMonitorPath() {
  const path = filePathObj.machineTimeMonitorPath
  const files = readdirSync(path)
  files.forEach((fileName) => {
    const compeletePath = join(path, fileName)
    const fileStatus = checkPathExists(compeletePath)
    if (fileStatus.isExist && fileStatus.isFile) {
      const tempArray = fileName.split('-')
      fileNameDate = tempArray[1]
      machineNo = tempArray[0]
      readMachineTimeFile(compeletePath, fileName)
      handleAlarmReportMonitorPath()
    }
  })
}

function readMachineTimeFile(compeletePath: string, toMoveFileName: string) {
  // 获取字符编码
  const binary = readFileSync(compeletePath, { encoding: 'binary' })
  const txt = detect(binary)
  // 创建文件流逐行读取
  const rl = createInterface({
    input: createReadStream(compeletePath).pipe(decodeStream(txt.encoding)),
    output: process.stdout,
    terminal: false,
  })
  rl.on('line', (line) => {
    const array: string[] = line.split(',')
    if (array.length < 2) {
      return
    }
    const matchObj = {
      'Total Chip': 1,
      'IDLE TIME': 2,
      'UP TIME': 3,
      'RUN TIME': 4,
      'DOWN TIME': 5,
      'ALARM TIME': 6,
      'SETUP TIME': 7,
    }
    sheet.data[1][0] = machineNo
    const index: number = matchObj[array[0]]
    if (index === undefined) {
      return
    }
    sheet.data[1][index] = array[1]
  })
  rl.on('close', () => {
    const toMoveCompeletePath = join(
      filePathObj.machineTimeMovePath,
      toMoveFileName,
    )
    moveFile(compeletePath, toMoveCompeletePath)
  })
}

function handleAlarmReportMonitorPath() {
  if (!fileNameDate) {
    return
  }
  const path = filePathObj.alarmReportMonitorPath
  const files = readdirSync(path)
  files.forEach((fileName) => {
    const compeletePath = join(path, fileName)
    const fileStatus = checkPathExists(compeletePath)
    if (fileStatus.isExist && fileStatus.isFile) {
      // 找到目标文件夹下包含对应年月日的文件
      if (fileName.includes(fileNameDate.slice(0, 8))) {
        readAlarmReportFile(compeletePath, fileName)
      }
    }
  })
}

function readAlarmReportFile(compeletePath: string, toMoveFileName: string) {
  const binary = readFileSync(compeletePath, { encoding: 'binary' })
  const txt = detect(binary)
  // 创建文件流逐行读取
  const rl = createInterface({
    input: createReadStream(compeletePath).pipe(decodeStream(txt.encoding)),
    output: process.stdout,
    terminal: false,
  })
  let fristLine = true
  rl.on('line', (line) => {
    if (fristLine) {
      fristLine = false
      return
    }
    sheet.data.push(line.split(','))
  })
  rl.on('close', () => {
    fristLine = true
    const resultFileName = `MachineTime-${machineNo}-${fileNameDate}.xlsx`
    try {
      const resultFilePath = join(
        filePathObj.machineTimeOutputPath,
        resultFileName,
      )
      write2excel(resultFilePath, machineTimeExcel)
    } catch (err) {
      win.webContents.send('probe:log', `Excel寫入時發生錯誤：${err}`)
    }
    const toMoveCompeletePath = join(
      filePathObj.machineTimeMovePath,
      toMoveFileName,
    )
    moveFile(compeletePath, toMoveCompeletePath)
  })
}

function moveFile(sourcePath: string, targetPath: string): boolean {
  try {
    renameSync(sourcePath, targetPath)
  } catch (err) {
    win.webContents.send('probe:log', `檔案移動失敗：${err}`)
    return false
  }
  return true
}

export default runGenMachineTimeFileTask
