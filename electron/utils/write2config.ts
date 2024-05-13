import { app } from 'electron'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import checkPathExists from './check-path-exists'

function write2config(config: Config) {
  const isPackaged = app.isPackaged
  const sourceConfigPath = isPackaged
    ? join(process.resourcesPath, 'config.json')
    : join('config', 'config.json')

  let success = true
  try {
    let configResult: Config = {}
    const fileStatus = checkPathExists(sourceConfigPath)
    if (fileStatus.isExist && fileStatus.isFile) {
      const configData = readFileSync(sourceConfigPath, 'utf-8')
      configResult = JSON.parse(configData)
    }
    // 直接覆盖相同属性名的配置项
    Object.assign(configResult, config)
    writeFileSync(sourceConfigPath, JSON.stringify(configResult, null, 2))
  } catch (error) {
    success = false
  }

  return success
}

export default write2config
