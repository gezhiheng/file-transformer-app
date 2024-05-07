import { ipcMain, dialog } from 'electron'
import type { BrowserWindow } from 'electron'
import checkAuthorization from '../utils/check-authorization'
import macAddress from '../utils/get-mac-address'
import runGenMachineTimeFileTask from './gen-machine-time-file-task.js'
import runGenWaferReportFileTask from './gen-wafer-report-file-task.js'
import { write2config } from '../utils'

let isAuthorization = false

function service(mainWindow: BrowserWindow) {
  isAuthorization = checkAuthorization()
  mainWindow.webContents.send('macAddress', macAddress)

  ipcMain.handle('dialog:openDirectory', async () => {
    if (!isAuthorization) {
      mainWindow.webContents.send('log', '當前MAC地址沒有授權')
      return
    }
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })
    if (!canceled) {
      return filePaths[0]
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
      write2config(authorizationCode)
      if (checkAuthorization()) {
        isAuthorization = true
        flag = true
      }
    } catch (error) {
      flag = false
    }
    mainWindow.webContents.send('config:authorizationCode', flag)
  })
}

export default service
