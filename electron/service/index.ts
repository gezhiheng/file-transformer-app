import { ipcMain, dialog } from 'electron'
import type { BrowserWindow } from 'electron'
import { join } from 'path'
import runClearCacheTask from './clear-cache-task'
import {
  write2config,
  checkAuthorization,
  macAddress,
  readConfig,
} from 'e/utils'
import { sortService } from './sort'
import { probeService } from './probe'

let isAuthorization = false

function service(mainWindow: BrowserWindow) {
  isAuthorization = checkAuthorization()

  mainWindow.webContents.send('macAddress', macAddress)

  mainWindow.webContents.send('isAuthorization', isAuthorization)

  runClearCacheTask()

  ipcMain.handle('dialog:openDirectory', async (event, prop) => {
    if (!isAuthorization) {
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

  ipcMain.handle('dialog:openFile', async (event, prop) => {
    if (!isAuthorization) {
      return
    }
    const config = readConfig()
    const defaultPath = config[prop] ? config[prop] : ''
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      defaultPath,
    })
    if (!canceled) {
      const filePath = filePaths[0]
      // TODO 如果是 macOS 需要进行处理
      const filePathArray = filePath.split('\\')
      filePathArray.pop()
      const configPath = join(...filePathArray)
      write2config({
        [prop]: configPath,
      })
      return filePath
    }
  })

  sortService(mainWindow)

  probeService(mainWindow)

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
