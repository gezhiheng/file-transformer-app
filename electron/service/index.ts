import { ipcMain, dialog } from 'electron'
import type { BrowserWindow } from 'electron'
import checkAuthorization from '../utils/check-authorization'
import macAddress from '../utils/get-mac-address'
import runGenMachineTimeFileTask from './gen-machine-time-file-task.js'
import runGenWaferReportFileTask from './gen-wafer-report-file-task.js'
import { write2config, readConfig, saveLog  } from '../utils'

let isAuthorization = false

function service(mainWindow: BrowserWindow) {
  isAuthorization = checkAuthorization()

  const initData: InitData = {
    config: readConfig(),
    macAddress: macAddress,
  }
  mainWindow.webContents.send('init', initData)

  ipcMain.handle('dialog:openDirectory', async (event, prop) => {
    if (!isAuthorization) {
      mainWindow.webContents.send('log', '當前MAC地址沒有授權')
      return
    }
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })
    if (!canceled) {
      const filePath = filePaths[0]
      write2config({
        [prop]: filePath
      })
      return filePath
    }
  })

  ipcMain.on('task:genMachineTimeFile', (event, filePathObj) => {
    if (!isAuthorization) {
      mainWindow.webContents.send('log', '當前MAC地址沒有授權')
      return
    }
    runGenMachineTimeFileTask(event, filePathObj, mainWindow)
  })

  ipcMain.on('task:genWaferReportFile', (event, filePathObj) => {
    if (!isAuthorization) {
      mainWindow.webContents.send('log', '當前MAC地址沒有授權')
      return
    }
    runGenWaferReportFileTask(event, filePathObj, mainWindow)
  })

  ipcMain.on('authorizationCode', (event, authorizationCode) => {
    let flag = false
    try {
      write2config({
        authorization: authorizationCode
      })
      if (checkAuthorization()) {
        isAuthorization = true
        flag = true
      }
    } catch (error) {
      flag = false
    }
    mainWindow.webContents.send('config:authorizationCode', flag)
  })

  ipcMain.on('saveLog', (event, log) => {
    const success = saveLog(log)
    const message = success ? '日志保存成功' : '日志保存失敗'
    mainWindow.webContents.send('log', message)
  })
}

export default service
