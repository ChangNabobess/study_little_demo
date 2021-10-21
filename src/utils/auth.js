import Cookies from "js-cookie"
import {tokenKey, stongTokenKey} from '@/const/index'
import {responseCode} from '@/const/index'

export const getStrongTokenKey = () => { // 获取延期Token
  return Cookies.get(stongTokenKey)
}

export const getToken = () => {
  return Cookies.get(tokenKey)
}

export const verifyResIsSuccess = (res) => {
  return res.data.code == responseCode.success
}
