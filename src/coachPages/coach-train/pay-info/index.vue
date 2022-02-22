<template>
  <view class="container page-bg">
    <cu-custom bgColor="bg-white" :backUrl="backUrl" :isBack="true"></cu-custom>
    <view class="pay-info">
      <image src="https://file.jiayu.world/image/weixinmini/paySucc.png" class="img" v-if="data.payInfo == 1"></image>
      <image src="https://file.jiayu.world/image/weixinmini/payFail.png" class="img" v-else></image>
      <view class="success">{{ data.payInfo == 1 ? "支付成功" : "支付失败" }}</view>
      <text class="text">{{ data.payInfo == 1 ? "支付完成，点击按钮查看详情" : "出错啦，请点击「重新支付」，再试一次" }}</text>
      <view class="btn">
        <button class="look buts" @click="look">返回主页</button>
        <button class="back-home buts" @click="backHome" v-if="data.payInfo == 1">查看详情</button>
        <button class="back-home buts" @click="newPay" v-else>重新支付</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      backUrl:""
    };
  },

  onLoad(option) {
    console.log(option.option);
    this.data = JSON.parse(option.option);
    this.backUrl="/coachPages/coach-train/my-sign-up/index?genre=" +this.data.genre
  },

  methods: {
    //我的主页
    look() {
      uni.navigateTo({
        url: "/coachPages/coach-train/my-coach-train/index?isRegister=true",
      });
    },
    //详情
    backHome() {
      uni.navigateTo({
        url: "/coachPages/coach-train/my-sign-up/index?genre=" + this.data.genre,
      });
    },

    //重新支付
    newPay() {
      let { semester_id, studentSemesterId, genre, genreSemester_id, genrestudentSemesterId } = this.data;
      console.log(this.data);

      let isSignUpData = {
        mainCourseId: semester_id,
        semesterId: genreSemester_id,
        student_mainCourseId: studentSemesterId,
        student_SemesterId: genrestudentSemesterId,
        genre: genre,
      };
      uni.navigateTo({
        url: "/coachPages/coach-train/cashier-desk/index?data=" + JSON.stringify(isSignUpData),
      });
    },
  },
};
</script>

<style lang="scss">
.container {
  background: #ffffff;
}
.pay-info {
  height: 100%;
  padding: 0 80rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .img {
    display: block;
    margin: 72rpx 0 56rpx 56rpx;
    width: 220rpx;
    height: 226rpx;
  }
  .success {
    font-size: 36rpx;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: center;
    color: #333333;
    padding: 56rpx 0 32rpx;
  }
  .text {
    display: block;
    text-align: center;
    font-size: 28rpx;
    font-family: PingFangSC, PingFangSC-Regular;
    color: #666666;
  }
  .btn {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    .buts {
      width: 272rpx;
      height: 78rpx;
      border-radius: 44rpx;
      margin-top: 80rpx;
      line-height: 78rpx;
      text-align: center;
      font-size: 32rpx;
      font-weight: 600;
    }
    .look {
      background: #ffffff;
      border: 1px solid #ef8236;
      color: #ef8236;
    }
    .back-home {
      background: #ef8236;
      color: #ffffff;
    }
  }
}
</style>
