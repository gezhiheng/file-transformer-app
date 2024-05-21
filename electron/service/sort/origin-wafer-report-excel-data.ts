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

export default originWaferReportExcelData
