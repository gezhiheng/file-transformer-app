const { ipcMain, dialog } = require('electron/main')
const runGenMachineTimeFileTask = require('./gen-machine-time-file-task.cjs')
const runGenWaferReportFileTask = require('./gen-wafer-report-file-task.cjs')
const checkMac = require('./check-mac.cjs')

function service(mainWindow) {
  // if (!checkMac()) {
  //   console.log('沒有授權')
  //   console.log("🚀 ~ service ~ mainWindow:", mainWindow)
  //   mainWindow.webContents.send('no-authorization', '當前MAC地址沒有授權！')
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
