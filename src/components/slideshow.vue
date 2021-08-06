<template>
  <div class='minbody'></div>
</template>

<script>
export default {
  data() {
    return {
      outLineBoder:null,
      imgUrl:["a.jpeg", "b.jpeg", "c.jpeg", "d.jpeg", "e.jpeg"],
      chooseImg: null,
      bigImgArr: [],
      bigImageOpacity:null
    };
  },
  computed: {},
  watch: {},
  methods: {
    initFunction(){
      this.outLineBoder = document.createElement('div')
      Object.assign(this.outLineBoder.style,{
        width:'100%',
        height:500/100 + 'rem',
        position: 'relative'
      })
      // document.getElementsByClassName('minbody')[0].appendChild(this.outLineBoder)
      document.querySelector('.minbody').appendChild(this.outLineBoder)
      this.imgUrl.forEach((item,index) => {
        let bigImg = new Image()
        bigImg.src = require('../assets/img/'+item)
        Object.assign(bigImg.style,{
          width:'100%',
          height:500/100 + 'rem',
          position:'absolute',
          top:'0px',
          left:'0px',
          opacity: '0',
          transform: 'all .3s'
        })
        this.bigImgArr.push(bigImg)
        if(index == 0) this.outLineBoder.appendChild(bigImg)
        this.outLineBoder.insertBefore(bigImg,this.bigImgArr[0])
        let iconImg = new Image()
        iconImg.src = require('../assets/img/icon_'+item)
        Object.assign(iconImg.style,{
          width:108/100 + 'rem',
          height:67/100 + 'rem',
          position:'absolute',
          top:(27+(67+27)*index)/100 + 'rem',
          right:20/100 + 'rem',
          cursor:'pointer'
        })
        this.outLineBoder.appendChild(iconImg)
        if(index == 0){
          this.chooseImg = iconImg
          this.bigImageOpacity = this.bigImgArr[index]
          this.iconImgClickHandler(iconImg,index,0)
        }
        iconImg.addEventListener('click',(e) => {this.iconImgClickHandler(e,index,1)})
      })
      window.addEventListener('resize',this.windowResizeHandler)
    },
    iconImgClickHandler(e,index,num) {
      if(this.chooseImg) {
        this.chooseImg.style.border = '2px solid rgba(0,0,0,0)'
      }
      if(num == 1) this.chooseImg = e.target
      this.chooseImg.style.border = '2px solid #800080'
      if(this.bigImageOpacity){
        this.bigImageOpacity.style.opacity = '0'
      }
      this.bigImageOpacity = this.bigImgArr[index]
      this.bigImageOpacity.style.opacity = '1'
    }
  },
  created() {},
  mounted() {
    this.initFunction()
  }
}
</script>

<style lang='scss' scoped>
.minbody{
  width: 100%;
  min-height: 800px;
}
</style>