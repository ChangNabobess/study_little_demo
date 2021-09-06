<template>
  <div class='outSide'>
    <div class="movePeople"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mainDom: null, // 移动小人框框
      stepNum: 0, // 步数
      type: 0, // 按键方向
      pace: 5, // 移动距离
      x: 0,
      y: 0,
      antiShakeInterval: null, // 防抖
      time: 0,
    };
  },
  computed: {},
  watch: {},
  methods: {
    keyDownHandlerEvent(e){
      if(e.type == 'keydown') {
        if(this.type == e.keyCode) return
        this.type = e.keyCode
      } else {
        this.type = 0
        this.stepNum = 0
      }
      if(this.type>=37 && this.type<=40) {
        switch(this.type){
          case 37: // 左
            Object.assign(this.mainDom[0].style,{
              'background-position-y': '-33px'
            })
          break;
          case 38: // 上
            Object.assign(this.mainDom[0].style,{
              'background-position-y': '-99px'
            })
          break;
          case 39: // 右
            Object.assign(this.mainDom[0].style,{
              'background-position-y': '-66px'
            })
          break;
          case 40: // 下
            Object.assign(this.mainDom[0].style,{
              'background-position-y': '0px'
            })
          break;
        }
      }
    },
    moveBgPic() {
      if (this.type < 37 || this.type > 40) return;
      this.time --
      if(this.time > 0) return
      this.time = 15
      this.stepNum ++
      if(this.stepNum > 3) this.stepNum = 0
      this.mainDomMove()
      this.mainDom[0].style.backgroundPositionX = -this.stepNum*32 + 'px'
    },
    mainDomMove(){
      switch(this.type) {
        case 37: 
          this.x -= this.pace
          break;
        case 38: 
          this.y -= this.pace
          break;
        case 39: 
          this.x += this.pace
          break;
        case 40: 
          this.y += this.pace
          break;
      }
      if(this.x>0 && this.x<this.mainDom[0].parentNode.clientWidth) {
        this.mainDom[0].style.left = this.x  + 'px'
      } else if(this.x < 0) {
        this.x = 0
      } else if(this.x > this.mainDom[0].parentNode.clientWidth) {
        this.x = this.mainDom[0].parentNode.clientWidth
      }
      if(this.y>0 && this.y<this.mainDom[0].parentNode.clientHeight) {
        this.mainDom[0].style.top = this.y + 'px'
      } else if(this.y < 0){
        this.y = 0
      } else if(this.y > this.mainDom[0].parentNode.clientHeight) {
        this.y = this.mainDom[0].parentNode.clientHeight
      }
    }
  },
  created() {

  },
  mounted() {
    this.mainDom = document.getElementsByClassName('movePeople')
    document.addEventListener('keydown',this.keyDownHandlerEvent)
    document.addEventListener('keyup',this.keyDownHandlerEvent)
    this.antiShakeInterval = setInterval(this.moveBgPic, 16);
  },
}
</script>

<style lang='scss' scoped>
.outSide{
  width: 600px;
  height: 600px;
  margin: auto;
  position: relative;
}
.movePeople{
  width: 32px;
  height: 32px;
  background-image: url('../assets/img/actor.png');
  position: absolute;
  left: 0;
  top: 0;
}
</style>