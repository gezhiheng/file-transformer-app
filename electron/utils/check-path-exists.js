import { statSync } from 'fs'

function checkPathExists(path) {
  try {
    const stat = statSync(path)
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

export default checkPathExists
