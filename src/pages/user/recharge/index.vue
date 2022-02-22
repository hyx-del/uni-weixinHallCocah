<template>
   <view class="container fixed-page page-bg">
      <cu-custom bgColor="bg-white"
                 :isBack="true">
         <block slot="content">充值</block>
      </cu-custom>
      <view class="content-wrap"
            @click="hideDropdown">
         <view class="card">
            <view class="name">充值金额</view>

            <view class="specs">
               <view class="specs__item-wrap"
                     v-for="(item, index) in specs"
                     :data-index="index"
                     :key="item"
                     @tap="checkedSpecs">
                  <view class="specs__item"
                        :class="{ checked: item.checked }">
                     <view class="label">
                        {{ item.amount }}
                        <text class="unit">元</text>
                     </view>
                     <view class="value">到账￥{{ item.amount }}</view>
                  </view>
               </view>
            </view>

            <view class="form-group">
               <view class="title">关联人</view>
               <view class="input-wrap"
                     @click.stop="">
                  <input v-if="!currentUser || !currentUser.id"
                         type="text"
                         v-model="keyword"
                         placeholder="搜索关联人"
                         :disabled="currentUser && currentUser.id"
                         @input="onChange"
                         @focus="focus" />
                  <view class="right-text"
                        v-if="currentUser && currentUser.id">
                     <text>{{ currentUser.name }}</text>
                     <text v-if="currentUser.shortMobile">({{ currentUser.shortMobile }})</text>
                  </view>
               </view>
               <view class="clear"
                     v-if="currentUser && currentUser.id"
                     @click="clearUser">
                  <text class="cuIcon-close"></text>
               </view>
               <view class="dropdown"
                     v-if="showDropdown && salesmanList.length"
                     @click.stop="">
                  <view class="dropdown-item"
                        v-for="item in salesmanList"
                        :key="item.id"
                        @click="selectUser(item)">
                     <text>{{ item.name }}</text>
                     <text v-if="item.shortMobile">({{ item.shortMobile }})</text>
                  </view>
               </view>
            </view>

            <view class="recharge-btn"
                  @click="recharge">充值</view>
         </view>
         <view class="card">
            <view class="card__title">充值优惠活动</view>
            <view class="card__content">
               <view>(1)充值会员余额消费为190元/次，充值5000元消费打9折(171元/次)，充值15000元消费打8折(152元/次)；</view>
               <view>(2)充值5000元，到账5000元</view>
               <view>(3)充值15000元，到账15000元</view>
               <view>
                  问题咨询客服电话：
                  <br />
                  400-999-8808/13591471192
               </view>
            </view>
         </view>
         <view class="card">
            <view class="card__title">备注说明</view>
            <view class="card__content">
               <view>折扣目前仅适用于团课课程预约价格。</view>
               <view>充值余额永久有效，梵音旗下全国所有门店团课通用。</view>
               <view>充值余额退款将扣除15%手续费。</view>
            </view>
         </view>
      </view>
   </view>
</template>

<script>
import { mapState } from 'vuex';
export default {
   data() {
      return {
         specs: [],
         hasRecharge: false,
         mobile: '',
         salesmanList: [],
         salesIndex: -1,
         keyword: '',
         currentUser: {},
         timer: null,
         showDropdown: false,
      };
   },
   computed: {
      ...mapState(['memberId', 'account', 'openId', 'appId']),
   },
   onLoad() {
      this.getSpecs();
      // this.getSalesmanlist();
   },
   methods: {
      async recharge() {
         if (this.hasRecharge) {
            // 正在充值
            return;
         }
         let selectSpecs = this.specs.find(item => item.checked);
         if (!selectSpecs) {
            uni.showToast({
               icon: 'none',
               title: '请选择充值规格',
            });
            return;
         }

         let params = {
            chargeSpecId: selectSpecs.id,
            channel: 30, // 20 -> 会员卡余额  30 -> 微信  40 -> 支付宝
         };
         //openid
         let result = await this.api.get("/app/api/user/grant/info", {}, { type: "other" });
         params.openid = result.openid;
         params.appid = result.appid;
         if (this.currentUser && this.currentUser.id) {
            params.saleId = this.currentUser.id;
         }//TODO
         this.hasRecharge = true;
         this.api
            .post('/api/hall/charge/charge', params, this.$other)
            .then(payData => {
               if (!payData.code) {
                  uni.requestPayment({
                     provider: 'weixin',
                     orderInfo: {}, //微信、支付宝订单数据
                     ...payData.payPackage,
                     success: async res => {
                        let params = { appid: result.appid, orderId: payData.orderId };
                        let resultStatus = this.api.post("/api/hall/charge/query", params, { type: "other" });
                        if (!resultStatus.code) {
                           this.toFailPage("充值成功", '返回上一页', () => {
                              uni.navigateBack({
                                 delta: 1,
                              });
                           });
                        }
                     },
                     fail: err => {
                        console.log('error', err);
                        this.toFailPage('充值失败',);
                        this.hasRecharge = false;
                     },
                  });
               } else {
                  this.toFailPage('充值失败',);
                  this.hasRecharge = false;
               }
            });
      },

      toFailPage(message = '', confirmText = '确定', callback) {
         uni.showModal({
            title: message,
            showCancel: false,
            confirmText: confirmText,
            success: callback
         });
      },

      toShowToast(msg, callback) {
         uni.showToast({
            duration: 2000,
            icon: "none",
            title: msg,
         });
      },
      getSalesmanlist(keyword) {
         let params = {};
         if (keyword) {
            params['keyword'] = keyword;
         }
         this.api.get('/api/staff/staff/relation/list', params, this.$other).then(ret => {
            (ret || []).forEach(item => {
               if (item.mobile) {
                  item.shortMobile = item.mobile.substring(item.mobile.length - 4, item.mobile.length);
               }
            });
            this.salesmanList = ret || [];
         });
      },
      rechargeSuccess() { },
      checkedSpecs(event) {
         const { index } = event.currentTarget.dataset;
         this.specs.forEach(item => {
            item.checked = false;
         });
         this.specs[index].checked = !this.specs[index].checked;
      },
      getSpecs() {
         this.api.get('/api/hall/charge/spec-list', {}, this.$other).then(data => {
            (data || []).forEach(specs => {
               specs.amount = parseFloat(specs.amount);
               specs.checked = false;
            });
            this.specs = data || [];
         });
      },
      selectUser(item) {
         this.showDropdown = false;
         this.currentUser = item;
         if (item.shortMobile) {
            this.keyword = `${item.name}(${item.shortMobile})`;
         } else {
            this.keyword = item.name;
         }
      },
      clearUser() {
         this.currentUser = {};
         this.keyword = '';
         this.salesmanList = [];
      },
      hideDropdown() {
         this.showDropdown = false;
         if (!this.currentUser || !this.currentUser.id) {
            this.keyword = '';
         }
         this.salesmanList = [];
      },
      focus() {
         this.showDropdown = true;
      },
      onChange(event) {
         if (!this.keyword) {
            this.salesmanList = [];
            return;
         }
         this.getSalesmanlist(this.keyword);
      },
   },
};
</script>

<style lang="scss">
.content-wrap {
   padding: 32upx;
   padding-bottom: 0;
}
.card {
   padding: 40upx;
   margin-bottom: 32upx;
   background: #ffffff;
   border-radius: 20upx;
   &__title {
      font-size: 32upx;
      color: #222527;
      margin-bottom: 24upx;
   }
   &__content {
      color: #484f55;
   }
   .info-cell {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32upx;
      .name {
         color: #222527;
      }
      .value {
         color: #636f7c;
      }
   }
   .line {
      margin: 8upx 0;
      border-top: 1px solid #cccccc;
   }
   .name {
      font-size: 30upx;
      // margin-bottom: 32upx;
      color: #222527;
   }
}
.specs {
   display: flex;
   flex-wrap: wrap;
   margin: 0 -12upx;
   padding: 32upx 0 8upx 0;
   &__item-wrap {
      width: 33.333%;
      // flex: 1;
      display: inline-block;
      padding: 0 12upx;
      overflow: hidden;
      margin-bottom: 8upx;
      margin-top: 8upx;
   }
   &__item {
      padding: 40upx 24upx;
      border: 2px solid transparent;
      border-radius: 20upx;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background-color: rgba(#f08336, 0.1);
      // text-align: center;
      align-items: center;
      &.checked {
         border: 2px solid #f08336;
      }
      .label {
         display: flex;
         font-size: 34upx;
         color: #222527;
      }
      .unit {
         font-size: 24upx;
      }
      .value {
         font-size: 24upx;
         margin-top: 10upx;
         color: #999999;
         white-space: nowrap;
         text-overflow: ellipsis;
         overflow: hidden;
      }
   }
}
.recharge-btn {
   background: #f08336;
   height: 100upx;
   font-size: 32upx;
   text-align: center;
   line-height: 100upx;
   color: #ffffff;
   border-radius: 50upx;
   margin-top: 32upx;
}
.form-group {
   display: flex;
   align-items: center;
   font-size: 28upx;
   position: relative;
   .title {
      width: 106upx;
      color: #484f55;
      margin-right: 16upx;
      font-size: 30upx;
   }
   .input-wrap {
      flex: 1;
      position: relative;
      input {
         width: 100%;
         height: 74upx;
         border: none;
         border-radius: 10upx;
         text-align: right;
      }
   }
   .right-text {
      height: 74upx;
      text-align: right;
      line-height: 74upx;
   }
   .clear {
      padding-left: 8upx;
      font-size: 30upx;
      color: #999;
      height: 30upx;
   }
   .input-placeholder {
      color: #999999;
   }
   .dropdown {
      position: absolute;
      top: 74upx;
      left: -40upx;
      right: -40upx;
      // left:  0;
      // right:  0;
      height: 400upx;
      background-color: white;
      padding: 0 40upx;
      overflow: auto;
      z-index: 1;
      &-item {
         padding: 24upx 0;
         text-align: right;
         color: #484f55;
         font-size: 28upx;
         border-bottom: 1px solid #e5e5e5;
      }
   }
}
</style>
