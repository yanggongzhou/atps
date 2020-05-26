// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

import store from './store'//引入store

import '@/assets/css/main.css'
import '@/assets/css/other.css'
import './assets/icon/iconfont.css'

import global from '@/api/global'
import echarts from 'echarts'

Vue.use(iView);
Vue.prototype.$global= global;
Vue.prototype.$echarts = echarts;


Vue.prototype.bus = new Vue();

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,//使用store
  components: { App },
  template: '<App/>'
})
