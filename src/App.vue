<template>
  <img src="./assets/lumitek.jpg" alt="lumitek" />
  <div class="container">
    <div class="form">
      <div class="title">File Transformer,<br /><span>Machine Time</span></div>
      <button class="btn-input" id="mt-file-btn1" @click="mt1BtnOnclick">
        {{ mt1BtnText }}
      </button>
      <button class="btn-input" id="mt-file-btn2" @click="mt2BtnOnclick">
        {{ mt2BtnText }}
      </button>
      <button class="btn-input" id="mt-output-btn" @click="mtOutputBtnOnclick">
        {{ mtOutputBtnText }}
      </button>
      <span class="current-process-file">
        當前處理的文件:
        <span id="mt-current-process-file">{{ mtCurrentProcessFile }}</span>
      </span>
      <div class="btn-group">
        <button
          class="btn-confirm"
          id="mt-start-btn"
          @click="machineTimeBtnOnclick"
        >
          開始
        </button>
      </div>
    </div>
    <div class="form">
      <div class="title">File Transformer,<br /><span>Wafer Report</span></div>
      <button class="btn-input" id="wr-file-btn" @click="wrBtnOnclick">
        {{ wrBtnText }}
      </button>
      <button class="btn-input" id="wr-output-btn" @click="wrOutputBtnOnclick">
        {{ wrOutputBtnText }}
      </button>
      <span class="current-process-file">
        當前處理的文件:
        <span id="wr-current-process-file">{{ wrCurrentProcessFile }}</span>
      </span>
      <div class="btn-group">
        <button
          class="btn-confirm"
          id="wr-start-btn"
          @click="waferReportBtnOnclick"
        >
          開始
        </button>
        <!-- <button class="btn-confirm" id="wr-save-btn">保存路徑</button> -->
      </div>
    </div>
  </div>
  <div class="form log">
    <div class="title log-title">
      Log, <br /><span>History & Exception</span><br /><span
        >MAC地址：{{ macAddress }}</span
      >
    </div>
    <textarea id="log-textarea" readonly="true" cols="30" rows="10">{{
      log
    }}</textarea>
  </div>
  <div class="footer">
    <span>Copyright © 2024 琉明光電（常州）</span>
  </div>
  <el-dialog
    v-model="dialogTableVisible"
    title="請輸入授權碼"
    width="350"
    :close-on-click-modal="false"
    :show-close="true"
  >
    <el-input
      v-model="authorizationCode"
      style="width: 240px; margin-right: 6px"
    />
    <el-button type="info" plain @click="authorizationCodeBtnOnclick"
      >確定</el-button
    >
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const win: any = window
win.api.send('rendererFinishLoad')

const mt1BtnText = ref<string>('Machine Time 轉檔前路徑')
const mt2BtnText = ref<string>('Alarm Report 轉檔前路徑')
const mtOutputBtnText = ref<string>('Machine Time 轉檔后路徑')
const mtCurrentProcessFile = ref<string>('')

const wrBtnText = ref<string>('Wafer Report 轉檔前路徑')
const wrOutputBtnText = ref<string>('Wafer Report 轉檔後路徑')
const wrCurrentProcessFile = ref<string>('')

const log = ref<string>('')
const authorizationCode = ref<string>('')
const dialogTableVisible = ref<boolean>(false)
const macAddress = ref<string>('')

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
  const filePath = await win.api.handle('dialog:openDirectory')
  if (filePath) {
    mt1BtnText.value = filePath
  }
}

const mt2BtnOnclick = async () => {
  const filePath = await win.api.handle('dialog:openDirectory')
  if (filePath) {
    mt2BtnText.value = filePath
  }
}

const mtOutputBtnOnclick = async () => {
  const filePath = await win.api.handle('dialog:openDirectory')
  if (filePath) {
    mtOutputBtnText.value = filePath
  }
}

const wrBtnOnclick = async () => {
  const filePath = await win.api.handle('dialog:openDirectory')
  if (filePath) {
    wrBtnText.value = filePath
  }
}

const wrOutputBtnOnclick = async () => {
  const filePath = await win.api.handle('dialog:openDirectory')
  if (filePath) {
    wrOutputBtnText.value = filePath
  }
}

win.api.receive('log', (data: string) => {
  if (data === '當前MAC地址沒有授權') {
    dialogTableVisible.value = true
  }
  log.value = `${data}\n${log.value}`
})

win.api.receive('macAddress', (data: string) => {
  macAddress.value = data
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
    alert('授權配置寫入成功，請重啓應用')
  } else {
    alert('錯誤：授權配置寫入失敗，請聯係開發人員！')
  }
})

const machineTimeBtnOnclick = () => {
  if (
    mt1BtnText.value === 'Machine Time 轉檔前路徑' ||
    mt2BtnText.value === 'Alarm Report 轉檔前路徑' ||
    mtOutputBtnText.value === 'Machine Time 轉檔后路徑'
  ) {
    alert('Machine Time 請补充轉換文件路徑')
    return
  }
  win.api.send('task:genMachineTimeFile', {
    mtFilePath1: mt1BtnText.value,
    mtFilePath2: mt2BtnText.value,
    mtOutputPath: mtOutputBtnText.value,
  })
}

const waferReportBtnOnclick = () => {
  if (
    wrBtnText.value === 'Wafer Report 轉檔前路徑' ||
    wrOutputBtnText.value === 'Wafer Report 轉檔後路徑'
  ) {
    alert('Wafer Report 請补充轉換文件路徑')
    return
  }
  win.api.send('task:genWaferReportFile', {
    wrFilePath: wrBtnText.value,
    wrOutputPath: wrOutputBtnText.value,
  })
}

const authorizationCodeBtnOnclick = () => {
  if (authorizationCode.value === '') {
    alert('授權碼不能為空')
    return
  }
  win.api.send('authorizationCode', authorizationCode.value)
}
</script>

<style scoped>
@import url('./index.css');
</style>
