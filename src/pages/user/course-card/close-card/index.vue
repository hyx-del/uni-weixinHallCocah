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
               <view class="logo"></view>
               <view class="card-info">
                  <view class="name">{{ card.name }}</view>
                  <view class="desc">FineYoga VIP</view>
                  <view class="card-no">{{ card.cardNo || '' }}</view>
               </view>
               <view class="total-wrap">
                  <text class="total">
                     <text v-if="card.status == 30">已转卡</text>
                     <text v-else-if="card.status == -20">已关卡</text>
                     <text v-else>已失效</text>
                  </text>
               </view>
            </view>
         </view>
      </view>

      <view class="no-card"
            v-else-if="isLoadingComplete && !courseCardList.length">
         <view class="no-card-wrap">
            <view class="tip">您还没有已作废的卡</view>
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
            isLoadingComplete: false,
         }
      },
      computed: mapState(['memberId']),
      onLoad() {
         this.getCourseCardList();
      },
      methods: {
         getCourseCardList() {
            let params = {
               member_id: this.memberId,
               invalid: true
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
               this.courseCardList = data.records || [];
               this.isLoadingComplete = true;
            })
         },
         courseCardDetail(event) {
            const { id, index } = event.currentTarget.dataset;
            let type = this.courseCardList[index].type;
            uni.navigateTo({
               url: "/pages/user/course-card/detail/index?id=" + id + "&type=" + type,
            })
         },
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
         }
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
