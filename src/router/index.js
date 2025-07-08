import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Home',
  component: Home
}, {
  path: '/uploader/ossUploader',
  name: 'ossUploader',
  component: () => import('../views/uploader/ossUploader.vue')
}, {
  path: '/theme',
  name: 'theme',
  component: () => import('../views/Theme.vue')
}]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: () => {
    return {
      y: 0
    }
  }
})

export default router
