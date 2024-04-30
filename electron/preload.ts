import { contextBridge, ipcRenderer } from 'electron'
import type { Event } from 'electron'
import { sendChannels, receiveChannels, handleChannels } from './constants'

type CallBackFn = (event: Event, ...args: any[]) => void

contextBridge.exposeInMainWorld('api', {
  send: (channel: string, data: any) => {
    const validChannels = sendChannels
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel: string, func: CallBackFn) => {
    const validChannels = receiveChannels
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(event, ...args))
    }
  },
  handle: (channel: string) => {
    const validChannels = handleChannels
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel)
    }
  },
})
