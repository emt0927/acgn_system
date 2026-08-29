import { createApp } from 'vue'
import router from './router/index.ts'
import './style.css'
import pinia from './store'
import App from './App.vue'
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
import { vThack } from './directives/track.ts'
const app = createApp(App)
// 注册
app.directive('thack', vThack)
app.use(router)
app.use(pinia)
app.mount('#app')
