<template>
  <div class=''>
    <!-- <el-button type="primary" @click="changeRouter">跳转路由界面</el-button> -->
    测试方法页面
  </div>
</template>

<script>
export default {
  data() {
    return {
      tranformArr: [5,3,2,9,4,6,8,1,7]
    };
  },
  computed: {},
  watch: {},
  methods: {
    arrSort(){
      console.log(this.tranformArr.sort((a,b) => b-a));
    },
    observeFun(){
      let data = {name: '张三'}
      let observeArr = []// 观察者数组
      let addObserve = function(fun) { // 添加观察者的方法
        observeArr.push(fun)
      }
      let dispatchObserve = (str) => { // 
        data.name = str
        for( let i = 0; i<observeArr.length; i++) {
            observeArr[i](str)
        }
      }
      addObserve((str) =>{
        console.log('第一个观察者',str)
      })
      addObserve((str) =>{
        console.log('第二个观察者',str)
      })
       addObserve((str) =>{
        console.log('第三个观察者',str)
      })
      dispatchObserve('畅一凡')
    },
    changeRouter() {
      // this.$router.replace({
      //   path: '/countdown'
      // })
    }
  },
  created() {
    this.arrSort()
    this.observeFun()
  },
  mounted() {

  },
}
</script>

<style lang='scss' scoped>

</style>