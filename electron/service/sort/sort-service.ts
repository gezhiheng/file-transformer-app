import { ipcMain } from 'electron'
import type { BrowserWindow } from 'electron'
import runGenMachineTimeFileTask from './gen-machine-time-file-task.js'
import runGenWaferReportFileTask from './gen-wafer-report-file-task.js'
import { saveLog, readConfig, checkAuthorization } from 'e/utils'

function sortService(mainWindow: BrowserWindow) {
  const config = readConfig()
  mainWindow.webContents.send('sort:init', {
    sortMachineTimePath: config.sortMachineTimePath
      ? config.sortMachineTimePath
      : '',
    sortAlarmReportPath: config.sortAlarmReportPath
      ? config.sortAlarmReportPath
      : '',
    sortMachineTimeOutputPath: config.sortMachineTimeOutputPath
      ? config.sortMachineTimeOutputPath
      : '',
    sortWaferReportPath: config.sortWaferReportPath
      ? config.sortWaferReportPath
      : '',
    sortWaferReportOutputPath: config.sortWaferReportOutputPath
      ? config.sortWaferReportOutputPath
      : '',
  })

  ipcMain.on('sort:task:genMachineTimeFile', (event, filePathObj) => {
    if (!checkAuthorization()) {
      return
    }
    runGenMachineTimeFileTask(event, filePathObj, mainWindow)
  })

  ipcMain.on('sort:task:genWaferReportFile', (event, filePathObj) => {
    if (!checkAuthorization()) {
      return
    }
    runGenWaferReportFileTask(event, filePathObj, mainWindow)
  })

  ipcMain.on('sort:saveLog', (event, log) => {
    const success = saveLog(log, 'sort')
    const message = success ? '日志保存成功' : '日志保存失敗'
    mainWindow.webContents.send('sort:log', message)
  })
}

export default sortService
