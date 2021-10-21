<template>
  <div class=''>
    <el-row>
      <el-col :span="12">
        <textarea name="chatArea" id="chatarea" cols="50" rows="30"></textarea>
        <input type="text" id="text-name">
        <input type="text" id="text-chat">
        <el-button type="primary" @click="clickHandler">发送</el-button>
      </el-col>
      <el-col :span="12">右侧占位符</el-col>
    </el-row>
  </div>
</template>

<script>
import {getOrgBuyTop} from '@/api/main'
import {verifyResIsSuccess} from '@/utils/auth'
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
      getOrgBuyTop(params).then((res) => {
        if(verifyResIsSuccess(res)) {
          console.log(111);
        } else {
          console.log(res);
        }
      })
    }
  },
  created() {

  },
  mounted() {},
}
</script>

<style lang='scss' scoped>

</style>