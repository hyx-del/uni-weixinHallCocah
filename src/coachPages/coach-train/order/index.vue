<template>
  <view class="container page-bg">
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="content">我的订单</block>
    </cu-custom>

    <view class="tab">
      <text v-for="(item, index) in listTab" :key="item.value" :style="{ color: tabActive == index ? '#ef8236' : '#999999' }" @click="tabChange(index)">{{ item.label }}</text>
      <i ref="iIcon" :style="{ left: tabActive ? '552rpx' : '176rpx' }"></i>
    </view>

    <swiper :current="tabActive" style="min-height: 100vh;">
      <!-- 学期 -->
      <swiper-item @touchmove.stop v-if="tabActive==0">
        <scroll-view scroll-y style="height: 100%;" @scrolltolower="handleScrollToLower">
          <view class="swiper-item uni-bg-red">
            <view class="warpall">
              <!-- 导航菜单 -->
              <view class="nav position-sticky">
                <view v-for="item in navList" :key="item.type" @click="navChange(item.type, 10)">
                  <text :class="item.type == activeNavAll ? 'active' : ''">{{ item.name }}</text>
                </view>
              </view>

              <view v-if="orderList.length" class="content-box">
                <!-- <mescroll-uni :up="upOption" @up="upCallback" ref="mescrollRef" :padTop="{ StatusBar }" :topbar="true" :down="{ use: false }" auto="false" :fixed="false" :bottom="100" @init="mescrollInit"> -->
                <view class="list" v-for="(item, index) in orderList" :key="index" @click="skipOrderDetailsPage(item)">
                  <view class="header">
                    <view class="order-number">订单号：{{ item.id }}</view>
                    <view class="right-status" :style="{ color: item.statusName == '已取消' ? 'red' : '#c76e2f' }">{{ item.statusName }}</view>
                  </view>
                  <view class="body">
                    <view class="img">
                      <image :src="item.coverUrl" mode="aspectFill"></image>
                    </view>
                    <view class="synopsis">
                      <view class="text">{{ item.name }}</view>
                      <view class="price" v-if="item.semester_total">￥{{ item.semester_total || "" }}</view>
                    </view>
                  </view>
                  <view class="bottom-content" v-if="!item.status">
                    <view class="needPay">
                      <view class="btn remove" @click.stop="del(item)">删除订单</view>
                    </view>
                  </view>
                  <view class="turn" v-if="item.forwardName">{{ item.forwardName }}</view>
                </view>
                <!-- </mescroll-uni> -->
              </view>
              <view class="blank"></view>
              <view class="no-data" v-if="!orderList.length">暂无相关数据</view>
            </view>
          </view>
        </scroll-view>
      </swiper-item>

      <!-- 全面课程 -->
      <swiper-item @touchmove.stop v-if="tabActive==1">
        <scroll-view scroll-y style="height: 100%; padding-bottom: 20rpx;" @scrolltolower="handleScrollToLower">
          <view class="swiper-item uni-bg-red">
            <!-- 导航菜单 -->
            <view class="nav position-sticky">
              <view v-for="item in navList" :key="item.type" @click="navChange(item.type)">
                <text :class="item.type == activeNavAll ? 'active' : ''">{{ item.name }}</text>
              </view>
            </view>

            <view v-if="orderList.length" class="content-box">
              <view class="list" v-for="(item, index) in orderList" :key="index" @click="skipOrderDetailsPage(item)">
                <view class="header">
                  <view class="order-number">订单号：{{ item.id }}</view>
                  <view class="right-status" :style="{ color: item.statusName == '已取消' ? 'red' : '#c76e2f' }">{{ item.statusName }}</view>
                </view>
                <view class="body">
                  <view class="img">
                    <image :src="item.coverUrl" mode="aspectFill"></image>
                  </view>
                  <view class="synopsis">
                    <view class="text">{{ item.name }}</view>
                    <view class="price" v-if="item.semester_total">￥{{ item.semester_total || "" }}</view>
                  </view>
                </view>
                <view class="bottom-content" v-if="!item.status">
                  <view class="needPay">
                    <view class="btn remove" @click.stop="del(item)">删除订单</view>
                  </view>
                </view>
              </view>
            </view>
            <view class="blank"></view>
            <view class="no-data" v-if="!orderList.length">暂无相关数据</view>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { mapState } from "vuex";
import MescrollUni from "../../../components/mescroll-uni/mescroll-uni.vue";
import MescrollMixin from "../../../components/mescroll-uni/mescroll-mixins.js";

export default {
  mixins: [MescrollMixin],
  data() {
    return {
      listTab: [
        { label: "学期", value: 10 },
        { label: "全面课程", value: 20 },
      ],
      tabActive: 0,
      swiper: 0,
      CustomBar: this.CustomBar,
      StatusBar: this.StatusBar,
      scrollTop: this.CustomBar + this.StatusBar,
      upOption: {
        isBounce: true,
      },
      orderList: [],
      navList: [
        { type: -1, name: "全部" },
        { type: 0, name: "已取消" },
        { type: 10, name: "已完成" },
      ],
      activeNav: 0,
      activeNavAll: -1,
      haveMore: true,
      pageIndex: 1,
      size: 10,
    };
  },

  components: {
    MescrollUni,
  },

  computed: {
    ...mapState(["ossPath"]),
  },

  filters: {
    payMoney: (data) => {
      switch (data.status) {
        case 8:
          return "本单待支付 ￥" + data.total;
        case 10:
          return "本单已支付 ￥" + data.total;
        default:
          break;
      }
    },
  },

  onShow() {
    this.tabChange(0);
  },

  methods: {
    //上拉
    handleScrollToLower() {
      if (!this.haveMore) return;
      this.pageIndex = this.pageIndex + 1;
      console.log(this.pageIndex);
      this.getOrderList();
    },
    tabChange(index) {
      this.tabActive = index;
      this.navChange(-1);
    },
    navChange(type) {
      this.activeNavAll = type;
      this.pageIndex = 1;
      this.getOrderList(true);
      // if (this.mescroll) {
      //   this.mescroll.resetUpScroll();
      //   this.mescroll.scrollTo(0, 0);
      // }
    },
    getOrderList(is = false) {
      this.haveMore = false;
      let params = {
        page: this.pageIndex,
        size: this.size,
        status: this.activeNavAll,
        orderMode: this.tabActive ? 20 : 10,
      };

      this.api.get("/api/school/order/pay/page", params, { type: "other" }).then((res) => {
        if (is) {
          this.orderList = res.records;
        } else {
          this.orderList = this.orderList.concat(res.records);
        }
        this.haveMore = true;
        if (res.pages <= this.pageIndex) this.haveMore = false;
      });
    },

    //删除
    del(item) {
      uni.showModal({
        content: "确定删除订单",
        showCancel: true,
        success: (res) => {
          let params = {
            id: item.id,
            orderMode: this.tabActive ? 20 : 10,
          };
          if (res.confirm) {
            this.api.put("/api/school/order/pay/delete", params, { type: "other" }).then((res) => {
              if (res == "删除成功") {
                uni.showToast({
                  icon: "none",
                  title: "删除成功",
                });
                this.getOrderList(true);
              } else {
                uni.showToast({
                  icon: "none",
                  title: res.msg,
                });
              }
            });
          }
        },
      });
    },

    skipOrderDetailsPage(item) {
      let num = this.tabActive ? 20 : 10;
      uni.navigateTo({
        url: "/coachPages/coach-train/order-details/index?id=" + item.id + "&orderMode=" + num,
      });
    },
  },
};
</script>

<style lang="scss">
.nav {
  display: flex;
  padding: 42rpx 0 36rpx 0;
  background: #ffffff;
  position: fixed;
  left: 0;
  z-index: 999;
  width: 100%;
  margin-bottom: 12rpx;
  &.position-sticky {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
  }
  view {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    text {
      color: #666666;
      padding: 8rpx 28rpx;
      background: #f7f7f7;
      border-radius: 16px;
    }
    .active {
      color: #ef8236;
      background: #fff3eb;
    }
  }
}

.content-box {
  padding: 20rpx 40rpx 40rpx 40rpx;
  .turn {
    width: 100%;
    padding: 12rpx 0;
    text-indent: 28rpx;
    background: #fff7f7;
    border-radius: 10rpx;
    color: #f8515d;
    font-size: 26rpx;
  }
}
.blank {
  height: 208rpx;
  width: 100%;
}
.list {
  background: #ffffff;
  border-radius: 20upx;
  padding: 0 28rpx 34rpx;
  margin-bottom: 16upx;
  overflow: hidden;
  .header {
    display: flex;
    justify-content: space-between;
    .order-number {
      height: 48rpx;
      background: linear-gradient(270deg, rgba(248, 184, 102, 0), rgba(244, 157, 78, 0.51));
      border-radius: 20rpx 0 20rpx 0;
      transform: translateX(-28rpx);
      font-size: 24rpx;
      color: #666666;
      line-height: 48rpx;
      text-indent: 24rpx;
    }

    .right-status {
      color: #c76e2f;
      line-height: 40upx;
      font-size: 28upx;
      font-weight: 400;
      padding-top: 28rpx;
    }

    .cancel-status {
      color: #ccc;
    }
  }

  .body {
    margin: 24upx 0;
    display: flex;
    .img {
      width: 180upx;
      height: 180upx;
      background: #cccccc;
      border-radius: 8upx;

      image {
        width: 100%;
        height: 100%;
        border-radius: 8upx;
      }
    }

    .synopsis {
      flex: 1;
      margin-left: 24upx;
      padding: 8upx 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .text {
        font-size: 30upx;
        color: #222527;
        font-weight: 400;
        line-height: 42upx;
      }

      .price {
        color: #ff0000;
        font-size: 600;
        font-size: 36upx;
        line-height: 50upx;
      }
    }
  }

  .bottom-content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .needPay {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      align-items: center;

      .price {
        font-size: 30upx;
      }

      .to_paid {
        color: #f67b25;
        font-weight: 600;
      }

      .paid {
        color: #666666;
      }
    }

    .btn {
      width: 168upx;
      height: 66upx;
      font-size: 28upx;
      display: flex;
      align-items: center;
      font-weight: 600;
      justify-content: center;
      line-height: 40upx;
      border-radius: 33upx;
    }

    .pay {
      border: 2upx solid #f67b25;
      color: #f67b25;
    }

    .look,
    .remove {
      border: 1px solid #d9d9d9;
      background: #fff;
      border-radius: 34rpx;
      color: #333333;
      font-weight: 400;
    }
  }
}

.list:last-of-type {
  margin: 0;
}

.tab {
  position: relative;
  display: flex;
  justify-content: center;
  background: #fff;
  padding: 22rpx 0 22rpx 0;
  i {
    position: absolute;
    left: 176upx;
    bottom: 4upx;
    width: 20rpx;
    height: 4rpx;
    background: #ef8236;
    border-radius: 4rpx;
    transition: 0.4s;
  }
  text {
    flex: 1;
    display: inline-block;
    font-size: 32rpx;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 700;
    text-align: center;
    color: #999999;
  }
  .warpall {
    height: 100%;
    margin-bottom: 60rpx;
  }
}
.no-data {
  text-align: center;
  padding-top: 20rpx;
}
</style>
