<template>
  <div class="horizontal-main">
    <div v-for="(item,index) in arr" :key="index">
      {{item.name}}
    </div>
    <el-button type="primary" @click="rotateScreen">旋转屏幕</el-button>
  </div>
</template>

<script>
export default {
  data() {
    const item = {
      name:'测试转换屏幕'
    }
    return {  
      arr:Array(100).fill(item)
    };
  },
  computed: {},
  watch: {},
  methods: {
    /* rotateScreen() {
      document.getElementsByClassName('horizontal-main').classList.remove('horizontal-main')
    }, */
    rotateScreen(){
      this.changeOrientation(document.getElementsByClassName('horizontal-main'));
    },
    changeOrientation( $print ){
      console.log(11);
      var width = document.documentElement.clientWidth;
      var height =  document.documentElement.clientHeight;
      if( width < height ){
        // 竖屏
        Object.assign($print[0].style, {
          'width': height  + 'px',
          'height': width  + 'px',
          'top': (height-width)/2  + 'px',
          'left': 0-(height-width)/2  + 'px',
          'transform': 'rotate(90deg)',
          'transform-origin': '50% 50%'
        })
      }
      var evt = "onorientationchange" in window ? "orientationchange" : "resize";
      window.addEventListener(evt, function() {
        console.log(22);
          setTimeout( function(){
              var width = document.documentElement.clientWidth;
              var height =  document.documentElement.clientHeight;
              if( width > height ){
                // 横屏
                  Object.assign($print[0].style, {
                    'width': width  + 'px',
                    'height': height  + 'px',
                    'top': 0,
                    'left': 0,
                    'transform': 'none',
                    'transform-origin': '50% 50%'
                  })
              }  else{
                  // 竖屏
                  Object.assign($print[0].style, {
                    'width': height + 'px',
                    'height': width  + 'px',
                    'top': (height-width)/2  + 'px',
                    'left': 0-(height-width)/2  + 'px',
                    'transform': 'rotate(90deg)',
                    'transform-origin': '50% 50%'
                  })
              }
          }  , 300 );
      }, false);
    }
  },
  created() {},
  mounted() {
    /* window.onorientationchange = function(){
       switch(window.orientation){  
        case 90:  
        console.log("横屏:" + window.orientation);  
        break;
        case 0:  
        console.log("竖屏:" + window.orientation); 
        break;  
      } 
    }, */
  },
};
</script>

<style lang='scss' scoped>
.horizontal-main{
    // position: fixed;
    // top: 0;
    // left: 0;
    // width: 100%;
    // height: 100%;
    // background: url('/assets/img/icon_a.jpeg') no-repeat #000;
    // background-size: cover; /* 铺满屏幕，屏幕变小，图片可能显示不下 */
    // background-size: 100% 100%; /* 铺满屏幕，随屏幕变化而变化比例，图片可能被拉伸 */
    // overflow: auto;
}
</style>