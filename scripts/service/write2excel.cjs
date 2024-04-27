const xlsx = require('node-xlsx')
const fs = require('fs')

function write2Excel(filePathObj, data) {
  // TODO 导出文件名添加日期
  let path = filePathObj.mtOutputPath
    ? filePathObj.mtOutputPath
    : filePathObj.mtFilePath1
  path += `\\MachineTime_test.xlsx`
  const buffer = xlsx.build(data)
  fs.writeFile(path, buffer, function (err) {
    if (err) {
      console.log(err, '导出excel失败')
    } else {
      console.log('导出excel成功!')
    }
  })
}

module.exports = write2Excel
