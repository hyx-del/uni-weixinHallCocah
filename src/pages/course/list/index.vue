<template>
  <view class="container page-bg">
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="content">团课列表</block>
    </cu-custom>
    <view
      class="filter-bar position-sticky"
      :style="[{ top: CustomBar + 'px' }]"
    >
      <view class="flex2">
        <picker
          @change="bindCityChange"
          :value="cityIndex"
          :range="cityList"
          range-key="name"
        >
          <view class="address">
            <text class="text">{{ cityList[cityIndex].name }}</text>
            <view class="yicon icon-xiala"></view>
          </view>
        </picker>
      </view>
      <view class="flex3 flex-center">
        <picker
          @change="bindShopChange"
          :value="shopIndex"
          :range="cityHalls"
          range-key="name"
        >
          <view class="shop">
            <text class="text">{{ cityHalls[shopIndex].name }}</text>
            <view class="yicon icon-xiala"></view>
          </view>
        </picker>
      </view>
      <view class="flex2 flex-end">
        <!-- <view class="private-btn"
                  @click="privateReservation">私教预约</view> -->
      </view>
    </view>
    <view class="calendar-wrap">
      <view
        class="date-item"
        :class="{ active: isCustomDate }"
        @click="openDateSelect"
      >
        <view class="label yicon icon-calendar" style="font-size: 30upx"></view>
        <view>日历</view>
      </view>
      <scroll-view class="scroll-x" scroll-x="true">
        <view
          class="date-item"
          :class="{ active: week.active && !isCustomDate }"
          v-for="(week, index) in weekDates"
          :data-index="index"
          :key="week.fulldate"
          @click="dateSelected"
        >
          <view class="label">{{ week.label }}</view>
          <view>{{ week.date }}</view>
        </view>
      </scroll-view>
    </view>
    <uni-calendar
      ref="calendar"
      :date="currentDate"
      :insert="false"
      @confirm="dateConfirm"
    />
    <view class="list">
      <view
        class="list-item"
        v-for="course in courseList"
        :key="course.coursePlanId"
        @click="courseDetail(course.coursePlanId)"
      >
        <view class="avatar">
          <image :src="course.coachPortrait" />
        </view>
        <view class="info">
          <view class="head">
            <view class="course-name">{{ course.courseName }}</view>
            <view class="labels" v-if="course.arrayCourseLabel.length">
              <view
                class="label-item"
                v-for="(label, index) in course.arrayCourseLabel"
                :key="index"
                >{{ label }}</view
              >
            </view>
            <!-- <view class="right-value" v-if="item == 3">可约{{ course.max_order }}人</view> -->
          </view>
          <view class="time">
            <view class="yicon icon-time"></view>
            <text class="text"
              >{{ course.startAtTime }}-{{ course.endAtTime }}</text
            >
          </view>
          <view class="teacher-info">
            <view class="teacher-name">{{ course.coachName }}</view>
            <!-- <view class="star">
                            <view v-for="(item) in 5" :key="item" :class="item > 3 ? 'cuIcon-favor' : 'cuIcon-favorfill'"></view>
                        </view> -->
          </view>

          <view
            class="handle-btn end"
            v-if="course.status == 4"
            :data-course="course"
            >已结束</view
          >
          <view
            class="handle-btn end"
            v-if="course.status == 3"
            :data-course="course"
            >已开始</view
          >
          <view class="handle-btn reservation" v-else-if="course.status == 1"
            >预约</view
          >
          <view
            class="handle-btn reservation disabled"
            v-else-if="course.status == -1"
            >预约</view
          >
          <view class="handle-btn not-start" v-else-if="course.status == 2"
            >排队</view
          >
          <view
            class="handle-btn not-start disabled"
            v-else-if="course.status == -2"
            >排队</view
          >
        </view>
      </view>
    </view>
    <view class="no-data" v-if="isLoaded && !courseList.length">暂无数据</view>

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
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
import uniCalendar from "@/components/uni-calendar/uni-calendar.vue";
export default {
  components: { uniCalendar },
  data() {
    return {
      CustomBar: this.CustomBar,
      hall_id: null,
      cityIndex: 0,
      shopIndex: 0,
      shops: [],
      courseList: [],
      weekDates: [],
      currentDate: null,
      isCustomDate: false,
      isLoaded: false,
      cityHalls: [],
      cityList: [],
      options: {},

      haveMore: false,
      pageIndex: 1,
      pageSize: 20,
      isVisible: false,
      isBooking: false,
      ossResize: "?x-oss-process=image/resize,m_fill,w_200,h_200",
    };
  },
  computed: {
    hasEnd(course) {
      // let courseDate = new Date(course.date + course.end_time);
      // let currentDate = new Date();
      // if (currentDate.getTime() > courseDate.getTime()) {
      //     return true;
      // }
      return false;
    },
    // ...mapState(['cityList']),
    ...mapState(["ossPath", "isLogin", "isAuth"]),
  },
  watch: {
    isLogin(value) {
      if (value && this.isBooking) {
        this.isBooking = false;
        this.privateReservation();
      }
    },
  },
  onLoad(options) {
    // if (options.city_id) {
    //     this.cityList.forEach((city, index) => {
    //         if (city.id == options.city_id) this.cityIndex = index;
    //     })
    //     this.getHallList();
    // }
    this.options = options;
    this.getCityHalls();

    let weekDates = [];
    let weekLabels = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    for (let index = 0; index < 7; index++) {
      let date = new Date();
      if (index) {
        date.setDate(date.getDate() + index);
      }
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      let dateItem = {
        date: month + "/" + day,
        active: false,
        fulldate: year + "-" + month + "-" + day,
      };
      if (!index) {
        dateItem.label = "今天";
        dateItem.active = true;
        this.currentDate = dateItem.fulldate;
      } else {
        dateItem.label = weekLabels[date.getDay()];
      }
      weekDates.push(dateItem);
    }
    this.weekDates = weekDates;

    if (options.hall_id) {
      this.hall_id = options.hall_id;
      this.getCourseList();
    }
  },
  onReachBottom() {
    if (!this.haveMore) return;
    this.pageIndex = this.pageIndex + 1;
    this.getCourseList(false);
  },
  methods: {
    getCourseList(isReset = true) {
      if (isReset) {
        this.pageIndex = 1;
      }
      let params = {
        hallId: this.hall_id,
        date: this.currentDate,
        page: isReset ? 1 : this.pageIndex,
        size: this.pageSize,
      };
      this.api
        .get("/api/hall/course/plan/open/list", params, this.$other)
        .then((ret) => {
          // if (ret.records.length) {
          //   ret.records.forEach((item) => {
          //     if (item.arrayCourseLabel) {
          //       item.arrayCourseLabel = item.arrayCourseLabel[0].split(" ");
          //     }
          //   });
          // }
          if (isReset) {
            this.courseList = ret.records || [];
          } else {
            this.courseList = this.courseList.concat(ret.records || []);
          }
          if (ret.pages > ret.current) {
            this.haveMore = true;
          } else {
            this.haveMore = false;
          }
          this.isLoaded = true;
        });
    },
    // getHallList(isReset = false) {
    //     let params = {
    //         page: 1,
    //         size: 100,
    //     }
    //     if (this.cityList.length) {
    //         params.city_id = this.cityList[this.cityIndex].id;
    //     }
    //     this.api.post("hall/index/list", params).then(ret => {
    //         this.shops = ret.data || [];
    //         if (isReset) {
    //             this.shopIndex = 0;
    //             this.hall_id = this.shops[0].id;
    //             this.getCourseList();
    //         }
    //     })
    // },
    getCityHalls() {
      this.api
        .get("/api/hall/initial/data/open/city", {}, this.$other)
        .then(async (data) => {
          let result = await this.api.get(
            "/api/hall/initial/data/open/hall",
            { cityId: this.options.city_id },
            this.$other
          );
          this.cityHalls = result.records;
          this.cityList = data;
          if (this.options.city_id) {
            this.cityList.forEach((item, index) => {
              if (item.id == this.options.city_id) {
                this.cityIndex = index;
              }
            });
            this.cityHalls.forEach((item, index) => {
              if (item.id == this.options.hall_id) {
                this.shopIndex = index;
              }
            });

            //    this.cityHalls.forEach((city, cIndex) => {
            //       if (city.id == this.options.city_id) {
            //          this.cityIndex = cIndex;
            //          city.halls.forEach((hall, sIndex) => {
            //             if (hall.id == this.options.hall_id) {
            //                this.shopIndex = sIndex;
            //                this.shops = city.halls;
            //             }
            //          });
            //       }
            //    });
          }
        });
    },
    async bindCityChange(event) {
      this.cityIndex = event.detail.value;
      let result = await this.api.get(
        "/api/hall/initial/data/open/hall",
        { cityId: this.cityList[this.cityIndex].id },
        this.$other
      );
      this.cityHalls = result.records;
      this.shopIndex = 0;
      this.hall_id = this.cityHalls[0].id;
      this.getCourseList();
      // this.getHallList(true);
    },
    bindShopChange(event) {
      this.shopIndex = event.detail.value;
      this.hall_id = this.cityHalls[this.shopIndex].id;
      this.getCourseList();
    },
    openDateSelect() {
      if (this.$refs.calendar) {
        this.$refs.calendar.open();
      }
    },
    dateSelected(event) {
      const { index } = event.currentTarget.dataset;
      this.weekDates.forEach((item) => {
        item.active = false;
      });
      this.weekDates[index].active = true;
      this.isCustomDate = false;
      this.currentDate = this.weekDates[index].fulldate;
      console.log("currentDate", this.weekDates[index], this.currentDate);
      this.getCourseList();
    },
    dateConfirm(event) {
      this.currentDate = event.fulldate;
      this.isCustomDate = true;
      this.getCourseList();
    },
    courseDetail(id) {
      uni.navigateTo({
        url: "/pages/course/plan-detail/index?id=" + id,
      });
    },
    privateReservation() {
      // 私教预约
      if (!this.isLogin) {
        this.isBooking = true;
        if (this.isAuth) {
          this.$store.dispatch("getToken");
        } else {
          this.showAuthModal();
        }
      } else {
        uni.navigateTo({
          url:
            "/pages/course/private/index?hall_id=" +
            this.hall_id +
            "&city_id=" +
            this.cityList[this.cityIndex].id,
        });
      }
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
  },
};
</script>

<style lang="scss">
.filter-bar {
  height: 80upx;
  padding: 0 24upx;
  display: flex;
  align-items: center;
  background-color: white;
  .flex2 {
    flex: 2;
  }
  .flex3 {
    flex: 3;
  }
  .flex-center {
    display: flex;
    justify-content: center;
  }
  .flex-end {
    display: flex;
    justify-content: flex-end;
  }

  &.position-sticky {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
  }
  picker {
    height: 100%;
  }
  .address,
  .shop {
    line-height: 40px;
    display: flex;
    align-items: center;
    .text {
      margin-right: 8upx;
    }
  }
  .private-btn {
    width: 152upx;
    height: 52upx;
    text-align: center;
    line-height: 50upx;
    font-size: 24upx;
    color: #484f55;
    border: 1px solid #484f55;
    border-radius: 26upx;
  }
}
.calendar-wrap {
  padding: 0 32upx;
  padding-top: 32upx;
  display: flex;
  // overflow: auto;
  flex-wrap: nowrap;
  .date-item {
    width: 118upx;
    min-width: 118upx;
    height: 100upx;
    padding: 12upx 24upx;
    border-radius: 20upx;
    background-color: white;
    margin-right: 12upx;
    text-align: center;
    color: #222527;
    display: inline-block;
    .label {
      margin-bottom: 4upx;
    }
    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;
    &:last-child {
      margin-right: 0;
    }
    &.active {
      background-color: #f08336;
      color: white;
    }
  }
}
.scroll-x {
  flex: 1;
  white-space: nowrap;
  width: calc(100% - 194upx);
}
.list {
  padding: 0 32upx;
  padding-top: 32upx;
  &-item {
    background: #ffffff;
    border-radius: 20upx;
    padding: 24upx;
    display: flex;
    margin-bottom: 32upx;
    .avatar {
      height: 132upx;
      width: 132upx;
      min-width: 132upx;
      border-radius: 8upx;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      flex: 1;
      margin-left: 24upx;
      position: relative;
      overflow: hidden;
      .head {
        // display: flex;
        align-items: center;
        margin-bottom: 12upx;
        overflow: hidden;
      }
      .course-name {
        font-size: 30upx;
        color: #222527;
        white-space: nowrap;
        text-overflow: ellipsis;
      //   overflow: hidden;
      }
      .address {
        font-size: 24upx;
        color: #636f7c;
        margin-left: 16upx;
        .yicon {
          font-size: 28upx;
        }
      }
      .time {
        font-size: 24upx;
        color: #f08336;
        margin-bottom: 12upx;
        display: flex;
        .text {
          margin-left: 8upx;
        }
      }
      .teacher-info {
        display: flex;
        align-items: center;
      }
      .teacher-name {
        font-size: 24upx;
        color: #636f7c;
        margin-right: 8upx;
      }
      .star {
        display: flex;
        margin-left: 8upx;
        color: #ffd000;
        font-size: 20upx;
      }
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

.handle-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 148upx;
  height: 66upx;
  font-size: 30upx;
  text-align: center;
  line-height: 66upx;
  border-radius: 33upx;
  &.end {
    color: #999999;
    background: #f2f2f2;
  }
  &.reservation {
    color: white;
    background-image: linear-gradient(-58deg, #ff401f 2%, #ff711e 75%);
    &.disabled {
      background: rgba(#f08336, 0.6);
    }
  }
  &.not-start {
    color: white;
    background: #02b94e;
    &.disabled {
      background: rgba(#02b94e, 0.6);
    }
  }
}

.no-data {
  text-align: center;
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
</style>
