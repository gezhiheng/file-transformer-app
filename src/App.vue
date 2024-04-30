<template>
  <img src="./assets/lumitek.jpg" alt="lumitek" />
  <div class="container">
    <div class="form">
      <div class="title">File Transformer,<br /><span>Machine Time</span></div>
      <button class="btn-input" id="mt-file-btn1" @click="fileOpen(mt1BtnText)">
        {{ mt1BtnText }}
      </button>
      <button class="btn-input" id="mt-file-btn2">
        {{ mt2BtnText }}
      </button>
      <button class="btn-input" id="mt-output-btn">
        {{ mtOutputBtnText }}
      </button>
      <span class="current-process-file">
        當前處理的文件:
        <span id="mt-current-process-file">{{ mtCurrentProcessFile }}</span>
      </span>
      <div class="btn-group">
        <button class="btn-confirm" id="mt-start-btn" @click="dialogTableVisible = true">開始</button>
      </div>
    </div>
    <div class="form">
      <div class="title">File Transformer,<br /><span>Wafer Report</span></div>
      <button class="btn-input" id="wr-file-btn">
        {{ wrBtnText }}
      </button>
      <button class="btn-input" id="wr-output-btn">
        {{ wrOutputBtnText }}
      </button>
      <span class="current-process-file">
        當前處理的文件:
        <span id="wr-current-process-file">{{ wrCurrentProcessFile }}</span>
      </span>
      <div class="btn-group">
        <button class="btn-confirm" id="wr-start-btn">開始</button>
        <!-- <button class="btn-confirm" id="wr-save-btn">保存路徑</button> -->
      </div>
    </div>
  </div>
  <div class="form log">
    <div class="title log-title">
      Log, <br /><span>History & Exception</span>
    </div>
    <textarea id="log-textarea" readonly="true" cols="30" rows="10"></textarea>
  </div>
  <div class="footer">
    <span>Copyright © 2024 琉明光電（常州）</span>
  </div>
  <el-dialog v-model="dialogTableVisible" title="Shipping address" width="800">
    <el-table :data="gridData">
      <el-table-column property="date" label="Date" width="150" />
      <el-table-column property="name" label="Name" width="200" />
      <el-table-column property="address" label="Address" />
    </el-table>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const mt1BtnText = ref<string>('Machine Time 轉檔前路徑')
const mt2BtnText = ref<string>('Alarm Report 轉檔前路徑')
const mtOutputBtnText = ref<string>('Machine Time 轉檔后路徑')
const mtCurrentProcessFile = ref<string>('')

const wrBtnText = ref<string>('Wafer Report 轉檔前路徑')
const wrOutputBtnText = ref<string>('Wafer Report 轉檔後路徑')
const wrCurrentProcessFile = ref<string>('')

const dialogTableVisible = ref<boolean>(false)

watch(dialogTableVisible, (newValue, oldValue) => {
  if (newValue) {
    document.querySelectorAll('*').forEach(item => {
      item.classList.add('no-drag')
    })
  } else {
    document.querySelectorAll('*').forEach(item => {
      item.classList.remove('no-drag')
    })
  }
})

const gridData = [
  {
    date: '2016-05-02',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-04',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-01',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-03',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
]

const mt1BtnOnclick = async () => {}

const fileOpen = async (btnText:string) => {
  console.log(globalThis)
  const filePath = await window.api.handle('dialog:openFile')

}
</script>

<style scoped>
@import url('./index.css');
</style>
