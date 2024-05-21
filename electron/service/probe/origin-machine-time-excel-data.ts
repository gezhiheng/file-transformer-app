import type { WorkSheet } from 'node-xlsx'

const worksheet: WorkSheet = {
  name: 'machineTime',
  data: [
    [
      '机台号',
      'Total Chip',
      'IDLE TIME',
      'UP TIME',
      'RUN TIME',
      'DOWN TIME',
      'ALARM TIME',
      'SETUP TIME',
    ],
    [],
    [],
    [],
    [],
    ['Date', 'Wafer ID', 'OP', 'Time', 'Machine', 'Type', 'Item'],
  ],
  options: {},
}

const originMachineTimeExcelData = [worksheet]

export default originMachineTimeExcelData
