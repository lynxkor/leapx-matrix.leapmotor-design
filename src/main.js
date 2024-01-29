/**
 * 开发模式入口
 */
import hljs from 'highlight.js'
import 'highlight.js/styles/xcode.css'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.directive('highlight', (el) => {
  const blocks = el.querySelectorAll('pre code')
  blocks.forEach(block => {
    hljs.highlightElement(block)
  })
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
