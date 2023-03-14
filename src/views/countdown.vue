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
    <iframe src='https://aw.dell-brand.com/pages/tabbar/user-v2' class="iframe" ref="iframe"></iframe>
    <div v-html="htmls"></div>
    <el-button type="primary" @click="editPdf">编辑pdf</el-button>
    <ShowPdf :pdfshow='pdfshow' :isEdit="isEdit" @pdfDialogClose='pdfDialogClose'></ShowPdf>
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
      isEdit: false,
      pdfshow:false,
      daojishi:null,
      message:'下载Excal',
      htmls:'<p>1.本抽奖活动为会员用户专享，每位会员用户每轮抽奖仅可参与一次；<br />2.活动奖品为第三方礼品，不支持进行等额商品或现金兑换，奖品一经送出不予退换；<br />3.每期活动中奖用户将在往期记录进行公示，请注意查看。开奖后7-14个工作日内将为您发货（暂不支持港澳台地区）；<br />4.实际寄出时间可能会因快递情况出现延迟，敬请谅解；<br />5.为了不影响抽奖结果的正常发放，请确保所使用的手机号码与小程序授权的手机号码相同，保持手机畅通。若中奖后2周未能联系成功（如您手机未接/拒绝或无法拨通等）或者您拒绝通知的，则将丧失中奖资格，敬请谅解！（我们的呼叫电话号码为：153****9980）<br />6.建议用户接受订阅开奖消息通知，以便于开奖后收到消息及时查看中奖结果；<br />7．本期活动有效期间，2022年05月28日起至2022年06月10日（含本日）止结束。</p>'
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
          endtime = new Date("2024/01/24");  //定义结束时间
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
          const url = window.URL.createObjectURL(new Blob([blobAsText]));
          // blob:http://localhost:8080/712dbb0d-21fe-4268-b441-982bca3b22a6
          const link = document.createElement('a');
          let fname = 'pdf文件.pdf';
          link.href = url;
          link.setAttribute('download', fname);
          document.body.appendChild(link);
          link.click();
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
      this.isEdit = false
      this.pdfshow=true;
    },
    editPdf(){
      this.isEdit = true
      this.pdfshow=true;
    },
    pdfDialogClose(val){
      this.pdfshow=val;
    },
    text(n){
      if(n<=1) {
        return 1
      }
      return n+this.text(n-1)
    }
  },

  created() {
    console.log(this.text(10));
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

<style lang='scss' scoped>
.iframe {
  width: 500px;
  height: 800px;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}
</style>