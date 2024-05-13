import { statSync } from 'fs'

function checkPathExists(path: string): fileStatus {
  const fileStatus: fileStatus = {
    isFile: false,
    isDirectory: false,
    isExist: true,
  }
  try {
    const stat = statSync(path)
    if (stat.isFile()) {
      fileStatus.isFile = true
    } else if (stat.isDirectory()) {
      fileStatus.isDirectory = true
    }
  } catch (err) {
    fileStatus.isExist = false
  }
  return fileStatus
}

export default checkPathExists
