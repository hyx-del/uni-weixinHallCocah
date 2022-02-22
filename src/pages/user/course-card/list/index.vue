<template>
   <view class="container page-bg">
      <cu-custom bgColor="bg-white"
                 :isBack="true">
         <block slot="content">我的课程卡</block>
      </cu-custom>
      <view class="card-list"
            v-if="isLoadingComplete && courseCardList.length">
         <view class="card-item"
               v-for="(card, index) in courseCardList"
               :key="index"
               :data-id="card.id"
               :data-index="index"
               :style="{'background-image': card.color}"
               @click="courseCardDetail">
            <view class="card-item-wrap">
               <view class="logo">
                  <!-- <image src="../../../../static/images/card-logo.png" /> -->
               </view>
               <view class="card-info">
                  <view class="name">{{ card.name }}</view>
                  <view class="desc">FineYoga VIP</view>
                  <!-- <view class="card-info-item">
                            <view class="label">余额:</view>
                            <view>{{ card.balance }}</view>
                            <text v-if="card.type == 1">次</text>
                            <text v-else-if="card.type == 2">天</text>
                        </view>
                        <view class="card-info-item">
                            <view class="label">有效期:</view>
                            <view>
                                <text>{{ card.start_date }}</text>
                                <text>~</text>
                                <text>{{ card.end_date }}</text>
                            </view>
                        </view> -->
                  <view class="card-no">{{ card.cardNo || '' }}</view>
               </view>
               <view class="total-wrap">
                  <text>剩余</text>
                  <text class="total">{{ card.balance }}</text>
                  <text v-if="card.type == 1">次</text>
                  <text v-else-if="card.type == 2">天</text>
                  <view v-if="card.type == 1  && card.availableTimes"
                        style="margin-left: 8px;">
                     <text>可用</text>
                     <text class="total">{{ card.availableTimes }}</text>
                     <text>次</text>
                  </view>
               </view>
               <view class="tag"
                     v-if="card.status == -30">请假中</view>
               <view class="tag"
                     v-else-if="card.status == -10">已停卡</view>
               <view class="tag"
                     v-else-if="card.status == 30">已转卡</view>
               <view class="tag"
                     v-else-if="card.status == -20">已关卡</view>
            </view>
         </view>

         <view class="other-card"
               v-if="disabledCourseCardList.length"
               @click="skipCloseCardPage">查看已作废的卡</view>
      </view>

      <view class="no-data-wrap"
            v-else-if="isLoadingDisabledCard && !courseCardList.length && disabledCourseCardList.length ">
         <view style="flex: 1;">暂无可用课程卡</view>
         <view class="other-card"
               v-if="disabledCourseCardList.length"
               @click="skipCloseCardPage">查看已作废的卡</view>
      </view>

      <view class="no-card"
            v-else-if="isLoadingComplete && isLoadingDisabledCard && !courseCardList.length">
         <view class="no-card-wrap">
            <view class="tip">您还没有课程卡</view>
            <view class="tip">拥有一张课程卡，享受轻松约课</view>
            <!-- <button class="cu-btn bg-card purchase-btn"
                    @click="nowPurchase">立即购卡</button> -->

            <view class="position-image">
               <view class="image-box">
                  <image src="../../../../static/images/card.svg"></image>
               </view>
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
            colors: [
               'linear-gradient(-48deg, #575555 0%, #363636 98%)',
               'linear-gradient(-48deg, #649AEB 0%, #297CF7 98%)',
               'linear-gradient(-48deg, #FE88C5 0%, #F560AD 98%)',
               'linear-gradient(-48deg, #9D71F6 0%, #692EDE 98%)',
               'linear-gradient(-48deg, #2ACEC4 0%, #04B8AD 97%)',
               'linear-gradient(-48deg, #F19C39 0%, #F08100 97%)',
            ],
            courseCardList: [],
            disabledCourseCardList: [],
            isLoadingComplete: false,
            isLoadingDisabledCard: false,
         }
      },
      computed: mapState(['memberId']),
      onLoad() {
         this.getCourseCardList();
         this.getDisabledCourseCardList();
      },
      onPullDownRefresh() {
         uni.showNavigationBarLoading();
         this.getCourseCardList();
      },
      methods: {
         getCourseCardList() {
            let params = {
               invalid: false
            }
            this.api.get("/api/hall/member/course/card/list", params, this.$other).then(data => {
               let colorIndex = 0;
               data.records.forEach(item => {
                  if (colorIndex > this.colors.length - 1) {
                     colorIndex = 0;
                  }
                  item.color = this.colors[colorIndex];
                  colorIndex++;
               });
               this.courseCardList = data.records;
               // this.courseCardList = [];
               this.isLoadingComplete = true;

               uni.hideNavigationBarLoading();
               uni.stopPullDownRefresh();
            })
         },
         getDisabledCourseCardList() {
            let params = {
               member_id: this.memberId,
                 invalid: true
            }
            this.api.get("/api/hall/member/course/card/list", params, this.$other).then(data => {
               this.disabledCourseCardList = data.records || [];
               this.isLoadingDisabledCard = true;
            })
         },
         courseCardDetail(event) {
            const { id, index } = event.currentTarget.dataset;
            let type = this.courseCardList[index].type;
            uni.navigateTo({
               url: "/pages/user/course-card/detail/index?id=" + id,
            })
         },
         nowPurchase() {
            console.log("购卡");
         },
         skipCloseCardPage() {
            uni.navigateTo({
               url: "/pages/user/course-card/close-card/index",
            })
         }
      }
   }
</script>
<style lang="scss">
   .card-list {
      padding: 0 32upx;
      padding-top: 32upx;
   }
   .card-item {
      // height: 226upx;
      height: 344upx;
      padding: 32upx;
      margin-bottom: 32upx;
      background: #3b3b3b;
      border-radius: 20upx;
      color: white;
      // background-image: url("../../../../static/images/biglogo.png");
      // background-position: right 32upx bottom 74upx;
      // background-repeat: no-repeat;
      // background-size: 265upx;
      // background-image: linear-gradient(-48deg, #575555 0%, #363636 98%);
      display: flex;
      &-wrap {
         width: 100%;
         height: 100%;
         position: relative;
         background-image: url("../../../../static/images/biglogo.png");
         background-position: right 0upx bottom 40upx;
         background-repeat: no-repeat;
         background-size: 265upx;
         display: flex;
         position: relative;
      }
      .logo {
         width: 80upx;
         height: 80upx;
         overflow: hidden;
         border-radius: 50%;
         margin-right: 24upx;
         background-image: url("../../../../static/images/card-logo.png");
         background-repeat: no-repeat;
         background-size: 100%;
         image {
            width: 100%;
            height: 100%;
         }
      }
      .card-info {
         flex: 1;
         .name {
            font-size: 30upx;
         }
         .desc {
            font-size: 24upx;
            color: rgba(255, 255, 255, 0.5);
            margin-top: 4upx;
         }
         .card-no {
            font-size: 30upx;
            margin-top: 40upx;
            text-shadow: 0 2px 4px rgba(#000000, 0.5);
            letter-spacing: 1px;
         }
      }
      .total-wrap {
         position: absolute;
         left: 0;
         bottom: 0;
         display: flex;
         align-items: flex-end;
         color: white;
         font-size: 24upx;
         .total {
            font-size: 36upx;
            line-height: 1;
            margin: 0 4upx;
         }
      }

      .tag {
         position: absolute;
         top: -32upx;
         right: 0;
         font-size: 26upx;
         padding: 8upx 24upx;
         color: white;
         border-radius: 0 0 12upx 12upx;
         background: #ff7171;
      }

      // .card-info-item {
      //     margin-top: 8upx;
      //     display: flex;
      //     align-items: center;
      //     .label {
      //         margin-right: 8upx;
      //     }
      // }
   }
   .other-card {
      text-align: center;
      color: #636f7c;
      padding: 8upx 0;
      margin-top: 72upx;
      margin-bottom: 40upx;
   }
   .no-data-wrap {
      width: 100%;
      flex: 1;
      padding: 32upx;
      display: flex;
      flex-direction: column;
      text-align: center;
      color: #636f7c;
      .other-card {
         margin-bottom: 0;
      }
   }
   .no-card {
      width: 100%;
      flex: 1;
      padding: 32upx;
      display: flex;
      flex-direction: column;
      &-wrap {
         position: relative;
         flex: 1;
         background-color: white;
         border-radius: 20upx;
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         padding-bottom: 48upx;
         .tip {
            text-align: center;
            color: #484f55;
            &:not(:last-child) {
               margin-bottom: 16upx;
            }
         }
      }
      .purchase-btn {
         margin-top: 100upx;
         width: 266upx;
         height: 80upx;
         border-radius: 12upx;
         font-size: 32upx;
      }
      .bg-card {
         background-image: linear-gradient(270deg, #dcbb89 0%, #fadbb0 100%);
         color: #784820;
      }

      .position-image {
         width: 100%;
         position: absolute;
         left: 0;
         bottom: 0;
         display: flex;
         justify-content: center;
         .image-box {
            width: 500upx;
            height: 195upx;
         }
         image {
            width: 100%;
            height: 100%;
         }
      }
   }
</style>
