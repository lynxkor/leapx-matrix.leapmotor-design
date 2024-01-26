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
  upload (file, option) {
    // 获取上传凭证、分区信息
    this._fetchUploadInfo(file, {
      fileName: option.fileName
    }).then((res) => {
      this._initOSSUploader({
        region: res.region,
        accessKeyId: res.temporaryAccessKey,
        accessKeySecret: res.temporaryAccessSecret,
        stsToken: res.token,
        bucket: res.bucketName,
        endpoint: res.endPoint,
        // endpoint: 'sts.cn-hangzhou.aliyuncs.com',
      })

      // 上传
      this._upload(file, {
        ...option,
        objectName: res.objectName,
      })
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
        this._getPath(this._pick(option, 'objectName', 'download', 'thumbnail')),
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
