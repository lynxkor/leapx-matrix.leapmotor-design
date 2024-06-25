import OSS from 'ali-oss'
import BaseUploader from '../baseUploader/uploader'

/**
 * 上传实例
 */
let instance
class OSSUploader extends BaseUploader {

  /**
   * @description: 构造函数
   * @param {*} option
   */
  constructor (option = {}) {
    if (!instance) {
      super()
      instance = this
    }
    
    instance.option = option
    return instance
  }

  /**
   * @description: 文件上传
   * @param {*} file: input file
   * @param {*} *option {
   *    *fileName: 返回的文件名
   *    *download: 0: 图片url, 1: 下载链接
   * }
   */
  async upload (file, option) {
    // 获取上传凭证、分区信息
    if (!this.OSSUploader) {
      await this._fetchUploadInfo().then((res) => {
        this._initOSSUploader({
          region: this.region || res.ossRegion || 'oss-cn-hangzhou',
          accessKeyId: res.credentials.accessKeyId,
          accessKeySecret: res.credentials.accessKeySecret,
          stsToken: res.credentials.securityToken,
          bucket: res.bucket,
          refreshSTSToken: async () => {
            // 向您搭建的STS服务获取临时访问凭证。
            const info = await this._fetchUploadInfo();
            return {
              accessKeyId: info.credentials.accessKeyId,
              accessKeySecret: info.credentials.accessKeySecret,
              stsToken: info.credentials.securityToken,
              refreshSTSTokenInterval: new Date(info.credentials.expiration).getTime() - new Date().getTime() - 1000 // 留1s兜底
            }
          },
          refreshSTSTokenInterval: new Date(res.credentials.expiration).getTime() - new Date().getTime() - 1000 // 留1s兜底
        })
  
      })
    }

    // 上传
    this._upload(file, {
      ...option,
      objectName: file.name,
    })
  }

  /**
   * @description: 初始化OSSUploader
   * @param {*} data {
   *    region,
   *    accessKeyId,
   *    accessKeySecret,
   *    stsToken,
   *    bucket,
   * }
   */
  _initOSSUploader (data) {
    this.OSSUploader = new OSS(data)
  }

  _upload (file, option) {
    // 上传
    this.OSSUploader.put(option.objectName, file).then((res) => {
      Promise.all([
        this._getPath({
          key: option.objectName,
        }),
        // this._getImgInfo(file)
      ])
        .then(([
          url,
          // imageInfo,
        ]) => {
          this.option.resolve(
            {
              // ...imageInfo,
              ...res,
              url,
              objectName: option.objectName,
            })
        })
    }).catch((e) => {
      this.option.reject(new Error(e))
    })
  }
}

export default OSSUploader
