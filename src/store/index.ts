import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
  },
  mutations: {
    SET_TOKEN(state, token: string) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER_INFO(state, info: any) {
      state.userInfo = info
      localStorage.setItem('userInfo', JSON.stringify(info))
    },
    CLEAR_AUTH(state) {
      state.token = ''
      state.userInfo = {}
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  },
  actions: {
    login({ commit }, payload: { token: string; userInfo: any }) {
      commit('SET_TOKEN', payload.token)
      commit('SET_USER_INFO', payload.userInfo)
    },
    logout({ commit }) {
      commit('CLEAR_AUTH')
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    userInfo: (state) => state.userInfo
  }
})
