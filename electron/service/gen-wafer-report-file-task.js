import { readdirSync, statSync, createReadStream } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'
import { scheduleJob } from 'node-schedule'
import { cloneDeep } from 'lodash'
import { getYesterdayDate, checkPathExists, write2Excel } from '../utils'
import { originWaferReportExcelData } from '../constants'

let filePathObj
let win
let excelDate
let isFirstRun = true
let task

async function runGenWaferReportFileTask(event, obj, mainWindow) {
  win = mainWindow
  filePathObj = obj
  if (isFirstRun) {
    task = scheduleJob('5 0 * * *', () => {
      excelDate = getYesterdayDate('_')
      genWaferReportFileTask(obj, excelDate)
    })
    isFirstRun = false
  }
  excelDate = getYesterdayDate('_')
  genWaferReportFileTask(obj, excelDate)
}

let waferReportExcelData
let excelDataArray

function genWaferReportFileTask(obj, excelDate) {
  waferReportExcelData = cloneDeep(originWaferReportExcelData)
  excelDataArray = waferReportExcelData[0].data
  const wrFilePath = obj.wrFilePath
  if (wrFilePath) {
    readFile(wrFilePath, excelDate)
  }
}

let pendingLength

function readFile(dirPath, executionDate) {
  dirPath += `\\${excelDate}\\`
  if (checkPathExists(dirPath) === 'not exists') {
    win.send('log', `找不到該文件夾：${dirPath}`)
    return
  }
  const files = readdirSync(dirPath)
  const pendingHandle = []
  let completePath
  files.forEach((file) => {
    completePath = join(dirPath, file)
    const stats = statSync(completePath)
    if (stats.isFile && file.includes(executionDate)) {
      pendingHandle.push({
        completePath: completePath,
        fileName: file,
      })
    }
  })
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
      const arrary = fileName.split('_')
      const formatDate = `${arrary[0]}/${arrary[1]}/${arrary[2]}`
      excelDataArray[excelDataArray.length - 1][0] = formatDate
      const formatTime = `${arrary[3]}:${arrary[4]}`
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
