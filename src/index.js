/**
 * 组件库引用入口
 */
import { version } from '../package.json'
// import HelloWorld from '../packages/helloWorld/index.js'
import OssUploader from '../packages/ossUploader/index'
import Theme from '../packages/theme/index.scss'

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
