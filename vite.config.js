import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'

import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src")
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://ceshi13.dishait.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/public': {
        target: 'http://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/public',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/public/, '')
      }
    }
  },
  plugins: [
    vue(),
    WindiCSS(),
  ],
})
