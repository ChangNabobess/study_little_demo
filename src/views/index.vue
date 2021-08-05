<template>
  <div class=''>
    <NewPage v-if="pageActiveType == pagetype.newpage"></NewPage>
    <Home v-else></Home>
  </div>
</template>

<script>
import NewPage from './newPage'
import Home from './Home'
import recordKeepAlive from '@/mixmin/pageActive';
export default {
  data() {
    return {
      pagetype:{
        newpage:'newpage'
      }
    };
  },
  mixins:[recordKeepAlive('page')],
  computed: {},
  watch: {},
  methods: {

  },
  components:{
    NewPage,
    Home
  },
  created() {

  },
  mounted() {

  },
}
</script>

<style lang='scss' scoped>

</style>