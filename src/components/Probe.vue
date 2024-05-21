<template>
  <div class="container">
    <div class="form" style="margin-right: 6px">
      <div class="title">點測轉檔, <span>Machine Time Report</span></div>
      <div class="btn-span-group">
        <span>{{ originMTMonitorText }}</span>
        <button
          class="btn-input"
          id="mt-file-btn1"
          @click="mtMonitorBtnOnclick"
        >
          {{ mtMonitorBtnText }}
        </button>
      </div>
      <div class="btn-span-group">
        <span>{{ originMTMoveText }}</span>
        <button class="btn-input" id="mt-file-btn2" @click="mtMoveBtnOnclick">
          {{ mtMoveBtnText }}
        </button>
      </div>
      <div class="btn-span-group">
        <span>{{ originALMonitorText }}</span>
        <button
          class="btn-input"
          id="mt-output-btn"
          @click="alMonitorBtnOnclick"
        >
          {{ alMonitorBtnText }}
        </button>
      </div>
      <div class="btn-span-group">
        <span>{{ originALMoveText }}</span>
        <button
          class="btn-input"
          id="mt-output-btn"
          @click="alMoveBtnOnclick"
        >
          {{ alMoveBtnText }}
        </button>
      </div>
      <div class="btn-span-group">
        <span>{{ originMTOutputText }}</span>
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
      <div class="title">點測轉檔,<br /><span>點測檔</span></div>
      <div class="btn-span-group">
        <span>{{ originProbeStdText }}</span>
        <button class="btn-input" id="wr-file-btn" @click="probeStdBtnOnclick">
          {{ probeStdBtnText }}
        </button>
      </div>
      <div class="btn-span-group">
        <span>{{ originProbeDailyText }}</span>
        <button
          class="btn-input"
          id="wr-output-btn"
          @click="probeDailyBtnOnclick"
        >
          {{ probeDailyBtnText }}
        </button>
      </div>
      <div class="btn-span-group">
        <span>{{ originProbeOutputText }}</span>
        <button
          class="btn-input"
          id="wr-output-btn"
          @click="probeOutputBtnOnclick"
        >
          {{ probeOutputBtnText }}
        </button>
      </div>
      <div class="btn-group">
        <button
          class="btn-confirm"
          id="wr-start-btn"
          @click="waferReportBtnOnclick"
        >
          {{ pbStartBtnText }}
        </button>
        <!-- <button class="btn-confirm" id="wr-save-btn">保存路徑</button> -->
      </div>
    </div>
  </div>
  <div class="form log">
    <div class="title log-title">
      Log, <br /><span>History & Exception</span><br />
    </div>
    <textarea id="log-textarea" readonly="true" cols="30" rows="10">{{
      log
    }}</textarea>
    <button class="btn-confirm" @click="saveLogBtnOnclick">保存日志</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { authorizationStore } from '../store'

const authorizationStoreInstance = authorizationStore()

const emits = defineEmits(['showDialog'])

const win: any = window

const originMTMonitorText = 'Machine Time 監控路徑'
const originMTMoveText = 'Machine Time 搬檔路徑'
const originALMonitorText = 'Alarm Report 監控路徑'
const originALMoveText = 'Alarm Report 搬檔路徑'
const originMTOutputText = 'Machine Time Report 產出'

const originProbeStdText = '標準檔選擇'
const originProbeDailyText = '日校檔選擇'
const originProbeOutputText = 'Probe Report 產出'

const mtMonitorBtnText = ref<string>(originMTMonitorText)
const mtMoveBtnText = ref<string>(originMTMoveText)
const alMonitorBtnText = ref<string>(originALMonitorText)
const alMoveBtnText = ref<string>(originALMoveText)
const mtOutputBtnText = ref<string>(originMTOutputText)

const probeStdBtnText = ref<string>(originProbeStdText)
const probeDailyBtnText = ref<string>(originProbeDailyText)
const probeOutputBtnText = ref<string>(originProbeOutputText)

const mtStartBtnText = ref('開始')
const pbStartBtnText = ref('開始')

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

/**
 * machine time form 部分
 */
const mtMonitorBtnOnclick = async () => {
  if (!isAuthorization()) {
    return
  }
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'probeMachineTimeMonitorPath',
  )
  if (filePath) {
    mtMonitorBtnText.value = filePath
  }
}

const mtMoveBtnOnclick = async () => {
  if (!isAuthorization()) {
    return
  }
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'probeMachineTimeMovePath',
  )
  if (filePath) {
    mtMoveBtnText.value = filePath
  }
}

const alMonitorBtnOnclick = async () => {
  if (!isAuthorization()) {
    return
  }
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'probeAlarmReportMonitorPath',
  )
  if (filePath) {
    alMonitorBtnText.value = filePath
  }
}

const alMoveBtnOnclick = async () => {
  if (!isAuthorization()) {
    return
  }
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'probeAlarmReportMovePath',
  )
  if (filePath) {
    alMoveBtnText.value = filePath
  }
}

const mtOutputBtnOnclick = async () => {
  if (!isAuthorization()) {
    return
  }
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'probeMachineTimeOutputPath',
  )
  if (filePath) {
    mtOutputBtnText.value = filePath
  }
}

/**
 * probe form 部分
 */
const probeStdBtnOnclick = async () => {
  if (!isAuthorization()) {
    return
  }
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'probeStandardPath',
  )
  if (filePath) {
    probeStdBtnText.value = filePath
  }
}

const probeDailyBtnOnclick = async () => {
  if (!isAuthorization()) {
    return
  }
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'probeDailyPath',
  )
  if (filePath) {
    probeDailyBtnText.value = filePath
  }
}

const probeOutputBtnOnclick = async () => {
  if (!isAuthorization()) {
    return
  }
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'probeOutputPath',
  )
  if (filePath) {
    probeOutputBtnText.value = filePath
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

win.api.receive('probe:log', recordLog)

win.api.receive('probe:init', (data: any) => {
  mtMonitorBtnText.value = data.probeMachineTimeMonitorPath
    ? data.probeMachineTimeMonitorPath
    : originMTMonitorText
  mtMoveBtnText.value = data.probeMachineTimeMovePath
    ? data.probeMachineTimeMovePath
    : originMTMoveText
  alMonitorBtnText.value = data.probeAlarmReportMonitorPath
    ? data.probeAlarmReportMonitorPath
    : originALMonitorText
  alMoveBtnText.value = data.probeAlarmReportMovePath
    ? data.probeAlarmReportMovePath
    : originALMoveText
  mtOutputBtnText.value = data.probeMachineTimeOutputPath
    ? data.probeMachineTimeOutputPath
    : originMTOutputText

  probeStdBtnText.value = data.probeStandardPath
    ? data.probeStandardPath
    : originProbeStdText
  probeDailyBtnText.value = data.probeDailyPath
    ? data.probeDailyPath
    : originProbeDailyText
  probeOutputBtnText.value = data.probeOutputPath
    ? data.probeOutputPath
    : originProbeOutputText
})

win.api.receive('probe:update', (data: any) => {
  probeOutputBtnText.value = data.probeOutputPath
})

const machineTimeBtnOnclick = () => {
  if (!isAuthorization()) {
    return
  }
  if (
    mtMonitorBtnText.value === originMTMonitorText ||
    mtMoveBtnText.value === originMTMoveText ||
    alMonitorBtnText.value === originALMonitorText ||
    alMoveBtnText.value === originALMoveText ||
    mtOutputBtnText.value === originMTOutputText
  ) {
    Swal.fire({
      icon: 'warning',
      title: 'Machine Time',
      text: '請补充轉換文件路徑',
    })
    return
  }
  win.api.send('probe:task:genMachineTimeFile', {
    machineTimeMonitorPath: mtMonitorBtnText.value,
    machineTimeMovePath: mtMoveBtnText.value,
    alarmReportMonitorPath: alMonitorBtnText.value,
    alarmReportMovePath: alMoveBtnText.value,
    machineTimeOutputPath: mtOutputBtnText.value,
  })
  mtStartBtnText.value = '已啓動'
}

const waferReportBtnOnclick = () => {
  if (!isAuthorization()) {
    return
  }
  // if (
  //   wrBtnText.value === originWRBtnText ||
  //   wrOutputBtnText.value === originWROutputBtnText
  // ) {
  //   alert('Wafer Report 請补充轉換文件路徑')
  //   return
  // }
  // win.api.send('task:genWaferReportFile', {
  //   wrFilePath: wrBtnText.value,
  //   wrOutputPath: wrOutputBtnText.value,
  // })
  // wrStartBtnText.value = '已啓動'
}

const saveLogBtnOnclick = () => {
  win.api.send('saveLog', log.value)
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.form {
  display: block;
  width: 50%;
  height: 500px;
  --input-focus: #2d8cf0;
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: #fff;
  --main-color: #323232;
  padding: 20px;
  background: lightgrey;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
}

.title {
  -webkit-app-region: no-drag;
  color: var(--font-color);
  font-weight: 900;
  font-size: 20px;
}

.title span {
  -webkit-app-region: no-drag;
  color: var(--font-color-sub);
  font-weight: 600;
  font-size: 17px;
}

.btn-span-group {
  width: 100%;
  span {
    color: var(--font-color-sub);
  }
}

.btn-input {
  -webkit-app-region: no-drag;
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 17px;
  font-weight: 600;
  color: var(--font-color);
  padding: 5px 10px;
  outline: none;
  cursor: pointer;
}

.btn-confirm:active,
.btn-input:active {
  box-shadow: 0px 0px var(--main-color);
  transform: translate(3px, 3px);
}

.btn-confirm {
  -webkit-app-region: no-drag;
  margin-right: 6px;
  width: 120px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 17px;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.current-process-file {
  -webkit-app-region: no-drag;
  background-color: transparent;
  border: 0;
  border-bottom: 2px #000000 solid;
  display: block;
  padding: 15px 0;
  font-size: 18px;
  color: #000000;
}

.footer {
  position: fixed;
  bottom: 7px;
  width: 100%;
  font-size: 14px;
  opacity: 0.5;
  text-align: center;
}

.log {
  margin-top: 12px;
  margin-bottom: 6px;
  width: 96.6%;
  height: 200px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.log-title {
  margin-top: 60px;
}

textarea {
  -webkit-app-region: no-drag;
  border: none;
  outline: none;
  resize: none;
  background-color: transparent;
  font-size: 17px;
  width: 1000px;
  height: 195px;
}

textarea::-webkit-scrollbar {
  width: 16px;
  height: 6px;
}

textarea::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}

textarea::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
