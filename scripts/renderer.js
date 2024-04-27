const mtFileBtn1 = document.getElementById('mt-file-btn1')
const mtFileBtn2 = document.getElementById('mt-file-btn2')
const mtOutputBtn = document.getElementById('mt-output-btn')

let mtFilePath1, mtFilePath2, mtBackupPath, mtOutputPath

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

const mtStartBtn = document.getElementById('mt-start-btn')
mtStartBtn.addEventListener('click', async () => {
  if (!mtFilePath1 && !mtFilePath2) {
    alert('請選擇至少一個轉換文件路徑')
    return
  }
  window.api.send('genMachineTimeFileTask', {
    mtFilePath1,
    mtFilePath2,
    mtBackupPath,
    mtOutputPath,
  })
})

window.api.receive('mtCurrentProcessFile', (currentProcessFile) => {
  document.getElementById('mt-current-process-file').innerText = currentProcessFile
})

window.api.receive('wrCurrentProcessFile', (currentProcessFile) => {
  document.getElementById('wr-current-process-file').innerText = currentProcessFile
})
