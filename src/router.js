import Vue from 'vue'
import Router from 'vue-router'
import Demo from './views/Demo.vue'
import Home from './views/Home.vue'
import CropPage from './views/CropPage.vue'
import Filter from './views/Filter.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/demo',
      name: 'Demo',
      component: Demo
    },
    {
      path: '/crop',
      name: 'CropPage',
      component: CropPage
    },
    {
      path: '/filter',
      name: 'Filter',
      component: Filter
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
  ]
})
