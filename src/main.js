/**
 * 开发模式入口
 */
import hljs from 'highlight.js'
import 'highlight.js/styles/xcode.css'

import './assets/css/base.scss'
import './assets/css/element-variables.scss'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/js/font.js'
import { Button, Pagination, Dialog, Col, Row, Input, Checkbox, CheckboxGroup, Radio, RadioGroup, Switch, Form, FormItem, Loading } from 'element-ui'

import {
  VxeUi,
  VxeTooltip,
  VxeButton,
  VxeIcon
} from 'vxe-pc-ui'

import {
  VxeTable,
  VxeColumn,
  VxeToolbar
} from 'vxe-table'

// 导入主题变量，也可以重写主题变量
import 'vxe-table/styles/cssvar.scss'
import 'vxe-pc-ui/styles/base.scss'
import './assets/css/vxe-table-variable.scss'

// 导入默认的语言
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'

VxeUi.setI18n('zh-CN', zhCN)
VxeUi.setLanguage('zh-CN')

// 注册 Element-UI 组件
Vue.component(Button.name, Button)
Vue.component(Pagination.name, Pagination)
Vue.component(Dialog.name, Dialog)
Vue.component(Col.name, Col)
Vue.component(Input.name, Input)
Vue.component(Row.name, Row)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Form.name, Form)
Vue.component(Radio.name, Radio)
Vue.component(FormItem.name, FormItem)
Vue.component(Switch.name, Switch)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(CheckboxGroup.name, CheckboxGroup)

Vue.use(VxeTable)
Vue.use(VxeTooltip)
Vue.use(VxeColumn)
Vue.use(VxeToolbar)
Vue.use(VxeButton)
Vue.use(VxeIcon)
Vue.use(Loading.directive) // 注册 v-loading 指令

Vue.directive('highlight', (el) => {
  const blocks = el.querySelectorAll('pre code')
  blocks.forEach(block => {
    hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
    hljs.highlightElement(block)
  })
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
