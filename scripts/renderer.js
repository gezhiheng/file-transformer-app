const mtFileBtn1 = document.getElementById('mt-file-btn1')
const mtFileBtn2 = document.getElementById('mt-file-btn2')
const mtOutputBtn = document.getElementById('mt-output-btn')

const wrFileBtn = document.getElementById('wr-file-btn')
const wrBackupBtn = document.getElementById('wr-backup-btn')
const wrOutputBtn = document.getElementById('wr-output-btn')

let mtFilePath1, mtFilePath2, mtBackupPath, mtOutputPath
let wrFilePath, wrBackupPath, wrOutputPath

const textarea = document.getElementById('log-textarea')

mtFileBtn1.addEventListener('click', async () => {
  try {
    const filePath = await window.api.openFile()
    if (filePath) {
      mtFileBtn1.innerText = filePath
      mtFilePath1 = filePath
    }
  } catch (error) {
    textarea.value = '當前MAC地址沒有授權\n' + textarea.value
  }
  
})

mtFileBtn2.addEventListener('click', async () => {
  try {
    const filePath = await window.api.openFile()
    if (filePath) {
      mtFileBtn2.innerText = filePath
      mtFilePath2 = filePath
    }
  } catch (error) {
    textarea.value = '當前MAC地址沒有授權\n' + textarea.value
  } 
})

mtOutputBtn.addEventListener('click', async () => {
  try {
    const filePath = await window.api.openFile()
    if (filePath) {
      mtOutputBtn.innerText = filePath
      mtOutputPath = filePath
    }
  } catch(error) {
    textarea.value = '當前MAC地址沒有授權\n' + textarea.value
  }
  
})

wrFileBtn.addEventListener('click', async () => {
  try {
    const filePath = await window.api.openFile()
    if (filePath) {
      wrFileBtn.innerText = filePath
      wrFilePath = filePath
    }
  } catch(error) {
    textarea.value = '當前MAC地址沒有授權\n' + textarea.value
  }
})

wrOutputBtn.addEventListener('click', async () => {
  try {
    const filePath = await window.api.openFile()
    if (filePath) {
      wrOutputBtn.innerText = filePath
      wrOutputPath = filePath
    }
  } catch(error) {
    textarea.value = '當前MAC地址沒有授權\n' + textarea.value
  }
})

const mtStartBtn = document.getElementById('mt-start-btn')

mtStartBtn.addEventListener('click', async () => {
  try {
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
  } catch (error) {
    textarea.value = '當前MAC地址沒有授權\n' + textarea.value
  }
})

const wrStartBtn = document.getElementById('wr-start-btn')
wrStartBtn.addEventListener('click', async () => {
  try {
    if (!wrOutputPath) {
      alert('Wafer Report 請選擇轉換文件路徑')
      return
    }
    window.api.send('genWaferReportFileTask', {
      wrFilePath,
      wrBackupPath,
      wrOutputPath,
    })
  } catch(error) {
    textarea.value = '當前MAC地址沒有授權\n' + textarea.value
  }
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
  textarea.value = log + '\n' + textarea.value
})

window.api.receive('no-authorization', () => {
  alert('當前MAC地址沒有授權！')
})
