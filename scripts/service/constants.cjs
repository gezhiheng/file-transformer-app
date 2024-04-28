const originMachineTimeExcelData = [
  {
    name: 'MachineTime',
    data: [
      [
        'TIME',
        'MACHINE ID',
        'DIE BONDED',
        'IDLE TIME',
        'UP TIME',
        'RUN TIME',
        'DOWN TIME',
        'ALARM TIME',
        'DAILY CAPACITY',
        'MACHINE UTILIZATION',
      ],
      [],
      [],
      [
        'Date/Time',
        'Error Code',
        'Error Description',
        'Start Time',
        'End Time',
        'Total Time',
        'User Name',
      ],
    ],
  },
]

const originWaferReportExcelData = [
  {
    name: 'WaferReport',
    data: [
      [
        'Date',
        'Time',
        'Wafer ID',
        'Machine No',
        '总Left',
        '总Bond',
        '总Total',
        '总Yield',
      ],
    ],
  },
]

;(function genBinColumn() {
  for (let i = 1; i <= 150; i++) {
    originWaferReportExcelData[0].data[0].push(`BIN ${i}`)
  }
})()

module.exports = {
  originMachineTimeExcelData,
  originWaferReportExcelData,
}
