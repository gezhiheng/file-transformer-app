const md5 = require('md5')

const mac = '3c:6a:48:6b:23:of'  // editor me!

const SALT = 'lumitek-file-transformer'

const data = md5(mac + SALT)

console.log('🚀 ~ data:', data)
