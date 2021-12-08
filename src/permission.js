import router from '@/router/index'
import store from '@/store/index'

router.beforeEach(async(to,from,next) => {
  if(Object.keys(store.state.userModule.userinfo || {} ).length == 0) {
    await store.dispatch('getUserInfo')
    next()
  }
  next()
})