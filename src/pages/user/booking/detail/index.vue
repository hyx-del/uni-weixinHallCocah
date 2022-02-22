<template>
   <view class="container page-bg"
         :class="{'fixed-page': detail.can_order || detail.can_queue }">
      <cu-custom bgColor="bg-white"
                 :isBack="true">
         <block slot="content">预约详情</block>
      </cu-custom>
      <view class="content-wrapper"
            v-if="detail.coursePlanOrderId">
         <view class="order-info">
            <view class="head">
               <view class="left">
                  <view class="yicon icon-order"></view>
                  <view class="date">下单时间：{{ detail.createdAt }}</view>
               </view>
               <view class="right">
                  <text v-if="detail.commentStatus == 0">待评价</text>
                  <text v-else-if="detail.commentStatus == 1">已评价</text>
                  <text v-else-if="detail.statusName">{{detail.statusName}}</text>
               </view>
            </view>
            <view class="course">
               <view class="avatar">
                  <image :src="detail.coachPortrait" />
               </view>
               <view class="course__info">
                  <view class="course__info__item mb16 name-wrap">
                     <view class="label">课程</view>
                     <view class="course-name">{{ detail.courseName }}</view>

                  </view>

                  <view class="labels"
                        v-if="detail.setArrayCourseLabel && detail.setArrayCourseLabel.length">
                     <view class="label-item"
                           v-for="(label, index) in detail.setArrayCourseLabel"
                           :key="index">{{ label }}</view>
                  </view>

                  <view class="course__info__item mb16">
                     <view class="label">教练</view>
                     <view class="value">{{ detail.coachName }}</view>
                  </view>
                  <view class="course__info__item mb16">
                     <view class="label">时间</view>
                     <!-- <view class="value">{{ course.date }}</view> -->
                     <view class="value">{{ detail.date }}</view>
                     <!--  {{ course.start_time }}- {{ course.end_time }} -->
                  </view>
                  <view class="course__info__item mb16">
                     <view class="label">地点</view>
                     <view class="value flex-center">
                        <text>{{ detail.hallName }}</text>
                        <text v-if="detail.classroomName"
                              style="margin-left: 4px;">{{ detail.classroomName }}</text>
                        <view class="address-icon yicon icon-coordinate"
                              @tap="showMap"></view>
                     </view>
                  </view>
                  <!-- <view class="course__info__item mb16">
                            <view class="label">状态</view>
                            <view class="value flex-center">
                                <view v-if="detail.status == 1">已完成</view>
                                <view v-else-if="detail.status == -1">已取消</view>
                                <view v-else-if="detail.status == 2">申请中</view>
                                <view v-else-if="detail.status == 0">未完成</view>
                            </view>
                        </view> -->
                  <!-- v-if="detail.comment_status == 1" -->
                  <view class="btn-handle"
                        v-if="detail.commentStatus == 0">
                     <button class="cu-btn bg-default comment-btn"
                             @click="jumpMyComment">去评价</button>
                  </view>
               </view>
            </view>
         </view>

         <view class="fun-item"
               hover-class="cell--hover"
               hover-stay-time="70"
               @click="jumpMyComment"
               v-if="detail.commentStatus == 1">
            <view class="title">我的评价</view>
            <view class="cuIcon-right right-icon"></view>
         </view>

         <view class="card">
            <view class="card__title">您的预约信息:</view>
            <view class="info-cell mb32"
                  v-if="detail.hasOrder">
               <view class="name">已预约</view>
               <view class="value">{{ detail.hasOrder }}人</view>
            </view>
            <view class="info-cell mb32"
                  v-if="detail.hasQueue">
               <view class="name">排队中</view>
               <view class="value">{{ detail.hasQueue }}人</view>
            </view>
            <view class="info-cell mb32"
                  v-if="detail.hasSigned">
               <view class="name">已上课</view>
               <view class="value">{{ detail.hasSigned }}人</view>
            </view>
            <view class="info-cell mb32"
                  v-if="detail.hasUnsigned">
               <view class="name">已爽约</view>
               <view class="value">{{ detail.hasUnsigned }}人</view>
            </view>
            <view class="info-cell mb32">
               <view class="name">支付方式</view>
               <!-- <view class="value">单店次卡</view> -->
               <view class="value"
                     v-if="detail.channel == 10">{{ detail.courseCardName }}</view>
               <view class="value"
                     v-else-if="detail.channel == 20">余额支付</view>
               <view class="value"
                     v-else-if="detail.channel == 30">微信支付</view>
               <view class="value"
                     v-else-if="detail.channel == 50">联卡券支付</view>
            </view>
            <view class="info-cell">
               <view class="name">合计</view>
               <view class="value"
                     v-if="detail.channel == 10">{{ detail.amount }}<text v-if="detail.amount">次</text></view>
               <view class="value"
                     v-else-if="detail.channel == 50">￥0</view>
               <view class="value"
                     v-else>￥{{ detail.amount }}</view>
            </view>
            <view class="info-cell mt32"
                  style="align-items: flex-start;"
                  v-if="detail.remark">
               <view class="name">备注</view>
               <view class="value remark"
                     style="flex: 1;">{{ detail.remark }}</view>
            </view>

         </view>

         <view class="card"
               v-for="(order, oIndex) in detail.memberCoursePlanItemVOS"
               :key="order.coursePlanOrderItemId">
            <view class="user-info">
               <view class="yicon icon-user"></view>
               <view class="date">{{ order.time }}</view>
               <view class="primary"
                     v-if="order.status == 20 || order.status == 40">{{ order.statusName }}</view>
               <view class="green"
                     v-else-if="order.status == 10">
                  <text>已排队</text>
                  <text v-if="order.queueNumber"
                        style="margin-left: 4px;">[排序: {{ order.queueNumber }}]</text>
               </view>
               <view class="cancel-color"
                     v-else>{{ order.statusName }}</view>
            </view>
            <view class="handle-wrap"
                  v-if="order.status == 20 || order.status == 5 || order.status == 10">
               <button class="cu-btn cancel-btn"
                       v-if="order.status == 20 || order.status == 5"
                       :data-index="oIndex"
                       @tap="cancelBooking">取消</button>
               <!-- <button class="cu-btn afresh-btn" v-else-if="order.status == -20" @tap="afreshBooking">重新预约</button> -->
               <button class="cu-btn cancel-btn"
                       v-else-if="order.status == 10"
                       :data-index="oIndex"
                       @tap="cancelQueue">取消</button>
            </view>
         </view>
      </view>

      <view class="footer"
            v-if="detail.can_order || detail.can_queue">//todo
         <view v-if="detail.can_order"
               class="handle-btn btn-bg-primary"
               :class="detail.channel != 10 ? 'btn-bg-disable' : ''"
               @tap="addPeer">添加同行</view>
         <view v-if="detail.can_queue"
               class="handle-btn btn-bg-green"
               @tap="addQueue">添加排队</view>
      </view>
   </view>
</template>
<script>
   import { mapState } from 'vuex';
   export default {
      data() {
         return {
            detail: {
               course_card: {},
            },
            course: {},
            pageInit: true,
            ossResize: "?x-oss-process=image/resize,m_fill,w_200,h_200",
            result: {}
         }
      },
      computed: mapState(['ossPath', 'memberId']),
      async onLoad(options) {
         let currentOrder = uni.getStorageSync("currentOrder");
         this.course = JSON.parse(currentOrder);
         console.log("预约详情", options, this.course);
         this.getBookingDetail(options.id);

         this.result = await this.api.get("/app/api/user/grant/info", {}, { type: "other" });

      },
      onShow() {
         if (this.pageInit) {
            this.pageInit = false;
            return;
         }
         this.getBookingDetail(this.detail.CoursePlanOrderId);
      },
      methods: {
         getBookingDetail(id) {
            let params = {
               CoursePlanOrderId: id,
            }
            this.api.get("/api/hall/member/course/plan/appointment/detail", params, this.$other).then(data => {
               if (!data.code) {
                  if (data.id && data.payments && data.payments.length) {
                     data.paymentType = data.payments[0].channel;
                  }
                  if (data.paymentType == 10) { // 课程卡支付
                     data.total = parseInt(data.total);
                  }
                  let { date, startAtTime, endAtTime } = data
                  data.date = `${date} ${startAtTime}-${endAtTime}`
                  this.detail = data || {};
                  uni.setStorageSync("makeDetail", this.detail)
                  console.log("预约详情", this.detail);
               } else {
                  uni.navigateBack({
                     delta: 1
                  })
               }
            })
         },
         addPeer() {
            if (this.detail.paymentType != 10) return;
            uni.navigateTo({
               url: "/pages/user/booking/peer/index?id=" + this.detail.course_plan_id +
                  "&hall_id=" + this.detail.hall_id + "&order_id=" + this.detail.id + "&amount=" + (this.detail.has_order || 0)
                  + "&course_card_id=" + this.detail.member_course_card_id,
            })
         },
         addQueue() {
            uni.navigateTo({
               url: "/pages/user/booking/peer/index?id=" + this.detail.course_plan_id +
                  "&hall_id=" + this.detail.hall_id + "&order_id=" + this.detail.id + "&amount=" + (this.detail.has_order || 0)
                  + "&course_card_id=" + this.detail.member_course_card_id + "&queue=true",
            })
         },
         cancelBooking(event) {
            const { index } = event.currentTarget.dataset;
            let order = this.detail.memberCoursePlanItemVOS[index];
            let { appid, openid } = this.result
            let params = {
               id: order.coursePlanOrderItemId,
               appid,
               openid
            }
            if (this.detail.courseType == 3) {
               uni.showToast({
                  icon: "none",
                  title: "企业课预约无法取消",
                  duration: 3000,
               });
               return;
            }
            let text = order.status == 20 ? "预约" : "申请";
            uni.showModal({
               content: "是否取消" + text + "？",
               success: (res) => {
                  if (res.confirm) {
                     this.api.post("/api/hall/course/plan/order/cancel", params, this.$other).then(ret => {
                        if (ret.code == 200) {
                           uni.showToast({
                              icon: "none",
                              title: "取消" + text + "成功",
                           })
                           this.getBookingDetail(this.detail.coursePlanOrderId);
                        } else {
                           uni.showToast({
                              icon: "none",
                              title: ret.msg,
                           })
                        }
                     })
                  }
               }
            })

         },
         cancelQueue(event) {
            const { index } = event.currentTarget.dataset;
            let order = this.detail.memberCoursePlanItemVOS[index];
            let { appid, openid } = this.result
            let params = {
               id: order.coursePlanOrderItemId,
               appid,
               openid
            }
            uni.showModal({
               content: "是否取消排队？",
               success: (res) => {
                  if (res.confirm) {
                     this.api.post("/api/hall/course/plan/order/cancel/queue", params, this.$other).then(ret => {
                        if (ret.code == 200) {
                           uni.showToast({
                              icon: "none",
                              title: "取消排队成功",
                           })
                           this.getBookingDetail(this.detail.coursePlanOrderId);
                        } else {
                           uni.showToast({
                              icon: "none",
                              title: ret.msg,
                           })
                        }
                     })
                  }
               }
            })
         },
         afreshBooking() {

         },
         jumpToComment() {
            uni.navigateTo({
               url: "/pages/user/comment/index?id=" + this.detail.coursePlanOrderId,
            })
         },
         jumpMyComment() {
            uni.navigateTo({
               url: "/pages/user/comment/index?orderId=" + this.detail.coursePlanOrderId,
            })
         },
         showMap() {
            console.log("显示地图");
            uni.navigateTo({
               url: '/pages/reservation/detail/index?id=' + this.detail.hallId,
            })
         },
         statusColor(status) {
            return status;
         }
      }
   }
</script>
<style lang="scss">
   .content-wrapper {
      padding: 0 32upx;
      padding-top: 32upx;
      color: #222527;
   }
   .order-info {
      padding: 32upx;
      background: #ffffff;
      border-radius: 20upx;
      margin-bottom: 32upx;
      .head {
         padding-bottom: 24upx;
         display: flex;
         align-items: center;
         .date {
            margin-left: 16upx;
         }
         .left {
            flex: 1;
            display: flex;
            align-items: center;
         }
         .right {
            color: #f08336;
         }
      }
   }

   .labels {
      display: flex;
      margin-left: -12upx;
      flex-wrap: wrap;
      // white-space: nowrap;
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

   .course {
      display: flex;
      .avatar {
         width: 132upx;
         height: 132upx;
         border-radius: 8upx;
         overflow: hidden;
         margin-right: 24upx;
         image {
            width: 100%;
            height: 100%;
         }
      }
   }
   .course__info {
      flex: 1;
      overflow: hidden;
      .name-wrap {
         white-space: nowrap;
         display: flex;
         align-items: center;
      }
      &__item {
         display: flex;
         flex-wrap: wrap;
         .label {
            color: #636f7c;
            margin-right: 24upx;
         }
         .value {
            flex: 1;
            color: #222527;
            display: flex;
         }
      }
      .address-icon {
         font-size: 34upx;
         height: 34upx;
         margin-left: 16upx;
         color: #f08336;
      }
      .flex-center {
         display: flex;
         align-items: center;
      }

      .course-name {
         color: #222527;
         white-space: nowrap;
         text-overflow: ellipsis;
         overflow: hidden;
      }
   }
   .btn-handle {
      display: flex;
      justify-content: flex-end;
      padding-top: 16upx;
   }
   .comment-btn {
      background: #ffffff;
      border: 1px solid #cccccc;
      border-radius: 33upx;
      padding: 12upx 30upx;
      font-size: 30upx;
      color: rgba(0, 0, 0, 0.65);
   }
   .bg-default {
      background-color: white;
   }
   .mb16 {
      margin-bottom: 16upx;
   }
   .mb32 {
      margin-bottom: 32upx;
   }
   .mt32 {
      margin-top: 32upx;
   }
   .card {
      padding: 32upx;
      margin-bottom: 32upx;
      border-radius: 20upx;
      background-color: white;
      color: #222527;
      &__title {
         font-size: 34upx;
         margin-bottom: 24upx;
      }
      .info-cell {
         display: flex;
         align-items: center;
         justify-content: space-between;
         .name {
            font-size: 30upx;
         }
         .value {
            color: #636f7c;
         }
         .remark {
            flex: 1;
            padding-left: 32upx;
            text-align: right;
         }
      }
      .user-info {
         display: flex;
         align-items: center;
         .yicon {
            font-size: 36upx;
         }
         .date {
            flex: 1;
            padding: 0 24upx;
         }
         .primary {
            color: #f08336;
         }
         .cancel-color {
            color: #aab1b6;
         }
         .green {
            color: #02b94e;
         }
      }
      .handle-wrap {
         margin-top: 32upx;
         display: flex;
         justify-content: flex-end;
         .afresh-btn {
            border: 1px solid #f08336;
            padding: 6upx 32upx;
            background-color: white;
            color: #f08336;
            border-radius: 50upx;
            font-size: 24upx;
            height: 46upx;
         }
         .cancel-btn {
            border: 1px solid #999999;
            padding: 6upx 32upx;
            background-color: white;
            color: #636f7c;
            border-radius: 50upx;
            font-size: 24upx;
            height: 46upx;
         }
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

   .cell--hover {
      background-color: #e8e8e8;
   }

   .handle-btn {
      width: 100%;
      height: 100upx;
      line-height: 100upx;
      text-align: center;
      font-size: 32upx;
      color: white;
      &.disable {
         background: #cccccc;
      }
   }
   .btn-bg-primary {
      background: #f08336;
   }
   .btn-bg-green {
      background: #02b94e;
   }

   .btn-bg-disable {
      background: #cccccc;
   }
</style>