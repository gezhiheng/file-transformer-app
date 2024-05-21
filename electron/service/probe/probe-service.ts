import { ipcMain } from 'electron'
import type { BrowserWindow } from 'electron'
import { saveLog, readConfig, checkAuthorization } from 'e/utils'
import runGenMachineTimeFileTask from './gen-machine-time-file-task'

function probeService(mainWindow: BrowserWindow) {
  const config = readConfig()
  mainWindow.webContents.send('probe:init', {
    probeMachineTimeMonitorPath: config.probeMachineTimeMonitorPath
      ? config.probeMachineTimeMonitorPath
      : '',
    probeMachineTimeMovePath: config.probeMachineTimeMovePath
      ? config.probeMachineTimeMovePath
      : '',
    probeAlarmReportMonitorPath: config.probeAlarmReportMonitorPath
      ? config.probeAlarmReportMonitorPath
      : '',
    probeAlarmReportMovePath: config.probeAlarmReportMovePath
      ? config.probeAlarmReportMovePath
      : '',
    probeMachineTimeOutputPath: config.probeMachineTimeOutputPath
      ? config.probeMachineTimeOutputPath
      : '',
    probeStandardPath: config.probeStandardPath ? config.probeStandardPath : '',
    probeDailyPath: config.probeDailyPath ? config.probeDailyPath : '',
    probeOutputPath: config.probeOutputPath ? config.probeOutputPath : '',
  })

  ipcMain.on('probe:task:genMachineTimeFile', (event, filePathObj) => {
    if (!checkAuthorization()) {
      return
    }
    runGenMachineTimeFileTask(filePathObj, mainWindow)
  })
}

export default probeService