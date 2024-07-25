<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">主页 | </router-link>
      <router-link to="/about">分页打印 | </router-link>
      <router-link to="/video" @click="videoClick">视频直播 | </router-link>
      <router-link to="/countdown">倒计时 | </router-link>
      <router-link to="/testpageactive" @click="changepage">
        跳转界面 |
      </router-link>
      <router-link to="/test"> 测试 | </router-link>
      <router-link to="/webodf">webodf</router-link>
    </div>
    <router-view />
  </div>
</template>

<script src="webodf.js" type="text/javascript" charset="utf-8"></script>
<script>
export default {
  data() {
    return {
      videoPath: "这是video路径",
    };
  },
  components: {},
  mounted() {
    this.changeRouter();
  },
  methods: {
    videoClick() {
      // console.log(1111);
      this.$store.commit("commitRouterState", "videoPath");
    },
    getroutePath() {
      console.log(this.$route.path);
    },
    changepage() {
      console.log(222);
    },
    changeRouter() {},
  },
  watch: {
    ["$route"]: {
      immediate: true,
      handler(newVal) {
        if (this.$route.path == "/video") {
          this.$store.dispatch("subOtherModule", this.videoPath);
        }
      },
    },
    // '$route':'getroutePath',
    /* $route(to,from){
      console.log(from.path);
      console.log(to.path);
    } */
  },
  computed: {},
};
</script>

<style lang="scss">
@import "./style/common.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 0.2rem;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
