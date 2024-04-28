const fs = require('fs')

function getYesterdayDate(connect) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const year = yesterday.getFullYear()
  const month = String(yesterday.getMonth() + 1).padStart(2, '0')
  const day = String(yesterday.getDate()).padStart(2, '0') // 补齐前导零
  return `${year}${connect}${month}${connect}${day}`
}

function checkPathExists(path) {
  try {
    const stat = fs.statSync(path)
    if (stat.isFile()) {
      return 'file' // 是文件
    } else if (stat.isDirectory()) {
      return 'directory' // 是文件夹
    } else {
      return 'other' // 其他类型
    }
  } catch (err) {
    return 'not exists' // 路径不存在
  }
}

module.exports = {
  getYesterdayDate,
  checkPathExists,
}
