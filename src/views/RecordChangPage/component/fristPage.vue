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
        右边预留空间
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getOrgBuyTop} from '@/api/main'
import {verifyResIsSuccess} from '@/utils/auth'
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
        if(verifyResIsSuccess(res)) {
          console.log(res.data.data);
        }
      }) */
    }
  },
  created() {

  },
  components: {
    RadarBar,
    TwoDimensionTable
  },
  mounted() {
    console.log(BaseConfig);
  },
}
</script>

<style lang='scss' scoped>

</style>