import { readdirSync, statSync, createReadStream } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'
import { scheduleJob } from 'node-schedule'
import { cloneDeep } from 'lodash'
import {
  getTodayDate,
  write2excel,
  readExcel,
  setCache,
  checkCache,
} from '../../utils'
import originWaferReportExcelData from './origin-wafer-report-excel-data'

let filePathObj
let win
let executionDate
let isFirstRun = true
let task

async function runGenWaferReportFileTask(event, obj, mainWindow) {
  win = mainWindow
  filePathObj = obj
  win.send('sort:log', 'WaferReport任務啓動')
  if (isFirstRun) {
    task = scheduleJob('0/3 * * * * ?', () => {
      executionDate = getTodayDate('')
      genWaferReportFileTask(obj, executionDate)
    })
    isFirstRun = false
  }
  executionDate = getTodayDate('')
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
    if (
      stats.isFile &&
      fileName.includes(executionDate) &&
      !checkCache(executionDate, fileName)
    ) {
      fileCount++
      pendingHandle.push({
        completePath: completePath,
        fileName: fileName,
      })
    }
  })
  if (fileCount === 0) {
    return
  } else {
    fileCount = 0
  }
  pendingLength = pendingHandle.length
  pendingHandle.forEach((item) => {
    handleFile(item.completePath, item.fileName)
  })
}

const pendingCacheFileNames = []

function handleFile(path, fileName) {
  const rl = createInterface({
    input: createReadStream(path),
    output: process.stdout,
    terminal: false,
  })

  onReadLine(rl, fileName)

  onReadClose(rl)
}

function onReadLine(rl, fileName) {
  let countNumberLine = 0
  rl.on('line', (line) => {
    const tmpArray = line.split(',')
    if (line.startsWith('WaferNo')) {
      excelDataArray.push(getInitArray())
      pendingCacheFileNames.push(fileName)
      formatFileNameData(fileName)
      excelDataArray[excelDataArray.length - 1][2] = getWaferID(fileName)
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
}

function getWaferID(fileName) {
  let resultArray = []
  const array = fileName.split('-')
  for (let i = 0; i < array.length; i++) {
    if (i === 0) {
      continue
    }
    if(array[i].includes(executionDate)) {
      break
    }
    resultArray.push(array[i])
  }
  return resultArray.join('-')
}

function onReadClose(rl) {
  rl.on('close', () => {
    pendingLength--
    if (pendingLength === 0) {
      const excelFileName = `WaferReport_${executionDate}.xlsx`
      const excelFilePath = join(filePathObj.wrOutputPath, excelFileName)
      const data = readExcel(excelFilePath)

      let isFirstLine = true
      if (data.length !== 0) {
        excelDataArray.forEach((item) => {
          if (isFirstLine) {
            isFirstLine = false
            return
          }
          data[0].data.push(item)
        })
        waferReportExcelData = data
      }
      const success = write2excel(excelFilePath, waferReportExcelData)
      if (success) {
        pendingCacheFileNames.forEach((fileName) => {
          setCache(executionDate, fileName)
        })
        win.send('sort:log', `Excel寫入成功，文件所在位置： ${excelFilePath}`)
      } else {
        win.send('sort:log', 'Excel寫入失敗，請檢查是否打開Excel文件')
      }

      pendingCacheFileNames.length = 0
      waferReportExcelData = cloneDeep(originWaferReportExcelData)
      excelDataArray = null
    }
  })
}

function formatFileNameData(fileName) {
  const arrary = fileName.split('-')
  let time = '????????????????????'
  arrary.forEach((item) => {
    if (item.includes(executionDate)) {
      time = item
      return
    }
  })
  const formatDate = `${time.slice(0, 4)}/${time.slice(4, 6)}/${time.slice(6, 8)}`
  excelDataArray[excelDataArray.length - 1][0] = formatDate
  const formatTime = `${time.slice(8, 10)}:${time.slice(10, 12)}`
  excelDataArray[excelDataArray.length - 1][1] = formatTime
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
