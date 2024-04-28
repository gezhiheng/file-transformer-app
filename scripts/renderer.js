const mtFileBtn1 = document.getElementById('mt-file-btn1')
const mtFileBtn2 = document.getElementById('mt-file-btn2')
const mtOutputBtn = document.getElementById('mt-output-btn')

const wrFileBtn = document.getElementById('wr-file-btn')
const wrBackupBtn = document.getElementById('wr-backup-btn')
const wrOutputBtn = document.getElementById('wr-output-btn')

let mtFilePath1, mtFilePath2, mtBackupPath, mtOutputPath
let wrFilePath, wrBackupPath, wrOutputPath

mtFileBtn1.addEventListener('click', async () => {
  const filePath = await window.api.openFile()
  if (filePath) {
    mtFileBtn1.innerText = filePath
    mtFilePath1 = filePath
  }
})

mtFileBtn2.addEventListener('click', async () => {
  const filePath = await window.api.openFile()
  if (filePath) {
    mtFileBtn2.innerText = filePath
    mtFilePath2 = filePath
  }
})

mtOutputBtn.addEventListener('click', async () => {
  const filePath = await window.api.openFile()
  if (filePath) {
    mtOutputBtn.innerText = filePath
    mtOutputPath = filePath
  }
})

wrFileBtn.addEventListener('click', async () => {
  const filePath = await window.api.openFile()
  if (filePath) {
    wrFileBtn.innerText = filePath
    wrFilePath = filePath
  }
})

wrOutputBtn.addEventListener('click', async () => {
  const filePath = await window.api.openFile()
  if (filePath) {
    wrOutputBtn.innerText = filePath
    wrOutputPath = filePath
  }
})

const mtStartBtn = document.getElementById('mt-start-btn')
mtStartBtn.addEventListener('click', async () => {
  if (!mtFilePath1 && !mtFilePath2) {
    alert('Machine Time 請選擇至少一個轉換文件路徑')
    return
  }
  window.api.send('genMachineTimeFileTask', {
    mtFilePath1,
    mtFilePath2,
    mtBackupPath,
    mtOutputPath,
  })
})

const wrStartBtn = document.getElementById('wr-start-btn')
wrStartBtn.addEventListener('click', async () => {
  if (!wrOutputPath) {
    alert('Wafer Report 請選擇轉換文件路徑')
    return
  }
  window.api.send('genWaferReportFileTask', {
    wrFilePath,
    wrBackupPath,
    wrOutputPath,
  })
})

window.api.receive('mtCurrentProcessFile', (currentProcessFile) => {
  document.getElementById('mt-current-process-file').innerText =
    currentProcessFile
})

window.api.receive('wrCurrentProcessFile', (currentProcessFile) => {
  document.getElementById('wr-current-process-file').innerText =
    currentProcessFile
})

window.api.receive('log', (log) => {
  const textarea = document.getElementById('log-textarea')
  textarea.value = log + '\n' + textarea.value
})

window.api.receive('no-authorization', () => {
  alert('當前MAC地址沒有授權！')
})
