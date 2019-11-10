import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueLazyload from 'vue-lazyload'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import "normalize.css"
import 'swiper/dist/css/swiper.css'
Vue.config.productionTip = false
Vue.prototype.$bus = Vue.prototype.$bus || new Vue() // 注册一个全局的总线组件
// 图片懒加载
Vue.use(VueAwesomeSwiper)
// or with options
Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 3,
  throttleWait:0
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
