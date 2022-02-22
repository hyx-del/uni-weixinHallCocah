<template>
  <view class="cu-modal auth-modal" :class=" isVisible ?'show':''">
      <view class="cu-dialog">
        <view class="image-wrap">
          <image src="/static/images/auth.svg" mode="widthFix" />
        </view>
        <view class="modal__name">您还未登录</view>
        <view class="modal__desc">请先登录后再进行操作</view>
        <view class="btn-wrapper">
          <view class="default-btn" @click="noLogin">暂不登录</view>
          <button open-type="getUserInfo" @getuserinfo="onGetUserInfo" class="primary-btn">立即登录</button>
        </view>
      </view>
    </view>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
  },

  methods: {
    noLogin() {
      this.$emit('cancel',false)
    },

    onGetUserInfo(event) {
      if (event.detail.userInfo) {
        this.$store.commit("setIsAuth", true);
        this.$store.dispatch("getToken", true);
      }
      this.$emit('cancel',false)
    },
  }
}
</script>

<style lang="scss">
.cu-modal.auth-modal {
    background: rgba(#000000, 0.6);
    text-align: center;
}
.auth-modal {
  z-index: 9999999999;
  .cu-dialog {
    padding-top: 0;
    padding-bottom: 80upx;
    width: 560upx;
    border-radius: 20upx;
    background-color: white;
  }
  .image-wrap {
    padding: 0 54upx;
    image {
      width: 100%;
    }
  }
  .modal__name {
    font-size: 36upx;
    color: rgba(#000000, 0.85);
    margin-bottom: 16upx;
    margin-top: 40upx;
  }
  .modal__desc {
    font-size: 30upx;
    color: #888888;
  }
  .btn-wrapper {
    display: flex;
    padding: 0 52upx;
    margin-top: 70upx;
  }
  .default-btn {
    flex: 1;
    height: 80upx;
    border-radius: 12upx;
    margin-right: 40upx;
    border: 2upx solid #f08336;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32upx;
    color: #f08336;
  }
  .primary-btn {
    flex: 1;
    font-size: 28upx;
    padding: 0;
    height: 80upx;
    border-radius: 12upx;
    background-color: #f08336;
    border: 2upx solid #f08336;
    color: white;
    display: flex;
    align-items: center;
    font-size: 32upx;
    justify-content: center;
    &::after {
      border: none;
    }
  }
}
</style>