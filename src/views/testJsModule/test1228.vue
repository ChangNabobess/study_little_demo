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
      tranformArr: [5, 3, 2, 9, 4, 6, 8, 1, 7]
    };
  },
  computed: {},
  watch: {},
  methods: {
    arrSort() {
      console.log(this.tranformArr.sort((a, b) => b - a));
    },
    observeFun() {
      let data = { name: '张三' }
      let observeArr = []// 观察者数组
      let addObserve = function (fun) { // 添加观察者的方法
        observeArr.push(fun)
      }
      let dispatchObserve = (str) => { // 
        data.name = str
        for (let i = 0; i < observeArr.length; i++) {
          observeArr[i](str)
        }
      }
      addObserve((str) => {
        console.log('第一个观察者', str)
      })
      addObserve((str) => {
        console.log('第二个观察者', str)
      })
      addObserve((str) => {
        console.log('第三个观察者', str)
      })
      dispatchObserve('畅一凡')
    },
    changeRouter() {
      // this.$router.replace({
      //   path: '/countdown'
      // })
    },
    initWebScoket() {
      // const webScoketEnty = new WebSocket('ws://localhost:4000/test');

      // webScoketEnty.onopen = () => {
      //   console.log('webScoket链接成功');
      // }
      // webScoketEnty.onmessage = (event) => {
      //   console.log('webScoket链接成功',event.data);
      // }
      // webScoketEnty.onclose = () => {
      //   console.log('webScoket关闭');
      // }
      // 
      let ws = new WebSocket('ws://localhost:4000/test');

      ws.onopen = function (evt) { // 连接建立触发
        console.log('建立连接，状态:' + ws.readyState);
        ws.send('hello Word');
      };

      ws.onmessage = function (evt) { // 服务端返回数据触发
        // var data = JSON.parse(evt.data)
        console.log("状态：" + ws.readyState + "；服务端返回数据:", evt);
      };

      ws.onerror = function (evt) { // 通信发生错误触发
        console.log('发生错误，状态:' + ws.readyState);
      };

      ws.onclose = function (evt) { // 连接关闭触发
        console.log("连接关闭，状态：", ws.readyState);
      };
    }
  },
  created() {
    this.arrSort()
    this.observeFun()
  },
  mounted() {
    this.initWebScoket()
  },
}
</script>

<style lang='scss' scoped></style>