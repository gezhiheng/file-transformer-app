const { BrowserWindow, dialog, ipcMain } = require('electron')
const fs = require('fs')

let mainWindow

function handleSetTitle(event, title) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}

async function readFile(filePath) {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      alert('An error ocurred reading the file :' + err.message)
      return
    }
    console.log('The file content is : ' + data)
  })
}

function service(mainWindow) {
  ipcMain.on('set-title', handleSetTitle)
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.on('toMain', (event, args) => {
    fs.readFile(
      '/Users/henry-ge/Documents/typesomething/临时摘抄的古诗词句.md',
      'utf-8',
      (error, data) => {
        // Do something with file contents

        // Send result back to renderer process
        mainWindow.webContents.send('fromMain', data)
      },
    )
  })
}

module.exports = service
