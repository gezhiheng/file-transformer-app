import { build } from 'node-xlsx'
import { writeFile } from 'fs'

function write2Excel(type, filePathObj, data, date = 'xxxx-xx-xx', win) {
  // TODO 判断文件是否存在，存在的话文件名添加后缀
  date = date.replace(/_/g, '')
  let path
  if (type === 'wr') {
    path = filePathObj.wrOutputPath
      ? filePathObj.wrOutputPath
      : filePathObj.wrFilePath
    path += `\\WaferReport_${date}.xlsx`
  } else {
    path = filePathObj.mtOutputPath
      ? filePathObj.mtOutputPath
      : filePathObj.mtFilePath1
    path += `/MachineTime_${date}.xlsx`
  }
  const buffer = build(data)
  console.log('🚀 ~ path:', path)
  writeFile(path, buffer, 'utf-8', function (err) {
    if (err) {
      win.send('log', `出現錯誤：${err}；文件位置：${path}`)
    } else {
      win.send('log', `Excel寫入成功，文件位置：${path}`)
    }
  })
}

export default write2Excel
