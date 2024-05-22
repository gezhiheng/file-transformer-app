import type { WorkSheet } from 'node-xlsx'

const workSheet: WorkSheet = {
  name: 'Probe Report',
  data: [
    [
      'TEST',
      'PosX',
      'PosY',
      'VF1-S',
      'VF1-M',
      'VF1-D',
      'VF2-S',
      'VF2-M',
      'VF2-D',
      'VF3-S',
      'VF3-M',
      'VF3-D',
      'VF4-S',
      'VF4-M',
      'VF4-D',
      'PO1-S',
      'PO1-M',
      'PO1-D',
      'PO2-S',
      'PO2-M',
      'PO2-D',
      'IR1-S',
      'IR1-M',
      'IR1-D',
      'WLP1-S',
      'WLP1-M',
      'WLP1-D',
      'WLP2-S',
      'WLP2-M',
      'WLP2-D',
    ],
  ],
  options: {},
}

const originProbeExcelData = [workSheet]

export default originProbeExcelData
