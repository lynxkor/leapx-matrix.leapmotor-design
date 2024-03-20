import BaseUploaderManager from './manager'

/**
 * @description: Uploader模块工厂方法
 * @param {*} option {
 *  *securityCheck: false 安全校验
 *  *singleton: true 上传实例单例
 *  *onSuccess: Function 成功回调
 *  *onError: Function 失败回调
 *  *securityCheck: boolean
 * }
 */
function uploaderCreater (option) {
  return new BaseUploaderManager(option)
}

export default uploaderCreater
