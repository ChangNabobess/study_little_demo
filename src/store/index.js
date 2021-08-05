import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const routerModule={
  state:{
    routerState:'/index',
    num:'1'
  },
  actions:{
    commitRouterState(state,payload){
      if(state=='/video'){
        state.commit('commitRouter',payload);
      }else{
        state.commit('commitRouter',payload);
      }
    }
  },
  mutations:{
    routerState(state,data){
      state.routerState=data;
    },
    commitRouter(state,data){
      state.num=data;
    }
  },
  getters: {
    routerState(state){
      return state.num;
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
    otherModule
  }
})
