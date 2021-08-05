<template>
  <div class='pir-chart'>
    <div id='linechart' style="width:100%;height:100%;"></div>
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
      this.mychart = this.$echart.init(document.getElementById('linechart'))
      let chartOption = this.chartOption()
      this.mychart.setOption(chartOption)
    },
    chartOption(){
      const vm = this
      let xLabel = ['3.26', '3.27', '3.28', '3.29', '3.30', '3.31']
      let goToSchool = ["40", "60", "22", "85", "50", "40"]
      let goOutSchool = ["20", "50", "12", "65", "30", "60"]
      let option = {
          backgroundColor: '',
          tooltip: {
              trigger: 'axis',
              backgroundColor:'transparent',
              axisPointer: {
                  lineStyle: {
                      color: {
                          type: 'linear',
                          x: 0,
                          y: 0,
                          x2: 0,
                          y2: 1,
                          colorStops: [{
                              offset: 0,
                              color: 'rgba(126,199,255,0)' // 0% 处的颜色
                          }, {
                              offset: 0.5,
                              color: 'rgba(126,199,255,1)' // 100% 处的颜色
                          }, {
                              offset: 1,
                              color: 'rgba(126,199,255,0)' // 100% 处的颜色
                          }],
                          global: false // 缺省为 false
                      }
                  },
              },
              formatter: (p) => {
                  let dom = `<div style="width: 79px;
                              height: 50px;;color:#fff;position: relative;">
                                    <svg style="position: absolute;top: 50%;
                                left: 50%;
                                transform: translateX(-50%) translateY(-50%);" class="svg" xmlns="http://www.w3.org/2000/svg" width="100" height="71" viewBox="0 0 84 55">
                                  <defs>
                                    <style>
                                      .cls-1 {
                                        fill: #07172c;
                                        fill-opacity: 0.8;
                                        stroke: #a7d8ff;
                                        stroke-linejoin: round;
                                        stroke-opacity: 0.2;
                                        stroke-width: 1px;
                                        fill-rule: evenodd;
                                      }

                                    </style>
                                  </defs>
                                  <path id="矩形_419" data-name="矩形 419" class="cls-1" d="M266,595h74v50H266V624.046L261,620l5-3.984V595Z"
                                    transform="translate(-258.5 -592.5)" />
                                </svg>
                                    <div style="padding: 4px 8px 4px 14px;display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    flex-direction: column;position: relative;z-index: 1;">
                                        <div style="margin-bottom: 4px;width:100%;display:flex;justify-content:space-between;align-items:center;">
                                            <span style="font-size:14px;color:#7ec7ff;">${p[0].seriesName}</span>
                                            <span style="font-size:14px;color:#fff;">${p[0].data}</span>
                                        </div>
                                        <div style="width:100%;display:flex;justify-content:space-between;align-items:center;">
                                            <span style="font-size:14px;color:#7ec7ff;">${p[1].seriesName}</span>
                                            <span style="font-size:14px;color:#fff;">${p[1].data}</span>
                                        </div>
                                    </div>
                                </div>`
                  return dom
              }
          },
          legend: {
              align: "left",
              left: '50%',
              top:'14%',
              type:'plain',
              textStyle:{
                  color:'#7ec7ff',
                  fontSize:16
              },
              // icon:'rect',
              itemGap:25,
              itemWidth:18,
              icon:'path://M631.466667 870.4c0 12.561067-10.194489 22.755556-22.755556 22.755556l-182.044444 0c-12.561067 0-22.755556-10.194489-22.755556-22.755556s10.194489-22.755556 22.755556-22.755556l182.044444 0C621.272178 847.644444 631.466667 857.838933 631.466667 870.4zM608.711111 904.533333l-182.044444 0c-14.973156 0-26.567111 14.461156-21.583644 30.173867 3.003733 9.477689 12.5952 15.337244 22.539378 15.337244l0.341333 0c13.141333 0 25.156267 7.429689 31.038578 19.182933l0.238933 0.477867C467.171556 985.543111 483.362133 995.555556 501.077333 995.555556l33.223111 0c17.7152 0 33.905778-10.012444 41.824711-25.850311l0.238933-0.477867c5.882311-11.753244 17.897244-19.182933 31.038578-19.182933l0.341333 0c9.944178 0 19.535644-5.859556 22.539378-15.337244C635.278222 918.994489 623.684267 904.533333 608.711111 904.533333zM517.688889 176.355556c12.561067 0 22.755556-10.194489 22.755556-22.755556l0-91.022222c0-12.561067-10.194489-22.755556-22.755556-22.755556s-22.755556 10.194489-22.755556 22.755556l0 91.022222C494.933333 166.161067 505.127822 176.355556 517.688889 176.355556zM276.332089 262.997333c4.437333 4.448711 10.262756 6.667378 16.088178 6.667378s11.650844-2.218667 16.088178-6.667378c8.886044-8.886044 8.886044-23.290311 0-32.176356l-64.364089-64.364089c-8.874667-8.886044-23.301689-8.886044-32.176356 0-8.886044 8.886044-8.886044 23.290311 0 32.176356L276.332089 262.997333zM221.866667 472.177778c0-12.561067-10.194489-22.755556-22.755556-22.755556l-91.022222 0c-12.561067 0-22.755556 10.194489-22.755556 22.755556s10.194489 22.755556 22.755556 22.755556l91.022222 0C211.672178 494.933333 221.866667 484.738844 221.866667 472.177778zM276.332089 681.358222l-64.364089 64.364089c-8.886044 8.886044-8.886044 23.290311 0 32.176356 4.437333 4.448711 10.262756 6.667378 16.088178 6.667378s11.650844-2.218667 16.088178-6.667378l64.364089-64.364089c8.886044-8.886044 8.886044-23.290311 0-32.176356C299.633778 672.472178 285.206756 672.472178 276.332089 681.358222zM759.045689 681.358222c-8.886044-8.886044-23.290311-8.886044-32.176356 0s-8.886044 23.290311 0 32.176356l64.364089 64.364089c4.448711 4.448711 10.262756 6.667378 16.088178 6.667378s11.639467-2.218667 16.088178-6.667378c8.886044-8.886044 8.886044-23.290311 0-32.176356L759.045689 681.358222zM927.288889 449.422222l-91.022222 0c-12.561067 0-22.755556 10.194489-22.755556 22.755556s10.194489 22.755556 22.755556 22.755556l91.022222 0c12.561067 0 22.755556-10.194489 22.755556-22.755556S939.849956 449.422222 927.288889 449.422222zM742.957511 269.664711c5.825422 0 11.639467-2.218667 16.088178-6.667378l64.364089-64.364089c8.886044-8.886044 8.886044-23.290311 0-32.176356s-23.290311-8.886044-32.176356 0l-64.364089 64.364089c-8.886044 8.886044-8.886044 23.290311 0 32.176356C731.306667 267.446044 737.132089 269.664711 742.957511 269.664711zM631.466667 813.511111c0 12.561067-10.194489 22.755556-22.755556 22.755556l-182.044444 0c-12.561067 0-22.755556-10.194489-22.755556-22.755556 0-12.117333 9.500444-21.936356 21.447111-22.619022C411.192889 662.846578 278.755556 634.322489 278.755556 483.555556c0-131.959467 106.973867-238.933333 238.933333-238.933333s238.933333 106.973867 238.933333 238.933333c0 150.766933-132.437333 179.291022-146.602667 307.336533C621.966222 791.574756 631.466667 801.393778 631.466667 813.511111zM465.248711 308.451556c-3.538489-8.726756-13.471289-12.925156-22.232178-9.409422-58.151822 23.563378-102.240711 73.9328-117.930667 134.735644-2.3552 9.136356 3.140267 18.432 12.265244 20.7872C338.773333 454.940444 340.206933 455.111111 341.617778 455.111111c7.600356 0 14.529422-5.108622 16.520533-12.8 12.993422-50.3808 49.516089-92.114489 97.6896-111.627378C464.566044 327.145244 468.775822 317.201067 465.248711 308.451556z',
              data: [
                  {
                      name: '上学'
                  },
                  {
                      name: '放学'
                  }
              ]
          },
          grid: {
              top: '18%',
              left: '15%',
              right: '5%',
              bottom: '25%',
              containLabel: true
          },
          xAxis: [{
              type: 'category',
              boundaryGap: false,
              axisLine: { //坐标轴轴线相关设置。数学上的x轴
                  show: true,
                  lineStyle: {
                      color: '#233653'
                  },
              },
              axisLabel: { //坐标轴刻度标签的相关设置
                  textStyle: {
                      color: '#7ec7ff',
                      padding: 16,
                      fontSize: 14
                  },
                  formatter: function(data) {
                      return data
                  }
              },
              splitLine: {
                  show: false,
                  lineStyle: {
                      color: '#192a44'
                  },
              },
              axisTick: {
                  show: false,
              },
              data: xLabel
          }],
          yAxis: [{
              name: '',
              nameTextStyle: {
                  color: "#7ec7ff",
                  fontSize: 16,
                  padding: 10
              },
              min: 0,
              splitLine: {
                  show: false,
                  lineStyle: {
                      color: '#192a44'
                  },
              },
              axisLine: {
                  show: false,
                  lineStyle: {
                      color: "#233653"
                  }

              },
              axisLabel: {
                  show: true,
                  textStyle: {
                      color: '#7ec7ff',
                      padding: 16
                  },
                  formatter: function(value) {
                      if (value === 0) {
                          return value
                      }
                      return value
                  }
              },
              axisTick: {
                  show: false,
              },
          }],
          series: [{
              name: '上学',
              type: 'line',
              symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
              showAllSymbol: true,
              symbolSize: 0,
              smooth: true,
              lineStyle: {
                  normal: {
                      width: 5,
                      color: "rgba(25,163,223,1)", // 线条颜色
                  },
                  borderColor: 'rgba(0,0,0,.4)',
              },
              itemStyle: {
                  color: "rgba(25,163,223,1)",
                  borderColor: "#646ace",
                  borderWidth: 2

              },
              tooltip: {
                  show: true
              },
              areaStyle: { //区域填充样式
                  normal: {
                      //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                      color: new vm.$echart.graphic.LinearGradient(0, 0, 0, 1, [{
                              offset: 0,
                              color: "rgba(25,163,223,.3)"


                          },
                          {
                              offset: 1,
                              color: "rgba(25,163,223, 0)"
                          }
                      ], false),
                      shadowColor: 'rgba(25,163,223, 0.5)', //阴影颜色
                      shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                  }
              },
              data: goToSchool
          }, {
              name: '放学',
              type: 'line',
              symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
              showAllSymbol: true,
              symbolSize: 0,
              smooth: true,
              lineStyle: {
                  normal: {
                      width: 5,
                      color: "rgba(10,219,250,1)", // 线条颜色
                  },
                  borderColor: 'rgba(0,0,0,.4)',
              },
              itemStyle: {
                  color: "rgba(10,219,250,1)",
                  borderColor: "#646ace",
                  borderWidth: 2

              },
              tooltip: {
                  show: true
              },
              areaStyle: { //区域填充样式
                  normal: {
                      //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                      color: new vm.$echart.graphic.LinearGradient(0, 0, 0, 1, [{
                              offset: 0,
                              color: "rgba(10,219,250,.3)"
                          },
                          {
                              offset: 1,
                              color: "rgba(10,219,250, 0)"
                          }
                      ], false),
                      shadowColor: 'rgba(10,219,250, 0.5)', //阴影颜色
                      shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                  }
              },
              data: goOutSchool
          }]
      };
      return option
    }
  },
  created() {},
  mounted() {
    this.initChart()
  }
}
</script>

<style lang='scss' scoped>
.pir-chart{
  width: 100%;
  height: 100%;
}
</style>