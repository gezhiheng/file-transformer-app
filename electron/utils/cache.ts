import { app } from 'electron'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import checkPathExists from './check-path-exists'

const isPackaged = app.isPackaged
const sourceCachePath = isPackaged
  ? join(process.resourcesPath, 'cache.json')
  : join('config', 'cache.json')

function setCache(dateKey: string, fileName: string): boolean {
  const fileStatus = checkPathExists(sourceCachePath)
  let cache: cache = {}
  let success = true
  try {
    if (fileStatus.isExist) {
      cache = JSON.parse(readFileSync(sourceCachePath, 'utf-8'))
      if (cache[dateKey]) {
        cache[dateKey].push(fileName)
      } else {
        cache[dateKey] = [fileName]
      }
    } else {
      cache[dateKey] = [fileName]
    }
    writeFileSync(sourceCachePath, JSON.stringify(cache))
  } catch (error) {
    success = false
  }
  return success
}

function getCache(): cache {
  let cache: cache = {}
  try {
    cache = JSON.parse(readFileSync(sourceCachePath, 'utf-8'))
  } catch (error) {
    cache = {}
  }
  return cache
}

function clearCache(date: string): boolean {
  let cache: cache = getCache()
  Object.keys(cache).forEach((key) => {
    if (key !== date) {
      delete cache[key]
    }
  })
  let success = true
  try {
    writeFileSync(sourceCachePath, JSON.stringify(cache))
  } catch (error) {
    success = false
  }
  return success
}

function checkCache(date: string, fileName: string): boolean {
  const cache = getCache()
  if (cache[date]) {
    if (cache[date].includes(fileName)) {
      return true
    }
  }
  return false
}

export { setCache, getCache, clearCache, checkCache }
