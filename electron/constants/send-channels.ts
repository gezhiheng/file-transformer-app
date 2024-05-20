const sendChannels: string[] = [
  'rendererFinishLoad',
  'authorizationCode',
  // 分选转档的发送channel
  'sort:task:genMachineTimeFile',
  'sort:task:genWaferReportFile',
  'sort:saveLog',
  // 点测转档的发送channel
  'probe:task:genMachineTimeFile',
]

export default sendChannels
