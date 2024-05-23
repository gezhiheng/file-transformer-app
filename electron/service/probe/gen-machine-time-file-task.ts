import type { BrowserWindow } from 'electron'
import type { WorkSheet } from 'node-xlsx'
import { scheduleJob } from 'node-schedule'
import { readdirSync, renameSync, readFileSync } from 'fs'
import { detect } from 'jschardet'
import { decode } from 'iconv-lite'
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
      machineNo = tempArray[0]
      fileNameDate = tempArray[1]
      if (!fileNameDate) {
        return
      }
      readMachineTimeFile(compeletePath, fileName)
    }
  })
}

let sourceMTCompeletePath: string
let toMoveMTCompeletePath: string

function readMachineTimeFile(compeletePath: string, toMoveFileName: string) {
  const content: Buffer = readFileSync(compeletePath)
  const txt = detect(content)
  const decodedContent: string = decode(content, txt.encoding)

  const lines: string[] = decodedContent.split('\n')
  for (const line of lines) {
    const array: string[] = line.split(',')
    if (array.length < 2) {
      continue
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
      continue
    }
    sheet.data[1][index] = array[1]
  }
  const toMoveCompeletePath = join(
    filePathObj.machineTimeMovePath,
    toMoveFileName,
  )
  sourceMTCompeletePath = compeletePath
  toMoveMTCompeletePath = toMoveCompeletePath

  handleAlarmReportMonitorPath()
}

function handleAlarmReportMonitorPath() {
  const path = filePathObj.alarmReportMonitorPath
  const files = readdirSync(path)
  files.forEach((fileName) => {
    const compeletePath = join(path, fileName)
    const fileStatus = checkPathExists(compeletePath)
    if (fileStatus.isExist && fileStatus.isFile) {
      // 找到目标文件夹下包含对应年月日的文件
      const yesterdayDate = getYesterdayDate(fileNameDate)
      if (fileName.includes(yesterdayDate)) {
        readAlarmReportFile(compeletePath, fileName)
      }
    }
  })
}

function getYesterdayDate(date: string): string {
  // 解析输入日期字符串
  const year = parseInt(date.slice(0, 4), 10)
  const month = parseInt(date.slice(4, 6), 10) - 1 // 月份需要减 1，因为 JavaScript 的月份是从 0 开始的
  const day = parseInt(date.slice(6, 8), 10)

  // 创建 Date 对象
  const inputDate = new Date(year, month, day)

  // 获取昨天的日期
  const yesterday = new Date(inputDate)
  yesterday.setDate(inputDate.getDate() - 1)

  // 构造昨天日期的字符串
  const yesterdayYear = yesterday.getFullYear()
  const yesterdayMonth = (yesterday.getMonth() + 1).toString().padStart(2, '0') // 月份加 1，并且保证是两位数
  const yesterdayDay = yesterday.getDate().toString().padStart(2, '0') // 日期保证是两位数

  // 返回格式化后的昨天日期字符串
  return `${yesterdayYear}${yesterdayMonth}${yesterdayDay}`
}

function readAlarmReportFile(compeletePath: string, toMoveFileName: string) {
  const content: Buffer = readFileSync(compeletePath)
  const txt = detect(content)
  const decodedContent: string = decode(content, txt.encoding)

  const lines: string[] = decodedContent.split('\n')
  let fristLine = true
  for (const line of lines) {
    if (fristLine) {
      fristLine = false
      continue
    }
    sheet.data.push(line.split(','))
  }

  fristLine = true
  const resultFileName = `MachineTime-${machineNo}-${fileNameDate}.xlsx`
  try {
    const resultFilePath = join(
      filePathObj.machineTimeOutputPath,
      resultFileName,
    )
    let success = write2excel(resultFilePath, machineTimeExcel)
    if (success) {
      win.webContents.send(
        'probe:log',
        `Excel寫入成功，文件所在位置：${resultFilePath}`,
      )
    }
  } catch (err) {
    win.webContents.send('probe:log', `Excel寫入時發生錯誤：${err}`)
  }
  const toMoveCompeletePath = join(
    filePathObj.alarmReportMovePath,
    toMoveFileName,
  )
  moveFile(compeletePath, toMoveCompeletePath)
  moveFile(sourceMTCompeletePath, toMoveMTCompeletePath)
  machineTimeExcel = cloneDeep(originMachineTimeExcelData)
  sheet = machineTimeExcel[0]
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
