const fs = require('fs')

function getYesterdayDate(connect) {
  return getDate(connect, 'yesterday')
}

function getTodayDate(connect) {
  return getDate(connect, 'today')
}

function getDate(connect, flag) {
  const today = new Date()
  let year
  let month
  let day
  if (flag === 'today') {
    year = today.getFullYear()
    month = String(today.getMonth() + 1).padStart(2, '0')
    day = String(today.getDate()).padStart(2, '0') // 补齐前导零
  } else {
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    year = yesterday.getFullYear()
    month = String(yesterday.getMonth() + 1).padStart(2, '0')
    day = String(yesterday.getDate()).padStart(2, '0') // 补齐前导零
  }
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
  getTodayDate,
}
