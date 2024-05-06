import md5 from 'md5'

function genAuthorization(macAddress: string): string {
  const SALT = 'lumitek-file-transformer'
  return md5(macAddress + SALT)
}

export default genAuthorization
