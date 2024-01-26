import BaseUploadCreater from '../baseUploader'
import uploader from './uploader'

/**
 * @description: Uploader模块工厂方法
 * @param {*} option {
 *  code: 业务码
 *  *singleton: true 上传实例单例
 *  *onSuccess: Function 成功回调
 *  *onError: Function 失败回调
 *  *securityCheck: boolean
 * }
 */
let instance
function uploaderCreater (option) {
  if (!instance || option.singleton === false) {
    instance = BaseUploadCreater(option)
    instance.setUploader(uploader)
  }
  return instance
}

export default uploaderCreater
