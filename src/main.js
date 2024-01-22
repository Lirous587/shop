import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //这个是全局引入elment plus图标

const app = createApp(App)

app.use(router)
app.use(store)
app.use(ElementPlus)

//全局引入elment plus图标的相关处理
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

import 'virtual:windi.css'

import "./permission"

import "nprogress/nprogress.css"


app.mount('#app')