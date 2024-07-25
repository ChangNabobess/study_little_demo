import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/video',
    name: 'Video',
    component: () => import('@/views/video')
  }, {
    path: '/countdown',
    name: 'Countdown',
    component: () => import('@/views/countdown')
  }, {
    path: '/testpageactive',
    name: 'Testpageactive',
    component: () => import('@/views/testPageActive/index'),
    meta: {
      x: 0,
      y: 0
    }
  },
  {
    path: '/test',
    name: 'Text',
    component: () => import('@/views/test'),
    meta: {
      x: 0,
      y: 0
    }
  },
  {
    path: '/webodf',
    name: 'Webodf',
    component: () => import('@/views/webodf'),
    meta: {
      x: 0,
      y: 0
    }
  }
]
// 注意: 这个功能（scrollBehavior）只在支持 history.pushState 的浏览器中可用。
const scrollBehavior = function (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    // 如果不是通过上述行为切换组件，就会让页面回到顶部
    return to.meta || { x: 0, y: 0 }
  }
}

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior
})

// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
// router.beforeEach({next('/')})  用户未登录，将路由重定向到其他页面
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

export default router
