const receiveChannels: string[] = [
  'config:authorizationCode',
  'isAuthorization',
  // 分选转档的接受channel
  'sort:init',
  'sort:log',
  // 点测转档的接受channel
  'probe:init',
  'probe:log',
]

export default receiveChannels
