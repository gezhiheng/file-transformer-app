const os = require('os')

const AUTHORIZATION_MAC_ADDRESSES = [
  'F4:6B:8C:CA:F1:AF',
  'CC:96:E5:18:88:9E',
  '6C:3C:8C:4E:55:0E',
  '04:D9:C8:6C:19:62',
  'F2:A6:54:E1:BF:17',
  '3C:6A:48:6B:23:0F',
  'C0:25:A5:97:B7:CE',
  'C0:25:A5:D3:1B:37',
]

let interfaces = os.networkInterfaces()
let macAddress = ''
for (let i in interfaces) {
  for (let j in interfaces[i]) {
    let address = interfaces[i][j]
    if (address.family === 'IPv4' && !address.internal) {
      macAddress = address.mac
      break
    }
  }
}

console.log(macAddress.toUpperCase())

function checkMac() {
  // 检查mac地址是否匹配
  if (AUTHORIZATION_MAC_ADDRESSES.indexOf(macAddress.toUpperCase()) === -1) {
    return false
  }
  return true
}

module.exports = checkMac
