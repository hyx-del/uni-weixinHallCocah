<template>
  <view class="container page-bg">
    <view class="cu-custom">
      <cu-custom bgColor="bg-white" :isBack="true">
        <block slot="content">我的报名</block>
      </cu-custom>
    </view>

    <view class="tab">
      <text v-for="(item, index) in listTab" :key="item.value" :style="{ color: tabActive == index ? '#ef8236' : '#999999' }" @click="tabChange(index)">{{ item.label }}</text>
      <i ref="iIcon" :style="{ left: tabActive ? '552rpx' : '176rpx' }"></i>
    </view>

    <swiper :current="tabActive" style="min-height: 100vh;">
      <!-- 学期 -->
      <swiper-item @touchmove.stop>
        <scroll-view scroll-y style="height: 100%;" @scrolltolower="handleScrollToLower">
          <view class="swiper-item uni-bg-red">
            <view>
              <!-- 导航菜单 -->
              <view class="nav position-sticky">
                <view v-for="item in navListAll" :key="item.id" @click="navChangeAll(item.id)">
                  <text :class="item.id == activeNavIdAll ? 'active' : ''">{{ item.name }}</text>
                </view>
              </view>

              <!-- wrap -->
              <!-- wrap -->
              <view class="wrap" v-if="myRegisteredList.length">
                <view class="item-list" v-for="item in myRegisteredList" :key="item.id" @click="look(item.id, item.studentSemesterId)">
                  <image :src="item.picture"></image>
                  <view class="state">{{ item.statusName }}</view>
                  <view class="introduce">
                    <text class="title">{{ item.name }}</text>
                    <view class="address">
                      <text class="yicon iconImg"></text>
                      <view>培训校区：{{ item.schoolName }}</view>
                    </view>
                    <!-- 已支付 线上 证明全款付清不用显示 -->
                    <view v-if="status(item.status)">
                      <view class="payment" v-if="payment(item.registerPayStatus, item.payOnline)">
                        <view class="price" v-if="prices(item.registerPayStatus, item.payOnline)">
                          需支付
                          <text>￥{{ item.registerMoney | priceFormat }}</text>
                        </view>
                        <button class="but" @click.stop="pay(item.payOnline, item.id, item.studentSemesterId, item.registerPayStatus)">
                          立即支付
                        </button>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <view class="blank"></view>
              <view v-if="isLoadingComplete && !myRegisteredList.length" class="no-data">暂无相关数据</view>
            </view>
          </view>
        </scroll-view>
      </swiper-item>

      <!-- 全面课程 -->
      <swiper-item @touchmove.stop>
        <scroll-view scroll-y style="height: 100%;" @scrolltolower="handleScrollToLower">
          <view class="swiper-item uni-bg-red">
            <view>
              <!-- 导航菜单 -->
              <view class="nav position-sticky">
                <view v-for="item in navList" :key="item.id" @click="navChange(item.id)">
                  <text :class="item.id == activeNavId ? 'active' : ''">{{ item.name }}</text>
                </view>
              </view>

              <!-- wrap -->
              <view class="wrap" v-if="myRegisteredList.length">
                <view class="item-list" v-for="(item, index) in myRegisteredList" :key="index" @click="look(item.id, item.studentMainCourseId)">
                  <image :src="item.coverUrl"></image>
                  <view class="state">{{ item.statusName }}</view>
                  <view class="introduce">
                    <text class="title">{{ item.name }}</text>
                    <view class="address">
                      <text class="yicon iconImg"></text>
                      <view>培训校区：{{ item.address }}</view>
                    </view>
                    <!-- 已支付 线上 证明全款付清不用显示 -->
                    <view class="payment" v-if="registerPayStatus(item.registerPayStatus)">
                      <view class="price" v-if="price(item.registerPayStatus, item.payOnline)">
                        需支付
                        <text>￥{{ item.registerMoney | priceFormat }}</text>
                      </view>
                      <button class="but" @click.stop="pay(item.payOnline, item.id, item.studentMainCourseId, item.registerPayStatus)">
                        立即支付
                      </button>
                    </view>
                  </view>
                </view>
              </view>
              <view class="blank"></view>
              <view v-if="isLoadingComplete && !myRegisteredList.length" class="no-data">暂无相关数据</view>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
    <v-dialog v-if="dialog" @but="dialog = false"></v-dialog>
  </view>
</template>

<script>
import { mapState } from "vuex";
import vDialog from "@/components/dialog/index.vue";
export default {
  components: { vDialog },
  data() {
    return {
      listTab: [
        { label: "学期", value: 0 },
        { label: "全面课程", value: 1 },
      ],
      genre: true, //默认学期
      tabActive: 0,
      dialog: false, //线下支付对话
      CustomBar: this.CustomBar,
      StatusBar: this.StatusBar,
      navList: [
        { id: 1, name: "正常" },
        { id: 0, name: "已取消" },
        { id: -1, name: "已过期" },
        { id: 2, name: "已完成" },
      ],
      navListAll: [
        { id: "", name: "全部" },
        { id: 10, name: "待报到" },
        { id: 20, name: "已报到" },
        { id: 40, name: "已结业" },
      ],
      activeNavIdAll: "",
      activeNavId: 1,
      myRegisteredList: [],
      pageIndex: 1,
      pageSize: 10,
      haveMore: false,
      isLoadingComplete: false,
    };
  },

  filters: {
    priceFormat: function (total) {
      if (total) {
        return parseFloat(total).toFixed(2);
      } else {
        return "0.00";
      }
    },
  },

  computed: mapState(["ossPath"]),
  onLoad(option) {
    if (option.genre) {
      JSON.parse(option.genre) ? this.tabChange(0) : this.tabChange(1);
    }
  },
  methods: {
    //上拉触底
    handleScrollToLower() {
      if (!this.haveMore) return;
      this.pageIndex = this.pageIndex + 1;
      if (!this.genre) {
        //走全面
        this.getSemesterList(this.activeNavId);
      } else {
        //走学期
        this.getSemesterList(this.activeNavIdAll);
      }
    },
    tabChange(index) {
      this.tabActive = index;
      console.log(this.tabActive);
      if (this.tabActive) {
        console.log("全面课程");
        this.genre = false;
        this.getSemesterList(1, true);
      } else {
        this.genre = true;
        console.log("学期");
        this.getSemesterList("", true);
      }
    },
    //立即支付 报名表没支付状态
    status(status) {
      let state;
      switch (status) {
         case 20:
          state = false;
          break;
          case 30:
          state = false;
          break;
         case 40:
          state = false;
          break;
        case 50:
          state = false;
          break;
        case 51:
          state = false;
          break;
       case 60:
          state = false;
          break;
        case 70:
          state = false;
          break;
        default:
          state = true;
          break;
      }
      return state;
    },

    //全面显示
    registerPayStatus(status) {
      let boolean;
      switch (true) {
        case status == 0 || status == 2:
          boolean = true;
          break;
        default:
          boolean = false;
          break;
      }
      return boolean;
    },
    //0 1定金未付， 0 2定金已付 尾款， 1 1 定金已付 线下支付 ，1 2 全款结清没有尾款
    //payOnline 后期修改 1是线上 2线下
    payment(status, payOnline) {
      let boolean;
      switch (true) {
        case status == 1 && payOnline == 1:
          boolean = false;
          break;
        default:
          boolean = true;
          break;
      }
      return boolean;
    },
    price(status, payOnline) {
      console.log(status, payOnline);
      let booleans;
      switch (true) {
        case status == 2 && payOnline == 2:
          booleans = false;
          break;
        default:
          booleans = true;
          break;
      }
      return booleans;
    },
    prices(status, payOnline) {
      console.log(status, payOnline);
      let booleans;
      switch (true) {
        case status == 1 && payOnline == 2:
          booleans = false;
          break;
        default:
          booleans = true;
          break;
      }
      return booleans;
    },
    //支付
    pay(payOnline, id, student_semester_id, status) {
      //线上
      if (!status) {
        let data = {
          isSignUp: true,
          mainCourseId: id,
          semesterId: id,
          student_mainCourseId: student_semester_id,
          student_SemesterId: student_semester_id,
          genre: this.genre,
        };
        uni.navigateTo({
          url: "/coachPages/coach-train/cashier-desk/index?data=" + JSON.stringify(data),
        });
      } else {
        if (payOnline == 2) {
          this.dialog = true;
        }
      }
    },

    myGrade(data) {
      uni.navigateTo({
        url: "/coachPages/coach-train/report-card/index?class_id=" + data.class_id + "&audit=" + data.audit,
      });
    },

    //报名列表
    getSemesterList(id, isReset = false) {
      this.pageIndex = isReset ? 1 : this.pageIndex;
      let params = {
        current: this.pageIndex,
        size: this.pageSize,
        //状态 正常
        status: id,
      };
      this.isLoadingComplete = false;
      params.queryType = 2;
      this.api.get(this.genre ? "/api/school/semester/open/list" : "/api/school/maincourse/open/list", params, { type: "other" }).then((res) => {
        if (isReset) {
          this.myRegisteredList = res.records || [];
        } else {
          this.myRegisteredList = this.myRegisteredList.concat(res.records);
        }
        this.isLoadingComplete = true;
        this.haveMore = true;
        this.pageIndex <= res.pages ? (this.haveMore = true) : (this.haveMore = false);
        uni.hideNavigationBarLoading();
        uni.stopPullDownRefresh();
      });
    },

    //学期二级菜单
    navChangeAll(id) {
      this.activeNavIdAll = id;
      this.getSemesterList(id, true);
    },
    //全面二级菜单
    navChange(id) {
      this.activeNavId = id;
      this.getSemesterList(id, true);
    },

    look(id, studentMainCourseId) {
      let options = {
        semester_id: id,
        studentSemesterId: studentMainCourseId,
        genre: this.genre,
        genreSemester_id: id,
        genrestudentSemesterId: studentMainCourseId,
      };
      let { semester_id, studentSemesterId, genre, genreSemester_id, genrestudentSemesterId } = options;
      uni.navigateTo({
        url: "/coachPages/coach-train/semester-details/index?semester_id=" + semester_id + "&isSignUp=true&genre=" + genre + "&student_Semester_id=" + studentSemesterId + "&genreSemester_id=" + genreSemester_id + "&genreStudentSemesterId=" + genrestudentSemesterId,
      });
    },
  },
};
</script>

<style lang="scss">
button::after {
  border: none;
  outline: none;
}

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

.wrap {
  padding: 20rpx 30rpx 0 30rpx;
  .item-list {
    margin-bottom: 32upx;
    background: #ffffff;
    border-radius: 20rpx 20rpx 0 0;
    position: relative;
    overflow: hidden;
    image {
      background: #ccc;
      border-radius: 20upx 20upx 0 0;
      width: 100%;
      height: 311upx;
    }
    .state {
      position: absolute;
      left: 0;
      top: 0;
      width: 120rpx;
      height: 44rpx;
      background: linear-gradient(270deg, #44c9f0, #1b9aee);
      border-radius: 6rpx 0 6rpx 0;
      text-align: center;
      color: #ffffff;
      line-height: 44rpx;
      font-size: 22rpx;
    }
    .introduce {
      padding: 24upx 32upx 32upx 32upx;
      .iconImg {
        background: url("/static/images/tabbar/revision/school.png") no-repeat 0 4rpx;
        background-size: 28rpx;
      }
      .address,
      .time {
        margin-top: 16upx;
        display: flex;
        align-items: center;
        font-size: 28upx;
        color: #222527;
        > text {
          color: #f08336;
          width: 35upx;
          height: 35upx;
          line-height: 35upx;
        }
      }
      .title {
        font-size: 34upx;
        color: #222527;
        font-weight: bold;
      }
      .payment {
        text-align: right;
        padding-top: 34rpx;
        .price {
          font-size: 13px;
          font-family: PingFangSC, PingFangSC-Regular;
          color: #333333;
          height: 50rpx;
          line-height: 50rpx;

          text {
            font-size: 18px;
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: right;
            color: #fe6a74;
          }
        }
        .closed {
          color: #ff0000;
          font-weight: 600;
        }
        .but {
          display: inline-block;
          margin: 24rpx 0 0 0;
          width: 196rpx;
          height: 64rpx;
          background: linear-gradient(90deg, #ff9096, #fd6771);
          border-radius: 38rpx;
          color: #ffffff;
          font-size: 28rpx;
          line-height: 64rpx;
        }
      }

      .myGrade,
      .look {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 24upx;

        .grade {
          margin: 0;
          border: 1upx solid #cfcfcf;
          color: #666666;
          background: #ffffff;
          font-size: 30upx;
          font-weight: 400;
          line-height: 40upx;
          padding: 13upx 28upx;
          border-radius: 33upx;
        }

        .perfective {
          margin: 0;
          border-radius: 33upx;
          background: #ffffff;
          font-size: 30upx;
          font-weight: 400;
          line-height: 40upx;
          padding: 12upx 56upx;
          border: 1upx solid #cfcfcf;
          color: #666666;
        }
      }
    }
  }
  .item-list:last-of-type {
    margin: 0;
  }
}
.blank {
  height: 255rpx;
  width: 100%;
}
.no-data {
  text-align: center;
  margin-top: 88upx;
  padding-top: 16upx;
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
}
</style>
