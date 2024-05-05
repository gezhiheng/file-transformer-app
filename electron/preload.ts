import { contextBridge, ipcRenderer } from 'electron'
import { sendChannels, receiveChannels, handleChannels } from './constants'

type CallBackFn = (...args: unknown[]) => void

contextBridge.exposeInMainWorld('api', {
  send: (channel: string, data: unknown) => {
    const validChannels = sendChannels
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel: string, func: CallBackFn) => {
    const validChannels = receiveChannels
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
  handle: (channel: string) => {
    const validChannels = handleChannels
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel)
    }
  },
})
