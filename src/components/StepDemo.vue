<template>
  <div class="stepMain">
    <div class="stepLeft" :class="nowClass">
      <slot name="stepLeft"></slot>
    </div>
    <div class="stepRight">
      <slot name="stepRight"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props:{
    nowClass: {
      type:String,
      default: 'unActiveClass'
    }
  },
  computed: {},
  watch: {},
  methods: {

  },
  created() {

  },
  mounted() {

  },
}
</script>

<style lang='scss' scoped>
.stepMain{
  display: flex;
  flex-direction: row;
  width: 100%;
  .stepLeft{
    width: 20%;
    position: relative;
    margin-bottom: 5px;
    padding-top: 20px;
  }
  .activeClass{
    border-right: 2px solid #4b5cc4;
  }
  .activeClass::after{
    content: '';
    position: absolute;
    bottom: -5px;
    right: -6px;
    width: 10px;
    height: 10px;
    background-color: #4b5cc4;
    border-radius: 50%;
  }
  .unActiveClass{
    border-right: 2px solid #a1afc9;
  }
  .unActiveClass::after{
    content: '';
    position: absolute;
    bottom: -5px;
    right: -6px;
    width: 10px;
    height: 10px;
    background-color: #a1afc9;
    border-radius: 50%;
  }
  .stepRight{
    width: 80%;
    padding-left: 5%;
    text-align: left;
    padding-top: 20px;
  }
}
</style>