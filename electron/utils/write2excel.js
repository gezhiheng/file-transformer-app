import { build } from 'node-xlsx'
import { writeFile, existsSync } from 'fs'
import { join } from 'path'

function write2Excel(type, filePaths, data, date = 'xxxx-xx-xx', win) {
  date = date.replace(/_/g, '')
  let pathPrefix, fileNamePrefix

  if (type === 'wr') {
    pathPrefix = filePaths.wrOutputPath || filePaths.wrFilePath
    fileNamePrefix = 'WaferReport'
  } else {
    pathPrefix = filePaths.mtOutputPath || filePaths.mtFilePath1
    fileNamePrefix = 'MachineTime'
  }

  const formattedDate = date.replace(/_/g, '')
  const fileName = `${fileNamePrefix}_${formattedDate}.xlsx`
  let filePath = join(pathPrefix, fileName)

  // Check if file exists and modify filePath if needed
  if (existsSync(filePath)) {
    const fileExtension = '.xlsx'
    const fileBaseName = fileName.slice(0, -fileExtension.length)
    const fileSuffix = new Date().toISOString().replace(/[^\d]/g, '')
    filePath = join(pathPrefix, `${fileBaseName}_${fileSuffix}${fileExtension}`)
  }

  const buffer = build(data)

  return new Promise((resolve, reject) => {
    writeFile(filePath, buffer, 'utf-8', (err) => {
      if (err) {
        win.send('log', `出現錯誤：${err}；文件位置：${filePath}`)
        reject(err)
      } else {
        win.send('log', `Excel寫入成功，文件位置：${filePath}`)
        resolve(filePath)
      }
    })
  })
}

export default write2Excel
