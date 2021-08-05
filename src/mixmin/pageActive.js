/**
 * 切换备案界面保存状态
 * @param {String} queryKey 页面监听属性
 * */
 export default function(queryKey) {
  return {
    data() {
      return {
        pageIsShow: true,
        pageActiveType: ''
      }
    },
    watch: {
      [`$route.query.${queryKey}`]: {
        immediate: true,
        handler(newVal) {
          if (this.pageIsShow) {
            this.pageActiveType = newVal
          }
        }
      }
    },
    activated() {
      this.pageIsShow = true
    },
    deactivated() {
      this.pageIsShow = false
    }
  }
}
