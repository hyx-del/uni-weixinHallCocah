<!--
 * @Author: jiu yin
 * @Date: 2021-09-22 11:23:48
 * @LastEditTime: 2022-02-17 15:44:57
 * @LastEditors: jiu yin zhen jing
 * @FilePath: \weixinmini-school\src\pages\course\reservation\index.vue
 * jiu
-->
<template>
   <view class="container page-bg fixed-page-large">
      <cu-custom bgColor="bg-white"
                 :isBack="true">
         <block slot="content">{{options.status==1?'课程预约':'课程排队'}}</block>
      </cu-custom>
      <view class="content-wrapper"
            v-if="course.coursePlanId">
         <view class="card">
            <view class="title">核对预约信息</view>
            <view class="info-item name-wrap">
               <view class="label">课程</view>
               <text class="course-name">{{ course.courseName }}</text>
            </view>
            <view class="labels"
                  v-if="course.arrayCourseLabel && course.arrayCourseLabel.length">
               <view class="label-item"
                     v-for="(label, index) in course.arrayCourseLabel"
                     :key="index">{{ label }}</view>
            </view>
            <view class="info-item">
               <view class="label">类型</view>
               <view class="value">{{ courseTypes[course.courseType] }}</view>
               <!-- <view class="value">团课</view> -->
            </view>
            <view class="info-item">
               <view class="label">时间</view>
               <view class="value">{{ course.courseTime }}</view>
            </view>
            <view class="info-item">
               <view class="label">地点</view>
               <!-- <view class="value">朝阳区西大望路3号蓝堡国际2座16层（近新光天地）</view> -->
               <!-- 58 -> 线上实授课门店id  -->
               <!-- <view class="value" v-if="course.hall_id == 58">{{ course.city_name || '线上' }} {{ course.hall_name }}</view> -->
               <view class="value">{{ course.address }}</view>
            </view>
            <button class="contact-btn"
                    open-type="contact">
               <image class="img"
                      src="/static/images/contact.svg" />
               <text>在线客服</text>
            </button>
         </view>

         <view class="card remark-card">
            <view class="remark-wrapper">
               <view class="label">备注</view>
               <view style="flex: 1"
                     class="input-wrap">
                  <input class="input"
                         @input="remarkChange"
                         placeholder="（选填）" />
               </view>
            </view>
         </view>

         <view class="pay-card">
            <radio-group class="block"
                         @change="payChannelChange">
               <view class="pay-list menu text-left">
                  <view class="pay-item"
                        v-if="paymentModes.length">
                     <label class="flex justify-between align-center">
                        <view class="image">
                           <image src="../../../static/images/card/class-card.svg"
                                  mode="widthFix" />
                        </view>
                        <view class="label">课程卡</view>
                        <view class="value">{{ paymentModes[payType].name }}</view>
                        <radio class="bg-primary round"
                               :class="{ checked: payChannelIndex == 0, disabled: disabled }"
                               :checked="payChannelIndex == 0 ? true : false"
                               :value="0"
                               :disabled="disabled"></radio>
                     </label>
                     <view class="other">
                        <view class="handle-link"
                              @click="showPayModal">
                           <text>选择其他课程卡</text>
                           <view class="icon cuIcon-right right-icon"></view>
                        </view>
                     </view>
                  </view>
                  <view class="pay-item"
                        v-else-if="courseCardLoading">
                     <label class="flex justify-between align-center">
                        <view class="image">
                           <image src="../../../static/images/card/class-card.svg"
                                  mode="widthFix" />
                        </view>
                        <view class="label">课程卡</view>
                        <view class="value"
                              style="color: #ccc">暂无课程卡</view>
                        <view class="y-radio"></view>
                     </label>
                     <!--  v-if="!defaultPayMode.length" -->
                     <view class="other-tip">如需购买课程卡，请联系您的会籍顾问或点击右上角"在线客服"咨询。</view>
                  </view>
                  <view class="pay-item"
                        v-for="(item, index) in defaultPayMode"
                        :key="index">
                     <label class="flex justify-between align-center">
                        <view class="image">
                           <image :src="item.icon"
                                  mode="widthFix" />
                        </view>
                        <view class="label">{{ item.name }}</view>
                        <!-- 这一行是占位 -->
                        <view class="value"></view>
                        <radio class="bg-primary round"
                               :class="{checked: payChannelIndex == item.index,disabled: disabled,}"
                               :checked="payChannelIndex == item.index ? true : false"
                               :value="item.index"
                               :disabled="disabled"></radio>
                     </label>
                     <view class="other"
                           v-if="item.channel == 20">
                        <view style="margin-right: 8upx">余额</view>
                        <view style="margin-right: 8upx">￥{{ account.balance || "0.00" }}</view>
                        <view class="handle-link"
                              @click="skipRechargePage">
                           <text>充值</text>
                           <view class="icon cuIcon-right right-icon"></view>
                        </view>
                     </view>
                  </view>
               </view>
            </radio-group>
         </view>

         <view class="card">
            <view class="order-info__item">
               <view class="label">预约人数</view>
               <view class="number">
                  <view class="yicon icon-minus-circle"
                        @click="onMinus"></view>
                  <view class="total">
                     <text>{{ currentNumber }}</text>
                     <text class="unit">/{{ maxNumber }}人</text>
                  </view>
                  <view class="yicon icon-plus-circle"
                        @click="onPlus"></view>
               </view>
            </view>
            <view class="order-info__item coupon-wrap"
                  v-if="!hasCourseCard">
               <view class="label">优惠券</view>
               <view class="value coupon"
                     @click="skipCouponsPage(1)">
                  <view class="no-card"
                        v-if="checkedCardCoupons.length">不可使用优惠券</view>
                  <view class="money-wrap"
                        v-else-if="checkedCoupons.length">
                     <view class="unit">-￥</view>
                     <view class="money">{{ couponTotal }}</view>
                  </view>
                  <view class="tag"
                        v-else-if="couponsList.length">{{ couponsList.length }}张可用</view>
                  <view class="no-card"
                        v-else>无可用优惠券</view>
               </view>
               <view class="icon cuIcon-right right-icon"></view>
            </view>

            <view class="order-info__item coupon-wrap">
               <view class="label">联卡券</view>
               <view class="value coupon"
                     @click="skipCouponsPage(2)">
                  <view class="no-card"
                        v-if="checkedCoupons.length">不可使用联卡券</view>
                  <view class="money-wrap"
                        v-else-if="checkedCardCoupons.length">
                     <!-- <view class="unit">-￥</view> -->
                     <view class="coupon_name">{{
                checkedCardCoupons[0].coupon_name
              }}</view>
                  </view>
                  <view class="tag"
                        v-else-if="cardCouponList.length">{{ cardCouponList.length }}张可用</view>
                  <view class="no-card"
                        v-else>无可用联卡券</view>
               </view>
               <view class="icon cuIcon-right right-icon"></view>
            </view>
         </view>

         <view class="card">
            <view class="title">温馨提示</view>
            <view style="color: 484f55">开课前1小时以上可以取消预约，支持退款</view>
         </view>
      </view>

      <view class="cu-modal bottom-modal"
            :class="payModalVisible ? 'show' : ''"
            @tap="hideModal">
         <view class="cu-dialog"
               @tap.stop="">
            <view class="cu-bar bg-white justify-end">
               <view class="content">选择课程卡</view>
               <view class="action"
                     @tap="hideModal">
                  <text class="cuIcon-close"></text>
               </view>
            </view>
            <view>
               <scroll-view scroll-y
                            style="height: 200px">
                  <radio-group class="block"
                               @change="payCardChange">
                     <view class="cu-list menu text-left">
                        <view class="cu-item"
                              v-for="(item, index) in paymentModes"
                              :key="index">
                           <label class="flex justify-between align-center flex-sub">
                              <view class="card-image">
                                 <image :src="item.image" />
                              </view>
                              <view class="flex-sub">{{ item.courseCardName }}</view>
                              <view class="card-no">{{ item.memberCourseCardId || "" }}</view>
                              <radio class="bg-primary round"
                                     :class="payType == index ? 'checked' : ''"
                                     :checked="payType == index ? true : false"
                                     :value="index"></radio>
                           </label>
                        </view>
                     </view>
                  </radio-group>
               </scroll-view>
            </view>
         </view>
      </view>

      <view class="footer">
         <view class="pay-footer-wrap">
            <view class="text"
                  v-if="!errorMessage">
               <view class="label">合计：</view>
               <view class="total"
                     v-if="checkedCardCoupons.length">￥0</view>
               <view class="total"
                     v-else-if="hasCourseCard">
                  {{ payTimes || 0 }}
                  <text class="unit"
                        v-if="payTimes">次</text>
               </view>
               <view class="total"
                     v-else>
                  <text class="unit">￥</text>{{ total || 0 }}
               </view>
               <view class="discount-wrap"
                     v-if="!hasCourseCard && checkedCoupons.length">
                  已优惠￥{{ discountTotal }}
               </view>
            </view>
            <view class="text"
                  v-else>
               <view class="error">{{ errorMessage }}</view>
            </view>
            <view class="confirm-btn"
                  :class="errorMessage ? 'disabled' : ''"
                  @click="submitOrder">提交订单</view>
         </view>
      </view>
   </view>
</template>

<script>
   import { mapState } from "vuex";
   export default {
      data() {
         return {
            payModalVisible: false,
            payType: 0,
            payChannelIndex: 0,
            paymentModes: [],
            defaultPayMode: [
               // { name: '余额支付', channel: 20, icon: "../../../static/images/money.svg", index: 1, },
               // { name: '微信支付', channel: 30, icon: "../../../static/images/card/wechat.svg", index: 2, }
            ],
            maxNumber: 0,
            currentNumber: 1,
            course: {
               type: 1,
            },
            courseTypes: {
               1: "团课",
               2: "私教课",
               3: "企业课",
            },
            num: 0,
            total: 0,
            couponTotal: 0,
            payTimes:0,
            checkedCoupons: [],
            couponsList: [],
            hasCourseCard: false,
            errorMessage: "",
            pageInit: true,
            courseCardImageNum: 6,
            hasRecharge: false,
            remark: "",
            courseCardLoading: false,
            discountTotal: null,
            isCreateOrder: false,
            checkedCardCoupons: [],
            cardCouponList: [],
            disabled: false,
            options: {},
         };
      },
      computed: {
         ...mapState(["memberId", "openId", "account", "appId"]),
      },
      onLoad(options) {
         console.log("options", options);
         this.options = options;
         this.api
            .get(
               "/api/hall/course/plan/payment",
               { coursePlanId: options.id },
               this.$other
            )
            .then((ret) => {
               let arr = [];
               if (ret.balancePrice || ret.balancePrice === 0) {
                  arr.push({
                     name: "余额支付",
                     channel: 20,
                     icon: "../../../static/images/money.svg",
                     index: 1,
                  });
               }
               if (ret.price || ret.price === 0) {
                  arr.push({
                     name: "微信支付",
                     channel: 30,
                     icon: "../../../static/images/card/wechat.svg",
                     index: arr.length ? 2 : 1,
                  });
               }
               this.defaultPayMode = arr;

               // if (ret.arrayCourseLabel) {
               //    ret.arrayCourseLabel = ret.arrayCourseLabel[0].split(" ");
               // }
               this.course = ret;
               this.maxNumber = parseInt(ret.maxOrder - ret.hasOrder);
               this.getCourseCardList(ret.appPaymentCourseCardsVOS);
               uni.setStorageSync("courseStore", ret);
               this.getCouponsList(ret);
               this.getCourseCardCouponList(ret);
            });
         this.$store.dispatch("getAccountInfo");
      },
      onShow() {
         if (this.hasRecharge) {
            this.hasRecharge = false;
            this.$store.dispatch("getAccountInfo");
         }
         if (this.pageInit) {
            this.pageInit = false;
            return;
         }
         if (this.checkedCardCoupons.length) {
            // 有使用联卡券 限制只能预约一个人
            this.maxNumber = 1;
            this.currentNumber = 1;
            this.payChannelIndex = -1; //
            this.disabled = true;
         }
         console.log(
            "checkedCoupons=======>",
            this.checkedCoupons,
            this.checkedCardCoupons
         );
         this.priceCalc();
      },
      methods: {
         getCourseCardList(opts) {
            let options = opts || [];
            let imageIndex = 1;
            options.forEach((item) => {
               item.channel = 10; // 会员卡支付
               if (imageIndex > this.courseCardImageNum) {
                  imageIndex = 1;
               }
               item.image = `../../../static/images/card/card${imageIndex}.svg`;
               imageIndex++;
            });
            // this.paymentModes.unshift(...options);
            if (!options.length) {
               this.payChannelIndex = 1;
               this.hasCourseCard = false;
            } else {
               this.hasCourseCard = true;
            }

            this.paymentModes = options;
            this.courseCardLoading = true;
            this.setOrderMaxNumber();
            this.priceCalc();
         },
         getCouponsList(course) {
            let { couponType, courseId, coursePlanId } = course;
            let params = {
               couponType: 1,
               courseId,
               coursePlanId,
            };
            this.api
               .get("/api/hall/course/plan/member/coupon", params, this.$other)
               .then((data) => {
                  this.couponsList = data || [];
               });
         },

         getCourseCardCouponList(course) {
            let { couponType, courseId, coursePlanId } = course;
            let params = {
               couponType: 2,
               courseId,
               coursePlanId,
            };
            this.api
               .get("/api/hall/course/plan/member/coupon", params, this.$other)
               .then((data) => {
                  this.cardCouponList = data || [];
               });
         },
         // 1 -> 优惠券 2 -> 联卡券
         skipCouponsPage(type = 1) {
            if (type === 1 && this.checkedCardCoupons.length) {
               // 已选择联卡券， 不可选择
               return;
            } else if (type === 2 && this.checkedCoupons.length) {
               // 已选择优惠券， 不可选择联卡券
               return;
            }
            let ids = [];
            if (type == 1) {
               ids = this.checkedCoupons.map((item) => item.id);
            } else {
               ids = this.checkedCardCoupons.map((item) => item.relation_id);
            }
            let url = "/pages/user/coupons-selected/index?use_limit=1&type=" + type;
            if (ids.length) {
               url += "&ids=" + JSON.stringify(ids);
            }
            uni.navigateTo({
               url: url,
            });
         },
         skipRechargePage() {
            this.hasRecharge = true;
            uni.navigateTo({
               url: "/pages/user/recharge/index",
            });
         },

         async submitOrder() {
            if (this.errorMessage) {
               uni.showToast({
                  icon: "none",
                  title: this.errorMessage,
               });
               return;
            }
            if (this.isCreateOrder) return;

            let params = {
               coursePlanId: this.course.coursePlanId,
               quantity: this.currentNumber,
               orderType: this.options.status,
            };
            if (this.remark) {
               params.remark = this.remark;
            }

            if (this.checkedCardCoupons.length) {
               params.channel = 50//联卡卷
               params.memberCouponId = this.checkedCardCoupons[0].memberCouponId
            } else if (this.payChannelIndex == 0) {
               if (!this.paymentModes.length) {
                  return;
               }
               let currentPayment = this.paymentModes[this.payType];
               params.channel = currentPayment.channel;
               params.memberCourseCardId = currentPayment.memberCourseCardId;
            } else {
               let payment = this.defaultPayMode[parseInt(this.payChannelIndex) - 1];
               payment && (params.channel = payment.channel)
            }
            if (params.channel == undefined) return this.toFailPage('预约失败')
            //优惠券
            if (this.checkedCoupons[0]) {
               params.memberCouponId = this.checkedCoupons[0].id;
            }

            //openid
            let result = await this.api.get("/app/api/user/grant/info", {}, { type: "other" });
            params.openid = result.openid;
            params.appId = result.appid;
            console.log("params", params, this.paymentModes);

            this.isCreateOrder = true;

            this.api
               .post("/api/hall/course/plan/order/register", params, this.$other)
               .then((ret) => {
                  this.isCreateOrder = false;
                  if (!ret.code) {
                     if (!ret.coursePlanOrderId) {
                        let orderInfo = ret;
                        uni.requestPayment({
                           provider: "weixin",
                           // orderInfo: {}, //微信、支付宝订单数据
                           timeStamp: orderInfo.timeStamp,
                           signType: orderInfo.signType,
                           paySign: orderInfo.paySign,
                           package: orderInfo.package,
                           nonceStr: orderInfo.nonceStr,
                           success: (res) => {
                              this.toSuccessPage(ret.id);
                           },
                           fail: (err) => {
                              this.toFailPage("支付失败");
                           },
                        });
                     } else {
                        this.toSuccessPage(ret.id);
                     }
                  } else {
                     this.isCreateOrder = false;
                     this.toFailPage(ret.msg);
                  }
                  console.log(ret);
               });
         },
         toFailPage(message = "") {
            uni.showModal({
               content: message,
               showCancel: false,
            });
         },
         remarkChange(event) {
            this.remark = event.detail.value;
         },
         priceCalc() {
            let params = {
               coursePlanId: this.course.coursePlanId,
               quantity: this.currentNumber,
               orderType: this.options.status,
            };
            if (this.checkedCardCoupons.length) {
               params.channel = 50//联卡卷
               params.memberCouponId = this.checkedCardCoupons[0].memberCouponId
            } else if (this.payChannelIndex == 0) {
               //课程卡
               let currentPayment = this.paymentModes[this.payType];
               params.channel = currentPayment.channel;
               params.memberCourseCardId = currentPayment.memberCourseCardId;
            } else {
               console.log("===>", this.defaultPayMode, this.payChannelIndex);
               let payment = this.defaultPayMode[parseInt(this.payChannelIndex) - 1];
               payment && (params.channel = payment.channel);
            }
            //优惠券
            if (this.checkedCoupons[0]) {
               params.memberCouponId = this.checkedCoupons[0].id;
            }

            this.api
               .get("/api/hall/course/plan/order/price/calculate", params, this.$other)
               .then((data) => {
                  this.errorMessage = "";
                  this.total = parseFloat(data.actualTotal);
                  this.discountTotal = parseFloat(data.privilegeTotal || 0);
                  this.payTimes=data.payTimes
                  if (this.payChannelIndex == 0 || this.payChannelIndex == "0") {
                     // 课程卡
                     this.hasCourseCard = true;
                  } else {
                     if (this.payChannelIndex != -1) {
                        this.hasCourseCard = false;
                     }
                  }
               })
               .catch((error) => {
                  if (error.message) {
                     this.errorMessage = error.msg;
                  }
               });
         },
         toSuccessPage(orderId) {
            let url = "/pages/course/result/index";
            if (orderId) {
               url = url + "?orderId=" + orderId;
            }
            uni.navigateTo({
               url: url,
            });
         },

         showPayModal() {
            this.payModalVisible = true;
         },
         hideModal() {
            this.payModalVisible = false;
         },
         payChannelChange(e) {
            this.payChannelIndex = e.detail.value;
            if (!parseInt(this.payChannelIndex)) {
               this.checkedCoupons = [];
            }
            this.setOrderMaxNumber();
            this.priceCalc();
         },
         //单选支付
         payCardChange(e) {
            this.payType = e.detail.value;
            if (parseInt(this.payChannelIndex)) {
               this.payChannelIndex = 0;
            }
            this.setOrderMaxNumber();
            this.priceCalc();
         },
         setOrderMaxNumber() {
            if (this.course["hallId"] == 58) {
               this.currentNumber = 1;
               this.maxNumber = 1;
               return;
            }
            if (this.checkedCardCoupons.length) {
               // 有使用联卡券 限制预约人数
               this.currentNumber = 1;
               this.maxNumber = 1;
               return;
            }
            this.currentNumber = 1;
            let courseMaxOrder = parseInt(
               this.course.maxOrder - this.course.hasOrder
            );
            if (parseInt(this.payChannelIndex)) {
               this.maxNumber = courseMaxOrder > 3 ? 3 : courseMaxOrder;
            } else {
               let currentPayment = this.paymentModes[this.payType];
               this.maxNumber = Math.min(currentPayment.maxCompanion, courseMaxOrder);
            }
         },
         onMinus() {
            if (this.currentNumber <= 1) return;
            this.currentNumber -= 1;
            this.priceCalc();
         },
         onPlus() {
            if (this.currentNumber >= this.maxNumber) return;
            this.currentNumber += 1;
            this.priceCalc();
         },
      },
   };
</script>

<style lang="scss">
   .content-wrapper {
      padding: 0 32upx;
      padding-top: 32upx;
   }
   .card {
      padding: 32upx;
      margin-bottom: 32upx;
      background: white;
      border-radius: 20upx;
      position: relative;
      .head {
         display: flex;
         align-items: center;
         margin-bottom: 24upx;
         .title {
            margin-bottom: 0;
         }
      }
      .title {
         font-size: 34upx;
         color: #222527;
         margin-bottom: 24upx;
         font-weight: bold;
      }
      .people {
         font-size: 28upx;
         color: #999999;
         margin-left: 16upx;
      }
   }
   .contact-btn {
      position: absolute;
      top: 32upx;
      right: 16upx;
      background-color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1;
      padding: 0 16rpx;
      font-size: 28upx;
      color: #484f55;
      &::after {
         border: none;
      }
      .img {
         width: 36upx;
         height: 36upx;
         margin-bottom: 8upx;
      }
   }
   .remark-card {
      padding: 26upx 32upx !important;
   }
   .remark-wrapper {
      display: flex;
      align-items: center;
      .label {
         font-size: 30upx;
         line-height: 1;
         margin-right: 24upx;
      }
      .input-wrap {
         text-align: right;
      }
      .input {
         &::-webkit-input-placeholder {
            color: #cccccc;
         }
      }
   }
   .order-info__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .right-icon {
         color: #c2c4ca;
      }
      .label {
         font-size: 30upx;
      }
      .number {
         display: flex;
         align-items: center;
         .yicon {
            color: #999999;
            font-size: 40upx;
         }
         .total {
            min-width: 114upx;
            text-align: center;
         }
         .unit {
            color: #636f7c;
         }
      }
   }
   .labels {
      display: flex;
      // white-space: nowrap;
      margin-left: -12upx;
      flex-wrap: wrap;
      .label-item {
         margin-left: 12upx;
         margin-bottom: 8upx;
         border: 1upx solid #f08336;
         border-radius: 4upx;
         padding: 4upx 4upx;
         color: #f08336;
         font-size: 22upx;
         line-height: 22upx;
         white-space: nowrap;
         font-weight: 400;
      }
   }

   .pay-card {
      padding: 0 32upx;
      margin-bottom: 32upx;
      background: white;
      border-radius: 20upx;
      position: relative;
      .pay-list {
      }
      .pay-item {
         padding: 32upx 0;
         position: relative;
         color: #222527;
         overflow: hidden;
         &:not(:last-child):after {
            position: absolute;
            top: 0;
            left: 0;
            box-sizing: border-box;
            width: 200%;
            height: 200%;
            border-bottom: 1upx solid #ddd;
            border-radius: inherit;
            content: " ";
            transform: scale(0.5);
            transform-origin: 0 0;
            pointer-events: none;
         }
         radio {
            transform: scale(0.8);
            &.disabled::before {
               content: "";
            }
         }

         .image {
            width: 50upx;
            margin-right: 24upx;
            max-height: 50upx;
            overflow: hidden;
         }
         .label {
            // flex: 1;
            font-size: 34upx;
         }
         .value {
            flex: 1;
            text-align: right;
            font-size: 30upx;
            margin-right: 16upx;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
         }
         .other {
            font-size: 30upx;
            margin-top: 24upx;
            display: flex;
            align-items: center;
            .right-icon {
               color: #c2c4ca;
               font-size: 24upx;
               height: 24upx;
               margin-left: 8upx;
            }
         }
         .other-tip {
            font-size: 30upx;
            margin-top: 24upx;
            text-align: center;
            color: #f08336;
         }
         .handle-link {
            color: #636f7c;
            display: flex;
            align-items: center;
         }
      }
      .y-radio {
         width: 38upx;
         height: 38upx;
         border-radius: 50%;
         border: 2upx solid #d0d0d0;
      }
   }

   .coupon-wrap {
      padding-top: 16upx;
      margin-top: 16upx;
      .icon {
         color: #c2c4ca;
      }
      .coupon {
         flex: 1;
         display: flex;
         justify-content: flex-end;
         padding-right: 8upx;
         .tag {
            padding: 4upx 16upx;
            background: #ff6464;
            border-radius: 12upx 0 12upx 0;
            font-size: 24upx;
            color: #ffffff;
         }
         .money-wrap {
            display: flex;
            align-items: center;
            color: #ff0000;
            .unit {
               font-size: 24upx;
            }
            .money {
               font-size: 30upx;
            }
            .coupon_name {
               font-size: 28upx;
            }
         }
         .no-card {
            color: #ccc;
         }
      }
   }
   .name-wrap {
      white-space: nowrap;
      align-items: center;
   }

   .info-item {
      display: flex;
      margin-bottom: 16upx;
      line-height: 40upx;
      flex-wrap: wrap;
      .label {
         display: inline-block;
         color: #636f7c;
         margin-right: 24upx;
      }
      .value {
         flex: 1;
         color: #222527;
      }
      .course-name {
         color: #222527;
         white-space: nowrap;
         text-overflow: ellipsis;
         overflow: hidden;
      }
   }

   .fixed-page-large {
      padding-bottom: 128upx;
      padding-bottom: calc(constant(safe-area-inset-bottom) + 128upx);
      padding-bottom: calc(env(safe-area-inset-bottom) + 128upx);
   }
   .pay-footer-wrap {
      height: 128upx;
      padding: 24upx 32upx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 -1px 4px rgba(#000, 0.1);
      .text {
         flex: 1;
         display: flex;
         align-items: center;
         overflow: hidden;
         .label {
            font-size: 30upx;
            color: #222527;
         }
         .error {
            font-size: 30upx;
            color: #ff0000;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
         }
      }
      .discount-wrap {
         margin-left: 16upx;
         font-size: 28upx;
         color: #ff0000;
      }
      .total {
         font-size: 48upx;
         color: #ff0000;
         display: flex;
         align-items: center;
         .unit {
            font-size: 28upx;
         }
      }
      .confirm-btn {
         width: 208upx;
         height: 80upx;
         display: flex;
         align-items: center;
         justify-content: center;
         background: #f08336;
         border-radius: 12upx;
         font-size: 32upx;
         color: #ffffff;
         text-align: center;
         line-height: 1;
         &.disabled {
            color: #999999;
            background: #f2f2f2;
         }
      }
   }
   .cu-dialog {
      .card-image {
         width: 50upx;
         height: 50upx;
         border-radius: 5upx;
         overflow: hidden;
         margin-right: 32upx;
         image {
            width: 100%;
            height: 100%;
         }
      }
      .card-no {
         padding-right: 24upx;
         color: #636f7c;
      }
   }
</style>
