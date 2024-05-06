import { app } from 'electron'
import { readFileSync } from 'fs'
import macAddress from './get-mac-address'
import genAuthorization from './gen-authorization'

const isPackaged = app.isPackaged

function readConfig(): string {
  let config: {
    authorization: string
  } = {
    authorization: '',
  }
  try {
    const configPath = isPackaged
      ? `${process.resourcesPath}\\config.json`
      : 'config\\config.json'
    const buffer = readFileSync(configPath, 'utf8')
    config = JSON.parse(buffer)
    console.log('🚀 ~ readConfig ~ config:', config)
  } catch (e) {
    console.log('🚀 ~ readConfig ~ error:', e)
  }
  return config.authorization
}

function checkAuthorization(): boolean {
  const authorization = readConfig()
  let isAuthorization = genAuthorization(macAddress) === authorization
  return isAuthorization
}

export default checkAuthorization
