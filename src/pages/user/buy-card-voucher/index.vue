<template>
   <view class="container page-bg">
      <cu-custom bgColor="bg-white"
                 :isBack="true">
         <block slot="content">优惠购券</block>
      </cu-custom>
      <view class="content-wrapper">
         <view class="coupon_item"
               v-for="(coupon, index) in couponsList"
               :key="index">
            <view class="price-wrap">
               <text class="unit">￥</text>
               <text class="price">{{ parseInt(coupon.discount) }}</text>
            </view>
            <view class="info">
               <view class="title">{{ coupon.name }}</view>
               <view class="desc">
                  <text class="unit">￥</text>
                  {{coupon.price}}
               </view>
            </view>
            <view class="btn-wrap">
               <button :class="(coupon.sellStartAt==coupon.sellEndAt)?'is-disabled cu-btn btn-bg-red':'cu-btn btn-bg-red'"
                       @click="goToBuy(coupon.id,coupon)"
                       :disabled="(coupon.sellStartAt==coupon.sellEndAt)">购买</button>
            </view>
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
               <button open-type="getUserInfo"
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
            couponsList: [],
            id: "",
            isLoginLink: false,
            isVisible: false,
         };
      },

      computed: {
         ...mapState(["isLogin", "isAuth"]),
      },

      watch: {
         isLogin(value) {
            if (value && this.isLoginLink) {
               this.isLoginLink = false;
               this.goToBuy(this.id);
            }
         },
      },

      methods: {
         goToBuy(id,item) {
           uni.setStorageSync('coupon',item)
            uni.navigateTo({
               url: "/pages/user/card-details/index?id=" + id,
            });
         },

         // 获取优惠券列表
         async getCouponsList() {
            let data = await this.api.get("/api/member/coupon/list-buy", {
               current: 1,
               size: 100,
            }, this.$other);
            if (data) {
               this.couponsList = data.records || [];
            }
         },

         noLogin() {
            this.isVisible = false;
            this.isLoggingIn = false;
         },

         onGetUserInfo(event) {
            if (event.detail.userInfo) {
               this.$store.commit("setIsAuth", true);
               this.$store.dispatch("getToken", true);
            }
            this.isVisible = false;
         },

         showAuthModal() {
            this.isVisible = true;
         },
      },

      created() {
         this.getCouponsList();
      },
   };
</script>

<style lang="scss">
   .content-wrapper {
      padding: 32upx;
      padding-bottom: 0;
      padding-top: 24upx;
   }
   .coupon_item {
      display: flex;
      padding: 24upx 0;
      margin-bottom: 32upx;
      background: #ffffff;
      box-shadow: 0 2px 4px 0 rgba(30, 36, 43, 0.2);
      position: relative;
      border-radius: 16upx;
      overflow: hidden;

      .price-wrap {
         width: 174upx;
         padding: 0 16upx;
         display: flex;
         align-items: center;
         justify-content: center;
         color: #ff0000;
         border-right: 1px dashed #dddddd;
         .unit {
            font-size: 28upx;
         }
         .price {
            font-size: 48upx;
         }
      }
      .tag {
         width: 54upx;
         height: 27upx;
         position: absolute;
         top: 0;
         left: 0;
         background-color: #48c5b6;
         color: white;
         display: flex;
         justify-content: center;
         align-items: center;
         font-size: 20upx;
         .text {
            transform: rotate(-45deg);
         }
      }
      .circle {
         position: absolute;
         width: 32upx;
         height: 32upx;
         border-radius: 50%;
         overflow: hidden;
         background-color: #f5f5f5;
         &.top {
            top: -16upx;
            left: 158upx;
         }
         &.bottom {
            bottom: -16upx;
            left: 158upx;
         }
      }
      .info {
         flex: 1;
         padding: 20upx 32upx;
         .title {
            color: #222527;
            margin-bottom: 16upx;
            font-size: 28upx;
         }
         .desc {
            font-size: 30upx;
            color: #222527;
            font-weight: 500;
            > .unit {
               text-align: left;
               font-size: 24upx;
               font-weight: 500;
            }
         }
      }
      .btn-wrap {
         padding-right: 32upx;
         display: flex;
         align-items: center;
         justify-content: center;
         button {
            padding: 9upx 36upx;
            font-size: 25upx;
            height: auto;
            background: #fff;
            border: 2upx solid #ff0000;
            border-radius: 28upx;
         }
         .is-disabled {
            color: #ccc;
            border: 2upx solid #ccc;
         }
      }
      .btn-bg-red {
         color: #ff0000;
         line-height: 36upx;
      }
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