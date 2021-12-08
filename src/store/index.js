import Vue from 'vue'
import Vuex from 'vuex'
import userModule from './module/user'

Vue.use(Vuex)

const routerModule={
  state:{
    routerState:'/index',
    num:'1',
    textDate: ''
  },
  actions:{ // dispatch提交action方法，是异步的，可以调用mutation中的方法异步修改state中的数据
    commitRouterState(state,payload){
      if(state=='/video'){
        state.commit('commitRouter',payload);
      }else{
        state.commit('commitRouter',payload);
      }
    },
    commitTextData({commit}, data){
      commit('CHANGE_TEXT_DATE',data)
    }
  },
  mutations:{ // commit 同步提交mutation数据，只有mutation可以修改state中的数据
    routerState(state,data){
      state.routerState=data;
    },
    commitRouter(state,data){
      state.num=data;
    },
    CHANGE_TEXT_DATE(state,data) {
      state.textDate = data
    }
  },
  getters: {
    routerState(state){
      return state.num;
    },
    getTextDate(state) {
      return state.textDate
    }
  },
}

const otherModule={
  state:{
    otherModule:'1',
  },
  actions:{
    subOtherModule(state,payload){
        state.commit('commitOtherMoudel',payload);
    }
  },
  mutations:{
    commitOtherMoudel(state,data){
      state.otherModule=data;
    }
  },
  getters: {
    getOtherModuleValue(state){
      return state.otherModule
    }
  },
}

export default new Vuex.Store({
  modules: {
    routerModule,
    otherModule,
    userModule
  }
})
