import {
  TOKEN_URL,
  GENERATE_URL,
  UNKNOWN_ERROR
} from './config'
import { pick } from './tools'

/**
 * 抽象上传实例
 */
class AbstractUploader {
  /**
   * @description: 基础版构造函数
   * @param {*} option
   */
  constructor () {
    if (new.target === AbstractUploader) {
      throw new Error('请使用setUploader指定上传器')
    }
  }

  upload () {
    throw new Error('请实现upload方法')
  }

  _pick () {
    return pick(...arguments)
  }

  /**
   * @description: request hook
   * @param {*} data: {
   *    url: string,
   *    params: <string, any>
   * }
   * @return {*}
   */
  _onBeforeRequest (data) {
    const { onBeforeRequest } = this.option
    if (onBeforeRequest) {
      const { url, params } = data
      Object.assign(data, onBeforeRequest(url, { ...params }))
    }
    return data
  }

  _fetchUploadInfo ({ headers }) {
    return new Promise((resolve) => {
      const { app } = this.option
      const requestData = this._onBeforeRequest({
        url: TOKEN_URL.replace('{app}', `${app || ''}`),
      })
      fetch(
        requestData.url,
        {
          body: JSON.stringify(requestData.params),
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            ...headers
          },
        }
      )
        .then(response => response.json())
        .then((response) => {
          if (response && response.data) {
            resolve(response.data)
          } else {
            const errorMsg = response.message || UNKNOWN_ERROR
            this.option.reject(new Error(errorMsg))
          }
        })
    })
  }

  /**
   * @description: 获取地址
   * @param {*} option {
   *    objectName
   *    *download: 0: 图片url, 1: 下载链接
   * }
   * @return {*} Promise
   */
  _getPath (option) {
    return new Promise((resolve) => {
      const { app } = this.option
      const url = GENERATE_URL.replace('{app}', `${app || ''}`)
      fetch(url + '?' + new URLSearchParams(option).toString(), {
        headers: option.headers
      })
        .then(response => response.json())
        .then((response) => {
          if (response && response.data) {
            resolve(response.data)
          } else {
            const errorMsg = response.message || UNKNOWN_ERROR
            this.option.reject(new Error(errorMsg))
          }
        })
    })
  }
}

export default AbstractUploader
