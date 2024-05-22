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
  sortMachineTimePath?: string
  sortAlarmReportPath?: string
  sortMachineTimeOutputPath?: string
  sortWaferReportPath?: string
  sortWaferReportOutputPath?: string
  probeMachineTimeMonitorPath?: string
  probeMachineTimeMovePath?: string
  probeAlarmReportMonitorPath?: string
  probeAlarmReportMovePath?: string
  probeMachineTimeOutputPath?: string
  probeStandardPath?: string
  probeDailyPath?: string
  probeOutputPath?: string
}

interface ProbeMachineTimeFilePathObj {
  machineTimeMonitorPath: string
  machineTimeMovePath: string
  alarmReportMonitorPath: string
  alarmReportMovePath: string
  machineTimeOutputPath: string
}

interface ProbeProbeFilePathObj {
  probeStandardPath: string
  probeDailyPath: string
  probeOutputPath: string
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
