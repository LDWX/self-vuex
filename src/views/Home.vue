<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    {{test}}

  </div>
</template>

<script>

export default {
  name: 'home',
  data() {
    return {
    }
  },
  computed: {
    test() {
      return this.$store.state.testValue
    }
  },
  mounted() {
    // this.test = this.$store.state.testValue
  }
 
}
</script>
