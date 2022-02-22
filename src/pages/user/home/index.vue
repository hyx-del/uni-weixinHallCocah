<template>
   <view class="container page-bg">
      <cu-custom bgColor="user-bg">
         <block slot="content">个人中心</block>
      </cu-custom>
      <view class="padding-view user-bg"></view>
      <view class="user-content-wrapper">
         <view class="user-content">
            <template v-if="isAuth">
               <view class="logo"
                     @click="skipUserInfo">
                  <open-data type="userAvatarUrl"></open-data>
               </view>
               <view class="nick-name"
                     @click="skipUserInfo">
                  <open-data type="userNickName"></open-data>
               </view>
               <view class="mobile">
                  {{ memberInfo.phone || "" }}
               </view>
            </template>
            <template v-else>
               <view class="logo-default"
                     style="background-color: #f2f2f2"
                     @click="showAuthModal">
                  <image src="/static/images/logo-black.svg"
                         mode="widthFix" />
               </view>

               <view class="nick-name"
                     @click="showAuthModal"> 点击登录账户 </view>
            </template>

            <view class="nav">
               <view class="nav-item">
                  <view class="value">
                     <view class="num">{{ totals.times || 0 }}</view>
                     <view class="unit">次</view>
                  </view>
                  <view class="name">训练次数</view>
               </view>
               <view class="nav-item">
                  <view class="value">
                     <view class="num">{{ totals.duration || 0 }}</view>
                     <view class="unit">分钟</view>
                  </view>
                  <view class="name">训练时长</view>
               </view>
               <view class="nav-item">
                  <view class="value">
                     <view class="num">{{ totals.days || 0 }}</view>
                     <view class="unit">天</view>
                  </view>
                  <view class="name">已经坚持</view>
               </view>
            </view>
         </view>
      </view>

      <view class="content">
         <!-- <view class="course-card">
                <text>拥有一张课程卡，享受轻松约课</text>
                <view class="purchase" @click="nowPurchase">立即购卡</view>
            </view> -->

         <view class="menu">
            <view class="menu-item"
                  @click="jumpToBooking">
               <view class="menu__icon">
                  <view class="yicon icon-yuyue"></view>
               </view>
               <view class="menu__name">我的预约</view>
            </view>
            <view class="menu-item"
                  @click="jumpCourseCard">
               <view class="menu__icon">
                  <view class="yicon icon-kechengka"></view>
               </view>
               <view class="menu__name">我的课程卡</view>
            </view>
            <view class="menu-item"
                  @click="jumpToCollection">
               <view class="menu__icon">
                  <view class="yicon icon-mark"></view>
               </view>
               <view class="menu__name">我的收藏</view>
            </view>
            <view class="menu-item"
                  @click="jumpToBodyData">
               <view class="menu__icon">
                  <view class="yicon icon-tice"></view>
               </view>
               <view class="menu__name">体测数据</view>
            </view>
         </view>

         <!-- <button class="cu-btn bg-green" open-type="contact">
                <image class="img" src="/static/images/contact.svg" />
                <text>在线咨询客服</text>
            </button> -->

         <view class="fun-item"
               hover-class="cell--hover"
               hover-stay-time="70"
               @click="skipStoredValuePage">
            <view class="title">我的余额</view>
            <view class="value">余额￥{{ account.balance || 0 }}</view>
            <view class="cuIcon-right right-icon"></view>
         </view>
         <view class="fun-item"
               hover-class="cell--hover"
               hover-stay-time="70"
               @click="toOrder">
            <view class="title">我的订单</view>
            <view class="cuIcon-right right-icon"></view>
         </view>
         <view class="fun-item"
               hover-class="cell--hover"
               hover-stay-time="70"
               @click="skipCouponsPage">
            <view class="title">我的优惠券</view>
            <view class="cuIcon-right right-icon"></view>
         </view>
         <view class="fun-item"
               hover-class="cell--hover"
               hover-stay-time="70"
               @click="skipCardCouponsPage">
            <view class="title">我的联卡券</view>
            <view class="cuIcon-right right-icon"></view>
         </view>
         <view class="fun-item"
               hover-class="cell--hover"
               hover-stay-time="70"
               @click="skipUserInfo">
            <view class="title">个人资料</view>
            <view class="cuIcon-right right-icon"></view>
         </view>

         <button class="fun-item contact-btn"
                 open-type="contact">
            <view class="title">在线客服</view>
            <view class="cuIcon-right right-icon"></view>
         </button>

         <view class="fun-item"
               hover-class="cell--hover"
               hover-stay-time="70"
               @click="skipFeedbackPage">
            <view class="title">意见反馈</view>
            <view class="cuIcon-right right-icon"></view>
         </view>
         <!-- <view class="fun-item" hover-class="cell--hover" hover-stay-time="70">
                <view class="title">排行榜</view>
                <view class="cuIcon-right right-icon"></view>
            </view> -->
      </view>
      <!-- 
    <view class="cu-modal auth-modal" :class="isVisible ? 'show' : ''">
      <view class="cu-dialog">
        <view class="image-wrap">
          <image src="/static/images/auth.svg" mode="widthFix" />
        </view>
        <view class="modal__name">您还未登录</view>
        <view class="modal__desc">请先登录后再进行操作</view>
        <view class="btn-wrapper">
          <view class="default-btn" @click="noLogin">暂不登录</view>
          <button
            open-type="getUserInfo"
            @getuserinfo="onGetUserInfo"
            class="primary-btn"
          >
            立即登录
          </button>
        </view>
      </view>
    </view> -->
   </view>
</template>

<script>
   import { mapState } from "vuex";
   export default {
      data() {
         return {
            toMethodName: "",
            pageInit: true,
            totals: {},
            memberInfo: {},
            isVisible: false,
         };
      },
      computed: mapState([
         "ossPath",
         "userInfo",
         "isLogin",
         "memberId",
         "account",
         "isAuth",
      ]),
      onLoad() {
         console.log(
            "ossPath===>",
            this.ossPath,
            this.userInfo,
            "isAuth",
            this.isAuth
         );
         // this.$store.dispatch("getToken", true);
         //   this.getMemberInfo();
         this.getMemberDetailInfo();
         this.getStatistics();

         // let page = getCurrentPages().pop(); //跳转页面成功之后
         // if (!page) return;
         // // page.onLoad(); //重新刷新页面
         // console.log("page===>", page);
         this.$store.dispatch("getAccountInfo");
      },
      onShow() {
         if (this.pageInit) {
            this.pageInit = false;
            return;
         }
         // this.$store.dispatch("getToken", true);
         this.getMemberDetailInfo();
         this.getStatistics();

         this.$store.dispatch("getAccountInfo");
      },
      // watch: {
      //   isLogin(val) {
      //     if (val) {
      //       if (this.toMethodName) {
      //         console.log("========================", this.toMethodName);
      //         this[this.toMethodName]();
      //       }
      //       // this.getMemberInfo();
      //       this.getMemberDetailInfo();
      //       this.getStatistics();
      //     }
      //   },
      // },
      methods: {
         getMemberDetailInfo() {
            this.api.get("/app/api/userinfo/detail", {}, this.$other).then((ret) => {
               this.memberInfo = ret;
               uni.setStorageSync("current_member_id", ret.memberId || "");
               this.$store.commit("setCurrentMemberId", ret.memberId || "");
            });
         },
         // getMemberInfo() {
         //   this.api
         //     .post("member/member/account/detail", { member_id: this.memberId })
         //     .then((data) => {
         //       this.account = data;
         //       this.$store.commit("setAccount", data);
         //     });
         // },
         getStatistics() {
            this.api
               .get("/api/hall/member/member/statistics", {}, this.$other)
               .then((data) => {
                  this.totals = data;
               });
         },
         nowPurchase() {
            console.log("立即购卡");
         },
         toOrder() {
            uni.navigateTo({
               url: "/pages/order/list/index",
            });
         },
         showAuthModal() {
            this.isVisible = true;
         },
         noLogin() {
            this.isVisible = false;
         },
         onGetUserInfo(event) {
            if (event.detail.userInfo) {
               this.$store.commit("setIsAuth", true);
               // this.$store.dispatch("getToken", true);
            }
            this.isVisible = false;
         },
         skipCouponsPage() {

            uni.navigateTo({
               url: "/pages/user/coupons/index",
            });
         },
         skipCardCouponsPage() {

            uni.navigateTo({
               url: "/pages/user/card-coupons/index",
            });
         },
         skipUserInfo() {

            uni.navigateTo({
               url: "/pages/user/info/index",
            });
         },
         skipFeedbackPage() {

            uni.navigateTo({
               url: "/pages/user/feedback/index",
            });
         },
         jumpCourseCard() {

            uni.navigateTo({
               url: "/pages/user/course-card/list/index",
            });
         },
         jumpToBooking() {

            uni.navigateTo({
               url: "/pages/user/booking/index",
            });
         },
         jumpToCollection() {

            uni.navigateTo({
               url: "/pages/user/collection/index",
            });
         },
         jumpToBodyData() {

            uni.navigateTo({
               url: "/pages/user/body-data/index",
            });
         },
         skipStoredValuePage() {

            uni.navigateTo({
               url: "/pages/user/stored-value/index",
            });
         },
      },
   };
</script>

<style lang="scss">
   .user-bg {
      background-color: #f08336;
      color: white;
   }
   .content {
      padding: 0 32upx;
   }

   .user-content-wrapper {
      padding: 0 32upx;
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

   .user-content {
      margin-top: -75upx;
      background: white;
      // height: 300upx;
      margin-bottom: 32upx;
      border-radius: 20upx;
      position: relative;
      padding-top: 80upx;
      .logo {
         position: absolute;
         top: -36upx;
         left: calc(50% - 50upx);
         width: 100upx;
         height: 100upx;
         margin: 0 auto;
         border-radius: 8upx;
         overflow: hidden;
         border: 2px solid white;
         image {
            width: 100%;
            height: 100%;
         }
      }
      .logo-default {
         position: absolute;
         top: -36upx;
         left: calc(50% - 50upx);
         width: 100upx;
         height: 100upx;
         margin: 0 auto;
         border-radius: 8upx;
         overflow: hidden;
         border: 2px solid white;
         display: flex;
         align-items: center;
         justify-content: center;
         image {
            width: 80upx;
         }
      }
      .nick-name {
         // margin-top: 16upx;
         display: flex;
         align-items: center;
         justify-content: center;
         font-size: 36upx;
         .yicon {
            margin-left: 16upx;
         }
      }
      .mobile {
         text-align: center;
         color: rgba(#000000, 0.65);
         line-height: 40upx;
         margin-top: 2px;
      }
      .nav {
         display: flex;
         &-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 40upx 0;
            text-align: center;
            .value {
               color: #f08336;
               display: flex;
               align-items: flex-end;
               justify-content: center;
            }
            .num {
               font-size: 48upx;
               line-height: 1;
            }
            .unit {
               font-size: 24upx;
               margin-left: 4upx;
            }
            .title {
               color: #222527;
            }
         }
      }
   }

   .padding-view {
      height: 144upx;
   }

   .course-card {
      height: 100upx;
      font-size: 26upx;
      text-align: center;
      background-color: white;
      margin-bottom: 32upx;
      border-radius: 20upx;
      padding: 24upx 168upx 24upx 136upx;
      position: relative;
      line-height: 52upx;
      position: relative;
      background-image: url("../../../static/images/fine-card.png");
      background-repeat: no-repeat;
      background-size: 136upx;
      background-position: left 0px bottom 0px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      .purchase {
         display: inline-block;
         width: 144upx;
         height: 52upx;
         position: absolute;
         top: 24upx;
         right: 16upx;
         background-image: linear-gradient(270deg, #dcbb89 0%, #fadbb0 100%);
         border-radius: 26upx;
         color: #784820;
         padding: 0 20upx;
      }
   }

   .menu {
      display: flex;
      background-color: white;
      margin-bottom: 32upx;
      border-radius: 20upx;
      &-item {
         flex: 1;
         display: flex;
         flex-direction: column;
         padding: 32upx 0;
         align-items: center;
      }
      &__icon {
         width: 50upx;
         height: 50upx;
         font-size: 50upx;
         color: #484f55;
      }
      &__name {
         margin-top: 16upx;
      }
   }

   .fun-item {
      padding: 0 32upx;
      margin-bottom: 32upx;
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: 20upx;
      height: 104upx;
      .title {
         color: #222527;
         flex: 1;
      }
      .value {
         color: #999999;
      }
      .right-icon {
         color: #c2c4ca;
      }
   }
   .contact-btn {
      font-size: 28upx;
      &::after {
         border: none;
      }
      .title {
         text-align: left;
      }
   }

   .cell--hover {
      background-color: #e8e8e8;
   }
</style>
