import { app } from 'electron'
import { readFileSync } from 'fs'
import { join } from 'path'

function readConfig(): Config {
  try {
    const isPackaged = app.isPackaged
    const sourceConfigPath = isPackaged
      ? join(process.resourcesPath, 'config.json')
      : join('config', 'config.json')
    return JSON.parse(readFileSync(sourceConfigPath, 'utf-8'))
  } catch (e) {
    console.error('Failed to read config.json', e)
    return {}
  }
}

export default readConfig
