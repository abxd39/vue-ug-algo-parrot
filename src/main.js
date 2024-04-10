import { createApp } from 'vue'
import App from './App.vue'
import './assets/less/index.less'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import store from './store'
// import './api/mock.js'
import api from '@/api'
import * as echarts from 'echarts'
import { getUsername } from '@/utils/api_utils'
import Plugin from 'v-fit-columns'
import DevicePixelRatio from '@/utils/devicePixelRatio';
// 校验cookie中是否有user_name
getUsername()

const app = createApp(App)
// 引入element-plus-icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$api = api
app.config.globalProperties.$echarts = echarts

app.use(router).use(Plugin).use(store)

app.mount('#app')


// export default {
//   name: "App",
//   created() {
//     new DevicePixelRatio().init();
// 	}
// };
