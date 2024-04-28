const os = require('os')

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

function checkMac() {
    const AUTHORIZATION_MAC_ADDRESS = 'c0:25:a5:97:b7:c'
    return macAddress === AUTHORIZATION_MAC_ADDRESS
}

module.exports = checkMac
