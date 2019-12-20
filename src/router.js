import Vue from 'vue'
import Router from 'vue-router'
import Demo from './views/Demo.vue'
import Home from './views/Home.vue'
import Crop from './views/Crop.vue'
import Filter from './views/Filter.vue'
import Pixi from './views/Pixi.vue'
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
      name: 'Crop',
      component: Crop
    },
    {
      path: '/filter',
      name: 'Filter',
      component: Filter
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/',
      name: 'Pixi',
      component: Pixi
    },
  ]
})
