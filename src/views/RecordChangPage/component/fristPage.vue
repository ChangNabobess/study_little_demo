<template>
  <div class=''>
    <el-row>
      <el-col :span="12">
        <textarea name="chatArea" id="chatarea" cols="50" rows="30"></textarea>
        <input type="text" id="text-name">
        <input type="text" id="text-chat">
        <el-button type="primary" @click="clickHandler">发送</el-button>
      </el-col>
      <el-col :span="12">
        <RadarBar />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <TwoDimensionTable />
      </el-col>
      <el-col :span="12">
        <div class="g-container">
          <div class="word">哇塞</div>
          <div class="word">这个特效</div>
          <div class="word">简直</div>
          <div class="word">绝绝子！</div>
          <div class="word">太厉害了</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getOrgBuyTop} from '@/api/main'
import RadarBar from './radarBar.vue'
import TwoDimensionTable from './twoDimensionTable.vue'
export default {
  data() {
    return {
      chatArea: null,
      iptName: '',
      iptChat: '',
    };
  },
  computed: {},
  watch: {},
  methods: {
    clickHandler() {
      this.chatArea = document.querySelector('textarea')
      this.iptName = document.querySelector('#text-name').value
      this.iptChat = document.querySelector('#text-chat').value
      this.chatArea.textContent = `${this.iptName}：${this.iptChat}`
      let params = {
        a: '1'
      }
      /* getOrgBuyTop(params).then((res) => {
        if(UTILS.verifyResIsSuccess(res)) {
          console.log(res.data.data);
        }
      }) */
    },
    ObjectAssignment() {
      let obj = {
        c: 3
      }
      obj.a = 1
      obj['b'] = 5 // 用中括号赋值的话，中括号里面是一个变量
      // console.log(obj);
      if('a' in obj) {
        // console.log(11);
      }
      let x = 1
      let arr = []
      let y = ((arr.length <= 0) || (arr[0] === undefined)) ? x : arr[0];
      // console.log(y);
    },
    fibonacci(n, pre, cur) {
     if (n === 0) {
        return n;
      }
      if (n === 1) {
        return cur;
      }
      return this.fibonacci(n - 1, cur, pre + cur);
    },
    freezeFun(){
      let  obj = {
        a:1,
        b:2
      }
      // Object.freeze(obj)
      // Object.seal(obj)
      // delete obj.b
      // obj['c'] = 4
      // Object.preventExtensions(obj)
      // obj.a = 3
      // delete obj.b
      // obj['c'] = 4
      
      // console.log(obj.valueOf());
      let mapArr = [1,2,3,4,5,6,7,8,9,0]
      mapArr = mapArr.map((item,index) => {
        return item+3
      })
      /* 
      Array.map()是有一个返回值的必须要有接受的对象
      */
      // console.log(mapArr);
    }
  },
  created() {
    this.freezeFun()
    this.ObjectAssignment()
  },
  components: {
    RadarBar,
    TwoDimensionTable
  },
  mounted() {
    console.log(this.fibonacci(6, 0, 1))
    // console.log('获取可修改配置项',BaseConfig);
    let bibao = UTILS.createIncrementor(5) // 通过闭包，start的状态被保留了，每一次调用都是在上一次调用的基础上进行计算。
    /* 
    为什么闭包能够返回外层函数的内部变量？
    原因是闭包（上例的bibao）用到了外层变量（start），
    导致外层函数（createIncrementor）不能从内存释放。
    只要闭包没有被垃圾回收机制清除，
    外层函数提供的运行环境也不会被清除，
    它的内部变量就始终保存着当前值，供闭包读取。
    */
    /* console.log(bibao()); // 5
    console.log(bibao()); // 6
    console.log(bibao()); // 7
    console.log(bibao()); // 8 */
    // console.log(UTILS.checkDataType().isNull(null));
  },
}
</script>

<style lang='scss' scoped>
// @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

$speed: 13s;
$wordCount: 5;

.g-container {
    position: relative;
    width: 300px;
    height: 100px;
    background: #000;
    font-family: 'Montserrat', sans-serif;
    color: #fff;
    font-size: 30px;
    filter: contrast(15);
}
.word {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: change $speed infinite ease-in-out;
    @for $i from 0 to $wordCount {
        &:nth-child(#{$i + 1}) {
            animation-delay: ($speed / ($wordCount) * $i) - $speed;
        }
    }
}

@keyframes change {
    0%,
    5%,
    60% {
        filter: blur(50px);
        opacity: 0;
    }
    80%{
      filter: blur(0px);
      opacity: 1;
    }
    100% {
        filter: blur(10px);
        opacity: 0;
    }
}
</style>