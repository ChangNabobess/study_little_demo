import {baseUrl} from '@/config/env' // 一级域名
import request from '@/router/axios.js'

// 单位采购量TOP10
export function getOrgBuyTop(data) {
  return request({
    url: `${baseUrl}`,
    method: 'POST',
    data
  })
}