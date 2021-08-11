<template>
  <div>
    <div class='minbody'></div>
    <div class="main-body2">
      <ul class="moveUl">
        <li><img src="../assets/img/a.jpeg" alt="图片加载失败..."></li>
        <li><img src="../assets/img/b.jpeg" alt="图片加载失败..."></li>
        <li><img src="../assets/img/c.jpeg" alt="图片加载失败..."></li>
        <li><img src="../assets/img/d.jpeg" alt="图片加载失败..."></li>
        <li><img src="../assets/img/e.jpeg" alt="图片加载失败..."></li>
      </ul>
      <img src="../assets/img/left.png" class="leftBtn" alt="">
      <img src="../assets/img/right.png" class="rightBtn" alt="">
      <ul class="absoluteP">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      outLineBoder:null,
      imgUrl:["a.jpeg", "b.jpeg", "c.jpeg", "d.jpeg", "e.jpeg"],
      chooseImg: null,
      bigImgArr: [],
      bigImageOpacity:null,
      imgNum: 0,
      liList: [],
      chooseLi: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    initFunction(){ // 用Dom创建元素并操作
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
    iconImgClickHandler(e,index,num) { // 点击右边小图片切换背景图
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
    },
    addEventHandler(){
      let imgElem1 = document.querySelector('.leftBtn')
      let imgElem2 = document.querySelector('.rightBtn')
      imgElem1.addEventListener('click',this.arrowClickFun)
      imgElem2.addEventListener('click',this.arrowClickFun)
      let dotDom = document.querySelector('.absoluteP')
      this.liList = dotDom.childNodes
      this.liList.forEach((item,index) => {
        if(index == 0) {
          item.style.backgroundColor = 'rgba(255,0,0,1)'
          this.chooseLi = item
        }
        item.addEventListener('click',(e) => {
          this.liClickHandler(index)
        })
      })
    },
    arrowClickFun(e){
      if(e.target.classList.value.includes('rightBtn')) {
        this.imgNum ++
        if(this.imgNum > 4) {
          this.imgNum = 0
        }
      } else {
        this.imgNum --
        if(this.imgNum < 0) {
          this.imgNum = 4
        }
      }
      this.changeImgPlace()
    },
    changeImgPlace() {
      let tranFormDom = document.getElementsByClassName('moveUl')
      // tranFormDom[0].style.transform = `translateX(${-(this.imgNum*1887)}px)`
      tranFormDom[0].style.transform = `translateX(${-(this.imgNum*1887)/100}rem)`
      this.changDotBg(this.imgNum)
    },
    liClickHandler(index) {
      this.imgNum = index
      this.changDotBg(index)
      this.changeImgPlace()
    },
    changDotBg(index) {
      if(this.chooseLi) {
        this.chooseLi.style.backgroundColor = 'rgba(0,0,0,0)'
      }
      this.chooseLi = this.liList[index]
      this.chooseLi.style.backgroundColor = 'rgba(255,0,0,1)'
    }
  },
  created() {},
  mounted() {
    this.initFunction()
    this.addEventHandler()
  }
}
</script>

<style lang='scss' scoped>
.minbody{
  width: 100%;
  min-height: 500px;
}
/* .main-body2{
  width: 100%;
  min-height: 500px;
  position: relative;
  overflow: hidden;
  .moveUl{
    list-style: none;
    width: 9600px;
    height: 100%;
    padding: 0px;
    transition: transform 1s;
    li{
      width: 1887px;
      height: 500px;
      font-size: 0px;
      float: left;
    }
  }
  img{
    width: 100%;
    height: 500px;
  }
  .leftBtn{
    width: 30px;
    height: 60px;
    position: absolute;
    top: 190px;
    left: 20px;
  }
  .rightBtn{
    width: 30px;
    height: 60px;
    position: absolute;
    top: 190px;
    right: 20px;
  }
  .absoluteP{
    list-style: none;
    position: absolute;
    left: 800px;
    bottom: 20px;
    padding: 0px;
    li{
      float: left;
      margin: 0px 20px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid #ff2d51;
    }
  }
} */
.main-body2{
  width: 100%;
  min-height: 5rem;
  position: relative;
  overflow: hidden;
  .moveUl{
    list-style: none;
    width: 96rem;
    height: 100%;
    padding: 0rem;
    transition: transform 1s;
    li{
      width: 18.87rem;
      height: 5rem;
      font-size: 0px;
      float: left;
      img{
        width: 100%;
        height: 5rem;
      }
    }
  }
  
  .leftBtn{
    width: 0.3rem;
    height: 0.6rem;
    position: absolute;
    top: 1.9rem;
    left: 0.2rem;
  }
  .rightBtn{
    width: 0.3rem;
    height: 0.6rem;
    position: absolute;
    top: 1.9rem;
    right: 0.2rem;
  }
  .absoluteP{
    list-style: none;
    position: absolute;
    left: 40%;
    bottom: 0.2rem;
    padding: 0rem;
    li{
      float: left;
      margin: 0rem 0.2rem;
      width: 0.2rem;
      height: 0.2rem;
      border-radius: 50%;
      border: 0.02rem solid #ff2d51;
    }
  }
}
</style>