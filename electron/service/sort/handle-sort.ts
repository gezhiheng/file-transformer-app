import { ipcMain } from 'electron'
import type { BrowserWindow } from 'electron'
import runGenMachineTimeFileTask from './gen-machine-time-file-task.js'
import runGenWaferReportFileTask from './gen-wafer-report-file-task.js'
import { saveLog } from 'e/utils'

function handleSort(isAuthorization: boolean, mainWindow: BrowserWindow) {
  ipcMain.on('sort:task:genMachineTimeFile', (event, filePathObj) => {
    if (!isAuthorization) {
      mainWindow.webContents.send('log', '當前MAC地址沒有授權')
      return
    }
    runGenMachineTimeFileTask(event, filePathObj, mainWindow)
  })

  ipcMain.on('sort:task:genWaferReportFile', (event, filePathObj) => {
    if (!isAuthorization) {
      mainWindow.webContents.send('log', '當前MAC地址沒有授權')
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

export default handleSort
