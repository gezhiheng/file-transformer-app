<template>
  <img src="./assets/lumitek.jpg" alt="lumitek" />
  <el-tabs v-model="activeName" class="tabs">
    <el-tab-pane label="分選" name="sort">
      <Sort @showDialog="dialogTableVisible = true" />
    </el-tab-pane>
    <el-tab-pane label="點測" name="probe">
      <Probe @showDialog="dialogTableVisible = true" />
    </el-tab-pane>
  </el-tabs>
  <div class="footer">
    <span>Copyright © 2024 琉明光電（常州）</span>
    <span>（當前MAC地址: {{ macAddress }}）</span>
  </div>
  <el-dialog
    v-model="dialogTableVisible"
    title="請輸入授權碼"
    width="350"
    :show-close="true"
  >
    <el-input
      v-model="authorizationCode"
      style="width: 240px; margin-right: 6px"
    />
    <el-button type="info" plain @click="authorizationCodeBtnOnclick">
      確定
    </el-button>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import Swal from 'sweetalert2'
import Sort from './components/Sort.vue'
import Probe from './components/Probe.vue'
import { authorizationStore } from './store'

const win: any = window

onMounted(() => {
  win.api.send('rendererFinishLoad')
})

const authorizationStoreInstance = authorizationStore()

win.api.receive('isAuthorization', (data: boolean) => {
  authorizationStoreInstance.setAuthorization(data)
})

const authorizationCode = ref<string>('')
const dialogTableVisible = ref<boolean>(false)
const activeName = ref<string>('sort')
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

win.api.receive('macAddress', (data: string) => {
  macAddress.value = data ? data : ''
})

win.api.receive('config:authorizationCode', (flag: boolean) => {
  dialogTableVisible.value = false
  if (flag) {
    authorizationStoreInstance.setAuthorization(flag)
    Swal.fire({
      icon: 'success',
      title: '授權成功！',
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: '授權失敗！',
      text: '請檢查授權碼，或聯係開發人員',
    })
  }
})

const authorizationCodeBtnOnclick = () => {
  if (authorizationCode.value === '') {
    return
  }
  win.api.send('authorizationCode', authorizationCode.value)
}
</script>

<style scoped>
img {
  width: 200px;
  margin: 18px 0 6px 8px;
}

.footer {
  position: fixed;
  bottom: 7px;
  width: 100%;
  font-size: 14px;
  opacity: 0.5;
  text-align: center;
}

.tabs {
  -webkit-app-region: no-drag;
  margin: 0 12px;
}

.el-tab-pane {
  height: 100%;
}
</style>
