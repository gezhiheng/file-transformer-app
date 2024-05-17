import { ipcMain, dialog } from 'electron'
import type { BrowserWindow } from 'electron'
import checkAuthorization from '../utils/check-authorization'
import macAddress from '../utils/get-mac-address'
import runClearCacheTask from './clear-cache-task'
import { write2config } from '../utils'
import { sortService } from './sort'

let isAuthorization = false

function service(mainWindow: BrowserWindow) {
  isAuthorization = checkAuthorization()

  mainWindow.webContents.send('macAddress', macAddress)

  runClearCacheTask()

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
        [prop]: filePath,
      })
      return filePath
    }
  })

  sortService(isAuthorization, mainWindow)

  ipcMain.on('authorizationCode', (event, authorizationCode) => {
    let flag = false
    try {
      write2config({
        authorization: authorizationCode,
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
}

export default service
