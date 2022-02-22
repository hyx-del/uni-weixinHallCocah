<template>
  <view class="container page-bg fixed-page-large">
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="content">订单详情</block>
    </cu-custom>

    <view class="wrap" v-if="orderDetailsData">
      <view class="header-info" v-if="orderDetailsData.status">
        <!-- 支付完成 -->
        <view class="success">
          <image src="../../static/images/wallet.svg"></image>
          <view class="title">订单已完成</view>
        </view>
      </view>
      <!-- 取消支付 -->
      <view class="cancel" v-else>
        <image src="../../static/images/wallet.svg"></image>
        <view class="title">订单已取消</view>
      </view>

      <view class="order">
        <view class="order-details">
          <view class="header">
            <view class="order-number">
              <image src="../../static/images/order.svg"></image>
              <view>订单号：{{ orderDetailsData.id }}</view>
            </view>
          </view>
          <view class="body">
            <view class="img">
              <image :src="orderDetailsData.coverUrl" mode="aspectFill"></image>
            </view>
            <view class="synopsis">
              <view class="text">{{ orderDetailsData.name }}</view>
            </view>
          </view>
        </view>

        <view class="funds">
          <view class="title">{{ orderDetailsData.status ? "已支付" : "待支付" }}</view>
          <view class="price-item" v-for="(item, index) in orderItem" :key="index">
            <text>{{ item.typeName }}</text>
            <text>￥{{ item.total }}</text>
          </view>
          <view class="total">合计：￥{{ countAll() }}</view>
        </view>

        <view class="order-info">
          <view class="title">订单信息</view>
          <view class="list">支付方式：微信支付</view>
          <view class="list">创建时间：{{ orderDetailsData.createdAt }}</view>
        </view>
      </view>
    </view>

    <view class="footer">
      <view class="footer-wrap">
        <view class="cancel-order" v-if="orderDetailsData.status !== 10" @click="remove">删除订单</view>
        <view class="semester-details" @click="skipSemesterDetailsPage">学期详情</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      order_id: null,
      orderDetailsData: null,
      status: null,
      orderItem: [],
      timer: null,
      isEnd: false,
      options: {},
      SemesterDetails: {},
    };
  },

  computed: {
    ...mapState(["ossPath", "openId"]),
  },

  watch: {},

  onLoad(option) {
    this.options = option;
  },

  onShow() {
    this.getOrderDetailsData(this.options);
  },

  methods: {
    //页面详情
    getOrderDetailsData(info) {
      this.api.get("/api/school/order/pay/detail", info, { type: "other" }).then((res) => {
        this.orderItem = res.orderItemDetailVOS;
        this.orderDetailsData = res;
        let { orderMode } = this.options;
        this.SemesterDetails = {
          semester_id: res.mainCourseId,
          studentSemesterId: res.registerId,
          genre: orderMode == 10 ? true : false,
          genreSemester_id: res.semesterId,
          genrestudentSemesterId: res.registerId,
        };
      });
    },

    countAll() {
      let count = 0;
      this.orderItem.forEach((item) => {
        count += item.total;
      });
      return count.toFixed(2);
    },

    skipSemesterDetailsPage() {
      let { semester_id, studentSemesterId, genre, genreSemester_id, genrestudentSemesterId } = this.SemesterDetails;
      uni.navigateTo({
        url: "/coachPages/coach-train/semester-details/index?semester_id=" + semester_id + "&isSignUp=true&genre=" + genre + "&student_Semester_id=" + studentSemesterId + "&genreSemester_id=" + genreSemester_id + "&genreStudentSemesterId=" + genrestudentSemesterId,
      });
    },

    remove() {
      uni.showModal({
        content: "确定删除订单",
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            this.api.put("/api/school/order/pay/delete", this.options, { type: "other" }).then((res) => {
              if (res == "删除成功") {
                uni.showToast({
                  icon: "none",
                  title: "删除成功",
                });
                uni.navigateBack({
                  delta: 1,
                });
              } else {
                uni.showToast({
                  icon: "none",
                  title: res.msg,
                });
              }
            });
          }
        },
      });
    },

    nowPay() {
      const orderInfo = this.orderDetailsData.extra;
      uni.requestPayment({
        provider: "wxpay",
        timeStamp: orderInfo.timeStamp,
        signType: orderInfo.signType,
        paySign: orderInfo.paySign,
        package: orderInfo.package,
        nonceStr: orderInfo.nonceStr,
        success: (res) => {
          uni.navigateTo({
            url: "/coachPages/coach-train/pay-info/index?payInfo=1&type=0",
          });
        },
        fail: (error) => {
          uni.navigateTo({
            url: "/coachPages/coach-train/pay-info/index?payInfo=2",
          });
        },
      });
    },
  },

  destroyed() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="scss">
.wrap {
  flex: 1;
}
.no-payment {
  display: flex;
  background: linear-gradient(270deg, #ffa735, #f67b25);
  padding: 36upx 120upx 36upx 100upx;
  justify-content: space-between;

  .pay-time {
    color: #ffffff;
    font-weight: 400;

    .title {
      line-height: 42upx;
      font-size: 30upx;
    }

    .count-down {
      font-size: 24upx;
      line-height: 33upx;
      margin-top: 8upx;
    }
  }

  image {
    height: 87upx;
    width: 103upx;
  }
}

.cancel {
  display: flex;
  padding: 36upx 120upx 36upx 36upx;
  align-items: center;
  color: #ffffff;
  background: #919da7;
  .title {
    text-indent: 40rpx;
    font-size: 32rpx;
  }
  image {
    height: 87upx;
    width: 103upx;
  }
}

.success {
  display: flex;
  background: linear-gradient(270deg, #ffa735, #f67b25);
  padding: 36upx 120upx 36upx 36upx;
  align-items: center;
  color: #ffffff;
  .title {
    text-indent: 40rpx;
    font-size: 32rpx;
  }
  image {
    height: 87upx;
    width: 103upx;
  }
}

.order {
  padding: 32upx 32upx 0 32upx;
  .order-details {
    background: #ffffff;
    border-radius: 20upx;
    padding: 32upx;
    margin-bottom: 32upx;

    .header {
      display: flex;
      .order-number {
        display: flex;
        align-items: center;
        image {
          height: 40upx;
          width: 32upx;
          margin-right: 12upx;
        }

        view {
          font-size: 28upx;
          // font-weight: bold;
          color: #222527;
        }
      }
    }

    .body {
      margin-top: 24upx;
      display: flex;
      .img {
        width: 180upx;
        height: 180upx;
        background: #cccccc;
        border-radius: 8upx;

        image {
          width: 100%;
          height: 100%;
          border-radius: 8upx;
        }
      }

      .synopsis {
        flex: 1;
        margin-left: 24upx;
        padding: 8upx 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .text {
          font-size: 28upx;
          color: #222527;
          font-weight: 400;
          line-height: 42upx;
        }

        .price {
          color: #ff0000;
          font-size: 600;
          font-size: 36upx;
          line-height: 50upx;
        }
      }
    }
  }
}

.funds,
.order-info {
  margin-bottom: 32upx;
  border-radius: 20upx;
  background: #ffffff;
  padding: 32upx;

  .title {
    font-size: 32upx;
    color: #222527;
    line-height: 48upx;
    margin-bottom: 20upx;
  }

  .price-item {
    margin-bottom: 20upx;
    display: flex;
    justify-content: space-between;
    font-size: 28upx;
    color: #222527;
    align-items: center;
  }

  .total {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 32upx;
    font-weight: 600;
    color: #ff5500;
  }

  // 订单信息
  .list {
    font-size: 28upx;
    line-height: 40upx;
    color: #666666;
    font-weight: 400;
  }

  .list:first-of-type {
    margin-bottom: 16upx;
  }
}

.footer-wrap {
  height: 114upx;
  background: #ffffff;
  padding: 24upx 0;
  display: flex;
  justify-content: flex-end;

  .pay,
  .semester-details,
  .cancel-order {
    font-size: 28upx;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 168upx;
    height: 66upx;
    border-radius: 33upx;
    color: #6666;
    border: 2upx solid #cfcfcf;
    margin-right: 24upx;
    font-weight: 300;
    line-height: 40px;
  }
  .pay {
    border: 2upx solid #f08336;
    color: #f67b25;
  }
}

.fixed-page-large {
  padding-bottom: 114upx;
  padding-bottom: calc(constant(safe-area-inset-bottom) + 114upx);
  padding-bottom: calc(env(safe-area-inset-bottom) + 114upx);
}
</style>
