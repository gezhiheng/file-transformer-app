<template>
  <div class="container">
    <div class="row">
      <div class="form" style="margin-right: 6px; min-height: 500px">
        <div class="title">分選轉檔, Machine Time</div>
        <div class="btn-span-group">
          <span>{{ originMT1BtnText }}</span>
          <button class="btn-input" id="mt-file-btn1" @click="mt1BtnOnclick">
            {{ mt1BtnText }}
          </button>
        </div>
        <div class="btn-span-group">
          <span>{{ originMT2BtnText }}</span>
          <button class="btn-input" id="mt-file-btn2" @click="mt2BtnOnclick">
            {{ mt2BtnText }}
          </button>
        </div>
        <div class="btn-span-group">
          <span>{{ originMTOutputBtnText }}</span>
          <button
            class="btn-input"
            id="mt-output-btn"
            @click="mtOutputBtnOnclick"
          >
            {{ mtOutputBtnText }}
          </button>
        </div>
        <div class="btn-group">
          <button
            class="btn-confirm"
            id="mt-start-btn"
            @click="machineTimeBtnOnclick"
          >
            {{ mtStartBtnText }}
          </button>
        </div>
      </div>
      <div class="form" style="margin: 0 6px">
        <div class="title">分選轉檔, Wafer Report</div>
        <div class="btn-span-group">
          <span>{{ originWRBtnText }}</span>
          <button class="btn-input" id="wr-file-btn" @click="wrBtnOnclick">
            {{ wrBtnText }}
          </button>
        </div>
        <div class="btn-span-group">
          <span>{{ originWROutputBtnText }}</span>
          <button
            class="btn-input"
            id="wr-output-btn"
            @click="wrOutputBtnOnclick"
          >
            {{ wrOutputBtnText }}
          </button>
        </div>
        <div class="btn-group">
          <button
            class="btn-confirm"
            id="wr-start-btn"
            @click="waferReportBtnOnclick"
          >
            {{ wrStartBtnText }}
          </button>
          <!-- <button class="btn-confirm" id="wr-save-btn">保存路徑</button> -->
        </div>
      </div>
    </div>
    <div class="row">
      <div class="form log">
        <div class="title log-title">
          Log, <br /><span>History & Exception</span><br />
        </div>
        <textarea id="log-textarea" readonly="true" cols="30" rows="10">{{
          log
        }}</textarea>
        <button class="btn-confirm" @click="saveLogBtnOnclick">保存日志</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { authorizationStore } from '../store'

const authorizationStoreInstance = authorizationStore()

const emits = defineEmits(['showDialog'])

const win: any = window

const originMT1BtnText = 'Machine Time 轉檔前路徑'
const originMT2BtnText = 'Alarm Report 轉檔前路徑'
const originMTOutputBtnText = 'Machine Time 轉檔後路徑'
const originWRBtnText = 'Wafer Report 轉檔前路徑'
const originWROutputBtnText = 'Wafer Report 轉檔後路徑'

const mtStartBtnText = ref('開始')
const wrStartBtnText = ref('開始')

const mt1BtnText = ref<string>(originMT1BtnText)
const mt2BtnText = ref<string>(originMT2BtnText)
const mtOutputBtnText = ref<string>(originMTOutputBtnText)

const wrBtnText = ref<string>(originWRBtnText)
const wrOutputBtnText = ref<string>(originWROutputBtnText)

const log = ref<string>('')

const isAuthorization = () => {
  let flag = true
  if (!authorizationStoreInstance.isAuthorization) {
    flag = false
    emits('showDialog', true)
    recordLog('當前MAC地址沒有授權')
  }
  return flag
}

const mt1BtnOnclick = async () => {
  if (!isAuthorization()) {
    return
  }
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'sortMachineTimePath',
  )
  if (filePath) {
    mt1BtnText.value = filePath
  }
}

const mt2BtnOnclick = async () => {
  if (!isAuthorization()) {
    return
  }
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'sortAlarmReportPath',
  )
  if (filePath) {
    mt2BtnText.value = filePath
  }
}

const mtOutputBtnOnclick = async () => {
  if (!isAuthorization()) {
    return
  }
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'sortMachineTimeOutputPath',
  )
  if (filePath) {
    mtOutputBtnText.value = filePath
  }
}

const wrBtnOnclick = async () => {
  if (!isAuthorization()) {
    return
  }
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'sortWaferReportPath',
  )
  if (filePath) {
    wrBtnText.value = filePath
  }
}

const wrOutputBtnOnclick = async () => {
  if (!isAuthorization()) {
    return
  }
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'sortWaferReportOutputPath',
  )
  if (filePath) {
    wrOutputBtnText.value = filePath
  }
}

const recordLog = (data: string) => {
  const timestamp = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  log.value = `${timestamp}: ${data}\n${log.value}`
}

win.api.receive('sort:log', recordLog)

win.api.receive('sort:init', (data: any) => {
  mt1BtnText.value = data.sortMachineTimePath
    ? data.sortMachineTimePath
    : originMT1BtnText
  mt2BtnText.value = data.sortAlarmReportPath
    ? data.sortAlarmReportPath
    : originMT2BtnText
  mtOutputBtnText.value = data.sortMachineTimeOutputPath
    ? data.sortMachineTimeOutputPath
    : originMTOutputBtnText
  wrBtnText.value = data.sortWaferReportPath
    ? data.sortWaferReportPath
    : originWRBtnText
  wrOutputBtnText.value = data.sortWaferReportOutputPath
    ? data.sortWaferReportOutputPath
    : originWROutputBtnText
})

const machineTimeBtnOnclick = () => {
  if (!isAuthorization()) {
    return
  }
  if (
    mt1BtnText.value === originMT1BtnText ||
    mt2BtnText.value === originMT2BtnText ||
    mtOutputBtnText.value === originMTOutputBtnText
  ) {
    Swal.fire({
      icon: 'warning',
      title: 'Machine Time',
      text: '請补充轉換文件路徑',
    })
    return
  }
  win.api.send('sort:task:genMachineTimeFile', {
    mtFilePath1: mt1BtnText.value,
    mtFilePath2: mt2BtnText.value,
    mtOutputPath: mtOutputBtnText.value,
  })
  mtStartBtnText.value = '已啓動'
}

const waferReportBtnOnclick = () => {
  if (!isAuthorization()) {
    return
  }
  if (
    wrBtnText.value === originWRBtnText ||
    wrOutputBtnText.value === originWROutputBtnText
  ) {
    Swal.fire({
      icon: 'warning',
      title: 'Wafer Report',
      text: '請补充轉換文件路徑',
    })
    return
  }
  win.api.send('sort:task:genWaferReportFile', {
    wrFilePath: wrBtnText.value,
    wrOutputPath: wrOutputBtnText.value,
  })
  wrStartBtnText.value = '已啓動'
}

const saveLogBtnOnclick = () => {
  win.api.send('sort:saveLog', log.value)
}
</script>

<style scoped>
@import url('./main.css');
</style>
