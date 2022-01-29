import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import userStore from './modules/userStore';
Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    domain : 'http://localhost:8080'
  },
  getters : {
    getDomain : state => state.domain,
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    userStore: userStore
  },
  plugins :[createPersistedState({
    paths: ['userStore']
  })]
})