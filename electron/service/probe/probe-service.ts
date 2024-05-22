import { ipcMain } from 'electron'
import type { BrowserWindow } from 'electron'
import { saveLog, readConfig, checkAuthorization } from 'e/utils'
import runGenMachineTimeFileTask from './gen-machine-time-file-task'
import genProbeFile from './gen-probe-report-file'

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

  ipcMain.on('probe:genProbeFile', (event, filePathObj) => {
    if (!checkAuthorization()) {
      return
    }
    genProbeFile(filePathObj, mainWindow)
  })

  // TODO 保存日志
}

export default probeService
