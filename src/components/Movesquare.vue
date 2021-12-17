<template>
  <div class='moveSquare'>
    移动方块
  </div>
</template>

<script>
import {clone,bubbling} from '@/utils/validator'
export default {
  data() {
    return {
      bool: false,
      speed: 2,
      distance: 0, // 前进距离
      interVal: null,
      clone,
      bubbling,
    };
  },
  computed: {},
  watch: {},
  methods: {
    createElem(){
      const vm = this
      let newEle = document.createElement('div')
      document.querySelector('.moveSquare').append(newEle)
      Object.assign(newEle.style,{
        'width' : '100px',
        'height' : '100px',
        'backgroundColor' : 'red',
        'position' : 'absolute',
      })
      newEle.addEventListener('click',(e) => {
        vm.clickMoveEvent(e)
      })
      this.interVal = setInterval(() => {
        // console.log(newEle);
        this.moveEvent(newEle)
      }, 16);
    },
    clickMoveEvent(e){
      this.bool = !this.bool
    },
    moveEvent(e){
      if(!this.bool) return
      this.distance+=this.speed
      e.style.left = this.distance + 'px'
      if(this.distance > 945) {
        this.distance = 0
      }
    },
    deepClone(target) {
      /*
        判断目标元素是否是数组或者对象并且目标元素不为null
      */
      if (
        target instanceof Array ||
        (target !== null && typeof target === 'object')
      ) {
        // 根据目标数据的类型创建一个数组或对象
        let cloneTarget = target instanceof Array ? [] : {}
        // 循环遍历目标元素, for...in...循环可以遍历数组和对象
        for (let key in target) {
          // 递归拷贝
          cloneTarget[key] = this.deepClone(target[key])
        }
        // 返回拷贝后的元素
        return cloneTarget
      } else {
        // 如果不是数组或对象类型直接返回元素
        return target
      }
    }
  },
  created() {

  },
  mounted() {
    this.createElem()
    let obj = {a:1,b:{c:2},d:[{e:3},456],f:789}
    let newObj = this.deepClone(obj)
    newObj.d[0].e = 159
    // console.log(obj)
    // console.log(newObj)
    // console.log(this.clone(obj));
    /* 
      深拷贝原理解析：使用到尾递归，数据类型判断(万物皆对象)，for in 循环对象 for of 循环数组
      放置一个中间桥梁接受深拷贝的值
      1、判断参数类型，非数组，对象，date格式的属性值统统return
      2、else 遍历数组或对象，取出键作为新数组或对象的键，把改键对应的键值作为参数尾递归深拷贝方法，
        直到return出一个数据类型。

      举例说明上面obj的clone过程
      1、a:1,
      2、b:{
          c:2
        },
      3、d:[
          {
            e:3,
          },
          456
        ],
      4、f:789
    */
   let arr = [5,2,1,7,3,6,2,4,9,0,8,3,5,0,4,6,0,9,5,4,3,8,7,6,5]
  //  5,3,6,4,2,8,0,6,9
  // 3,5,4,2,6,0,6,8,9
  // 3,4,2,5,0,6,8,9
  // 3,2,4,0,5,6,8,9
  // 2,3,0,4,5,6,8,9
  // 2,0,3,4,5,6,8,9
  // 0,2,3,4,5,6,8,9
   console.log(this.bubbling(arr));
  },
  destroyed(){
    clearInterval(this.interVal)
  }
}
</script>

<style lang='scss' scoped>
.moveSquare{
  width: 100%;
  min-height: 100px;
}
</style>