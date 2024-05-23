import type { BrowserWindow } from 'electron'
import type { WorkSheet } from 'node-xlsx'
import { readFileSync } from 'fs'
import { cloneDeep } from 'lodash'
import { join } from 'path'
import Decimal from 'decimal.js'
import { checkPathExists, write2excel } from 'e/utils'
import originProbeExcelData from './origin-probe-excel-data'

let win: BrowserWindow
let probeExcelData: WorkSheet[] = []
let sheet: WorkSheet
let matchCount = 0

function genProbeFile(
  obj: ProbeProbeFilePathObj,
  browserWindow: BrowserWindow,
) {
  win = browserWindow
  probeExcelData = cloneDeep(originProbeExcelData)
  sheet = probeExcelData[0]

  const { probeStandardPath, probeDailyPath, probeOutputPath } = obj
  const probeStandardData = getPendingData(probeStandardPath)
  const probeDailyData = getPendingData(probeDailyPath)

  for (let i = 0; i < probeStandardData.length; i++) {
    const stdPosition = probeStandardData[i][1] + probeStandardData[i][2]
    for (let j = 0; j < probeDailyData.length; j++) {
      const dlyPosition = probeDailyData[j][1] + probeDailyData[j][2]
      if (stdPosition === dlyPosition) {
        matchCount++
        sheet.data.push(mergeData(probeStandardData[i], probeDailyData[j]))
      }
    }
  }
  matchCount = 0

  const resultFileName = getResultFileName(probeStandardPath, probeDailyPath)
  const resultFilePath = join(probeOutputPath, resultFileName)

  const success = write2excel(resultFilePath, probeExcelData)
  if (success) {
    win.webContents.send(
      'probe:log',
      `Excel寫入成功，文件所在位置：${resultFilePath}`,
    )
  } else {
    win.webContents.send('probe:log', 'Excel寫入失敗，請檢查Excel是否開啓')
  }
}

function getResultFileName(stdPath: string, dlyPath: string): string {
  let resultFileName = ''

  const stdFileNameWithExtension: string = stdPath.split('\\').pop() || '' // 获取文件名（包括后缀）
  const stdFileName: string = stdFileNameWithExtension.split('.')[0] // 获取文件名（不包括后缀）

  try {
    const dlyContent: string[] = readFileSync(dlyPath, 'utf-8').split('\n')

    for (const line of dlyContent) {
      if (line.trim().startsWith('EndTime')) {
        const formatTime = line.trim().split(',')[1].replace(/[^\d]/g, '')
        resultFileName = `${stdFileName}_${formatTime}.xlsx`
      }
    }
  } catch (error) {
    return 'probe-report.xlsx'
  }

  return resultFileName
}

function mergeData(stdArray: string[], dlyArray: string[]): string[] {
  const result: string[] = []
  result.push(matchCount + '')
  result.push(stdArray[1])
  result.push(stdArray[2])

  const indexes: number[] = [5, 6, 7, 8, 9, 10, 12, 13, 26]
  indexes.forEach((index) => {
    result.push(stdArray[index])
    result.push(dlyArray[index])
    result.push(subtract(stdArray[index], dlyArray[index]) + '')
  })
  return result
}

function getPendingData(filePath: string): string[][] {
  const result: string[][] = []

  const fileStatus = checkPathExists(filePath)
  if (!fileStatus.isExist) {
    win.webContents.send('probe:log', '該路徑非法，請檢查：' + filePath)
    return result
  }

  const fileContent: string = readFileSync(filePath, 'utf-8')
  const lines: string[] = fileContent.split('\n')

  let isFirst = true
  let jumpFlag = true
  lines.forEach((line) => {
    if (jumpFlag && !line.startsWith('TEST')) {
      return
    }
    jumpFlag = false
    if (isFirst) {
      isFirst = false
      return
    }
    result.push(line.split(','))
  })

  return result
}

function subtract(str1: string, str2: string): number {
  const num1: number = parseFloat(str1)
  const num2: number = parseFloat(str2)

  if (isNaN(num1) || isNaN(num2)) {
    return -1
  }

  const result = new Decimal(num1).minus(num2).toNumber()
  return result
}

export default genProbeFile
