<template>
  <div class="container">
    <div class="form" style="margin-right: 6px">
      <div class="title">點測轉檔, <span>Machine Time Report</span></div>
      <div class="btn-span-group">
        <span>{{ originMTMonitorText }}</span>
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
      <div class="title">點測轉檔,<br /><span>點測檔</span></div>
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
import { ref, watch } from 'vue'

const win: any = window

const originMTMonitorText = 'Machine Time 监控路徑'
const originMTBackupText = 'Machine Time 备份路徑'
const originALMonitorText = 'Alarm Report 监控路徑'
const originALBackupText = 'Alarm Report 备份路徑'
const originMTOutputText = 'Machine Time Report 產出'

const originProbeStdText = '標準檔選擇'
const originProbeDailyText = '日校檔選擇'
const originProbeOutputText = 'Probe Report 產出'

const mtStartBtnText = ref('開始')
const wrStartBtnText = ref('開始')

const mt1BtnText = ref<string>(originMTMonitorText)
const mt2BtnText = ref<string>(originMT2BtnText)
const mtOutputBtnText = ref<string>(originMTOutputBtnText)
const mtCurrentProcessFile = ref<string>('')

const wrBtnText = ref<string>(originWRBtnText)
const wrOutputBtnText = ref<string>(originWROutputBtnText)
const wrCurrentProcessFile = ref<string>('')

const log = ref<string>('')
const authorizationCode = ref<string>('')
const dialogTableVisible = ref<boolean>(false)

watch(dialogTableVisible, (newValue, oldValue) => {
  if (newValue) {
    document.querySelectorAll('*').forEach((item) => {
      item.classList.add('no-drag')
    })
  } else {
    document.querySelectorAll('*').forEach((item) => {
      item.classList.remove('no-drag')
    })
  }
})

const mt1BtnOnclick = async () => {
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'machineTimePath',
  )
  if (filePath) {
    mt1BtnText.value = filePath
  }
}

const mt2BtnOnclick = async () => {
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'alarmReportPath',
  )
  if (filePath) {
    mt2BtnText.value = filePath
  }
}

const mtOutputBtnOnclick = async () => {
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'machineTimeOutputPath',
  )
  if (filePath) {
    mtOutputBtnText.value = filePath
  }
}

const wrBtnOnclick = async () => {
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'waferReportPath',
  )
  if (filePath) {
    wrBtnText.value = filePath
  }
}

const wrOutputBtnOnclick = async () => {
  const filePath = await win.api.handle(
    'dialog:openDirectory',
    'waferReportOutputPath',
  )
  if (filePath) {
    wrOutputBtnText.value = filePath
  }
}

win.api.receive('log', (data: string) => {
  const timestamp = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  if (data === '當前MAC地址沒有授權') {
    dialogTableVisible.value = true
  }
  log.value = `${timestamp}: ${data}\n${log.value}`
})

win.api.receive('init', (data: any) => {
  mt1BtnText.value = data.config.machineTimePath
    ? data.config.machineTimePath
    : originMT1BtnText
  mt2BtnText.value = data.config.alarmReportPath
    ? data.config.alarmReportPath
    : originMT2BtnText
  mtOutputBtnText.value = data.config.machineTimeOutputPath
    ? data.config.machineTimeOutputPath
    : originMTOutputBtnText
  wrBtnText.value = data.config.waferReportPath
    ? data.config.waferReportPath
    : originWRBtnText
  wrOutputBtnText.value = data.config.waferReportOutputPath
    ? data.config.waferReportOutputPath
    : originWROutputBtnText
})

win.api.receive('mtCurrentProcessFile', (data: string) => {
  mtCurrentProcessFile.value = data
})

win.api.receive('wrCurrentProcessFile', (data: string) => {
  wrCurrentProcessFile.value = data
})

win.api.receive('config:authorizationCode', (flag: boolean) => {
  dialogTableVisible.value = false
  if (flag) {
    alert('授權成功!')
  } else {
    alert('錯誤：授權失敗，請聯係開發人員！')
  }
})

const machineTimeBtnOnclick = () => {
  if (
    mt1BtnText.value === originMT1BtnText ||
    mt2BtnText.value === originMT2BtnText ||
    mtOutputBtnText.value === originMTOutputBtnText
  ) {
    alert('Machine Time 請补充轉換文件路徑')
    return
  }
  win.api.send('task:genMachineTimeFile', {
    mtFilePath1: mt1BtnText.value,
    mtFilePath2: mt2BtnText.value,
    mtOutputPath: mtOutputBtnText.value,
  })
  mtStartBtnText.value = '已啓動'
}

const waferReportBtnOnclick = () => {
  if (
    wrBtnText.value === originWRBtnText ||
    wrOutputBtnText.value === originWROutputBtnText
  ) {
    alert('Wafer Report 請补充轉換文件路徑')
    return
  }
  win.api.send('task:genWaferReportFile', {
    wrFilePath: wrBtnText.value,
    wrOutputPath: wrOutputBtnText.value,
  })
  wrStartBtnText.value = '已啓動'
}

const authorizationCodeBtnOnclick = () => {
  if (authorizationCode.value === '') {
    alert('授權碼不能為空')
    return
  }
  win.api.send('authorizationCode', authorizationCode.value)
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
