import { createPinia } from "pinia";
// 持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
export default pinia

// 统一导出
export * from './modules/user'