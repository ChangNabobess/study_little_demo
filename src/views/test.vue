<template>
   <div class="map" ref='bartech'>
    <div id='bartech' style="width:100%;height:100%"></div>
    <ul class="test-ul">
      <li v-for="(i,index) in 10" :key="index" :class="'test-' + i">测试{{i}}界面</li>
    </ul>
   </div>
</template>

<script>


export default {
  name:'bartech',
  data(){
    return{
      myMap:null,
      timer: null
    }
  },
  mounted()
  {
      this._initMap();
      window.onresize=this._resize;
      window.onscroll = this.justifyPos()
  },
  destroyed()
  {
      window.removeEventListener('resize',this._resize);
  },
  methods:{
      //0.25rem;
    _initMap()
    {
      const dolInt = this.$echart.init(document.getElementById('bartech'));
      const dolSetOption =  this._updataChart();   
      dolInt.setOption(dolSetOption)
    },
    _updataChart(){
      var data = [70, 34, 60, 78, 69];
      var titlename = ["HTML5", "CSS3", "javascript", "VUE", "NODE"];
      var valdata = [702, 350, 610, 793, 664];
      var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"];

      let option={
          title:{
              text:'技能掌握',
              textStyle:{
                  color:'white',
                  fontWeight: 400
              },
              left:'center'
          },
          grid: {
              left: "0%",
              top: "30px",
              right: "0%",
              bottom: "4%",
              containLabel: true
          },
          xAxis:{
              type:'value',
              show:false,
              inverse:false,
          },
          yAxis:[{
              type:'category',
              inverse:false,
              data:titlename,
              splitLine:{
                  show:false
              },
              axisLabel: {
                color: "#fff",

                rich: {
                  lg: {
                    backgroundColor: "#339911",
                    color: "#fff",
                    borderRadius: 15,
                    // padding: 5,
                    align: "center",
                    width: 15,
                    height: 15
                  }
                }
              },
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              },

          },
          {
            show: true,
            inverse: true,
            data: valdata,
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: "#fff"
              }
            }
          }
          ],
          series:[
            {
                type:'bar',
                data:data,
                barWidth: "35%",
                itemStyle: {
                    barBorderRadius: 5
                },
                yAxisIndex:0,
                barCategoryGap: 50,
                label: {
                  show: true,
                  position: "inside",
                  formatter: "{c}%"
                },
                itemStyle:{
                  barBorderRadius: 20,
                  color:function(params)
                  {
                    var num=myColor.length;
                    return myColor[params.dataIndex%num]
                  }
                }
            },
            {
              type:'bar',
              data:[100, 100, 100, 100, 100],
              yAxisIndex: 1,
              barWidth:'50%',
              
              itemStyle:{
                color:'none',
                borderColor:"#00c1de",
                borderWidth: 3,
                barBorderRadius: 15
              }
            }
          ]
      }
      return option
    },
    justifyPos() {
      if(this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$route.meta.y = window.pageYOffset
        console.log(window.pageYOffset);
      },300)
    }
  }


}
</script>

<style lang='scss' scoped>
.map{
    height: 100%;
    width:100%;
  .test-ul{
    li{
        width: 100%;
        min-height: 200px;
        list-style: none;
        text-align: center;
        padding: 20px 0px;
        font-size: 25px;
    }
    .test-1{
        background-color: #FFB6C1;
    }
    .test-2{
        background-color: #DB7093;
    }
    .test-3{
        background-color:#FF69B4;
    }
    .test-4{
        background-color: #C71585;
    }
    .test-5{
        background-color: #EE82EE;
    }
    .test-6{
        background-color: #FF00FF;
    }
    .test-7{
        background-color: #BA55D3;
    }
    .test-8{
        background-color: #8A2BE2;
    }
    .test-9{
        background-color: #00BFFF;
    }
    .test-10{
        background-color: #00FFFF;
    }
}
}
</style>