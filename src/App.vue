<template>
  <div id="app">
    这里是store的state: {{this.$store.state.count}} <br/>
    这里是store的getter: {{this.$store.getters.newCount}} <br/>
    这里是store的state.a: {{this.$store.state.a.count}} <br/>
    <button @click="change">点击触发dispach: actions</button>
    <button @click="change1">点击触发commit: mutations</button>
    <button @click="changeA">点击触发a的dispatch: actions</button>
    <router-view></router-view>
  </div>
</template>
<script>
// import {mapState} from 'vuex'
export default {
  name: 'app',
  data() {
    return {
    }
  },
  computed: {
    // ...mapState({
    //   count: state => state.count,
    //   name: state => state.name
    // })
  },
  methods: {
    change () {
      this.$store.dispatch('change') // 触发actions对应的change
    },
    change1 () {
      this.$store.commit('changeMutation') // 触发mutations对应的change
    },
    changeA() {
      // this.$store.dispatch('a/change')
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
