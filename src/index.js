/**
 * 组件库引用入口
 */
import Vue from 'vue'
import './assets/js/font.js'
import { version } from '../package.json'
// import HelloWorld from '../packages/helloWorld/index.js'
import OssUploader from '../packages/ossUploader/index'
import Theme from '../packages/theme/index.scss'
import { Button } from 'element-ui'

// 注册 Button 组件
Vue.component(Button.name, Button)

// const components = {
//   HelloWorld,
// }

// const install = function (Vue) {
//   Object.values(components).forEach(component => {
//     Vue.component(component.name, component)
//   })
// }

// if (typeof window !== 'undefined' && window.Vue) {
//   install(window.Vue)
// }

export { OssUploader }
export { Theme }
// export { HelloWorld }
export default {
  version,
  // install,
  // HelloWorld,
  OssUploader,
  Theme,
}
