<template>
  <div class='lingt'>
    <p>使用Promise+尾递归实现红绿灯(基础版)</p>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeOut: null,
      prev: null,
      elemList: []
    };
  },
  computed: {},
  watch: {},
  methods: {
    promiseFun(lightColor) {
      const vm = this
      return new Promise((resolve, reject) => {
        vm.timeOut = setTimeout(() => {
          resolve(lightColor)
        }, 3000)
      })
    },
    initColor(){
      const vm = this
      this.promiseFun('red').then((color) => {
        vm.setCoLor(0,color)
        clearTimeout(this.timeOut)
        return vm.promiseFun('yellow')
      }).then((color) => {
        vm.setCoLor(1,color)
        clearTimeout(this.timeOut)
        return vm.promiseFun('green')
      }).then((color) => {
        vm.setCoLor(2,color)
        clearTimeout(this.timeOut)
        return vm.initColor() // 尾调用自身的函数也叫尾递归
      })
    },
    setCoLor(num, color) {
      if(this.prev) {
        this.prev.style.background = '#ddd'
      }
      this.prev = this.elemList[num]
      this.prev.style.background = color
    }
  },
  created() {

  },
  mounted() {
    this.elemList = document.querySelectorAll('.lingt > div')
    this.initColor()  
  },
}
</script>

<style lang='scss' scoped>
.lingt{
  div{
    width: 100px;
    height: 100px;
    border: 1px solid #ddd;
    border-radius: 50%;
    background: #ddd;
    display: inline-block;
    margin-right: 10px;
  }
}

</style>