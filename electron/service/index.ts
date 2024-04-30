import { ipcMain, dialog } from 'electron'
import type { BrowserWindow } from 'electron'

function service(mainWindow: BrowserWindow) {
  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })
    if (!canceled) {
      return filePaths[0]
    }
  })


}

export default service
