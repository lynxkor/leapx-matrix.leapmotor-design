import OSS from 'ali-oss'
import BaseUploader from '../baseUploader/uploader'

/**
 * 上传实例
 */
class OSSUploader extends BaseUploader {
  /**
   * @description: 构造函数
   * @param {*} option
   */
  constructor (option = {}) {
    super()
    this.option = option
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
      await this._fetchUploadInfo(option).then((res) => {
        this._initOSSUploader({
          region: this.region || res.ossRegion || 'oss-cn-hangzhou',
          accessKeyId: res.credentials.accessKeyId,
          accessKeySecret: res.credentials.accessKeySecret,
          stsToken: res.credentials.securityToken,
          bucket: res.bucket,
          refreshSTSToken: async () => {
            // 向您搭建的STS服务获取临时访问凭证。
            const info = await this._fetchUploadInfo(option)
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

    let objectName
    if (file.name.includes('.')) {
      const list = file.name.split('.')
      const name = list.slice(0, -1).join('.')
      const ext = list.pop()
      objectName = name + '_' + new Date().getTime() + `.${ext}`
    } else {
      objectName = file.name + '_' + new Date().getTime()
    }

    // 上传
    this._upload(file, {
      ...option,
      objectName
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
          ...option,
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
              name: file.name
            })
        })
    }).catch((e) => {
      this.option.reject(new Error(e))
    })
  }
}

export default OSSUploader
