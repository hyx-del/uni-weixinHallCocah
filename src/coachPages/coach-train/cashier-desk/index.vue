<template>
  <view class="container page-bg fixed-page-large">
    <cu-custom bgColor="bg-white" :isBack="true" backUrl="/coachPages/coach-train/home/index">
      <block slot="content">收银台</block>
    </cu-custom>
    <!-- <view class="wrap" v-if="details"> -->
    <view class="wrap" v-if="details.orderItems">
      <view class="header-info">
        <!-- 等待支付 -->
        <view class="no-payment">
          <image src="../../static/images/wallet.svg"></image>
          <view class="pay-time">
            <view class="title">等待报名支付中</view>
            <view class="count-down" v-if="details.isCountdown">{{ endTime }}后订单将自动关闭</view>
            <view class="count-down" v-else>报名成功，请支付尾款</view>
          </view>
        </view>
      </view>

      <!-- 信息 -->
      <view class="info">
        <text class="info-title">核对报名信息</text>
        <view class="info-content" v-if="genre">
          <view class="semester">
            <text class="title">学期</text>
            <text class="name">{{ details.name }}</text>
          </view>
          <view class="school">
            <text class="title">校区</text>
            <text class="name">{{ details.schoolName }}</text>
          </view>
          <view class="time">
            <text class="title">报名时间</text>
            <text class="time-scope">{{ details.trainStartTime }}~{{ details.trainEndTime }}</text>
          </view>
        </view>

        <view class="info-content" v-else>
          <view class="semester">
            <text class="title">全面课程</text>
            <text class="name">{{ details.name }}</text>
          </view>
          <view class="school">
            <text class="title">培训有效期</text>
            <text class="name">{{ details.trainValidDay }}天</text>
          </view>
        </view>
      </view>
      <!-- total: 100
type: 10
typeName: "定金" 类型:10定金 20学费 30住宿费 40押金 50:分红 60：餐费 -->
      <!-- 相关费用 -->
      <view class="cost">
        <view class="cost-details">
          <label v-for="(item, index) in costList" :key="item.typeName" class="checkbox-item" @click="checked(item, index)">
            <view class="checkbox-group">
              <view :class="['checkbox', item.checked ? ' checked' : '', item.type == 10 ? 'disabled' : '']"></view>
              <text>{{ item.typeName }}</text>
            </view>
            <text>￥{{ item.total }}</text>
          </label>
        </view>

        <view class="total" v-if="countPrice">
          <!-- 合计：￥{{(details.register_mode == 10 && detail.to_paid_earnest > 0) ? total : countPrice}} -->
          合计：￥{{ countPrice }}
        </view>
      </view>

      <!-- 支付方式 -->
      <view class="pay-type">
        <text class="title">支付方式</text>
        <view class="type-select">
          <image src="/static/images/card/wechat.svg" mode="widthFix"></image>
          <text>微信支付</text>
        </view>
      </view>

      <!-- 优惠券 -->
      <!-- <view class="ticket">
				<text class="title">优惠券</text>
				<view class="ticket-sum">
				<text>￥100</text>
				</view>
			</view> -->
    </view>

    <!-- footer -->
    <view class="footer">
      <view class="footer-wrap">
        <view class="total">
          <view class="total-price">
            <text>合计：</text>
            <view class="price">
              <text class="unit">￥</text>
              <text class="sum" v-if="countPrice">{{ countPrice }}</text>
            </view>
          </view>
          <!-- <text class="discounts">已优惠￥100</text> -->
        </view>
        <button class="submit" @click="submit">提交</button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      semester_id: null,
      semesterIds: null,
      salesmanList: [],
      details: null,
      costList: [],
      tuition: null,
      debounce: true,
      countPrice: null, // 全款总计价格
      isSignUp: false,
      studentSemesterId: null,
      student_SemesterId: null,
      //判断学期还是全面
      genre: null,
      isEnd: false,
      timer: null,
      //当前时间
      now: new Date().getTime(),
      //结束时间
      endTime: "00分00秒",
      costListFil: [],
      allId: {},
    };
  },

  onLoad(option) {
    //学期ID 报名ID 是全面还是学期报名
   let _data= decodeURIComponent(option.data)
    let data = JSON.parse(_data);
    let { mainCourseId, semesterId, student_mainCourseId, student_SemesterId, genre, isSignUp } = data;
    //全面学期id
    this.semester_id = mainCourseId;
    this.semesterIds = semesterId;
    //是否流派
    this.genre = genre;
    this.isSignUp = isSignUp;
    // 全面学期报名id
    this.studentSemesterId = student_mainCourseId;
    this.student_SemesterId = student_SemesterId;
    this.getDetail();
    //appid
    const accountInfo = uni.getAccountInfoSync();
    console.log(accountInfo.miniProgram.appId, "APPID");
    //openid
    this.api.get("/app/api/user/grant/info", {}, { type: "other" }).then((res) => {
      this.allId = res;
    });
  },

  computed: {
    ...mapState(["openId", "appId", "currentMemberId"]),

    async orderCountDown() {},

    // total() { // 定金的总计
    //     if (this.costList) {
    //         let sum = 0
    //         this.costList.forEach(item => {
    //             sum += parseFloat(item.price);
    //         });

    //         return sum.toFixed(2)
    //     }
    // },

    // getSumPrice() { // 计算定金总计
    //     if (!this.details) {
    //         return;
    //     }

    //     let data = Object.assign({}, this.details);
    //     if (data.register_mode = 10) { // 定金模式
    //         if (data.to_paid_earnest > 0) { // 定金未付
    //             return data.to_paid_earnest
    //         }
    //     }
    // }
  },
  watch: {
    //倒计时
    async now(newValue, oldValue) {
      const data = await this.details;
      if (data) {
        //15分钟 -时间差
        const newTime = new Date().getTime();
        //报名时
        let a = data.countdownDate.replace(/-/g, "/");
        const countdownDate = new Date(a).getTime();
        const M15 = parseInt(15 * 60 * 1000);
        //倒计时
        const interval = M15 - (newTime - countdownDate).toFixed(0);
        console.log(interval);
        const mins = new Date(interval).getMinutes();
        const ss = new Date(interval).getSeconds();
        // console.log(mins, ss, "分秒");倒计时判断0为尾款
        if (interval <= 0 && data.isCountdown == 1) {
          clearInterval(this.timer);
          this.endTimeNav();
          return;
        } else {
          this.endTime = this.prefixInteger(mins) + "分" + this.prefixInteger(ss) + "秒";
        }
      }
    },
  },
  methods: {
    openTimer() {
      this.timer = setInterval(() => {
        this.now = new Date().getTime();
      }, 1000);
    },
    prefixInteger(time) {
      let str = time + "";
      return str.padStart(2, 0);
    },
    //z支付时间过期去详情
    endTimeNav() {
      uni.showModal({
        title: "支付时间过期，请重新下单",
        confirmText: "去下单",
        showCancel: false,
        success: () => {
          //跳转详情
          uni.redirectTo({
            url: "/coachPages/coach-train/semester-details/index?semester_id=" + this.semester_id + "&isSignUp=false&genre=" + this.genre + "&student_Semester_id=" + this.studentSemesterId + "&genreSemester_id=" + this.semesterIds + "&genreStudentSemesterId=" + this.student_SemesterId,
          });
        },
      });
    },

    salesmanChange(event) {
      this.salesmanIndex = event.detail.value;
    },

    // 支付信息
    getDetail() {
      let params = {
        id: this.genre ? this.student_SemesterId : this.studentSemesterId,
      };
      if (this.currentMemberId) {
        params.student_id = this.currentMemberId;
      }
      this.api.get(this.genre ? "/api/school/order/pay/payment/detail" : "/api/school/mainorder/payment/detail", params, { type: "other" }).then((res) => {
        this.details = res || {};
        if (this.details.code == 1) {
          this.endTimeNav();
        } else {
          console.log(res, "费用明细");
          this.costList = res.orderItems;
          //默认第一项选中
          this.costList[0].checked = true;
          this.costListFil = this.costList.filter((item) => {
            item.checked;
          });
          //合计
          this.setCountPrice();
          this.openTimer();
        }
      });
    },

    //提交  TODO  为什么必须要同步，而且在同步里面  对线程有操作？  setTimeout
    async submit() {
      if (!this.debounce) return;
      this.debounce = false;
      let params = {
        //报名id
        id: this.studentSemesterId,
        studentSemesterId: this.student_SemesterId,
        //合计金额
        actualTotal: this.countPrice,
        openid: this.allId.openid,
        //选择款项
        orderItemList: this.costListFil,
      };
      this.api
        .post(this.genre ? "/api/school/order/pay/created" : "/api/school/mainorder/created", params, { type: "other" })
        .then((res) => {
          let genre = this.details.detailModel == 10 ? true : false;
          let option = {
            //全面学期id
            semester_id: this.semester_id,
            //全面报名
            studentSemesterId: this.studentSemesterId,
            genreSemester_id: this.semesterIds,
            genrestudentSemesterId: this.student_SemesterId,
            genre: genre,
          };
          uni.requestPayment({
            provider: "weixin",
            nonceStr: res.nonceStr,
            appId: res.appId,
            timeStamp: res.timeStamp,
            signType: res.signType,
            paySign: res.paySign,
            package: res.package,
            nonceStr: res.nonceStr,
            success: (res) => {
              option.payInfo = 1;
              this.debounce = true;
              clearInterval(this.timer);
              uni.redirectTo({
                url: "/coachPages/coach-train/pay-info/index?option=" + JSON.stringify(option),
              });
            },
            fail: (error) => {
              this.debounce = true;
              option.payInfo = 2;
              clearInterval(this.timer);
              uni.redirectTo({
                url: "/coachPages/coach-train/pay-info/index?option=" + JSON.stringify(option),
              });
            },
          });
        })
        .catch((err) => {
          this.debounce = true;
          uni.showToast({
            icon: "none",
            title: "创建订单失败",
          });
        });
    },

    checked(item, index) {
      if (index == 0) {
        return;
      }
      item.checked = !item.checked;
      this.setCountPrice();
    },

    setCountPrice() {
      // 计算全款总计
      this.countPrice = 0;
      this.costList.forEach((item) => {
        if (item.checked) {
          this.countPrice += parseFloat(item.total);
        }
      });
      this.costListFil = this.costList.filter((item) => {
        return item.checked == true;
      });
      this.countPrice = this.countPrice.toFixed(2);
    },
  },
  beforeDestroy() {
    console.log("销毁之前");
    clearInterval(this.timer);
  },
  onHide() {
    console.log("隐藏");
    clearInterval(this.timer);
  },
};
</script>

<style lang="scss">
.wrap {
  padding: 32upx;
  .no-payment {
    width: 100%;
    display: flex;
    background: linear-gradient(270deg, #ffa735, #f67b25);
    padding: 36upx 120upx 36upx 30upx;
    .pay-time {
      color: #ffffff;
      font-weight: 400;
      margin-left: 40rpx;
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
  .info {
    border-radius: 20upx;
    background: #ffffff;
    margin-bottom: 24upx;
    padding: 32upx;
    .info-title {
      font-size: 34upx;
      color: #222527;
      font-weight: 600;
    }
    .info-content {
      margin-top: 22upx;
      .semester,
      .school,
      .time {
        > .title {
          color: #636f7c;
          font-size: 30upx;
          font-weight: 400;
        }
        > .name,
        .time-scope {
          margin-left: 24upx;
          color: #222527;
          font-size: 30upx;
        }
      }
      .school,
      .time {
        margin-top: 16upx;
      }
    }
  }

  .cost {
    padding: 32upx;
    margin-bottom: 24upx;
    border-radius: 20upx;
    background: #ffffff;

    .cost-details {
      font-size: 30upx;
      font-weight: 400;
      color: #222527;
      .checkbox-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16upx;
        .checkbox-group {
          display: flex;
          align-items: center;
          .checkbox {
            width: 38upx;
            height: 38upx;
            border: 1px solid #d0d0d0;
            border-radius: 100%;
            margin-right: 16upx;
          }
          .checked {
            height: 38upx;
            width: 38upx;
            margin-right: 16upx;
            background: #f67b25;
            border-radius: 100%;
            border: 3upx solid #f67b25;
            display: flex;
            justify-content: center;
            align-items: center;
            &::before {
              font-family: "cuIcon";
              content: "\e645";
              color: #ffffff;
            }
          }

          .disabled {
            opacity: 0.45;
          }
        }
      }
    }

    .total {
      display: flex;
      justify-content: flex-end;
      font-size: 34upx;
      font-weight: 600;
      color: #222527;
    }

    .earnest-explain {
      color: #ff5500;
      font-weight: 400;
      font-size: 30upx;
      margin-top: 24upx;
    }
  }

  .market,
  .pay-type,
  .ticket {
    padding: 32upx;
    margin-bottom: 24upx;
    border-radius: 20upx;
    background: #ffffff;
    display: flex;
    justify-content: space-between;

    .title {
      font-size: 30upx;
      color: #222527;
      font-weight: 400;
    }

    .type-select {
      display: flex;
      align-items: center;
      font-size: 29upx;
      color: #222527;
      font-weight: 400;
      image {
        width: 42upx;
        height: 37upx;
        margin-right: 16upx;
      }
    }

    .ticket-sum {
      font-size: 30upx;
      color: #ff0000;
    }
  }
}

.footer-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-height: 128upx;
  padding: 24upx 32upx;
  background: #ffffff;
  .total {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .total-price {
      display: flex;
      align-items: center;
      > text {
        font-size: 30upx;
        color: #222527;
      }
      .price {
        .unit {
          font-size: 28upx;
          font-weight: 500;
          color: #ff0000;
        }
        .sum {
          color: #ff0000;
          font-size: 48upx;
          font-weight: 600;
        }
      }
    }
    .discounts {
      font-size: 24upx;
      font-weight: 400;
      color: #999999;
      margin-top: 11upx;
    }
  }
  .submit {
    margin: 0;
    padding: 17upx 72upx 18upx 72upx;
    font-size: 32upx;
    background: #f67b25;
    border-radius: 40upx;
    color: #ffffff;
    line-height: 45upx;
  }
}
.fixed-page-large {
  padding-bottom: 128upx;
  padding-bottom: calc(constant(safe-area-inset-bottom) + 128upx);
  padding-bottom: calc(env(safe-area-inset-bottom) + 128upx);
}
</style>
