<template>
   <view class="container page-bg coupon-fixed-page">
      <cu-custom bgColor="bg-white"
                 :isBack="true">
         <block slot="content">{{ couponType == 1 ? '优惠券' : '联卡券' }}</block>
      </cu-custom>
      <view class="content-wrapper">
         <view class="redeem-wrap">
            <input type="text"
                   placeholder="请输入兑换码"
                   v-model="redeemCode" />
            <button class="cu-btn green-btn"
                    @click="redeemCoupon">兑换</button>
         </view>

         <radio-group class="radio-group"
                      @change="checkedChange">
            <label class="coupon_item"
                   v-for="(coupon, index) in couponsList"
                   :key="index"
                   :data-id="coupon.memberCouponId"
                   @click="selectedCoupon">
               <view class="price-wrap"
                     v-if="coupon.type !== 2&& couponType == 1">
                  <text class="unit">￥</text>
                  <text class="price">{{ coupon.discount }}</text>
               </view>
               <!-- <view class="tag">新</view> -->
               <!-- <view class="circle top"></view>
                    <view class="circle bottom"></view> -->
               <view class="info">
                  <view class="title">{{ coupon.name }}</view>
                  <view class="desc">
                     <view v-if="coupon.startTime">
                        <!-- <view v-if="coupon.effective_time == coupon.expiry_date">限{{ coupon.expiry_date }}当天使用</view> -->
                        <view>限{{ coupon.startTime }}至{{ coupon.endTime }}使用</view>
                     </view>
                  </view>
               </view>
               <view class="btn-wrap">
                  <radio class='bg-primary'
                         :class="coupon.checked  ?'checked':''"
                         :checked="coupon.checked ? true : false"
                         :value="coupon.memberCouponId"></radio>
                  <!-- <checkbox class='round ' :class="coupon.checked  ?'checked':''" :checked="coupon.checked ? true : false"
                        :value="coupon.relation_id"></checkbox> -->
               </view>
            </label>
         </radio-group>

         <!-- <label class="coupon_item disabled" v-for="(item, index) in couponsList" :key="index">
                <view class="head">
                    <view class="price-wrap">
                        <text class="unit">￥</text>
                        <text class="price">100</text>
                    </view>
                    <view class="info">
                        <view class="title">新用户专享</view>
                        <view class="desc">
                            <view v-if="coupon.start_date">
                                <view v-if="coupon.start_date == coupon.end_date">限{{ coupon.start_date }}当天使用</view>
                                <view v-else>限{{ coupon.start_date }}至{{ coupon.end_date }}使用</view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="tip-info">
                    <view class="circle left"></view>
                    <view class="circle right"></view>
                    <view class="icon"><text class="cuIcon-infofill lg"></text></view>
                    <view class="info-list">
                        <view>满100元可用</view>
                        <view>限蓝堡店使用</view>
                    </view>
                </view>
            </label> -->
         <view class="no-data"
               v-if="isLoadingComplete && !couponsList.length">
            {{ couponType == 1 ? '无可用优惠券' : '无可用联卡券' }}
         </view>
      </view>

      <view class="footer"
            v-if="isLoadingComplete && couponsList.length">
         <view class="coupon-footer-wrap">
            <view class="text">
               <view>已选择{{ amount }}张，可抵扣</view>
               <view class="total">
                  <text class="unit">￥</text>
                  {{ total }}
               </view>
            </view>
            <view class="confirm-btn"
                  @click="confirm">确认使用</view>
         </view>
      </view>
   </view>
</template>
<script>
import { mapState } from 'vuex';
export default {
   data() {
      return {
         amount: 0,
         total: 0,
         couponsList: [],
         isLoadingComplete: false,
         checkedIds: [],
         useLimit: 0,
         couponType: 1, // 默认代金券
         courseStore: uni.getStorageSync("courseStore")
      };
   },
   computed: mapState(['memberId']),
   onLoad(options) {
      if (options.ids) {
         this.checkedIds = JSON.parse(options.ids);
      }
      if (options.use_limit) {
         this.useLimit = parseInt(options.use_limit);
      }
      if (options.type) {
         this.couponType = parseInt(options.type);
      }

      console.log("ids", this.checkedIds, this.couponType, options);
      this.getCouponsList();
   },
   methods: {
      getCouponsList() {
         let { couponType, courseId, coursePlanId } = this.courseStore;
         let params = {
            couponType: this.couponType,
            courseId,
            coursePlanId
         };
         this.api.get("/api/hall/course/plan/member/coupon", params, this.$other).then(data => {
            let couponsList = data || [];
            couponsList.forEach(item => {
               if (this.checkedIds.indexOf(item.relation_id) > -1) {
                  item.checked = true;
               } else {
                  item.checked = false;
               }
               //    item.start_date = item.collection_time.split(" ")[0];
               //    item.end_date = item.expiry_date;
               item.discount = parseInt(item.discount);
            });
            this.isLoadingComplete = true;
            this.couponsList = couponsList;
            if (this.checkedIds.length) {
               this.setCheckedTotal();
            }
         });
      },
      checkedChange(event) {
         this.checkedIds = [event.detail.value];
         console.log("checkedIds", this.checkedIds);
         this.setCheckedTotal();
      },
      setCheckedTotal() {
         let checkedCoupons = this.couponsList.filter(coupon =>
            this.checkedIds.indexOf(coupon.memberCouponId) >= 0
         );
         console.log(checkedCoupons);
         let total = 0;
         checkedCoupons.forEach(coupon => {
            total += coupon.discount;
         });
         this.amount = checkedCoupons.length;
         this.total = total;
      },
      selectedCoupon(event) {

      },
      redeemCoupon() {
         if (!this.redeemCode) {
            uni.showToast({
               icon: "none",
               title: "请输入兑换码",
            });
            return;
         }
         let params = {
            redeemCode: this.redeemCode,
            type: this.couponType,
         };
         this.api.post("/api/member/coupon/member-convert", params, this.$other).then(ret => {
            if (!ret.code) {
               uni.showToast({
                  icon: "none",
                  title: "兑换成功",
               });
               this.redeemCode = '';
               this.getCouponsList();
            } else {
               uni.showToast({
                  icon: "none",
                  title: ret.msg,
               });
            }
         });
      },
      confirm() {
         let checkedCoupons = this.couponsList.filter(coupon => this.checkedIds.indexOf(coupon.memberCouponId) >= 0);

         checkedCoupons = checkedCoupons.map(item => {
            if (this.couponType === 1) { // 代金券
               return { id: item.memberCouponId, name: item.name, amount: item.discount };
            } else { // 联卡券
               return { coupon_id: item.coupon_id, memberCouponId: item.memberCouponId, coupon_name: item.name };
            }
         });
         let pages = getCurrentPages();
         let prevPage = pages[pages.length - 2]; //上一个页面
         if (this.couponType === 1) {
            prevPage.$vm.checkedCoupons = checkedCoupons;
            prevPage.$vm.couponTotal = this.total;
         } else if (this.couponType === 2) {
            prevPage.$vm.checkedCardCoupons = checkedCoupons;
         }
         uni.navigateBack({
            delta: 1,
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
.radio-group {
   width: 100%;
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
      &.disabled {
         flex-direction: column;
         padding: 0;
         box-shadow: none;
         .price-wrap {
            border-right: none;
            color: #dddddd;
         }
         .info {
            .title {
               color: #dddddd;
            }
            .desc {
               color: #dddddd;
            }
         }
         .circle {
            &.left {
               top: -16upx;
               left: -16upx;
            }
            &.right {
               top: -16upx;
               right: -16upx;
            }
         }
      }
      .head {
         display: flex;
         padding: 24upx 0;
      }
      .price-wrap {
         width: 174upx;
         border-right: 1px dashed #dddddd;
         padding: 0 16upx;
         display: flex;
         align-items: center;
         justify-content: center;
         color: #ff0000;
         .unit {
            font-size: 28upx;
         }
         .price {
            font-size: 48upx;
         }
      }
      .tag {
         // width: 54upx;
         // height: 27upx;
         // position: absolute;
         // top: 0;
         // left: 0;
         // background-color: #48C5B6;
         // color: white;
         // display: flex;
         // justify-content: center;
         // align-items: center;
         // font-size: 20upx;
         // transform: rotate(-45deg);
      }
      .tip-info {
         padding: 24upx;
         border-top: 1px dashed #dddddd;
         display: flex;
         position: relative;
         .icon {
            font-size: 32upx;
            color: #467cfd;
         }
         .info-list {
            flex: 1;
            padding-left: 16upx;
            font-size: 20upx;
            color: #484f55;
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
         padding-left: 32upx;
         padding-right: 32upx;
         display: flex;
         align-items: center;
         justify-content: center;
      }
   }
}
.coupon-fixed-page {
   padding-bottom: 128upx;
   padding-bottom: calc(constant(safe-area-inset-bottom) + 128upx);
   padding-bottom: calc(env(safe-area-inset-bottom) + 128upx);
}
.coupon-footer-wrap {
   height: 128upx;
   padding: 24upx 32upx;
   display: flex;
   align-items: center;
   justify-content: center;
   .text {
      flex: 1;
      display: flex;
      align-items: center;
   }
   .total {
      font-size: 36upx;
      color: #ff0000;
      display: flex;
      align-items: center;
      .unit {
         font-size: 28upx;
      }
   }
   .confirm-btn {
      width: 230upx;
      height: 80upx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f08336;
      border-radius: 12upx;
      font-size: 32upx;
      color: #ffffff;
      text-align: center;
   }
}

.no-data {
   text-align: center;
}
</style>