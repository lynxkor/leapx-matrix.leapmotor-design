import { base64ToFile, pick } from './tools'

/**
 * Uploader Manager
 */
class BaseUploaderManager {
  /**
   * @description: 基础版构造函数
   * @param {*} option
   */
  constructor (option = {}) {
    this.option = option
  }

  /**
   * @description: 设置上传构造器
   * @param {*} Uploader: 上传构造器
   * @return {*}
   */
  setUploader (Uploader) {
    this.Uploader = Uploader
  }

  /**
   * @description: 文件上传
   * @param {*} file: input file
   * @param {*} *option {
   *    *fileName: 返回的文件名
   *    *download: 0: 图片url, 1: 下载链接
   * }
   */
  upload (file, option = {}) {
    return this.uploads([file], {
      onProgress: option.onProgress,
      options: [option]
    })
  }

  /**
   * @description: 文件上传
   * @param {*} files: input files
   * @param {*} *options {
   *    *onProgress: fn
   *    *onSuccess: fn
   *    *onError: fn
   *    *securityCheck: boolean
   *    options: [{
   *       *fileName: 返回的文件名
   *       *download: 0: 图片url, 1: 下载链接
   *    }]
   * }
   */
  uploads (files, options = {}) {
    const Uploader = this.Uploader
    options = Object.assign({
      options: [],
      securityCheck: false,
      overwrite: true,
      ...pick(this.option, 'onSuccess', 'onError', 'onProgress', 'securityCheck', 'app', 'onBeforeRequest', 'overwrite')
    }, options)
    const promiseList = []
    const onProgress = this._progress(options.onProgress).calcu
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      if (typeof file === 'string') {
        // base64转文件
        file = base64ToFile(file)
        if (!file) {
          options.onError(new Error('格式解析失败'))
          continue
        }
      }
      promiseList.push(new Promise((resolve, reject) => {
        new Uploader({
          ...options,
          resolve,
          reject,
          onProgress
        })
          .upload(file, (options && options.options[i]) || [])
      }))
    }
    return Promise.all(promiseList).then(options.onSuccess, options.onError)
  }

  /**
   * @description: 上传进度
   * @param {*} cbFn callback
   * @return {*} fn
   */
  _progress (cbFn) {
    if (!cbFn) {
      return {
        calcu: () => {}
      }
    }
    const progressData = {}
    let currentPercent = 0
    return {
      /**
       * @return {
       *    percent: 总百分比
       *    uploaded: 已上传数
       *    sum: 总上传数
       * }
       */
      calcu: (data) => {
        progressData[data.name] = data.percent
        const percents = Object.keys(progressData).map((key) => progressData[key])
        const uploaded = percents.filter((percent) => percent === 1).length

        const percent = Math.floor(
          percents
            .reduce((total, num) => {
              return total + num
            }) / percents.length * 100
        )

        if (percent > currentPercent) {
          currentPercent = percent
          cbFn({
            percent,
            uploaded,
            sum: percents.length
          })
        }
      }
    }
  }
}

export default BaseUploaderManager
