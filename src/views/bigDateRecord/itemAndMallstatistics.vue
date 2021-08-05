<template>
  <div class='statistics'>
    <p class="top-blocktitle blockItem" v-if="blockTitle == '项目采购'">项目</p>
    <p class="top-blocktitle blockMall" v-else>卖场</p>
    <div class="outsideBall"  @click="changePage" :class="blockTitle == '项目采购' ? 'itemBlock' : 'mallBlock'">
      <p class="top-pictur" :class="(blockTitle == '项目采购') ? 'bg-item-picture' : 'bg-mall-picture'"></p>
      <p>
        <span class="million" :class="blockTitle == '项目采购' ? 'itemBlock' : 'mallBlock'">{{funfilter(allMoney)[0]}}</span>
        <span class="thousand" v-if="funfilter(allMoney).length > 1">亿</span>
        <span class="million" :class="blockTitle == '项目采购' ? 'itemBlock' : 'mallBlock'">{{funfilter(allMoney)[1]}}</span>
        <span class="thousand">万元</span>
      </p>
      <p style="line-height: 30px;">
        <span class="all-count-unit">共</span>
        <span class="all-money-count" :class="blockTitle == '项目采购' ? 'itemBlock' : 'mallBlock'">{{allMoneyNum}}</span>
        <span class="all-count-unit">笔</span>
      </p>
    </div>
  </div>
</template>
<script>
import { number_set, sy_number_format } from '@/util/util'
import { differentTypeTitle } from '@/const/constant'
export default {
  data() {
    return {
      allMoney: null,
      allMoneyNum: null,
      number_set,
      sy_number_format,
      differentTypeTitle
    }
  },
  computed: {},
  watch: {
    'itemAndMallObj': {
      deep: true,
      handler(newVal, oldVal) {
        this.setVal()
      }
    }
  },
  props: {
    blockTitle: {
      type: String,
      default: ''
    },
    itemAndMallObj: Object
  },
  methods: {
    funfilter(value) {
      return sy_number_format(number_set(value), 2, '.', ',', 'floor')
    },
    setVal() {
      if (this.blockTitle == '项目采购') {
        this.allMoneyNum = this.itemAndMallObj.itemMoneyAndNum.num
        this.allMoney = this.itemAndMallObj.itemMoneyAndNum.money
      } else {
        this.allMoneyNum = this.itemAndMallObj.mallMoneyAndNumVO.num
        this.allMoney = this.itemAndMallObj.mallMoneyAndNumVO.money
      }
    },
    changePage() {
      if (this.blockTitle == '项目采购') {
        this.$router.push({ query: {
          page: 'governmentTender',
          type: differentTypeTitle.itemBlockTitle
        }})
      } else {
        this.$router.push({ query: {
          page: 'governmentTender',
          type: differentTypeTitle.mallBlockTitle
        }})
      }
    }
  },
  created() {

  },
  mounted() {
    this.setVal()
  }
}
</script>

<style lang='scss' scoped>
.statistics{
  width: 100%;
  height: 100%;
  position: relative;
  .top-blocktitle{
      text-align: center;
      width: 100%;
      color: rgba(255, 255, 255, 0);
      height: 2.933333rem;
    }
    .blockItem{
      background-image: url('../../assets/img/itemword.png');
      background-repeat: no-repeat;
      background-position: 50px -25px;
    }
    .blockMall{
      background-image: url('../../assets/img/mallword.png');
      background-repeat: no-repeat;
      background-position: 50px -25px;
    }
  .outsideBall{
    height: 250px;
    margin: 0px auto;
    width: 250px;
    background-image: url('../../assets/img/itemmallbg.png');
    background-repeat: repeat;
    background-size: 250px 250px;
    cursor: pointer;
    .top-pictur{
      width: 45px;
      height: 45px;
      margin: 0px auto;
      background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
      background-position: 0px 40px;
      background-size: 45px 45px;
      padding: 20px 0px;
    }
    .bg-item-picture{
      background-image: url("../../assets/img/item.png");
    }
    .bg-mall-picture{
      background-image: url("../../assets/img/mall.png");
    }
    p{
      width: 100%;
      text-align: center;
      line-height: 60px;
    }
    .all-money-count{
      font-size: 26px;
      font-family: myFirstFont;
      color: $mainTextColor;
      letter-spacing: 5px;
    }
    .all-count-unit{
      color: white;
      font-size: 12px;
    }
    .million{
      color: $mainTextColor;
      font-family: myFirstFont;
      font-size: 26px;
    }
    .thousand{
      color: white;
      font-size: 12px;
    }
  }
}
</style>
