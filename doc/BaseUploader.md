### BaseUploader
内部抽象组件，用于扩展上传行为, 默认提供`token`与`generalUrl`两个上传必经接口的调用能力

## 用法
```vue
// 定义
import BaseUploader from '@leapmotor-design'

/**
 * 上传实例
 */
class MyUploader extends BaseUploader {
  constructor (option = {}) {
    super()
    this.option = option
  }

  // 定义upload行为
  // 批量与单独调用均会调用该函数
  upload (file, option) {
  }

}

export default MyUploader

// 使用
const uploader = MyUploader(...)
uploader.uploads('...')
uploader.upload('...')
```