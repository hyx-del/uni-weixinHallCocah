<template>
   <view class="container page-bg">
      <cu-custom bgColor="bg-white"
                 :isBack="true">
         <block slot="content">我的联卡券</block>
      </cu-custom>

      <view class="content-wrapper">
         <view class="redeem-wrap">
            <input type="text"
                   placeholder="请输入兑换码"
                   v-model="redeemCode" />
            <button class="cu-btn green-btn"
                    @click="redeemCoupon">兑换</button>
         </view>
         <view class="coupon_item"
               v-for="(coupon, index) in couponsList"
               :key="index">
            <view class="info">
               <view class="title">{{ coupon.name }}</view>
               <view class="desc">
                  <view v-if="coupon.effectiveTime">
                     <view v-if="coupon.effectiveTime == coupon.expirationTime">限{{ coupon.effectiveTime }}当天使用</view>
                     <view v-else>限{{ coupon.effectiveTime }}至{{ coupon.expirationTime }}使用</view>
                  </view>
               </view>
            </view>
            <view class="btn-wrap">
               <button class="cu-btn btn-bg-red"
                       @click="goToUse">去使用</button>
            </view>
         </view>
         <view class="no-data-text"
               v-if="!isLoadingComplete && !couponsList.length">加载中...</view>
         <view class="no-data"
               v-if="isLoadingComplete && !couponsList.length">
            <view class="image-wrap">
               <image src="/static/images/no-data.png"
                      mode="widthFix" />
            </view>
            <view class="desc">暂无联卡券</view>
         </view>
      </view>

   </view>
</template>
<script>
   import { mapState } from 'vuex';
   export default {
      data() {
         return {
            list: [1, 2, 3],
            couponsList: [],
            isLoadingComplete: false,
            redeemCode: '',
         }
      },
      computed: mapState(['memberId']),
      onLoad() {
         this.getCouponsList();
      },
      onPullDownRefresh() {
         uni.showNavigationBarLoading();
         this.getCouponsList();
      },
      methods: {
         getCouponsList() {
            this.isLoadingComplete = false;
            let params = {
               current: 1,
               size: 100,
               type: 2,
            }
            this.api.get("/api/member/coupon/list", params, this.$other).then(data => {
               this.isLoadingComplete = true;
               let couponsList = data.records || [];
               couponsList.forEach(item => {
                  item.discount = parseInt(item.discount);
               });
               this.couponsList = couponsList;
               uni.hideNavigationBarLoading();
               uni.stopPullDownRefresh();
            })
         },
         downCallback(mescroll) {
            mescroll.resetUpScroll();
            this.getCouponsList();
         },
         upCallback() {

         },
         redeemCoupon() {
            if (!this.redeemCode) {
               uni.showToast({
                  icon: "none",
                  title: "请输入兑换码",
               })
               return;
            }
            let params = {
               memberId: this.memberId,
               redeemCode: this.redeemCode,
               type: 2, // 只能兑换联卡券
            }
            this.api.post("/api/member/coupon/member-convert", params, this.$other).then(ret => {
               if (!ret.code) {
                  uni.showToast({
                     icon: "none",
                     title: "兑换成功",
                  })
                  this.redeemCode = '';
                  this.getCouponsList();
               } else {
                  uni.showToast({
                     icon: "none",
                     title: ret.msg,
                  })
               }

            })
         },
         goToUse() {
            uni.switchTab({
               url: '/pages/reservation/index'
            });
         }
      },
   }
</script>
<style lang="scss">
   .content-wrapper {
      padding: 32upx;
      padding-bottom: 0;
      padding-top: 24upx;
   }
   .redeem-wrap {
      display: flex;
      height: 80upx;
      margin-bottom: 24upx;
      input {
         flex: 1;
         height: 100%;
         padding: 0 20upx;
         border-radius: 8upx;
         background-color: white;
         &::-webkit-input-placeholder {
            color: #999999;
         }
      }
      .green-btn {
         margin-left: 16upx;
         background: #48c5b6;
         color: white;
         height: 100%;
         font-size: 32upx;
         padding: 0 38upx;
      }
   }
   .coupon {
      &_item {
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
            }
            .desc {
               font-size: 20upx;
               color: #636f7c;
            }
         }
         .btn-wrap {
            padding-right: 32upx;
            display: flex;
            align-items: center;
            justify-content: center;
            button {
               border-radius: 26upx;
               padding: 10upx 24upx;
               font-size: 26upx;
               height: auto;
            }
         }
         .btn-bg-red {
            color: white;
            background-image: linear-gradient(-58deg, #ff401f 2%, #ff711e 75%);
         }
      }
   }
   .no-data-text {
      text-align: center;
   }
   .no-data {
      padding-top: 204upx;
      padding-bottom: 120upx;
      .image-wrap {
         width: 180upx;
         height: 280upx;
         margin: 0 auto;
         image {
            width: 100%;
            height: 100%;
         }
      }
      .desc {
         margin-top: 60upx;
         font-size: 30upx;
         text-align: center;
         color: #484f55;
         line-height: 42upx;
      }
      .btn-wrap {
         width: 400upx;
         margin: 0 auto;
         margin-top: 64upx;
         .y-btn {
            width: 100%;
            height: 100upx;
            background: #f08336;
            border-radius: 20upx;
            font-size: 32upx;
            color: #ffffff;
         }
      }
   }
</style>