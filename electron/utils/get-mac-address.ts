import os from 'os'

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

export default macAddress
