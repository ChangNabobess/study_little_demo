import axios from "axios";
import {tokenKey, responseCode} from '@/const/index' // 常量
import {getStrongTokenKey} from '@/utils/auth' // 工具类
import NProgress from "nprogress"; // 进度条
import 'nprogress/nprogress.css'
import {verifyResIsSuccess} from '@/utils/auth'
import Cookies from "js-cookie";
import { Store } from "vuex";

const isInWhiteList = function(errorCode, whiteListConfig = []) {
  return (
    whiteListConfig.filter(rule => {
      if (Object.prototype.toString.call(rule) === '[object RegExp]') {
        return rule.test(errorCode)
      } else {
        return rule === errorCode
      }
    }).length !== 0
  )
}

// 请求超时时间
axios.defaults.timeout = 300000,
// 跨域请求，允许保存cookie
// axios.defaults.withCredentials = true
NProgress.configure({ showSpinner: false }) // 是否显示环形进度动画，默认true。

axios.interceptors.request.use(
  config => {
    // console.log(config);
    config.headers['Access-Control-Allow-Origin'] = '*'
    config.headers['Access-Control-Allow-Methods'] = 'get,post'
    NProgress.start() // start progress bar
    const timep = new Date().getTime()
    const sType = 'fixed_tag'
    config.params = {
      // sendType: sType,
      ...config.params
    }
    if(Object.prototype.toString.call(config.params == '[object object]')) {
      config.params._t = timep
    } else {
      config.params = {
        _t: timep
      }
    }
    const token = getStrongTokenKey()
    if(token) {
      config.headers[tokenKey] = token
    }
    return config
  },
  error => {
    return Promise.reject(new Error(error))
  }
)
axios.interceptors.response.use(
  res => {
    NProgress.done()
    /**
     * 统一提示错误
     * 当数据存在code字段并且不等于success时提示错误信息
     * 并且在不提示的白名单中时统一提示
     * */
     if (
      res.data.code &&
      !(
        verifyResIsSuccess(res) ||
        isInWhiteList(res.data.code, responseCode.errorCodeWhiteList)
      )
    ) {
     /* Message({
        message: res.data.msg,
        showClose: true,
        type: 'error',
        duration: 6000
      })*/
    }
    return res
  },
  error => {
    NProgress.done()
    return Promise.reject(new Error(error))
  }
)

export default axios