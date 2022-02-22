<template>
   <view class="container page-bg">
      <!--   -->
      <cu-custom bgColor="bg-white"
                 :isHome="true"
                 bgImage="https://file.jiayu.world/image/weixinmini/title.png">
         <block slot="content"
                style="color: #fff;">教练培训</block>
      </cu-custom>
      <view class="bg">
         <view class="handle-bar">
            <!-- <picker @change="cityChange" :value="cityIndex" :range="cityList" range-key="name" v-if="cityList.length">
          <view class="picker">
            {{ cityList[cityIndex].name }}
            <text class="yicon icon-xiala"></text>
          </view>
        </picker> -->
            <view class="search-box">
               <view class="search circle">
                  <view class="search-icon">
                     <span></span>
                  </view>
                  <view class="tag"
                        v-if="activeType">
                     {{ activeType.label }}
                     <icon type="clear"
                           size="14"
                           class="colse"
                           color="#fff"
                           @click="colse()" />
                  </view>
                  <input type="text"
                         :placeholder="activeType ? '' : '搜索'"
                         confirm-type="search"
                         v-model="keyword"
                         @confirm="search"
                         placeholder-style="color:#fad9c3;" />
               </view>
            </view>

            <view class="my"
                  @click="skipMyCoachTrainPage">
               <!-- <image src="../../static/images/my-jiaopei.svg"></image>
          <text>我的</text> -->
            </view>
         </view>
         <view class="tab">
            <text v-for="(item, index) in listTab"
                  :key="item.value"
                  :style="{ opacity: tabActive == index ? 1 : 0.8 }"
                  @click="tabChange(index)">
               {{ item.label }}
            </text>
            <i ref="iIcon"
               :style="{ left: tabActive ? '552rpx' : '176rpx' }"></i>
         </view>
      </view>

      <swiper :current="tabActive"
              style="min-height: 75vh;">
         <!-- 流派 -->
         <swiper-item @touchmove.stop
                      v-if="tabActive == 0">
            <scroll-view scroll-y
                         style="height: 100%;"
                         @scrolltolower="handleScrollToLower">
               <view class="swiper-item uni-bg-red">
                  <view class="semesterType position-sticky">
                     <template v-for="item in semesterTypeSchool">
                        <view :class="[activeType.value == item.value ? 'active-status type-item' : 'type-item']"
                              @click="typeChange(item)"
                              :key="item.value">
                           {{ item.label }}
                        </view>
                     </template>
                  </view>

                  <view class="cardImgWarp">
                     <view class="cardImg"
                           @click="genreListClick(item)"
                           v-for="item in genreList"
                           :key="item.id">
                        <image :src="item.coverUrl"></image>
                     </view>
                     <view class="blank"></view>
                  </view>
               </view>
            </scroll-view>
            <view v-if="isLoadingComplete && !genreList.length"
                  class="no-data">暂无相关数据</view>
         </swiper-item>
         <!-- 全面课程 -->
         <swiper-item @touchmove.stop
                      v-if="tabActive == 1">
            <scroll-view scroll-y
                         style="height: 100%;"
                         @scrolltolower="handleScrollToLower">
               <view class="swiper-item uni-bg-red">
                  <view class="semesterType position-sticky">
                     <template v-for="item in semesterType">
                        <view :class="[activeType.value == item.value ? 'active-status type-item' : 'type-item']"
                              @click="typeChange(item)"
                              :key="item.value">
                           {{ item.label }}
                        </view>
                     </template>
                  </view>

                  <view class="content-list"
                        v-if="semesterList.length">
                     <view class="item-list"
                           v-for="item in semesterList"
                           :key="item.id"
                           @click="skipSemesterDetailsPage(item.id)">
                        <image :src="item.coverUrl"></image>
                        <view class="introduce">
                           <text class="title">{{ item.name }}</text>
                           <view class="address">
                              <text class="iconSchool"></text>
                              <view>培训校区：{{ item.address }}</view>
                           </view>
                           <!-- <view class="time">
                    <text class="yicon icon-time1"></text>
                    <view>报名时间：{{ item.register_start_at }}~{{ item.register_end_at }}</view>
                  </view> -->
                           <!-- 定金模式不显示金额-->
                           <view class="payment">
                              <button class="reserveBg"
                                      v-if="item.registerMode == 10">
                                 {{ "定金" + parseFloat(item.earnest) + "元" }}
                              </button>
                              <button class="full-payment"
                                      v-else>立即支付</button>
                           </view>
                        </view>
                     </view>
                  </view>
               </view>
            </scroll-view>
            <view v-if="isLoadingComplete && !semesterList.length"
                  class="no-data">暂无相关数据</view>
         </swiper-item>
      </swiper>
      <is-login :isVisible="loginTemplateVisible"
                @cancel="cancelLogin($event)"></is-login>
   </view>
</template>

<script>
import { mapState } from "vuex";
import isLogin from "../../../components/login/login.vue";
import { loginBack } from "@/utils/loginBack.js";
export default {
   data() {
      return {
         listTab: [
            { label: "流派", value: 0 },
            { label: "全面课程", value: 1 },
         ],
         tabActive: 0,
         current: 0,
         CustomBar: this.CustomBar,
         cityList: [],
         semesterList: [],
         cityIndex: 0,
         keyword: "",
         semesterTypeSchool: [
            { label: "常规课", value: 1 },
            { label: "工作坊", value: 2 },
            { label: "名师培训", value: 3 },
         ],
         semesterType: [
            { label: "哈他综合班", value: 1 },
            { label: "高温瑜伽综合班", value: 2 },
            { label: "塑形综合班", value: 3 },
         ],
         //流派图片
         genreList: [],
         activeType: null,
         pageIndex: 1,
         pageSize: 10,
         haveMore: false,
         isShare: false,
         isLoginLink: false,
         loginTemplateVisible: false,
         isLoadingComplete: false,
         onoff: true, // 防止持续点击
         on_off: true,
         otherToken: false,
         shareData: null,
         uid: '',
      };
   },
   computed: {
      ...mapState(["ossPath", "isAuth", "isLogin", "currentMemberId", "shareSalesmanId"]),
   },

   components: {
      isLogin,
   },

   watch: {
      // isLogin(value) {
      //   if (value && this.isLoginLink) {
      //     this.isLoginLink = this.onoff = false;
      //     uni.hideLoading();
      //     this.skipMyCoachTrainPage();
      //   }
      // },
   },

   filters: {
      price: function (item) {
         return parseFloat(item.tuition);
         if (item.is_contain_quarterage == 1) {
            return parseFloat(item.quarterage) + parseFloat(item.tuition);
         } else {
            let min = parseFloat(item.tuition);
            let max = parseFloat(item.quarterage) + parseFloat(item.tuition);
            return min + "~" + max;
         }
      },
   },

   async onLoad(options) {
      let isEnter = uni.getStorageSync("isEnter");
      this.otherToken = uni.getStorageSync("otherToken");
      if (this.otherToken) {
         this.shareData = await this.getshareInfo(1);
         this.uids = this.shareData.uid;
      } else if (isEnter !== false) {
         await loginBack({}, async () => { this.shareData = await this.getshareInfo(1); this.uids = this.shareData.uid; });
      }
      if (options["school_share_member_id"]) {
         this.$store.commit("setSchoolShareMemberId", options["school_share_member_id"]);
         // uni.setStorageSync("school_share_member_id", options['school_share_member_id']);
      } else {
         this.$store.commit("setSchoolShareMemberId", "");
      }

      if (options["share_salesman_id"]) {
         this.$store.commit("setShareSalesmanId", options["share_salesman_id"]);
      } else {
         this.$store.commit("setShareSalesmanId", "");
      }
      //是否有分享数据
      let isShareObj = uni.getStorageSync("isShareObj");
      if (options.isShare == 'true') {
         this.isShare = JSON.parse(options.isShare);
         this.uid = JSON.parse(options.shareData).uid;
         this.shareData = JSON.parse(options.shareData);
         let isShareObj = { isShare: this.isShare, uid: this.uid, shareData: this.shareData };
         uni.setStorageSync("isShareObj", JSON.stringify(isShareObj));
      } else if (isShareObj) {
         let isShareObjs = JSON.parse(isShareObj);
         this.isShare = isShareObjs.isShare;
         this.uid = isShareObjs.uid;
         this.shareData = isShareObjs.shareData;
      }
      this.activeType = { label: "常规课", value: 1 };
      this.getGenreList(true);
   },

   onShow() {
      this.onoff = false;
      this.on_off = true;
   },

   onPullDownRefresh() {
      uni.showNavigationBarLoading();
      this.getSemesterList(true);
   },

   //分享好友
   onShareAppMessage() {
      let _shareData = { ...this.shareData }; delete _shareData.name;
      //普通用户分享还是之前uid - 如果是销售分享出去则替换为自己uid
      _shareData.uid = this.uids || _shareData.uid;
      return {
         title: "fineyoga 教练培训",
         path: `/coachPages/coach-train/home/index?isShare=true&shareData=${JSON.stringify(_shareData)}`,
         imageUrl: "https://fanyin-oss.fineyoga.com/mini/share-img2.png",
      };
   },
   //分享朋友圈
   onShareTimeline() {
      let _shareData = { ...this.shareData }; delete _shareData.name;
      _shareData.uid = this.uids || _shareData.uid;
      return {
         title: "fineyoga 教练培训",
         query: `isShare=true&shareData=${JSON.stringify(_shareData)}`,
         imageUrl: "https://fanyin-oss.fineyoga.com/mini/share-img2.png",
      };
   },


   methods: {
      tabChange(e) {
         this.tabActive = e;
         this.keyword = "";
         this.allList();
      },
      //上拉触底
      handleScrollToLower() {
         if (!this.haveMore) return;
         this.pageIndex = this.pageIndex + 1;
         this.tabActive ? this.getSemesterList() : this.getGenreList();
      },
      //获取流派或全面列表
      allList() {
         if (this.tabActive) {
            console.log("走全面");
            this.activeType = null;
            this.getSemesterList(true);
         } else {
            //全新列表 false为叠加前面列表 上拉刷新
            this.activeType = { label: "常规课", value: 1 };
            this.getGenreList(true);
         }
      },

      getCityList() {
         this.api.get("school/index/school/city-list").then((res) => {
            this.cityList = res;
            this.cityList.unshift({ name: "全国", id: -1 });
         });
      },

      typeChange(item) {
         console.log(this.shareData);
         this.activeType = item;
         this.tabActive ? this.getSemesterList(true) : this.getGenreList(true);
      },

      colse() {
         this.activeType = null;
         this.getSemesterList(true);
      },
      //流派图片
      getGenreList(is = false) {
         this.pageIndex = is ? 1 : this.pageIndex;
         let params = {
            current: this.pageIndex,
            size: this.pageSize,
            name: this.keyword,
         };
         this.activeType ? (params.category = this.activeType.value) : null;
         this.isLoadingComplete = false;
         this.api.get("/api/school/semester/open/category/list", params, { type: "other" }).then((res) => {
            this.isLoadingComplete = true;
            this.genreList = is ? res.records : [...this.genreList, ...res.records];
            this.pageIndex < res.pages ? (this.haveMore = true) : (this.haveMore = false);
         });
      },
      //全面课程列表
      getSemesterList(isReset = false) {
         this.pageIndex = isReset ? 1 : this.pageIndex;
         let params = {
            index: true,
            current: this.pageIndex,
            size: this.pageSize,
            register_date: true,
            status: "",
         };

         if (this.cityList.length && this.cityList[this.cityIndex].id > -1) {
            params.options = {
               city_id: this.cityList[this.cityIndex].id,
            };
         }
         //查询
         this.keyword ? (params.name = this.keyword) : null;
         //二级查询
         this.activeType ? (params.type = this.activeType.value) : null;
         this.isLoadingComplete = false;
         params.queryType = 1;
         this.api.get("/api/school/maincourse/open/list", params, { type: "other" }).then((res) => {
            if (isReset) {
               this.semesterList = res.records || [];
            } else {
               this.semesterList = this.semesterList.concat(res.records);
            }
            this.isLoadingComplete = true;
            this.pageIndex < res.pages ? (this.haveMore = true) : (this.haveMore = false);
            uni.hideNavigationBarLoading();
            uni.stopPullDownRefresh();
         });
      },

      cityChange(event) {
         this.cityIndex = event.detail.value;
         this.getSemesterList(true);
      },

      search() {
         if (!this.tabActive) {
            this.getGenreList(true);
         } else {
            this.getSemesterList(true);
         }
      },

      //流派列表
      genreListClick(item) {
         this.onoff = true;
         console.log(this.uid, "传参");
         let _item = encodeURIComponent(JSON.stringify(item));
         uni.navigateTo({
            url: `/coachPages/coach-train/home/genre?data=${_item}&uid=${this.uid}`,
         });
      },
      //全面详情
      skipSemesterDetailsPage(id) {
         this.onoff = true;
         uni.navigateTo({
            url: `/coachPages/coach-train/semester-details/index?semester_id=${id}&isSignUp=false&genre=false&uid=${this.uid}`,
         });
      },

      skipMyCoachTrainPage() {
         if (this.on_off) {
            this.on_off = false;
            let otherToken = uni.getStorageSync("otherToken");
            otherToken
               ? uni.navigateTo({
                  url: "/coachPages/coach-train/my-coach-train/index?isRegister=true",
               })
               : loginBack({}, () => {
                  uni.navigateTo({
                     url: "/coachPages/coach-train/my-coach-train/index?isRegister=true",
                  });
               });
         }
      },
      //分享数据
      async getshareInfo() {
         return await this.api.get("/api/school/share/getShareCode", { type: 40 }, { type: "other" });
      },
      cancelLogin(event) {
         this.loginTemplateVisible = false;
      },
   },
};
</script>

<style lang="scss">
.bg {
   background: url("/static/images/tabbar/revision/title2.png") no-repeat;
   background-size: 100%;
   height: 182upx;
   .tab {
      position: relative;
      height: 102upx;
      display: flex;
      justify-content: center;
      i {
         position: absolute;
         left: 176upx;
         bottom: 4upx;
         width: 32upx;
         height: 16upx;
         background: url("/static/images/tabbar/revision/tabIcon.png") no-repeat;
         background-size: 100%;
         transition: 0.4s;
      }

      text {
         flex: 1;
         display: inline-block;
         opacity: 0.8;
         font-size: 30upx;
         font-family: PingFangSC, PingFangSC-Regular;
         text-align: center;
         color: #ffffff;
         line-height: 102upx;
      }
   }
}
.handle-bar {
   display: flex;
   padding: 16upx 32upx 7upx 32upx;

   .picker {
      height: 60upx;
      display: flex;
      align-items: center;
      font-size: 30upx;
      color: #484f55;

      .yicon {
         margin-left: 8upx;
      }
   }
}
.search-box {
   flex: 1;
   margin-left: 16upx;
   // width: 100%;
   z-index: 12;
   box-sizing: border-box;
   input {
      margin-left: 10upx;
      flex: 1;
   }

   .search {
      width: 100%;
      height: 64upx;
      display: flex;
      flex-direction: row;
      align-items: center;
      color: #fff;
      background: #f29b5e;
      border-radius: 40upx;
      .tag {
         margin-left: 20upx;
         background: #888888;
         border-radius: 22upx;
         padding: 5upx 10upx;
         display: flex;
         align-items: center;
         color: #fff;
         .colse {
            margin-left: 10upx;
         }
      }
   }

   .search-icon {
      position: relative;
      margin-left: 24upx;
      width: 34upx;
      height: 34upx;
      display: inline-block;
      opacity: 1;
      span {
         display: block;
         z-index: 2022;
         background: url("/static/images/tabbar/revision/search.png") no-repeat
            0 4upx;
         width: 28upx;
         height: 30upx;
         background-size: 100%;
      }
   }
}
.blank {
   height: 300rpx;
   width: 100%;
}
.semesterType {
   display: flex;
   justify-content: space-between;
   height: 103upx;
   padding: 15upx 32upx 40upx;
   background: #f9f9f9;
   &.position-sticky {
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 10;
   }
   .type-item {
      min-width: 206rpx;
      border: 1px solid #ebd9cd;
      border-radius: 32upx;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 64upx;
      padding: 0 30rpx;
      background: #f8f8f8;
      color: #bf8359;
      font-size: 24upx;
      border-radius: 32upx;
   }
   .active-status {
      background: #fcf5f0;
      border: 1px solid #bf8359;
   }
}

.my {
   width: 64upx;
   height: 64upx;
   margin-left: 10upx;
   background: url("/static/images/tabbar/revision/mine.png") no-repeat center
      top;
   background-size: 120%;
}

.content-list {
   padding: 32upx;
   height: 100%;
   .item-list {
      position: relative;
      margin-bottom: 32upx;
      background: #ffffff;
      border-radius: 20upx;
      image {
         background: #ccc;
         border-radius: 20upx 20upx 0 0;
         width: 100%;
         height: 343upx;
      }
      .introduce {
         padding: 24upx 32upx 32upx 32upx;
         .address,
         .time {
            margin-top: 24upx;
            display: flex;
            align-items: center;
            font-size: 28upx;
            color: #222527;
            font-weight: 400;
            > text {
               color: #f08336;
               width: 35upx;
               height: 35upx;
               line-height: 35upx;
            }
            .iconSchool {
               display: inline-block;
               background: url("/static/images/tabbar/revision/school.png")
                  no-repeat bottom left;
               background-size: 28upx;
            }
         }
         .title {
            font-size: 34upx;
            color: #222527;
            font-weight: bold;
         }
         .payment {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-top: 40upx;
            .price {
               color: #ff0000;
               .unit {
                  font-size: 32upx;
                  font-weight: 500;
               }
               .money {
                  font-size: 48upx;
                  font-weight: 600;
               }
            }
            .reserveBg,
            .past-due,
            .full-payment {
               margin: 0;
               padding: 12upx 36upx;
               border-radius: 33upx;
               font-size: 30upx;
               color: #ffffff;
               line-height: 42upx;
               font-weight: 500;
            }
            .reserveBg {
               background: linear-gradient(90deg, #ff9096, #fd6771);
            }
            .full-payment {
               background: linear-gradient(90deg, #b699f3, #8e80f3);
            }
            .past-due {
               background: #919da7;
            }
         }
      }
   }

   .item-list:last-of-type {
      margin-bottom: 0;
   }
}

.no-data {
   text-align: center;
   transform: translateY(-50vh);
}
.swiper {
   display: block;
   overflow: auto;
   height: 8000rpx;
}
.cardImgWarp {
   display: flex;
   flex-wrap: wrap;
   justify-content: center;
   padding-top: 10rpx;
   .cardImg {
      width: 690rpx;
      height: 320rpx;
      background: #f1e8e1;
      border-radius: 20rpx;
      margin-bottom: 20rpx;
      overflow: hidden;
   }
}
</style>
