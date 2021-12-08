import arrDeweight from '../../../public/arrDeweight.json'
import { verifyResIsSuccess } from '../../utils/auth'
import axios from '@/router/axios'

const userModule = {
  state:{
    userinfo: {}, // 用户信息
  },
  actions:{
    getUserInfo({ commit, state, dispatch }){
      return new Promise((resolve, reject) => {
        axios.get('./arrDeweight.json').then((res) => {
          if(verifyResIsSuccess(res)){
            commit('SET_USERINFO', res.data.data)
            resolve()
          } else {
            reject(new Error('用户信息获取失败' + res.message))
          }
        }).catch((err) => {
          reject(new Error('用户信息获取失败', +err))
        })
      })
    }
  },
  mutations:{
    SET_USERINFO: (state,value) => {
      state.userinfo = Object.assign(value)
    }
  },
  getters:{
    userinfo(state){
      return state.userinfo
    }
  },
}

export default userModule;