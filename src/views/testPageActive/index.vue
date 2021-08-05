<template>
  <div class=''>
    <MainPage v-if="pageActiveType == 'newPage' "></MainPage>
    <TextPage v-else></TextPage>
  </div>
</template>

<script>
import recordKeepAlive from '@/mixmin/pageActive';
import MainPage from './main'
import TextPage from './text'

export default {
  name:'Testpageactive',
  data() {
    return {

    };
  },
  components:{
    MainPage,
    TextPage
  },
  mixins:[recordKeepAlive('page')],
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

</style>