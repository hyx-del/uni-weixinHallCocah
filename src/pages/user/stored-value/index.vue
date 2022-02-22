<template>
  <view class="container">
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="content">我的余额</block>
    </cu-custom>
    <view class="stored-wrap">
      <view class="money-icon">
        <image src="/static/images/money.svg" />
      </view>
      <view class="account">账户余额</view>
      <view class="money-wrap">
        <text class="unit">￥</text>
        <view class="total">{{ account.balance || "0.00" }}</view>
      </view>
      <view class="stored-detail" @tap="skipDetailPage">
        <text style="margin-right: 8upx">余额明细</text>
        <view class="cuIcon-right right-icon"></view>
      </view>
    </view>
    <view class="btns-wrap">
      <button class="cu-btn bg-primary mb24" @tap="skipRechargePage">
        充值
      </button>
      <!-- <button class="cu-btn bg-secondary" @tap="skipRefundPage">退款</button> -->
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      pageInit: true,
    };
  },
  computed: mapState(["memberId", "account"]),
  onLoad() {
    // this.getMemberInfo();
    this.$store.dispatch("getAccountInfo");
  },
  onShow() {
    if (this.pageInit) {
      this.pageInit = false;
      return;
    }
    // this.getMemberInfo();
    this.$store.dispatch("getAccountInfo");
  },
  methods: {
    getMemberInfo() {
      this.api
        .post("member/member/account/detail", { member_id: this.memberId })
        .then((data) => {
          this.account = data;
          this.$store.commit("setAccount", data);
        });
    },
    skipRechargePage() {
      uni.navigateTo({
        url: "/pages/user/recharge/index",
      });
    },
    skipRefundPage() {
      uni.navigateTo({
        url: "/pages/user/refund/index",
      });
    },
    skipDetailPage() {
      uni.navigateTo({
        url: "/pages/user/recharge-detail/index",
      });
    },
  },
};
</script>

<style lang="scss">
.stored-wrap {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  padding: 100upx 0 160upx 0;
}
.money-icon {
  width: 100upx;
  height: 100upx;
  border-radius: 50%;
  overflow: hidden;
  image {
    width: 100%;
    height: 100%;
  }
}
.account {
  margin-top: 60upx;
  color: #222527;
}
.money-wrap {
  margin-top: 24upx;
  color: #222527;
  display: flex;
  align-items: flex-start;
  .unit {
    font-size: 48upx;
  }
  .total {
    font-size: 80upx;
  }
}
.stored-detail {
  margin-top: 60upx;
  color: #f08336;
  display: flex;
  align-items: center;
  padding: 0 16upx;
}
.btns-wrap {
  padding: 0 175upx;
  button {
    width: 100%;
    border-radius: 20upx;
    height: 100upx;
    line-height: 1;
    font-size: 32upx;
  }
  .bg-primary {
    background: #f08336;
    color: white;
  }
  .bg-secondary {
    background: rgba(#f08336, 0.1);
    color: #f08336;
  }
}
.mb24 {
  margin-bottom: 24upx;
}
</style>
