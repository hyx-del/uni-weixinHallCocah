<template>
  <WebView :src="url"></WebView>
</template>

<script>
/*
  * 加载其他网站的页面
  * */

export default {
  data () {
    return {
      url:''
    }
  },
  onLoad(options) {
    this.url =options.url||'';
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
