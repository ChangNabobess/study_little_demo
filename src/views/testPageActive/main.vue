<template>
  <div class="main-test">
    <el-row>
      <el-col :span="2">
        <!-- <DigitRoll :rollDigits="digits" /> -->
        <vns :start="0" :end="digits" :times="10" :speed="50"/>
        <span>元</span>
      </el-col>
      <el-col :span="20">
        <GdMap></GdMap>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="goBack">返回</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        左侧占位符asd
      </el-col>
      <el-col :span="20">
        <template>
            <el-table
              :data="tableData"
              style="width: 100%"
              class="testTable"
              ref='refTable'
              max-height='305'>
              <el-table-column type="expand">
                <template>
                  <div class="tringle1"></div>
                  <div class="tringle2"></div>
                  <textarea class="textarerea" ref="explain" placeholder="请在此处输入黄色预警反馈说明..." v-model="waringExplain"></textarea>
                </template>
              </el-table-column>
              <el-table-column
                label="商品 ID"
                prop="id">
              </el-table-column>
              <el-table-column
                label="商品名称"
                prop="name">
              </el-table-column>
              <el-table-column
                label="描述"
                prop="desc">
              </el-table-column>
              <el-table-column
                label="按钮"
                prop="desc">
                <template slot-scope="scope">
                  <el-button type="primary" @click="clickMe(scope.row)">点我</el-button>
                </template>
              </el-table-column>
            </el-table>
        </template>
      </el-col>
      <el-col :span="2">
        右侧占位符
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">左侧占位符</el-col>
      <el-col :span="20" style="margin: 20px 0px 0px 0px;">
        <div class="testTringle"></div>
        <div class="timePicker" style="margin-top:20px;">
            <el-date-picker
              v-model="value"
              type="date"
              :clearable='false'
              placeholder="选择日期"
              format='yyyy-MM-dd'
              value-format="yyyy-MM-dd"
              ref='datapicker'
              @blur='putAway = false'
              @focus='putAway = true'>
            </el-date-picker>
            <i class="iconfont el-icon-arrow-down" :class="putAway? 'translateClass1' : 'translateClass2'" @click="setputAway = !setputAway"></i>
        </div>
        <el-row :gutter="12">
          <el-col :span="12">
            <div class="pie-class">
              <BarChart></BarChart>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="pie-class">
              <LineChart></LineChart>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="2">右侧占位符</el-col>
    </el-row>
  </div>
</template>

<script>
import GdMap from '@/views/map/gdMap'
import BarChart from '@/views/testPageActive/component/barChart'
import LineChart from '@/views/testPageActive/component/lineChart'
import {mapGetters, mapState} from 'vuex'
import vns from 'vue-number-scroll'
export default {
  data() {
    return {
      digits: 53268845.523,
      tableData: [{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987123',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987125',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
      }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
      }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
      }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
      }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
      }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
      }],
      visible: false,
      waringExplain: '',
      value: '',
      putAway: false, // el-dataPicker 下拉框是否显示
      setputAway: false,
    };
  },
  components:{
    GdMap,
    BarChart,
    LineChart,
    vns,
  },
  computed:{
    ...mapGetters(['getTextDate']),
    ...mapState({count (state) { return state.routerModule.textDate}})
  },
  watch: {
    visible:{
      immediate:true,
      handler(newVal,oldVal) {
        // if(newVal == false) {
          // console.log(this.waringExplain);
        // }
      }
    },
    putAway:{
      handler(newVal,oldVal) {
        if(newVal == true) {
          this.$refs.datapicker.focus();
        } else {
          this.$refs.datapicker.blur();
        }
      }
    },
    setputAway:{
      handler(newVal,oldVal) {
        if(newVal) {
          this.putAway = newVal
        }
      }
    }
  },
  methods: {
    goBack() {
      this.$router.push({query:{}})
    },
    clickMe(row){
      this.$refs.refTable.toggleRowExpansion(row)
      if(this.$refs.explain) {
        // console.log(this.$refs.explain.value);
      } else {
        this.waringExplain = ''
      }
    },
    getScrollElm() {
      const vm = this
      // console.log(this.$store.getters.getTextDate);
      // console.log(this.getTextDate);
      // console.log(this.$store.state.routerModule.textDate);
      // console.log(this.count);
      this.scrollElem = document.getElementById('scrollTable')
      this.scrollElem.addEventListener('scroll',this.scrollHandler,true)
    },
    scrollHandler(){
      let scrolldown = this.scrollElem.scrollHeight - this.scrollElem.scrollTop - this.scrollElem.clientHeight
      /* if( scrolldown = 0) {
        console.log(11);
      } else { 
        console.log(scrolldown);
      } */
    }
  },
  created() {
    let data = new Date()
    let year = data.getFullYear()
    let month = data.getMonth() + 1
    let day = data.getDate()
    this.value = year + '-' + month + '-' + day
  },
  mounted() {
    // let dom = document.getElementsByClassName('el-input__inner')
    // console.log(dom[0].attributes);
    // console.log(getComputedStyle(dom[0]).display);
    // console.log(document.styleSheets[0].insertRule);
    // 添加id名
    document.getElementsByClassName('el-table__body-wrapper')[0].setAttribute('id','scrollTable');
    // 添加类名
    document.getElementsByClassName('el-table__body-wrapper')[0].classList.add('ceshiNewClassName')
    this.getScrollElm()
  },
}
</script>

<style lang='scss' scoped>
.demo-table-expand {
    font-size: 0;
  }
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.main-test{
  .testTable::v-deep .el-table__expand-icon{
    display: none;
  }
  .textarerea{
    width: 85%;
    height: 100%;
    border: 1px solid rgba(169, 169, 169, 1);
    border-radius: 10px;
    padding: 10px;
    resize:none;
    outline:none;
    font-size: 16px;
    letter-spacing: 3px;
    color: rgba(169, 169, 169, 1);
    position: relative;
  }
  .tringle1{
    position: absolute;
    top: -12px;
    left: 78%;
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid rgba(169, 169, 169, 1);
  }
  .tringle2{
    position: absolute;
    top: -12px;
    left: 78%;
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid #fff;
  }
}
.testTringle{
  margin: auto;
  width: 200px;
  height: 100px;
  border: 1px solid #99a9bf;
  background-color: transparent;
  position: relative;
  background-color: antiquewhite;
}

.testTringle::before{
    content: '';
    position:absolute;
    top:-1px;
    left: -101px;
    width:0px;
    height:0px;
    border-top: 51px solid transparent;
    border-right: 100px solid #99a9bf;
    border-bottom: 51px solid transparent;
}
.testTringle::after{
    content: '';
    position:absolute;
    top:-1px;
    left: -99.8px;
    width:0px;
    height:0px;
    border-top: 51px solid transparent;
    border-right: 100px solid #fff;
    border-bottom: 51px solid transparent;
}
.timePicker ::v-deep .el-input__prefix{
    display: none;
  }
.timePicker ::v-deep .el-input--prefix .el-input__inner{
    cursor: pointer;
    padding: 0px 12px;
    border: 0px solid ;
  }
.translateClass1{
  transform:rotateZ(-180deg);
  transition: transform .3s
}
.translateClass2{
  transform:rotateZ(0deg);
  transition: transform .3s
}
.pie-class{
  width:100%;
  height:500px
}

</style>