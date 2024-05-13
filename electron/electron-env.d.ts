/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
}

interface Config {
  authorization?: string
  machineTimePath?: string
  alarmReportPath?: string
  machineTimeOutputPath?: string
  waferReportPath?: string
  waferReportOutputPath?: string
}

interface InitData {
  config: Config
  macAddress: string
}

interface fileStatus {
  isFile: boolean
  isDirectory: boolean
  isExist: boolean
}

interface cache {
  [dateKey: string]: any
}