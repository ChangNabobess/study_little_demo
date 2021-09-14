<template>
  <div class='pir-chart'>
    <div id='barchart' style="width:100%;height:100%;"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mychart: null
    };
  },
  computed: {},
  watch: {},
  methods: {
    initChart(){
      const vm = this
      this.mychart = this.$echart.init(document.getElementById('barchart'))
      let chartOption = this.chartOption()
      this.mychart.setOption(chartOption)
      this.mychart.on('click',(params) =>{ // 增加click事件改变弹框位置，和再tooptip里面直接设置position不冲突
        vm.chartToopTipPosition(params)
      })
    },
    chartOption(){
      let seriesData = [
        [320, 302, 301, 334, 390, 330, 320],
        [120, 132, 101, 134, 90, 230, 210],
        [220, 182, 191, 234, 290, 330, 310],
        [150, 212, 201, 154, 190, 330, 410],
        [820, 832, 901, 934, 1290, 1330, 1320]
      ]
      let legendData = ['Direct', 'Mail Ad', 'Affiliate Ad', 'Video Ad', 'Search Engine']
      let endData = []
      seriesData.forEach((item,index) => {
        let obj = {
            name: legendData[index],
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'none' // 在高亮图形时，是否淡出其它数据的图形已达到聚焦的效果,
                             // 'series' 聚焦当前高亮的数据所在的系列的所有图形。
                             // 'none' 不淡出其它图形，默认使用该配置。
                            // 'self' 只聚焦（不淡出）当前高亮的数据的图形。
            },
            itemStyle:{
              normal:{
                borderRadius: 15,
              }
            },
            data: item
        }
      endData.push(obj)
      })
      let option = {
          tooltip: {
              trigger: 'axis',
              axisPointer: {            // Use axis to trigger tooltip
                  type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
              },
              position:function(point, params, dom, rect, size){ // 这里是hover定位，click是点击定位
                return ['20%', '50%']
              }
          },
          legend: {
              show:true,
              selected: {
                  // 选中'系列1'
                  'Mail Ad': false,
                  // 不选中'系列2'
                  'Video Ad': false
              }
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis: {
              type: 'value'
          },
          yAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          series: endData
      };
      return option
    },
    chartToopTipPosition(params) { // 给Echatrs增加点击事件改变tooptip弹框位置
      const vm = this
      // console.log(params);
      this.mychart.dispatchAction({
          type: 'showTip',
          // 系列的 index，在 tooltip 的 trigger 为 axis 的时候可选。
          seriesIndex: 0,
          // 数据项的 index，如果不指定也可以通过 name 属性根据名称指定数据项
          dataIndex: 0,
          // 可选，数据项名称，在有 dataIndex 的时候忽略
          // name: string,
          // 本次显示 tooltip 的位置。只在本次 action 中生效。
          // 缺省则使用 option 中定义的 tooltip 位置。
          position: (point, params, dom, rect, size) => {
              return [point[0]+200, point[1]+200]
          },
      })
    }
  },
  created() {

  },
  mounted() {
    this.initChart()
  },
}
</script>

<style lang='scss' scoped>
.pir-chart{
  width: 100%;
  height: 100%;
}
</style>