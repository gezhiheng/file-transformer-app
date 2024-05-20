import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'

import 'element-plus/dist/index.css'
import './base.css'

import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(ElementPlus)
app.mount('#app')
