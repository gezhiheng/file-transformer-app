import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import service from './service'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

let mainWindow: BrowserWindow | null

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 930,
    resizable: false,
    maximizable: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#fff',
      symbolColor: '#323232',
      height: 30,
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    )
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools({ mode: 'undocked' })
}

app.whenReady().then(() => {
  createWindow()
  const appDataPath = app.getPath('userData')
  console.log('🚀 ~ app.whenReady ~ appDataPath:', appDataPath)
  // 渲染进程加载完后调用业务
  ipcMain.on('rendererFinishLoad', () => {
    service(mainWindow)
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
