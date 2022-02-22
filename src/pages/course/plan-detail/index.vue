<template>
   <view class="container page-bg fixed-page">
      <cu-custom bgColor="bg-white"
                 :isBack="true">
         <block slot="content">课程详情</block>
      </cu-custom>
      <view class="banner-wrap"
            v-if="course.id">
         <!-- <image style="width: 100%;" src="https://zhongle-store.oss-cn-hangzhou.aliyuncs.com/mini/banner1.png"></image> -->
         <image v-if="course.classroom_type == 1"
                style="width: 100%"
                src="https://fanyin-oss.fineyoga.com/base/online_course_banner.jpg"></image>
         <image v-else
                style="width: 100%"
                src="https://fanyin-oss.fineyoga.com/base/course_banner.jpg"></image>
      </view>
      <view class="content-wrapper"
            v-if="course.id">
         <view class="card course-info">
            <view class="head-info">
               <view class="avatar">
                  <image :src="course.coachPortrait" />
               </view>
               <view class="info">
                  <view class="head">
                     <view class="course-name">{{ course.courseName }}</view>
                     <view class="labels"
                           v-if="course.arrayCourseLabel.length">
                        <view class="label-item"
                              v-for="(label, index) in course.arrayCourseLabel"
                              :key="index">{{ label }}</view>
                     </view>
                  </view>
                  <view class="user-info">
                     <view class="left">
                        <view class="name">{{ course.coachName }}</view>
                        <!-- <view class="star">
                                    <view v-for="(item) in 5" :key="item" :class="item > 3 ? 'cuIcon-favor' : 'cuIcon-favorfill'"></view>
                                </view> -->
                     </view>
                     <view class="unit-price"
                           v-if="course.price">
                        <text class="unit">￥</text>{{ course.price }}
                     </view>
                  </view>
               </view>
            </view>
            <view class="tag">{{ courseTypeMap[course.type || 1] }}</view>
            <view class="info-item">
               <view class="yicon icon-classroom"></view>
               <text>{{ course.address || "" }}</text>
            </view>
            <view class="info-item">
               <view class="yicon icon-time"></view>
               <text>{{ course.courseTime }}</text>
            </view>
         </view>
         <view class="card">
            <view class="title">课程介绍</view>
            <view class="course-desc">
               <!-- <view>肩颈脊椎（练习强度1.5级）</view> -->
               <!-- <view>{{ course.courseName }}</view> -->
               {{ course.introduction || "" }}
            </view>
         </view>
         <view class="card"
               v-if="course.hasOrder">
            <view class="head">
               <view class="title">当前成员</view>
               <view class="people">{{ course.hasOrder }}/{{ course.maxOrder }}</view>
            </view>
            <scroll-view scroll-x="true"
                         class="people-list">
               <view class="people-item"
                     v-for="(avatar, index) in course.memberAvatar"
                     :key="index">
                  <image v-if="avatar.avatar"
                         :src="avatar.avatar"
                         @error="imgLoadError(index)" />
                  <image v-else
                         src="../../../static/images/user.svg" />
               </view>
            </scroll-view>
         </view>
         <view class="card">
            <view class="title">上课须知</view>
            <view class="tip"
                  v-if="course.hallId == 58">
               <view>1、开课前1小时之内不能取消课程。</view>
               <view>2、开课前1小时以上可以预约和取消课程</view>
               <view>3、课程开始前90分钟会有短信提醒。</view>
               <view>4、排队成功的课程会发短信提醒（课前90分钟不再发短信提醒）。</view>
               <view>5、准备好瑜伽垫,砖,抱枕等辅具。</view>
               <view>6、请选择宽敞,明亮，网络信号好的练习环境，独立的空间为宜，确保大家在上课过程中不受外界干扰。</view>
            </view>
            <view class="tip"
                  v-else>
               <view>1、开课前1小时以上可以预约课程。</view>
               <view>2、开课前1小时以上可以取消预约，支持退款。</view>
               <view>3、课程开始前90分钟会有短信提醒。</view>
               <view>4、到店上课时需要在前台扫码签到。</view>
               <view>5、上完课后可以对老师课程进行评价。</view>
               <view>6、为保障会员上课质量，开课后不允许再进出教室。</view>
            </view>
         </view>
      </view>

      <view class="cu-modal auth-modal"
            :class="isVisible ? 'show' : ''">
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
                       class="primary-btn">
                  立即登录
               </button>
            </view>
         </view>
      </view>

      <view class="footer"
            v-if="course.id">
         <view v-if="isReservation"
               class="footer-btn"
               @click="cancelReservation">取消预约</view>
         <view v-else-if="course.status == 1 || course.status == -1"
               class="footer-btn bg-primary"
               :class="course.status == -1 ? 'disable' : ''"
               @click="nowReservation">立即约课</view>

         <view v-else-if="course.status == 2 || course.status == -2"
               class="footer-btn bg-green"
               :class="course.status == -2 ? 'disable' : ''"
               @click="nowQueue">立即排队</view>
         <view v-else-if="course.status == 3"
               class="footer-btn disable">已开始</view>
         <view v-else-if="course.status == 4"
               class="footer-btn disable">已结束</view>
      </view>
   </view>
</template>

<script>
   import { mapState } from "vuex";
   export default {
      data() {
         return {
            isShare: false,
            isReservation: false,
            StatusBar: this.StatusBar,
            CustomBar: this.CustomBar,
            scrollTop: 0,
            course: {},
            isLoggingIn: false,
            isVisible: false,
            otherToken: uni.getStorageSync("otherToken"),
            // statusMap: {
            //     1：可预约
            //     -1：不可预约
            //     2：可排队
            //     -2：不可排队
            //     3：已开始
            //     -3：已结束
            // }
            ossResize: "?x-oss-process=image/resize,m_fill,w_200,h_200",
            isimgLoadError: false,
         };
      },
      computed: {
         style() {
            let alpha = 0;
            if (this.scrollTop > 100) {
               alpha = 1;
            } else if (this.scrollTop <= 100 && this.scrollTop > 50) {
               alpha = this.scrollTop / 100;
            } else {
               alpha = 0;
            }
            return `
                    height:${this.CustomBar}px;
                    padding-top:${this.StatusBar}px;
                    background-color: rgba(255, 255, 255, ${alpha});
                `;
         },
         ...mapState(["courseTypeMap", "ossPath", "isLogin", "isAuth"]),
      },
      onLoad(options) {
         if (options.reservation) {
            this.isReservation = true;
         }
         let url = "/api/hall/course/plan/open/detail";
         this.api.get(url, { coursePlanId: options.id }, this.$other).then((ret) => {
            if (ret.price) {
               ret.price = parseFloat(ret.price);
            }

            // if (ret.arrayCourseLabel) {
            //   ret.arrayCourseLabel = ret.arrayCourseLabel[0].split(" ");
            // }

            this.course = ret;
            this.course.id = options.id;
            console.log("课程详情", ret);
         });
      },
      onPageScroll(event) {
         this.scrollTop = event.scrollTop;
      },
      watch: {
         // isLogin(value) {
         //    if (value) {
         //       this.isLoggingIn = false;
         //       if (this.course.hasOrder >= this.course.maxOrder) {
         //          this.nowQueue();
         //       } else {
         //          this.nowReservation();
         //       }
         //    }
         // },
      },
      methods: {
         nowReservation() {
            if (this.course.status == 4 || this.course.status == -1) {
               // uni.showToast({
               //     icon: "none",
               //     title: "课程已结束",
               // })
               return;
            }

            uni.navigateTo({
               url:
                  "/pages/course/reservation/index?id=" +
                  this.course.id +
                  "&hall_id=" +
                  this.course.hallId +
                  "&status=" +
                  this.course.status,
            });
         },
         nowQueue() {
            if (this.course.status == -2 || this.course.status == 4) {
               return;
            }
            uni.navigateTo({
              url:
                  "/pages/course/reservation/index?id=" +
                  this.course.id +
                  "&hall_id=" +
                  this.course.hallId +
                  "&status=" +
                  this.course.status,
            });
         },
         showAuthModal() {
            this.isVisible = true;
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
         cancelReservation() {
            console.log("取消预约");
         },
         BackPage() {
            if (this.isShare) {
               uni.reLaunch({
                  url: "/pages/tabbar/home",
               });
            } else {
               uni.navigateBack({
                  delta: 1,
               });
            }
         },
         imgLoadError(index) {
            this.$set(this.course.memberAvatar, index, null);
         },
      },
   };
</script>

<style lang="scss">
   .content-wrapper {
      padding: 0 32upx;
      padding-top: 32upx;
   }
   .banner-wrap {
      height: 375upx;
      image {
         height: 100%;
      }
   }
   .course-info {
      position: relative;
      .head-info {
         display: flex;
      }
      .avatar {
         width: 132upx;
         height: 132upx;
         // background-color: #f1f1f1;
         border-radius: 8upx;
         margin-right: 24upx;
         overflow: hidden;
         image {
            width: 100%;
            height: 100%;
         }
      }
      .tag {
         position: absolute;
         top: 0;
         right: 32upx;
         width: 72upx;
         height: 36upx;
         font-size: 20upx;
         line-height: 36upx;
         text-align: center;
         background: #48c5b6;
         border-radius: 0 0 12upx 12upx;
         color: white;
      }
      .info {
         flex: 1;
         display: flex;
         flex-direction: column;
         justify-content: center;
         overflow: hidden;
         .head {
            // display: flex;
            align-items: center;
            margin-bottom: 16upx;
            overflow: hidden;
            flex-wrap: wrap;
         }
         .course-name {
            font-size: 30upx;
            color: #222527;
            white-space: nowrap;
            text-overflow: ellipsis;
         }
      }
      .user-info {
         display: flex;
         justify-content: space-between;
         .left {
            display: flex;
            align-items: center;
         }
         .name {
            color: #636f7c;
         }
         .star {
            display: flex;
            margin-left: 8upx;
            color: #ffd000;
            font-size: 20upx;
         }
      }
      .unit-price {
         color: #ff0000;
         font-size: 36upx;
         .unit {
            font-size: 28upx;
         }
      }
      .info-item {
         color: #222527;
         padding-left: 156upx;
         margin-top: 16upx;
         display: flex;
         align-items: center;
         .yicon {
            color: #f08336;
         }
         text {
            margin-left: 8upx;
         }
      }
   }
   .course-desc {
      color: #484f55;
      line-height: 48upx;
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
         justify-content: center;
         font-size: 32upx;
         &::after {
            border: none;
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

   .card {
      padding: 32upx;
      margin-bottom: 32upx;
      background: white;
      border-radius: 20upx;
      position: relative;
      .head {
         // display: flex;
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
      .tip {
         color: #484f55;
         line-height: 50upx;
      }
   }
   .people-list {
      white-space: nowrap;
   }
   .people-item {
      width: 60upx;
      height: 60upx;
      margin: 8rpx 0;
      margin-right: 16upx;
      overflow: hidden;
      border-radius: 50%;
      display: inline-block;
      // background-color: #f1f1f1;
      image {
         width: 100%;
         height: 100%;
      }
   }
   .footer-btn {
      height: 100upx;
      font-size: 32upx;
      text-align: center;
      line-height: 100upx;
      color: #ffffff;
      background: #f08336;
      &.disable {
         background: rgba(#f08336, 0.6) !important;
      }
      &.bg-primary {
         background-image: linear-gradient(-58deg, #ff401f 2%, #ff711e 75%);
      }
      &.bg-green {
         background: #02b94e;
         &.disable {
            background: rgba(#02b94e, 0.6) !important;
         }
      }
   }
</style>
