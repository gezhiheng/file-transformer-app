const md5 = require('md5')

const mac = 'c0:25:a5:94:3f:2d'  // edit me!

const SALT = 'lumitek-file-transformer'

const data = md5(mac + SALT)

console.log('🚀 ~ data:', data)
