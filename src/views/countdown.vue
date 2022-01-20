<template>
  <div class=''>
    <!-- <Countdown endTime="1490761860" endText="已经结束了"></Countdown> -->
    <div id="showtime"></div>
    <template>
      <div id="app" @click="fireCD">
        <div class="demo">
          <countDown 
            ref="countDown"
            :fire="fire"
            time="15"
            :tiping="tiping"
            :tipend="tipend"
            @onStatusChange="onStatusChange"
            @onEnd="onEnd"/>
        </div>
      </div>
    </template>
    <template>
      <button @click="creatPdfFilds">点击生成PDF</button>
      <button @click="downloadPDf" loading>下载pdf文件</button>
      <button @click="showpdf">预览pdf文档</button>
    </template>
    <template>
      <div>
        {{message}}
      </div>
    </template>
    <ShowPdf :pdfshow='pdfshow' @pdfDialogClose='pdfDialogClose'></ShowPdf>
  </div>
</template>

<script>

import countDown from 'vue-canvas-countdown'
import ShowPdf from './showPdfDialog'
import {jsPDF} from 'jspdf'//生成pdf组件
export default {
  data() {
    return {
      fire: 1,
      tiping: {
        text: '倒计时进行中',
        color: '#fff'
      },
      tipend: {
        text: '倒计时结束',
        color: '#fff'
      },
      pdfshow:false,
      daojishi:null,
      message:'下载Excal'
    };
  },
  computed: {},
  watch: {},
  methods: {
    getDate(){
      var div = document.getElementById("showtime");
      let that=this;
      this.daojishi = setInterval (function () {
          div.innerHTML = that.countDown();
      }, 1000);  //反复执行函数本身
    },
    countDown(){
      var nowtime = new Date(),  //获取当前时间
          endtime = new Date("2022/01/24");  //定义结束时间
      var lefttime = endtime.getTime() - nowtime.getTime(),  //距离结束时间的毫秒数
          leftd = Math.floor(lefttime/(1000*60*60*24)),  //计算天数
          lefth = Math.floor(lefttime/(1000*60*60)%24),  //计算小时数
          leftm = Math.floor(lefttime/(1000*60)%60),  //计算分钟数
          lefts = Math.floor(lefttime/1000%60);  //计算秒数
      return '距离放假回家还有:' + leftd + "天" + lefth + "时" + leftm + "分" + lefts+'秒';  //返回倒计时的字符串
    },
    fireCD () {
      // 配置参数（更多配置如下表）
      this.tiping = {
        text: '开始',
        color: '#4fdv5s'
      }
      this.tipend = {
        text: '结束',
        color: '#fff'
      }
      // 启动倒计时(效果如上图所示)      
      // 也支持：this.$refs.countDown.startCd()方式 启动倒计时
      this.fire++ 
    },
    onStatusChange (payload) {
      // console.log('倒计时状态改变：', payload)
    },
    onEnd () {
      // console.log('倒计时结束的回调函数')
    },
    creatPdfFilds(){//生成pdf文件
        const doc = new jsPDF();
        doc.text("Hello semlinker!", 66, 88);
        const blob = new Blob([doc.output()], { type: "application/pdf" });
        blob.text().then((blobAsText) => {
          console.log('pdf文件：'+blobAsText);
        });
    },
    downloadPDf() {//下载本地pdf文件
    // http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf
    // static/test.pdf
        this.$axios.get('./test.pdf', {
          responseType: 'blob', //重要
        }).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          // blob:http://localhost:8080/712dbb0d-21fe-4268-b441-982bca3b22a6
          const link = document.createElement('a');
          let fname = '验收单.pdf';
          link.href = url;
          link.setAttribute('download', fname);
          document.body.appendChild(link);
          link.click();
        })
      },
    showpdf(){
      this.pdfshow=true;
    },
    pdfDialogClose(val){
      this.pdfshow=val;
    },

  },

  created() {

  },
  mounted() {
    this.getDate();
    // 启动倒计时
    // this.fireCD();
  },
  components:{ 
    countDown,
    ShowPdf,
  },
  destroyed(){
    window.clearInterval(this.daojishi)
  }
}
</script>

<style lang='scss' scoped></style>