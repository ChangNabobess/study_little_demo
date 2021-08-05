<template>
  <div class="about">
    <div id="printTest">
        <div style="page-break-after:always">
          <textarea name="test" id="" cols="30" rows="10" style="resize:none;">
            测试测试测试
          </textarea>
          <img src="@/assets/logo.png" alt="vuelogo">
          <main>这里是main主题</main>
          <p>我是第一个分页</p>
        </div>
        <div style="page-break-after:always">
          <p>我是第三页</p>
        </div>
        <div style="page-break-after:always">
          <p>我是第四页</p>
        </div>
        <div style="page-break-after:always">
          <p>我是第五页</p>
        </div>
        <div style="page-break-after:always">
          <p>我是第六页</p>
        </div>
        <div style="page-break-after:always">
          <p>我是第七页</p>
        </div>
        <div style="page-break-after:always">
          <p>我是第八页</p>
        </div>
        <div style="page-break-after:always">
          <p>我是第九页</p>
        </div>
        <div style="page-break-after:always">
          <p>我是第十页</p>
        </div>
    </div>
    <button type="button" v-print="'#printTest'">打印</button>
    <button type="button" onclick="window.print()">打印本页</button>
  </div>
</template>

<script>
export default {
  data(){
    return{
      flatJson:[],
      tranformArr: []
    }
  },
  created(){
    /* this.$axios.get('./json/flatarray.json').then(res=>{
      if(res.data.code=='200'){
        this.flatJson=res.data.data
        console.log(this.flatJson);
      }
    }) */
    // this.textInfinity(Math.pow(100,10000000000))
    // this.testFun()
    this.evenArr()
  },
  mounted(){

  },
  watch:{

  },
  computed:{

  },
  methods:{
    textInfinity(num){ // Infinity 无穷大
      if(isFinite(num)){
        console.log('这是有限数');
      }else{
        console.log('这是无穷数');
      }
    },
    testFun() {
      let arr = ['畅一凡abcdef', '测试数据一', '测试数据二']
      let str = 'changyifan'
      // console.log(arr.reverse());
      // 方法一
      let str1 = ''
      let i = str.length - 1
      while(i >= 0){
        str1 += str[i]
        i--
      }
      console.log(str1);
      // 方法二
      /* let str1 = str.split("").reverse().join("")
      console.log(str1); */
    },
    evenArr() { // 随机验证码
      for(let i =48; i<123; i++){
        if(i > 57 && i < 65) continue;
        if(i > 90 && i < 97) continue;
        this.tranformArr.push(String.fromCharCode(i))
      }
      // 不均匀分配数组获取验证码 Sort()方法
      /* this.tranformArr.sort(function(){
        return Math.floor(Math.random() - 0.5)
      })
      this.tranformArr.length = 4
      console.log(this.tranformArr.join("")); */

      // 均匀分配数据方法获取随即验证码
      let str = ''
      while(str.length < 4) {
        let n = Math.floor(Math.random()*this.tranformArr.length)
        str += this.tranformArr[n]
      }
      console.log(str);
    }
  }
}
</script>
