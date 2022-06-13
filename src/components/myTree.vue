<template>
  <div class=''>
    <ul id="clickUl">
      <li>
        浙江省
        <ul>
          <li>
            杭州市
            <ul>
              <li>西湖区</li>
              <li>余杭区</li>
              <li>滨江区</li>
            </ul>
          </li>
          <li>
            温州市
            <ul>
              <li>龙湾区</li>
              <li>鹿城区</li>
              <li>瓯海区</li>
            </ul>
          </li>
          <li>
            丽水市
            <ul>
              <li>天宁工业区</li>
              <li>莲都区</li>
              <li>金华区</li>
            </ul>
          </li>
          <li>
            宁波市
            <ul>
              <li>镇海区</li>
              <li>江北区</li>
              <li>海曙区</li>
            </ul>
          </li>
        </ul>
      </li>
      <li>北京
            <ul>
                <li>海淀</li>
                <li>昌平
                    <ul>
                        <li>沙河</li>
                        <li>回龙观</li>
                        <li>天通苑</li>
                        <li>西二旗</li>
                    </ul>
                </li>
                <li>朝阳</li>
                <li>东城</li>
            </ul>
        </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bool:true
    };
  },
  computed: {},
  watch: {},
  methods: {
    initFun(){
      let ulDom = document.querySelector('#clickUl')
      ulDom.addEventListener('click',this.ulClickHandler)
    },
    ulClickHandler(e){
      e.stopImmediatePropagation() // 停止冒泡
      if(!e.target.firstElementChild) return // 点击的元素有没有子元素
      if(e.target.constructor !== HTMLLIElement) return // 利用构造函数判断当前点击的元素是不是li
      if(this.bool) {
        e.target.firstElementChild.style.display = 'none'
      } else {
        e.target.firstElementChild.style.display = 'block'
      }
      this.bool = !this.bool
    }
  },
  created() {

  },
  mounted() {
    this.initFun()
  },
}
</script>

<style lang='scss' scoped>

</style>