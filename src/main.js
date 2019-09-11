import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueLazyload from 'vue-lazyload'
import "normalize.css";

Vue.config.productionTip = false
// 图片懒加载
// or with options
Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
