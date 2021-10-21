import Cookies from 'js-cookie'

export function isTel(rule,value,callback) {
    const RegExp=/^1[3456789]\d{9}$/;
    if(RegExp.test(value)){
      callback();
    }else{
      throw new Error('手机号验证错误');
    }
};

/**
 * 深拷贝
 */
 export const clone = obj => {
  let copy
  // Handle the 3 simple types, and null or undefined
  if (obj == null || typeof obj !== 'object') return obj
  // Handle Date
  if (obj instanceof Date) {
    copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }
  // Handle Array
  if (obj instanceof Array) {
    copy = []
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i])
    }
    return copy
  }
  // Handle Object
  if (obj instanceof Object) {
    copy = {}
    for (const attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
    }
    return copy
  }
  throw new Error("Unable to copy obj! Its type isn't supported.")
}
/**
 * 判断是否为空
 */
 export function validatenull(val) {
  if (val instanceof Array) {
    if (val.length == 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (val == 'null' || val == null || val == 'undefined' || val == undefined || val == '') return true
    return false
  }
  return false
}

export function setTitle (str){
  window.document.title = str
}

export function setIcon() {
  let iconArea = '	https://ww4.sinaimg.cn/bmiddle/b4ef4e59gy1gtd3nbm38sj20go0m8gmn.jpg'
  if(iconArea) {
    let linkElm = window.document.createElement('link');
    linkElm.type = 'image/x-icon'
    linkElm.rel = 'shortcut icon'
    linkElm.href = iconArea
    let appendElm = window.document.querySelector('head');
    appendElm.appendChild(linkElm)
  }
}