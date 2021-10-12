<template>
  <div class='moveSquare'>
    移动方块
  </div>
</template>

<script>
export default {
  data() {
    return {
      bool: false,
      speed: 2,
      distance: 0, // 前进距离
      interVal: null
    };
  },
  computed: {},
  watch: {},
  methods: {
    createElem(){
      const vm = this
      let newEle = document.createElement('div')
      document.querySelector('.moveSquare').append(newEle)
      Object.assign(newEle.style,{
        'width' : '100px',
        'height' : '100px',
        'backgroundColor' : 'red',
        'position' : 'absolute',
      })
      newEle.addEventListener('click',(e) => {
        vm.clickMoveEvent(e)
      })
      this.interVal = setInterval(() => {
        // console.log(newEle);
        this.moveEvent(newEle)
      }, 16);
    },
    clickMoveEvent(e){
      this.bool = !this.bool
    },
    moveEvent(e){
      if(!this.bool) return
      this.distance+=this.speed
      e.style.left = this.distance + 'px'
      if(this.distance > 945) {
        this.distance = 0
      }
    }
  },
  created() {

  },
  mounted() {
    this.createElem()
  },
  destroyed(){
    clearInterval(this.interVal)
  }
}
</script>

<style lang='scss' scoped>
.moveSquare{
  width: 100%;
  min-height: 100px;
}
</style>