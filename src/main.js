import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as echarts from 'echarts'
import Prient from 'vue-print-nb'
import axios from 'axios';
import elementui from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/js/directives.js'
import directives from './js/allDirectives';
import '@/assets/public.scss';
import VueHoverMask from 'vue-hover-mask' // 遮罩组件
import './permission' // 权限
import InputTag from 'vue-input-tag'

UTILS.setTitle('MyText');
UTILS.setIcon()
Vue.config.productionTip = false//关闭控制台关于运行环境的提示
Vue.use(Prient);
Vue.use(elementui);
Vue.use(directives);
Vue.component(VueHoverMask.name, VueHoverMask)
Vue.component('input-tag', InputTag)
Vue.prototype.$axios = axios //全局注册，使用方法为:this.$axios
Vue.prototype.$echart = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
