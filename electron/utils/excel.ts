import { build, parse } from 'node-xlsx'
import { writeFileSync } from 'fs'
import checkPathExists from './check-path-exists'

function write2excel(filePath: string, data: any[]): boolean {
  let success = true
  const buffer = build(data)
  try {
    writeFileSync(filePath, buffer, 'utf-8')
  } catch (error) {
    success = false
  }
  return success
}

function readExcel(filePath: string): any[] {
  const fileStatus = checkPathExists(filePath)
  let data: any[]
  if (!fileStatus.isExist) {
    data = []
  } else {
    data = parse(filePath)
  }
  return data
}

export {
  write2excel,
  readExcel,
}