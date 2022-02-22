<template>
   <view class="container page-bg">
      <cu-custom bgColor="bg-white"
                 :isBack="true"
                 :isHome="isHome">
         <block slot="content">我的预约</block>
      </cu-custom>
      <scroll-view scroll-x
                   class="position-sticky bg-white nav"
                   :style="'top:' + CustomBar + 'px'">
         <view class="flex text-center">
            <view class="cu-item flex-sub"
                  :class="index==tabIndex?'active':''"
                  v-for="(tab, index) in tabs"
                  :key="index"
                  @tap="tabSelect"
                  :data-id="tab.id"
                  :data-index="index">
               {{ tab.name }}
            </view>
         </view>
      </scroll-view>

      <view class="content-wrapper">
         <view class="card course-info"
               v-for="(order, index) in orderList"
               :key="order.id"
               :data-index="index"
               :data-id="order.coursePlanOrderId"
               @click="skipOrderDetail">
            <view class="head-info">
               <view class="avatar">
                  <image :src="order.coachPortrait" />
               </view>
               <view class="info">
                  <view class="course-wrapper">
                     <view class="course-name">{{ order.courseName }}</view>
            
                  </view>

         <view class="labels"
                           v-if="order.courseLabelsNameArray && order.courseLabelsNameArray.length">
                        <view class="label-item"
                              v-for="(label, index) in order.courseLabelsNameArray"
                              :key="index">{{ label }}</view>
                     </view>

                  <view class="user-info"
                        style="margin-bottom: 8upx;">
                     <view class="left">
                        <view class="name">{{ order.coachName }}</view>
                        <view class="star">
                           <!-- <view v-for="(item) in 5" :key="item" :class="item > 3 ? 'cuIcon-favor' : 'cuIcon-favorfill'"></view> -->
                        </view>
                     </view>
                  </view>
               </view>

               <view class="status"
                     @click.stop="showDropdown(index)">
                  <view :style="[{ color: colorsMap[order.status] || '' }]">
                     <text>{{ order.statusName }}</text>
                     <!-- <text v-if="order.itemStatusNames.length > 1">{{order.itemStatusNames.length}}</text> -->
                  </view>
                  <!-- <view class="ico yicon1"
                        v-if="order.itemStatusNames.length"
                        :class="order.isVisible ? 'icon-up' : 'icon-down'"></view> -->
                  <!-- <text class="cuIcon-triangledownfill ico"></text> -->

                  <!-- <view class="dropdown-status"
                        v-if="order.isVisible && order.itemStatusNames.length">
                     <view class="dropdown-item"
                           v-for="(item, index) in order.itemStatusNames"
                           :key="index"
                           :style="[{ color: colorsMap[item.status] || '' }]">
                        {{ item.name }}{{ item.member_count }}
                     </view>
                  </view> -->
               </view>

            </view>
            <view class="tag"
                  :class="order.type != 1 ? 'private' : 'team'">{{ courseTypeMap[order.courseType] }}</view>
            <view class="info-item">
               <view class="yicon icon-classroom"></view>
               <text>{{ order.hallName }} </text>
               <text v-if="order.classroomName">{{ order.classroomName }}</text>
            </view>
            <view class="info-item">
               <view class="yicon icon-time"></view>
               <text>{{ order.date }}</text>
            </view>
         </view>
         <view class="loading-text"
               v-if="loading">加载中...</view>
         <view class="loading-text"
               v-if="!loading && !orderList.length">暂无数据</view>
      </view>
   </view>
</template>
<script>
   import { mapState } from 'vuex';
   export default {
      data() {
         return {
            orderList: [],
            CustomBar: this.CustomBar,
            tabs: [
               { name: "全部", id: 0, },
               { name: "已预约", id: 20, },
               { name: "排队中", id: 10, },
               { name: "待评价", id: 40, },
            ],
            tabIndex: 0,
            pageIndex: 1,
            pageSize: 10,
            hasMore: false,
            loading: false,
            courseTypeMap: {
               1: "团课",
               2: "私教",
               3: "企业",
            },
            colorsMap: {
               '20': '#F08336', // 已预约
               '-20': '#AAB1B6', // 预约取消
               '10': '#02B94E', // 排队中
               '-10': '#AAB1B6', // 排队取消
               '40': '#F08336', // 待评价 已完成
               '-40': '#FF4040', // 已爽约
               '5': '#02B94E', // 申请中

            },
            isHome: false,
            ossResize: "?x-oss-process=image/resize,m_fill,w_200,h_200",
         }
      },
      computed: mapState(['ossPath', 'memberId']),
      onLoad(options) {
         if (options.isHome) {
            this.isHome = true;
         }
         this.getOrderList(true);
      },
      onPullDownRefresh() {
         uni.showNavigationBarLoading();
         this.getOrderList(true);
      },
      onReachBottom() {
         if (!this.hasMore) return;
         this.getOrderList();
      },
      methods: {
         getOrderList(isReset = false) {
            this.loading = true;
            let params = {
               member_id: this.memberId,
               current: isReset ? 1 : (this.pageIndex + 1),
               size: this.pageSize
            }
            params.status = this.tabs[this.tabIndex].id || 0;
            this.api.get("/api/hall/member/course/plan/appointment/list", params, this.$other).then(ret => {
               let data = ret.records || [];
               data.forEach(item => {
                  item.date = `${item.date} ${item.startAtTime}-${item.endAtTime}`
                  item.dropdownStatus = [];
                  item.isVisible = false;
                  // if (item.status && item.status.length > 1) {
                  //    item.dropdownStatus = item.status.slice(1);
                  // }
               });

               if (isReset) {
                  this.orderList = data;
               } else {
                  this.orderList = this.orderList.concat(data);
               }
               this.pageIndex = ret.current;

               if (ret.pages > ret.current) {
                  this.hasMore = true;
               } else {
                  this.hasMore = false;
               }
               this.loading = false;
               uni.hideNavigationBarLoading();
               uni.stopPullDownRefresh();
            })
         },
         tabSelect(e) {
            const { index, id } = e.currentTarget.dataset;
            this.tabIndex = index;
            this.orderList = [];
            this.getOrderList(true);
         },
         skipOrderDetail(event) {
            const { id, index } = event.currentTarget.dataset;
            uni.setStorageSync("currentOrder", JSON.stringify(this.orderList[index]));
            uni.navigateTo({
               url: "/pages/user/booking/detail/index?id=" + id,
            })
         },
         showDropdown(index) {
            let currentOrder = this.orderList[index];
            currentOrder.isVisible = !currentOrder.isVisible;
         }
      }
   }
</script>
<style lang="scss">
   .content-wrapper {
      padding: 0 32upx;
      padding-top: 32upx;
   }
   .position-sticky {
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 10;
      border-top: 1px solid #f1f1f1;
   }
   .nav .cu-item {
      margin: 0;
      &.active {
         color: #f08336;
         position: relative;
         &::after {
            content: " ";
            position: absolute;
            bottom: 8upx;
            left: 50%;
            transform: translateX(-50%);
            width: 32upx;
            height: 4upx;
            background: #f08336;
            border-radius: 2upx;
         }
      }
   }
   .card {
      padding: 32upx;
      padding-top: 60upx;
      margin-bottom: 32upx;
      background: white;
      border-radius: 20upx;
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
   .course-info {
      position: relative;

      .head-info {
         display: flex;
      }
      .avatar {
         width: 132upx;
         height: 132upx;
         border-radius: 8upx;
         margin-right: 24upx;
         overflow: hidden;
         image {
            width: 100%;
            height: 100%;
         }
      }
      .tag {
         &.private {
            background: #9472d8;
         }
         &.team {
            background: #48c5b6;
         }
         position: absolute;
         top: 0;
         left: 32upx;
         width: 72upx;
         height: 36upx;
         font-size: 20upx;
         line-height: 36upx;
         text-align: center;
         border-radius: 0 0 12upx 12upx;
         color: white;
      }
      .info {
         flex: 1;
         display: flex;
         flex-direction: column;
         justify-content: center;
         overflow: hidden;
         .course-name {
            font-size: 30upx;
            color: #222527;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
         }
      }
      .course-wrapper {
         display: flex;
         align-items: center;
         margin-bottom: 16upx;
         overflow: hidden;
         flex-wrap: wrap;
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
      .status {
         position: absolute;
         top: 4upx;
         right: 16upx;
         display: flex;
         align-items: center;
         padding: 16upx;
         .ico {
            font-size: 24upx;
            color: rgba(0, 0, 0, 0.85);
            margin-left: 8upx;
         }
      }
      .status-item {
         display: inline-block;
         margin-right: 16upx;
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
   .dropdown-status {
      position: absolute;
      top: 64upx;
      right: 16upx;
      padding: 8upx 16upx;
      min-width: 164upx;
      line-height: 40upx;
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.2);
      background-color: white;
      .dropdown-item {
         text-align: center;
         &:not(:last-child) {
            margin-bottom: 16upx;
         }
      }
   }

   .loading-text {
      text-align: center;
      padding: 16upx;
   }
</style>