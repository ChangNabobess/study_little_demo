<template>
  <div class="block" style="height: 100%;width: 100%;">
    <div class="block-title"><em class="text"><span>{{blockTitle}}</span></em></div>
    <div class="is-right-button" style="color: #00d4e9;">
      <span class="top-item">
          <i class="icon-quanping amplifier" @click="changeNowPage"></i>
      </span>
    </div>
    <div class="ul-box">
      <ul class="table-ul">
        <li style="width: 12%">所属区域</li>
        <template>
          <li style="width: 15%" v-if="isShow">供应商名称</li>
          <li style="width: 15%" v-else>项目名称</li>
        </template>
        <li style="width: 15%">采购单位</li>
        <li style="width: 13%" class="text-center">采购时间</li>
        <template>
          <li style="width: 12%" class="text-center" v-if="isShow">实施方式</li>
          <li style="width: 12%" class="text-center" v-else>采购方式</li>
        </template>
        <li style="width: 18%" class="text-right">项目金额/万元</li>
      </ul>
      <vue-seamless-scroll :data="tableData" class="seamless-warp" :class-option="classOption">
        <ul class="list-ul" v-for="(item,index) in tableData" :key="index">
          <el-tooltip :content="item.regionName" placement="right">
            <li style="width: 12%" class="omit" :class="(index%2 == 0) ? '' : 'nobackdrop'">{{item.regionName}}</li>
          </el-tooltip>
          <el-tooltip :content="isShow ? item.agentName : item.projectName" placement="right" >
            <li style="width: 15%" v-if="isShow" class="omit" :class="(index%2 == 0) ? '' : 'nobackdrop'">{{item.agentName}}</li>
            <li style="width: 15%" v-else class="omit" :class="(index%2 == 0) ? '' : 'nobackdrop'">{{item.projectName}}</li>
          </el-tooltip>
          <el-tooltip :content="item.orgName" placement="right">
            <li style="width: 15%" class="omit" :class="(index%2 == 0) ? '' : 'nobackdrop'">{{item.orgName}}</li>
          </el-tooltip>
          <el-tooltip :content="filterDate(item.bidOpenTime)" placement="right">
          <li style="width: 13%" class="text-center omit" :class="(index%2 == 0) ? '' : 'nobackdrop'">
            {{filterDate(item.bidOpenTime)}}
          </li>
          </el-tooltip>
          <el-tooltip :content="item.purmethod" placement="right">
          <li style="width: 12%" class="text-center omit" :class="(index%2 == 0) ? '' : 'nobackdrop'">
            {{item.purmethod}}
          </li>
          </el-tooltip>
          <li style="width: 18%" class="text-center" :class="(index%2 == 0) ? '' : 'nobackdrop'">{{filterMoney(item.money)}}</li>
        </ul>
      </vue-seamless-scroll>
    </div>
  </div>
</template>
<script>
import vueSeamless from 'vue-seamless-scroll'
import { getRealTimeProjectInfo } from '@/api/project-analysis'
import { number_format, number_set, verifyResIsSuccess } from '@/util/util'
import Screenfull from '@/components/Screenfull'
import { differentTypeTitle } from '@/const/constant'

export default {
  name: 'projectAll',
  components: {
    vueSeamless,
    Screenfull
  },
  directives: {},
  computed: {
    classOption() {
      return {
        step: 0.4, // 数值越大速度滚动越快
        limitMoveNum: 11, // 开始无缝滚动的数据量
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动)
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动)
        waitTime: 3000 // 单步运动停止的时间(默认值1000ms)
	    }
    }
  },
  data() {
    return {
	    tableData: [],
      differentTypeTitle,
      number_format,
      number_set
    }
  },
  props: {
    regionguid: String,
    year: [String, Number],
    isShow: {
      type: Boolean
    },
    blockTitle: {
      type: String,
      default: ''
    }
  },
  watch: {
    'regionguid'(val) {
      this.getData()
	  },
    'year'(newVal, oldVal) {
      if (oldVal != '') {
        this.getData()
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    filterDate(val) {
      return this.$options.filters.moment([val], 'MM-DD HH:mm')
    },
    filterMoney(cellValue) {
      return `${number_format(number_set(cellValue), 2, '.', ',', 'floor')}`
    },
    getData() {
      let param = {}
      if (this.blockTitle == differentTypeTitle.itemBlockTitle) {
        param = {
          platformTypeGuid: 11
        }
      } else {
        param = {
          platformTypeGuid: 15
        }
      }
      getRealTimeProjectInfo(param).then(res => {
        if (verifyResIsSuccess(res)) {
          this.tableData = res.data.data.projectList
        }
      })
    },
    changeNowPage() {
      let type = ''
      if (this.blockTitle == differentTypeTitle.itemBlockTitle) {
        type = differentTypeTitle.itemBlockTitle
      } else { // 近期政府采购电子卖场一览表
        type = differentTypeTitle.mallBlockTitle
      }
      this.$router.push({
        query: {
          page: 'governmentTender',
          type: type,
          year: this.year
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
  $ul-width: 1005;
  .amplifier{
    z-index: 9999; // 防止点击不到
  }
  .right {
    float: right;
    width: 60px;
  }
  .seamless-warp {
    /*height: 100%;*/
    height: 100%;
    min-width: $ul-width;
    overflow: hidden;
    background: -moz-linear-gradient(top, #024c6a 0%, #042f4f 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#024c6a), color-stop(100%,#042f4f));
    background: -webkit-linear-gradient(top, #024c6a 0%,#042f4f 100%);
    background: -o-linear-gradient(top, #024c6a 0%,#042f4f 100%);
    background: -ms-linear-gradient(top, #024c6a 0%,#042f4f 100%);
    background-image: linear-gradient(#024c6a, #042f4f);
    li{
      cursor: pointer;
    }
  }
  .ul-box {
    width: 100%;
    height: calc(100% - 35px);
    overflow-x: auto;
    overflow-y: hidden;
    // margin-top: 15px;
  }
  .table-ul{
    display: flex;
    width: $ul-width;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: left;
    background: #017c97;
    z-index: 2;

    li{
      background: #0000;
      color: #fff;
      border-bottom: none;
      padding: 8px 10px;
      font-size: 12px;
    }
  }
  .list-ul{
    display: flex;
    width: $ul-width;
    li{
      background: #0000;
      color: #fff;
      border-bottom: none;
      padding: 0px 10px;
      font-size: 12px;
      line-height: 40px;
    }
    .nobackdrop{
      background-color: rgba(1,124,151,.25);
    }
  }
  .info li{
    color: #2FC25B;
  }
  .warn li{
    color: #EF4864;
  }
  .omit{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .text-center{
    text-align: center;
  }
  .text-right{
    text-align: right;
  }
  .is-right-button{
    float: right;
  }
</style>
