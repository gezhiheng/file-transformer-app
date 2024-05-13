const md5 = require('md5')

const mac = 'c0:25:a5:97:b7:ce'  // edit me!

const SALT = 'lumitek-file-transformer'

const data = md5(mac + SALT)

console.log('🚀 ~ data:', data)
