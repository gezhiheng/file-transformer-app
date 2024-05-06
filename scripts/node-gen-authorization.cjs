const md5 = require('md5')

const mac = 'c0:25:a5:94:3f:2d'

const data = md5(mac)

console.log('🚀 ~ data:', data)
