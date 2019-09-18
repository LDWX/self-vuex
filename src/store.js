import Vue from 'vue'
import Vuex from './vuex'
// import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 1000,
    name: 'sen'
  },
  getters: {
    newCount (state) {
      return state.count + 1000
    }
  },
  mutations: {
    changeMutation(state) {
      console.log('state.count')
      state.count += 10
    }
  },
  actions: {
    change({commit}) {
      setTimeout( () => {
        commit('changeMutation')
      }, 1000)
    }
  },
  modules: {
    a: {
      state: {
        count: 4000
      },
      actions: {
        change({state}) {
          state.count += 21
        }
      },
      modules: {
        b: {
          state: {
            count: 500
          }
        }
      }
    }
  }
})
