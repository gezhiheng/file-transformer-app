const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const service = require('./scripts/service')

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '/scripts/preload.js'),
    },
  })

  mainWindow.loadFile('./views/index.html')
}

app.whenReady().then(() => {
  createWindow()

  service(mainWindow)

  mainWindow.webContents.openDevTools({ mode: 'undocked' })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
