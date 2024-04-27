const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => {
    let validChannels = ['genMachineTimeFileTask']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, func) => {
    let validChannels = ['mtCurrentProcessFile', 'wrCurrentProcessFile']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
})
