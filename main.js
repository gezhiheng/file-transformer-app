const { app, BrowserWindow, nativeImage, Tray } = require('electron/main')
const path = require('node:path')
const service = require('./scripts/service')

let mainWindow

const createWindow = () => {
  const appIcon = nativeImage.createFromPath('./icon.png')
  mainWindow = new BrowserWindow({
    icon: appIcon,
    width: 1500,
    height: 920,
    resizable: false,
    maximizable: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#fff',
      symbolColor: '#323232',
      height: 30,
    },
    webPreferences: {
      preload: path.join(__dirname, '/scripts/preload.js'),
    },
  })

  mainWindow.loadFile('./views/index.html')
}

app.whenReady().then(() => {
  const trayIcon = nativeImage.createFromPath('./icon.png')
  const tray = new Tray(trayIcon)

  createWindow()

  service(mainWindow)

  // mainWindow.webContents.openDevTools({ mode: 'undocked' })

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
