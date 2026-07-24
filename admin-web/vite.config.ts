import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), AutoImport({
    imports: ['vue', {
      'naive-ui': [
        'useDialog',
        'useMessage',
        'useNotification',
        'useLoadingBar'
      ]
    }]
  }),
  Components({
    resolvers: [NaiveUiResolver()]
  })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 👈 配置 @ 映射到 src 目录
    }
  },
  server: {
    port: 5173,
    open: true // 启动时自动打开浏览器
  }
})
