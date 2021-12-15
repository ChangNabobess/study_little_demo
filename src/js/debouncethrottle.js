/**
 * 防抖（debounce）
   所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
export const debounce = function(func,wait,immediate) {
  let timeout;
  return function () {
      let context = this;
      let args = arguments;
      if (timeout) clearTimeout(timeout); // 如果有，就清空，重新计时
      if (immediate) { // 立即执行版本，触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果。
          var callNow = !timeout;
          timeout = setTimeout(() => { // 给debounce的AO里面的timeout赋值
              timeout = null;
          }, wait)
          if (callNow) func.apply(context, args)
          
      }
      else { // 非立即执行版本，触发事件后函数不会立即执行，而是在 n 秒后执行，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
          timeout = setTimeout(function(){
              func.apply(context, args)
          }, wait);
      }
  }
}

// 防抖是控制次数，节流是控制频率
// 防抖是控制次数，每一次重新进来都会重新计时，旨在最后一次点击时执行
// 节流是控制频率，每个多少毫秒执行一次，不论在当前时间内触发了多少次

/**
 * 节流
 * 是指连续触发事件但是在 n 秒中只执行一次函数。节流会稀释函数的执行频率。
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 */
export const throttle = function(func, wait){
    /* 时间戳版*/
    let previous = 0;
    return function() {
        let now = Date.now();
        let context = this;
        let args = arguments;
        if (now - previous > wait) {
            func.apply(context, args);
            previous = now;
        }
    }
    /* 倒计时版 */
    /* let timeout;
    return function() {
        let context = this;
        let args = arguments;
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                func.apply(context, args)
            }, wait)
        }
    }    */
}

export function debounceTime(wait,fn){ // 防抖倒计时版
    let timeout
    return function (args) {
        if(timeout) clearTimeout(timeout) // 有就清空，等到最后一次
        timeout = setTimeout(() => {
            timeout = null
            fn.apply(this,args)
        },wait)
    }
}

export function throttleDate(wait,fn){ // 节流时间戳版
    let computeTim = 0
    return function (args) {
        let nowTim = Date.now()
        if(nowTim - computeTim > wait){ // 12-0 13-12 14-12 15-12 16-12
            fn.apply(this,args)
            computeTim = nowTim // 每次都给局部变量computeTim 重新赋值
        }
    }
}

export function throttleTime(wait,fn) { // 节流倒计时版
    let timeout
    return function(args) {
        if(!timeout) {
            timeout = setTimeout(() => {
                timeout = null
                fn.apply(this,args)
            }, wait)
        }
    }
}