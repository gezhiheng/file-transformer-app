import { app } from 'electron'
import { writeFileSync } from 'fs'

const isPackaged = app.isPackaged

function write2config(authorizationCode: string) {
  const config = {
    authorization: authorizationCode,
  }
  const configPath = isPackaged
    ? `${process.resourcesPath}\\config.json`
    : 'config\\config.json'
  writeFileSync(configPath, JSON.stringify(config))
}

export default write2config
