const { ipcMain, dialog } = require('electron/main')
const runGenMachineTimeFileTask = require('./gen-machine-time-file-task.cjs')
const runGenWaferReportFileTask = require('./gen-wafer-report-file-task.cjs')
const checkMac = require('./check-mac.cjs')

function service(mainWindow) {
  // if(!checkMac()) {
  //   mainWindow.send('no-authorization')
  //   return
  // }
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.on('genMachineTimeFileTask', (event, filePathObj) => {
    runGenMachineTimeFileTask(event, filePathObj, mainWindow)
  })
  ipcMain.on('genWaferReportFileTask', (event, filePathObj) => {
    runGenWaferReportFileTask(event, filePathObj, mainWindow)
  })
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })
  if (!canceled) {
    return filePaths[0]
  }
}

module.exports = service
