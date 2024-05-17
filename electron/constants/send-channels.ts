const sendChannels: string[] = [
  'rendererFinishLoad',
  'authorizationCode',
  // 分选转档的channel
  'sort:task:genMachineTimeFile',
  'sort:task:genWaferReportFile',
  'sort:saveLog',
  // 点测转档的channel
]

export default sendChannels
