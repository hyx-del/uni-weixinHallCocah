<template>
   <view class="container page-bg fixed-page-large">
      <cu-custom bgColor="bg-white"
                 :isBack="true"
                 :isHome="isHome">
         <block slot="content">购买优惠券</block>
      </cu-custom>

      <!-- 新用户专享 -->
      <view class="content-wrap"
            v-if="detailsList.id">
         <view class="new-user">
            <view class="title">{{detailsList.name}}</view>
            <view class="new_user_content"
                  v-if="detailsList.effectiveDays">
               <text>有效期天数：</text>
               <text>{{detailsList.effectiveDays||0}}天</text>
            </view>
            <view class="new_user_content"
                  v-if="!detailsList.effectiveDays"
                  style="display: flex;">
               <text>有效期：</text>
               <view style="flex: 1;">{{detailsList.effectiveTime}} - {{ detailsList.expirationTime }}</view>
            </view>
            <view class="new_user_content">
               <text>使用限制：</text>
               <text>{{classText}}</text>
            </view>
         </view>

         <!-- 支付方式 -->
         <view class="pay_type">
            <radio-group class="block"
                         @change="payChannelChange">
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
                            :class="payChannelIndex == item.index  ?'checked':''"
                            :checked="payChannelIndex == item.index ?true:false"
                            :value="item.index"></radio>
                  </label>
                  <!-- <view class="other" v-if="item.channel == 20">
              <view style="margin-right: 8upx;">余额</view>
              <view style="margin-right: 8upx;">￥{{ account.balance || '0.00' }}</view>
              <view class="handle-link" @click="skipRechargePage">
                <text>充值</text>
                <view class="icon cuIcon-right right-icon"></view>
              </view>
            </view>-->
               </view>
            </radio-group>
         </view>

         <!-- 优惠券数 -->
         <view class="card">
            <view class="order-info__item">
               <view class="label">购买数量</view>
               <view class="number">
                  <view class="yicon icon-minus-circle"
                        @click="onMinus"></view>
                  <view class="total">
                     <text>{{ currentNumber }}</text>
                  </view>
                  <view class="yicon icon-plus-circle plus"
                        @click="onPlus"></view>
               </view>
            </view>
         </view>

         <!-- 备注说明 -->
         <view class="remark">
            <view class="title">备注说明</view>
            <view class="remark_content"
                  v-if="detailsList.sellStartAt&&detailsList.sellEndAt">
               <text>购券时间：{{detailsList.sellStartAt}}至{{detailsList.sellEndAt}}</text>
            </view>
            <view class="remark_content"
                  v-if="detailsList.remark"><text>{{ detailsList.remark }}</text></view>
         </view>
      </view>

      <view class="footer">
         <view class="pay-footer-wrap">
            <view class="price_wrap">
               <text>合计：</text>
               <view class="price">
                  <text class="price_unit">￥</text>
                  {{price}}
               </view>
            </view>

            <button class="nowbuy"
                    @click="nowbuy">立即购买</button>
         </view>
      </view>
      <view class="cu-modal auth-modal"
            :class=" isVisible ?'show':''">
         <view class="cu-dialog">
            <view class="image-wrap">
               <image src="/static/images/auth.svg"
                      mode="widthFix" />
            </view>
            <view class="modal__name">您还未登录</view>
            <view class="modal__desc">请先登录后再进行操作</view>
            <view class="btn-wrapper">
               <view class="default-btn"
                     @click="noLogin">暂不登录</view>
               <button open-type='getUserInfo'
                       @getuserinfo="onGetUserInfo"
                       class="primary-btn">立即登录</button>
            </view>
         </view>
      </view>
   </view>
</template>

<script>
   import { mapState } from "vuex";
   export default {
      data() {
         return {
            payChannelIndex: 2,
            defaultPayMode: [
               // {
               //   name: "余额支付",
               //   channel: 20,
               //   icon: "../../../static/images/money.svg",
               //   index: 1,
               // },
               {
                  name: "微信支付",
                  channel: 30,
                  icon: "../../../static/images/card/wechat.svg",
                  index: 2,
               },
            ],
            hasRecharge: false,
            detailsList: {},
            maxNumber: 0,
            currentNumber: 1,
            classText: "",
            isCreateOrder: false,
            price: 0,
            isVisible: false,
            isNowBuy: false,
            isHome: false,
         };
      },

      computed: {
         ...mapState(["account", "openId", 'appId', 'isLogin', 'isAuth']),
      },

      methods: {
         async getDetailsList(id) {
            let data = uni.getStorageSync('coupon')
            if (data) {
               this.detailsList = data;
               this.maxNumber = data.purchaseLimit;
               this.price = data.price;

               let classType = data.useLimit ? JSON.parse(data.useLimit) : [];
               if (Array.isArray(classType)) {
                  let arr = [];
                  classType.forEach((item) => {
                     if (item == 1) {
                        arr.push("团课");
                     } else if (item == 2) {
                        arr.push("私教课");
                     } else if (item == 3) {
                        arr.push("购卡");
                     } else if (item == 4) {
                        arr.push("教培学费");
                     } else if (item == 5) {
                        arr.push("购买商品");
                     }
                  });
                  this.classText = arr.join(",");
               }
            }
         },

         payChannelChange(e) {
            this.payChannelIndex = e.detail.value;
            if (!parseInt(this.payChannelIndex)) {
               this.checkedCoupons = [];
            }
         },

         // skipRechargePage() {
         //   this.hasRecharge = true;
         //   uni.navigateTo({
         //     url: "/pages/user/recharge/index",
         //   });
         // },

         // 购买数量
         onMinus() {
            // 减
            if (this.currentNumber <= 1) return;
            this.currentNumber -= 1;
            this.countPrice();
         },

         onPlus() {
            // 加
            if (this.detailsList.purchase_limit) {
               if (this.currentNumber >= this.maxNumber) return;
               this.currentNumber++;
               this.countPrice();
            } else {
               this.currentNumber++;
               this.countPrice();
            }
         },

         // 计算价格
         countPrice() {
            this.price = (this.currentNumber * this.detailsList.price).toFixed(2);
         },
         // 支付
         async nowbuy() {

            if (this.isCreateOrder) return;
            this.isCreateOrder = true;
            if (!this.payChannelIndex) {
               uni.showToast({
                  title: "请选择支付方式",
                  icon: "none",
               });
               this.isCreateOrder = false;
               return;
            }


            let result = await this.api.get("/app/api/user/grant/info", {}, { type: "other" })
            let { appid, openid } = result
            let parmas = {
               couponId: this.detailsList.id,
               amount: this.currentNumber,
               appid,
               openid
            };

            const data = await this.api.post("/api/member/coupon/buy", parmas, this.$other);

            if (!data.code) {
               uni.requestPayment({
                  provider: "weixin",
                  ...data,
                  // timeStamp: orderInfo.timeStamp,
                  // signType: orderInfo.signType,
                  // paySign: orderInfo.paySign,
                  // package: orderInfo.package,
                  // nonceStr: orderInfo.nonceStr,
                  success: (res) => {
                     this.toSuccessPage();
                  },
                  fail: (err) => {
                     this.toFailPage("支付失败");
                    //  this.purchaseCancel(data.out_trade_no || '');
                  },
                  complete: () => {
                     this.isCreateOrder = false;
                  }
               });
            } else {
               this.isCreateOrder = false;
               this.toFailPage(data.msg);
            }

         },

         // 用户取消支付后调用
         purchaseCancel(payment_id) {
            if (!payment_id) return;
            this.api.post("member/member/coupon/purchase-cancel", { payment_id: payment_id });
         },

         toSuccessPage() {
            uni.showModal({
               title: "购买成功",
               showCancel: false,
               success: (res) => {
                  uni.navigateBack({
                     delta: 2,
                  });
               },
            });
         },

         toFailPage(message = "") {
            uni.showModal({
               title: "支付失败",
               content: message,
               showCancel: false,
            });
         },

         showAuthModal() {
            this.isVisible = true;
         },
      },
      watch: {
         isLogin(value) {
            if (value && this.isNowBuy) {
               this.isNowBuy = false;
               this.nowbuy();
            }
         }
      },
      onLoad(option) {
         let pages = getCurrentPages();
         if (pages.length <= 1) {
            this.isHome = true;
         }
         this.getDetailsList(option.id);
      },
      onShow() {
         // if (this.hasRecharge) {
         //   this.hasRecharge = false;
         //   this.$store.dispatch("getAccountInfo");
         // }
      },
   };
</script>

<style lang="scss" scoped>
   .content-wrap {
      padding: 32upx;
      padding-bottom: 0;
      padding-top: 24upx;
   }
   .new-user,
   .remark,
   .card {
      background: #ffffff;
      padding: 32upx;
      margin-bottom: 32upx;
      border-radius: 20upx;
      .title {
         color: #222527;
         font-size: 34upx;
         font-weight: 700;
         margin-bottom: 24upx;
      }
      .remark_content,
      .new_user_content {
         font-size: 28upx;
         color: #484f55;
         line-height: 40upx;
         font-weight: 400;
      }
   }
   .pay_type {
      padding: 0 32upx;
      margin: 0 0 32upx 0;
      background: white;
      border-radius: 20upx;
      position: relative;
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
            margin-left: 74upx;
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
         .plus {
            color: #f08336;
         }
         .total {
            min-width: 60upx;
            text-align: center;
         }
         .unit {
            color: #636f7c;
         }
      }
   }
   .pay-footer-wrap {
      height: 128upx;
      display: flex;
      align-items: center;
      padding: 0 32upx;
      justify-content: space-between;
      .price_wrap {
         color: #222527;
         font-size: 30upx;
         display: flex;
         align-items: center;
         .price {
            color: #ff0000;
            font-weight: bold;
            font-size: 48upx;
            > .price_unit {
               font-size: 28upx;
            }
         }
      }
      .nowbuy {
         background: #f08336;
         border-radius: 12upx;
         color: #ffffff;
         font-size: 32upx;
         font-weight: 500;
         margin: 0px;
         :hover {
            opacity: 0.5;
         }
      }
   }
   .fixed-page-large {
      padding-bottom: 128upx;
      padding-bottom: calc(constant(safe-area-inset-bottom) + 128upx);
      padding-bottom: calc(env(safe-area-inset-bottom) + 128upx);
   }

   .mg-left {
      margin-left: 8upx;
   }
   .cu-modal.auth-modal {
      background: rgba(#000000, 0.6);
      text-align: center;
   }
   .auth-modal {
      z-index: 10000;
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