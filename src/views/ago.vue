<template>
  <div style="height: 100%;width: 100%;">
    <div class="main-title"><p>{{title}}</p></div>
    <div id="mapdetails" style="width:100%;height:93%" ref="mapdetails"></div>
  </div>
</template>

<script>
import { number_set, number_format } from '@/util/util'
export default {
  props: {
    mapList: Array,
    maxNum: Number,
    itemData: Array
  },
  data() {
    return {
      salvProName: [],
      salvProValue: [],
      salvProMax: [],
      title: '2021年各市交易完成金额情况排行',
      datesetInterval: null,
      chartInit: null,
      number_set,
      number_format,
      mapChooseRegionName: ''
    }
  },
  computed: {},
  watch: {
    'mapList': {
      handler(newVal, oldVal) {
        if (newVal.length > 0) {
          this.getDataNum(newVal)
        }
      },
      deep: true,
      immediate: true
    },
    'itemData': {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal && newVal.length > 0) {
          this.mapChooseRegionName = newVal[0].regionName
          this.getDataNum(this.mapList)
        }
      }
    }
  },
  methods: {
    getDataNum(mapList) {
      this.chartInit = this.$echarts.init(document.getElementById('mapdetails'))
      mapList.forEach(item => {
        if (item.regionPGuid == '2137') {
          this.salvProName.push(item.regionName)
          this.salvProValue.push(item.projectMoney) // buyPlanExec
        }
      })
      this.pushMaxNum()
      const chartOptaion = this.optaionChart(this.salvProName, this.salvProValue, this.salvProMax)
      this.chartInit.setOption(chartOptaion)
    },
    optaionChart(salvProName, salvProValue, salvProMax) {
      const vm = this
      const option = {
        layoutSize: '80%', // 大小
        backgroundColor: '',
        grid: {
          left: '2%',
          right: '2%',
          bottom: '0%',
          top: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          formatter: function(params) {
            return params[0].name + ' : ' + vm.filterMoney(params[0].value)
          }
        },
        /* legend: {
          orient: 'horizontal',  // 设置水平展示
          itemHeight: 20,  // legend图形大小
          x: '10px',
          textStyle: {
            fontSize: 14, // 字体大小
            color: 'white'
          }
        }, */
        xAxis: {
          show: false,
          type: 'value'
        },
        yAxis: [{
          type: 'category',
          inverse: true,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          data: salvProName
        }],
        animationEasing: 'bounceOut',
        series: [{
          name: '各市完成交易金额',
          type: 'bar',
          zlevel: 1,
          itemStyle: {
            normal: {
              barBorderRadius: 30,
              color: function(params) {
                if (vm.mapChooseRegionName == params.name) {
                  console.log('相同了')
                  return 'ff0000'
                } else {
                  return new vm.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                    offset: 0,
                    color: 'rgb(36,111,168,1)'
                  }, {
                    offset: 1,
                    color: 'rgb(87,193,235,1)'
                  }])
                }
              }
            }
          },
          label: {
            normal: {
              show: true, // 显示数字
              position: 'right',
              color: '#ffffff',
              fontSize: '12',
              formatter: (params) => {
                // const showvalue = `${params.value} (${Number((params.value / vm.maxNum) * 100).toFixed(2)}%)`
                const showvalue = `${Number((params.value / vm.maxNum) * 100).toFixed(2)}%`
                return showvalue
              }
            }
          },
          barWidth: '50%',
          data: salvProValue,
          animationDelay: function(idx) {
            return idx * 40
          },
          animationDuration: 3000
        },
        {
          name: '各市占全省交易完成比例',
          type: 'bar',
          barWidth: '50%',
          barGap: '-100%',
          // data: salvProMax,
          data: [],
          itemStyle: {
            normal: {
              color: 'rgba(0,0,0,0)',
              barBorderRadius: 30
            }
          },
          label: {
            formatter: (params) => {
              // const showvalue = `${params.value} (${(params.value / vm.maxNum) * 100}%)`
              const showvalue = `${(params.value / vm.maxNum) * 100}%`
              return showvalue
            }
          },
          animationDuration: 0
        }
        ]
      }
      return option
    },
    filterMoney(cellValue) {
      return `${number_format(number_set(cellValue), 2, '.', ',', 'floor')}`
    },
    pushMaxNum() {
      for (let i = 0; i < this.salvProValue.length; i++) {
        this.salvProMax.push(this.maxNum)
      }
    },
    resize() {
      if (this.$refs.mapdetails.myChart) {
        this.$refs.mapdetails.myChart.resize()
      }
    }
  },
  created() {
    /* this.datesetInterval = setInterval(() => {
      this.getDataNum(this.mapList)
    }, 3000) */
  },
  mounted() {
    window.addEventListener('resize', this.resize)
  },
  destroyed() {
    // clearInterval(this.datesetInterval)z
    window.addEventListener('resize', this.resize)
  }
}
</script>

<style lang='scss' scoped>
.main-title{
  p{
    font-weight: bold;
    padding: 10px 0px 0px 20px;
  }
  height: 7%;
  margin-bottom: 5px;
  font-size: 22px;
}
</style>
