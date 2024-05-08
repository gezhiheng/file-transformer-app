import macAddress from './get-mac-address'
import genAuthorization from './gen-authorization'
import readConfig from './read-config'

function checkAuthorization(): boolean {
  const config = readConfig()
  const authorization = config.authorization
  let isAuthorization = genAuthorization(macAddress) === authorization
  return isAuthorization
}

export default checkAuthorization
