<template>
  <div class="home">
    <head>
      这个主界面的名字怎么没有改变？
    </head>
    <TabBar :tabList='tabList'>
      <template v-slot:shangpinxiangqing class="frist">
        <el-row>
          <el-col :span="20">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="copyText">
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button v-copy="copyText">复制全部</el-button>
          </el-col>
        </el-row>
        <el-row>
          <!-- <h1 class="testH1">这里测试一下，animation中的step属性</h1> -->
          <h1 class="testH1">这里测试一下好像只适配中文</h1>
        </el-row>
        <el-row>
          <el-col :span="4">
            <MyTree></MyTree>
          </el-col>
          <el-col :span='12'>
            <TodoList></TodoList>
          </el-col>
          <el-col :span="8">
            <TrafficLight />
          </el-col>
        </el-row>
      </template>
      <template v-slot:guigecanshu>
        <el-row>
          {{textTxt}}
          <vue-hover-mask @click="handleClick">
            <!-- 默认插槽 -->
            <!-- <video 
              src="https://s3.pstatp.com/aweme/resource/web/static/image/index/tvc-v2_30097df.mp4" 
              autoplay
              loop/> -->
              <img src="https://img1.baidu.com/it/u=1263028917,3538415969&fm=26&fmt=auto&gp=0.jpg" alt="">
            <!-- action插槽 -->
            <!-- v-slot 指令自 Vue 2.6.0 起被引入 -->
            <!-- <template v-slot:action> -->
              <!-- slot 指令自 Vue 2.6.0 起被废弃 -->
            <template slot="action">
              <i class="iconfont zoom"></i>
              <i class="iconfont delete"></i>
              <i class="iconfont delete">测试更改</i>
            </template>
          </vue-hover-mask>
        </el-row>
        <el-row>
          <el-col :span="6">
            <p>鼠标在灰色区域滑动时候有节流效果，点击按钮没有节流效果</p>
            <div id="content"></div>
            <el-button type='primary' @click="countEvent">不加节流防抖</el-button>
            <el-button type='primary' id="havedebounce">有节流防抖</el-button>
            <p class="textWrap">测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本测试文本</p>
          </el-col>
          <el-col :span="12" style="position:relative;">
            <RemovePeople></RemovePeople>
            <Movesquare></Movesquare>
          </el-col>
          <el-col :span="6">
            <TestJsModule />
          </el-col>
        </el-row>
      </template>
      <template v-slot:peijianxiane style="background-color: #d6ecab;border: 2px solid pink;">
        <template>
          <el-button type="primary" @click="changePage">切换页面</el-button>
        </template>
        <template>
          <RotateScreen></RotateScreen>
        </template>
      </template>
      <template v-slot:chengjiaojilu>
        <input type="text" @change="getBaiduData">
        <ul></ul>
        <RecordChangPage></RecordChangPage>
      </template>
      <template v-slot:shangpinpingjia>
        <Slideshow></Slideshow>
      </template>
    </TabBar>
  </div>
</template>

<script>
// @ is an alias to /src
import TabBar from '@/components/TabBar.vue'
import promise from '@/js/promise'
import Slideshow from '@/components/slideshow'
import TodoList from '@/components/todoList'
import MyTree from '@/components/myTree'
import RotateScreen from '@/components/rotateScreen'
import RemovePeople from '@/components/RemovePeople'
import Movesquare from '@/components/Movesquare'
import TrafficLight from '@/components/TrafficLight'
import {debounce, throttle, throttleDate, throttleTime, debounceTime} from '@/js/debouncethrottle'
import RecordChangPage from '@/views/RecordChangPage'
import TestJsModule from '@/views/testJsModule/test1228'
import {mapState} from 'vuex'

export default {
  name: 'Home',
  components: {
    TabBar,
    Slideshow,
    TodoList,
    MyTree,
    RotateScreen,
    RemovePeople,
    Movesquare,
    RecordChangPage,
    TrafficLight,
    TestJsModule
  },
  data(){
    return{
      tabList:[
        {label:"商品详情",value:"0",slotName:'shangpinxiangqing'},
        {label:"规格参数",value:"1",slotName:'guigecanshu'},
        {label:"配件限额",value:"2",slotName:'peijianxiane'},
        {label:"成交记录",value:"3",slotName:'chengjiaojilu'},
        {label:"图片轮播",value:"4",slotName:'shangpinpingjia'},
      ],
      copyText: 'a copy directives',
      textTxt:'测试数组对象去重',
      user:{
          id: 1,
          name: 'zs'
      },
      url:'https://geo.datav.aliyun.com/areas_v2/bound/110000_full.json?callback=aliyunshuju',
      num: 1,
      contentElm: null,
    };
  },
  mounted(){
    this.changeArr();
    window.aliyunshuju=function(data){
      // console.log('我是回调函数成功之后返回的数据',data);
    }
    // this.getMaps()
    this.testDebounceAndThrottle()
    // this.precompile(1,2)
  },
  methods:{
    changeArr(){
      this.$axios.get('./arrDeweight.json').then(res=>{
        if(res.data.code==200){
          let arr=this.deWeight(res.data.data);
          // console.log('数组对象去重',arr);
        }else{}
      });
      let arr=[1,2,3,4,5,6,7,8,9,0,2,4,3,7];
      // 这种去重的方法代码最少。这种方法还无法去掉“{}”空对象，后面的高阶方法会添加去掉重复“{}”的方法。
      // console.log('数组去重',[...new Set(arr)]);
      // console.log('数组去重',Array.from(new Set(arr)));
      let arr1 = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
      // let testarr ={asd:'1',vfds:"3",cdb:"4",vfds:"2"};
      // console.log(this.uniqueFor(testarr));
      // console.log(this.uniqueIndexOf(testarr));
    },
    deWeight(objArray) {//利用对象键值不能重复的规则去重
        //定义一个空数组，最后return出去
        let resultArr=[];
        //定义一个空对象，作为中介判断重复对象
        let Obj={};
        //添加一个for循环遍历传进来的每一个对象值
        for(let i=0;i<objArray.length;i++){
          //取一个传入对象的键值作为判断依据
          /* let temp = objArray[i].id;
          //判断该对象是否已有此键值
          if(Obj[temp]){
            //如果有的话就代码穿透，直接推出循环
            continue;
          }else{
            //如果没有的话就将此键值设为true，方便下次循环判断
            Obj[temp]=true;
          };
          //最终将符合条件的对象塞入resultArr数组中return出去
          resultArr.push(objArray[i]); */
          //化繁为简代码
          Obj[objArray[i].id] ? '' : Obj[objArray[i].id] = true && resultArr.push(objArray[i]);
        };
        return resultArr;
    },
    uniqueFor(arr){//利用for嵌套for，然后splice去重（ES5中最常用）
      if(Array.isArray(arr)){
      for(let i=0;i<arr.length;i++){
        for(let j=i+1;j<arr.length;j++){
          if(arr[i]==arr[j]){
            arr.splice(j,1);
            j--;
          }else{}
        };
        /* for(var i=0; i<arr.length; i++){
            for(var j=i+1; j<arr.length; j++){
                if(arr[i]==arr[j]){         //第一个等同于第二个，splice方法删除第二个
                    arr.splice(j,1);
                    j--;
                }
            }
        } */
      }
      }else{
        this.$message({message:"接受数据类型应为数组",type:'error'});
      }
      return arr;
    },
    uniqueIndexOf(arr) {//利用indexof判断新数组中是否包含某个元素
      let res=[];
      for(let i=0;i<arr.length;i++){
        if(res.indexOf(arr[i])===-1){
          res.push(arr[i])
        };
      };
      return res;
    },
    changePage(){
      this.$router.push({
        query:{
          page:'newpage',
          id:'123456789'
        }
      })
    },
    test(){
      let arr=[];
      for(let i=0;i<10;i++){
        arr[i]=[];
        for(let j=0;j<10;j++){
          arr[i][j]=i*10+j;
        }
      }
      // console.log('10*10矩阵' , arr);
    },
    /* 通过jsonp方式实现跨域请求 */
    jsonpgetData(){
      let srcelm=null;
      let interval = 0;
      let now = new Date().getTime();
      let val='1'
      if(now - interval >300){
        if (srcelm) {
              scriptEle.remove();
          }
        // let url="https://geo.datav.aliyun.com/areas_v2/bound/110000_full.json?callback=aliyunshuju";
        let url ='https://www.baidu.com/sugrec?ie=utf-8&json=1&from=pc_web&prod=pc&wd='+ val + '&req=2&cb=aliyunshuju'
        // let url="https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?callback=aliyunshuju"//qq音乐列表
        srcelm=document.createElement('script');
        srcelm.setAttribute('type','text/javascript');
        srcelm.src=url;
        document.body.appendChild(srcelm);
      }
      /* window.aliyunshuju=function(data){
        console.log(data);
      } */
    },
    /* 通过jsonp方式获取百度搜索接口 */
    getBaiduData(){
      let inpEle = document.querySelector('input');
      let ulEle = document.querySelector('ul');
      let interval = 0;
      let scriptEle = null;
      let val = inpEle.value;
      let now = new Date().getTime();
      if (now - interval > 300) {
          if (scriptEle) {
              scriptEle.remove();
          }
          scriptEle = document.createElement('script');
          // wd后面接的是关键字,cb后面接的回调函数的名称
          let url = 'https://www.baidu.com/sugrec?ie=utf-8&json=1&from=pc_web&prod=pc&wd='+ val + '&req=2&cb=searchData'
          // let url="https://geo.datav.aliyun.com/areas_v2/bound/110000_full.json?callback=aliyunshuju"
          scriptEle.src = url;
          document.body.appendChild(scriptEle);
      }
      window.searchData=function(data) {
        if (data.g) {
            let result = data.g;
            let fragment = document.createDocumentFragment();
            let html = '';
            result.forEach( (item) => {
                html += `<li><a target="_blank" href="https://www.baidu.com/s?wd=${item.q}">${item.q}</a></li>`;
            } )
            ulEle.innerHTML = html;
        } else {
            ulEle.innerHTML = '';
        }
      }
    },
    /* 使用vue-jsonp组件实现跨域 */
    getJson() {
      this.$jsonp(this.url, {
        callbackQuery: "callbackParam",
        callbackName: "aliyunshuju"
      })
      .then((json) => {
      // 返回的jsonp数据不会放这里，而是在 window.jsonpCallback
        console.log('我是组件vue-jsonp返回的数据',json)
      })    
    },
    // https://apis.map.qq.com/ws/district/v1/list 腾讯
    // https://restapi.amap.com/v3/config/district 高德 兰州新区 center坐标36.4799930, 103.6646868
   /*  getMaps() { // 请求广东省地图数据，但是没有coordinates(坐标系画图)，只有center值能用，存在public-->json-->guangdong.json
      this.$axios.get('https://restapi.amap.com/v3/config/district',{
        params:{key:'7b1aa3932b00a6f583eb0312e29225dd',
                subdistrict: '2',
                keywords:'广东'}}).then((res) => {
        console.log('请求成功' , res.data);
      }).catch((err) => {
        console.log('请求报错' , err);
      })
    }, */
    getMaps() { 
      // 直接用postMan测试多好,这样直接请求接口会报跨域错误，还没有结局
      // 请求广东省地图数据，但是没有coordinates(坐标系画图)，只有center值能用，存在public-->json-->guangdong.json
      this.$axios.get('https://apis.map.qq.com/ws/district/v1/list',{
        params:{key:'BCQBZ-QSUCX-JTH47-TNU3E-KZQ6T-CBBGD',
                output: 'json',
                id:'620100'}}).then((res) => {
        console.log('请求成功' , res.data);
      }).catch((err) => {
        console.log('请求报错' , err);
      })
    },
    handleClick() {
      console.log('click')
    },
    testDebounceAndThrottle(){
      // 防抖是连续点击直到最后一次点击结束之后等待一定时间之后再
      document.getElementById('havedebounce').addEventListener('click',debounceTime(2000,this.countEvent))
      // 立即执行的防抖
      // document.getElementById('havedebounce').addEventListener('click',debounce(this.countEvent,20000))
      // 节流是连续点击隔两秒请求一次
      // document.getElementById('havedebounce').addEventListener('click',throttleDate(2000,this.countEvent))
    },
    countEvent() {
      document.getElementById('content').innerHTML = this.num++;
    },
    precompile(a,c){ // 预编译测试
      console.log(a,c);
      console.log(a) // ƒ a() {}
      var a = 123
      console.log(a) // 123
      console.log(c)  // ƒ c() {}
      function a() { } // 
      if (false) {
        var d = 678
      }
      console.log(d) // undefined
      console.log(b) // undefined
      var b = function () { }
      console.log(b)  // ƒ b() {}
      function c() { }
      console.log(c)  // ƒ c() {}
      // 首先会创建一个GO,就是预编译方法之前的全局对象
      // 1. 创建ao对象 AO{}
      // 2. 找形参和变量声明 将变量和形参名 当做 ao对象的属性名 值为undefined
      // 3. 实参形参相统一 
      // 4. 在函数体里面找函数声明 会覆盖形参,如果没有函数声明,会直接打印传入参数
    }
  },
  created(){
    // console.log('测试一下routerBefore是否有效，在home页面的created里面打印试试',this.userinfo); // 成功的
    this.test();
    this.jsonpgetData();
    //使用vue-jsonp实现跨域请求
    promise() // 类函数
    // this.$store.dispatch('commitTextData', '我是测试数据，首页打开之后就提交了')
  },
  computed:{
    ...mapState({
      userinfo: state => state.userModule.userinfo
    })
  }
}
</script>
<style scoped lang="scss">
@keyframes typing { from { width: 0; } }
@keyframes blink-caret { 50% { border-color: transparent; } }
@import url('//at.alicdn.com/t/font_1223885_a68qqkvtjgr.css');
.iconfont {
  padding: 0 10px;
  font-size: 24px;
}
.vue-hover-mask{
  video{
    width: 200px;
    height: 100px;
  }
  img{
    width: 200px;
    height: 100px;
  }
}
.el-textarea ::v-deep .el-textarea__inner{
  resize: none;
}
.testH1{
  font: bold 200% Consolas, Monaco, monospace;
	border-right: .1em solid;
	width: 425px; /* fallback */ // h1的长度
	// width: 30ch; /* # of chars */
	margin: 2em 1em;
	white-space: nowrap;
	overflow: hidden;
	animation: typing 20s steps(13, end), /* # of steps = # of chars step规定动画执行几次例如：425px，一共是三个字符，动画分布执行13次*/
	           blink-caret .5s step-end infinite alternate;
}
#content{
  width: 200px;
  height: 200px;
  background-color:darkgray;
  text-align: center;
  line-height: 6;
  color: white;
  font-size: 30px;
  margin: auto;
}
.textWrap{
  width:300px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
