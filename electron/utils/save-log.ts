import { app } from 'electron'
import { writeFileSync } from 'fs'
import path from 'path'

function saveLog(log: string): boolean {
  let success = true
  try {
    const timestamp = new Date().toISOString().replace(/:/g, '-')
    const fileName = `file-transformer-${timestamp}.txt`

    const isPackaged = app.isPackaged
    const logPath = isPackaged
      ? path.join(process.resourcesPath, fileName)
      : path.join('config', fileName)

    writeFileSync(logPath, log, { encoding: 'utf-8' })
  } catch (error) {
    success = false
  }
  return success
}

export default saveLog
