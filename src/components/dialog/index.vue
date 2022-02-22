<!--
 * @Author: jiu yin
 * @Date: 2021-10-12 09:31:09
 * @LastEditTime: 2021-10-13 19:10:09
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \weixinmini-school\src\components\dialog\index.vue
 * jiu
-->
<template>
  <!-- 对话框 -->
  <view class="dialog">
    <view class="shade"></view>
    <view class="box">
      <image :src="imgUrl"></image>
      <text class="title">{{ title }}</text>
      <text class="body">{{ body }}</text>
      <button class="but" @click="but">知道了</button>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "提示",
    },
    body: {
      type: String,
      default: "尾款可以等开课后，到现场再缴费",
    },
    imgUrl: {
      type: String,
      default: "https://file.jiayu.world/image/weixinmini/blank.png",
    },
  },
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    but() {
      this.$emit("but");
    },
  },
  mounted() {},
};
</script>
<style scoped lang="scss">
.dialog {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  .shade {
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000000;
  }
  .box {
    text-align: center;
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -344rpx;
    margin-left: -300rpx;
    padding: 54rpx 68rpx 30rpx;
    background: #ffffff;
    border-radius: 30rpx;
    opacity: 1;
    image {
      width: 468rpx;
      height: 334rpx;
    }
    text {
      display: block;
      text-align: center;
    }
    .title {
      font-size: 36rpx;
      font-weight: 600;
      color: #333333;
      line-height: 86rpx;
    }
    .body {
      font-size: 30rpx;
      color: #333333;
    }
    .but {
      display: inline-block;
      width: 250rpx;
      height: 78rpx;
      background: #ef8236;
      border-radius: 40rpx;
      font-size: 32rpx;
      color: #ffffff;
      font-weight: 500;
      margin-top: 50rpx;
      font-family: PingFangSC, PingFangSC-Medium;
    }
  }
}
</style>
