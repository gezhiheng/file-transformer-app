import md5 from 'md5'

function genAuthorization(macAddress: string): string {
  return md5(macAddress)
}

export default genAuthorization
