import { readdirSync, statSync, createReadStream } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'
import { scheduleJob } from 'node-schedule'
import { cloneDeep } from 'lodash'
import { getYesterdayDate, checkPathExists, write2Excel } from '../utils'
import { originWaferReportExcelData } from '../constants'

let filePathObj
let win
let executionDate
let isFirstRun = true
let task

async function runGenWaferReportFileTask(event, obj, mainWindow) {
  win = mainWindow
  filePathObj = obj
  win.webContents.send('log', 'WaferReport定時任務啓動')
  if (isFirstRun) {
    task = scheduleJob('5 0 * * *', () => {
      executionDate = getYesterdayDate('')
      genWaferReportFileTask(obj, executionDate)
    })
    isFirstRun = false
  }
  executionDate = getYesterdayDate('')
  genWaferReportFileTask(obj, executionDate)
}

let waferReportExcelData
let excelDataArray

function genWaferReportFileTask(obj, executionDate) {
  waferReportExcelData = cloneDeep(originWaferReportExcelData)
  excelDataArray = waferReportExcelData[0].data
  const wrFilePath = obj.wrFilePath
  if (wrFilePath) {
    readFile(wrFilePath, executionDate)
  }
}

let pendingLength

function readFile(dirPath, executionDate) {
  const files = readdirSync(dirPath)
  const pendingHandle = []
  let completePath
  let fileCount = 0
  files.forEach((fileName) => {
    completePath = join(dirPath, fileName)
    const stats = statSync(completePath)
    if (stats.isFile && file.includes(executionDate)) {
      fileCount++
      pendingHandle.push({
        completePath: completePath,
        fileName: fileName,
      })
    }
  })
  if (fileCount === 0) {
    win.webContents.send('log', `${executionDate} WaferReport沒有符合的檔案`)
    return
  } else {
    fileCount = 0
  }
  pendingLength = pendingHandle.length
  pendingHandle.forEach((item) => {
    win.send('wrCurrentProcessFile', item.fileName)
    handleFile(item.completePath, item.fileName)
  })
}

function handleFile(path, fileName) {
  const rl = createInterface({
    input: createReadStream(path),
    output: process.stdout,
    terminal: false,
  })
  let countNumberLine = 0
  rl.on('line', (line) => {
    const tmpArray = line.split(',')
    if (line.startsWith('WaferNo')) {
      excelDataArray.push(getInitArray())
      const arrary = fileName.split('-')
      const time = arrary[2]
      const formatDate = `${time.slice(0, 4)}/${time.slice(4, 6)}/${time.slice(6, 8)}`
      excelDataArray[excelDataArray.length - 1][0] = formatDate
      const formatTime = `${time.slice(8, 10)}:${time.slice(10, 12)}`
      excelDataArray[excelDataArray.length - 1][1] = formatTime
      excelDataArray[excelDataArray.length - 1][2] = line.split('-')[1]
    } else if (line.startsWith('Machine No')) {
      excelDataArray[excelDataArray.length - 1][3] =
        tmpArray[tmpArray.length - 1]
    } else if (!isNaN(Number(tmpArray[0], 10)) && tmpArray[0] !== '') {
      countNumberLine++
      excelDataArray[excelDataArray.length - 1][countNumberLine + 7] =
        tmpArray[3]
    } else if (line.startsWith('Total')) {
      excelDataArray[excelDataArray.length - 1][4] = tmpArray[1]
      const bound = tmpArray[2]
      excelDataArray[excelDataArray.length - 1][5] = bound
      const total = tmpArray[3]
      excelDataArray[excelDataArray.length - 1][6] = total
      const totalYield =
        ((Number(bound) / Number(total)) * 100).toFixed(2) + '%'
      excelDataArray[excelDataArray.length - 1][7] = totalYield
    }
  })
  rl.on('close', () => {
    pendingLength--
    if (pendingLength === 0) {
      write2Excel('wr', filePathObj, waferReportExcelData, excelDate, win)
      waferReportExcelData = cloneDeep(originWaferReportExcelData)
      win.send('wrCurrentProcessFile', '')
      excelDataArray = null
    }
  })
}

function getInitArray() {
  const result = []
  for (let i = 0; i < 8; i++) {
    result.push('-')
  }
  for (let i = 0; i < 150; i++) {
    result.push('0')
  }
  return result
}

export default runGenWaferReportFileTask
