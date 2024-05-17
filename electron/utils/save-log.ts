import { app } from 'electron'
import { writeFileSync } from 'fs'
import path from 'path'

function saveLog(log: string, type: string = ''): boolean {
  let success = true
  try {
    const fileName = `file-transformer-${type}-${getCurrentDate()}.txt`

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

function getCurrentDate(): string {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
  const day = currentDate.getDate().toString().padStart(2, '0')
  const hours = currentDate.getHours().toString().padStart(2, '0')
  const minutes = currentDate.getMinutes().toString().padStart(2, '0')
  const seconds = currentDate.getSeconds().toString().padStart(2, '0')

  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`
}

export default saveLog
