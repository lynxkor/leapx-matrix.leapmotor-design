/**
 * 改工具类组件比较特殊，需在window中定义对象来使用
 */
import axios from 'axios'
import moment from 'moment'

const LOG_LOCAL_STORAGE_KEY = '__LP_LOGGER_LIST__'
const LOG_LOCAL_LOAD_KEY = '__LP_LOGGER_LOAD__'

function createUniqueString () {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

class LPLogger {
  constructor (option = {}) {
    this.sort = 1
    this.option = { ...option, pid: createUniqueString() + new Date().getTime() }
    this.list = [...this.__getLocalStorage(), ...this.__getLoadLocalStorage()]
    this.sort = this.list.length
    this.timeout = null
  }

  /**
   * 用户登录后设置用户id
   * @param {string} uid 用户id
   */
  setUid (uid) {
    this.option.uid = uid
  }

  report (data) {
    this.list.push(this.__logAssign(data))
    localStorage.setItem(LOG_LOCAL_STORAGE_KEY, JSON.stringify(this.list))

    if (!this.timeout) {
      this.timeout = setTimeout(() => {
        this.__request()
      }, 10 * 1000)
    }
  }

  __request () {
    axios.post(this.option.url, this.list)
      .then(() => {
        // 这里不做清空处理，可能在请求时又有新的日志生成
        // 当没有新日志生成时，list为空，可以理解为执行了清空操作
        localStorage.setItem(LOG_LOCAL_STORAGE_KEY, JSON.stringify(this.list))
      })
      .finally(() => {
        clearTimeout(this.timeout)
        this.timeout = null
      })
    this.list = []
  }

  /**
   * 获取本地未及时上报的日志
   */
  __getLocalStorage () {
    let list = []
    try {
      list = JSON.parse(localStorage.getItem(LOG_LOCAL_STORAGE_KEY))
      localStorage.removeItem(LOG_LOCAL_STORAGE_KEY)
      if (!Array.isArray(list)) {
        list = []
      }
    } catch (error) {
      // do nothing
    }
    return list
  }

  /**
   * 获取sdk未加载时的日志
   */
  __getLoadLocalStorage () {
    let list = []
    try {
      list = JSON.parse(localStorage.getItem(LOG_LOCAL_LOAD_KEY))
      localStorage.removeItem(LOG_LOCAL_LOAD_KEY)
      if (!Array.isArray(list)) {
        list = []
      } else {
        for (let i = 0; i < list.length; i++) {
          list[i] = this.__logAssign(list[i])
        }
      }
    } catch (error) {
      // do nothing
    }
    return list
  }

  __logAssign ({ level = 'INFO', message, sort }) {
    const { code, uid, pid } = this.option
    const data = {
      code,
      uid,
      pid,
      sort: sort || this.sort++,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      path: window.location.href,
    }

    return {
      ...data,
      level,
      message: JSON.stringify(message),
    }
  }
}

export default LPLogger
