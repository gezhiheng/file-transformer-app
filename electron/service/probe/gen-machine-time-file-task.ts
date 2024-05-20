import type { BrowserWindow } from 'electron'
import { scheduleJob } from 'node-schedule'
import { readdirSync, statSync, createReadStream } from 'fs'
import { join } from 'path'
import { checkPathExists } from 'e/utils'

let isFirstRun = true
let win: BrowserWindow

function runGenMachineTimeFileTask(
  filePathObj: ProbeMachineTimeFilePathObj,
  browserWindow: BrowserWindow,
) {
  win = browserWindow
  if (isFirstRun) {
    scheduleJob('0/3 * * * * ?', () => {
      genMachineTimeFileTask(filePathObj)
    }).invoke()
    isFirstRun = false
  }
}

let fileNameDate: string
let macineNo: string

function genMachineTimeFileTask(filePathObj: ProbeMachineTimeFilePathObj) {
  const probeMachineTimeMonitorPath = filePathObj.probeMachineTimeMonitorPath
  const files = readdirSync(probeMachineTimeMonitorPath)
  files.forEach((fileName) => {
    const compeletePath = join(probeMachineTimeMonitorPath, fileName)
    const fileStatus = checkPathExists(compeletePath)
    if (fileStatus.isExist && fileStatus.isFile) {
      const tempArray = fileName.split('-')
      fileNameDate = tempArray[1].slice(0, 8)
      macineNo = tempArray[0]
    }
  })
}

export default runGenMachineTimeFileTask
