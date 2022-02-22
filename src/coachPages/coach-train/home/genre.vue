<template>
   <view class="container page-bg">
      <cu-custom bgColor="bg-white"
                 :isBack="true"
                 backUrl="/coachPages/coach-train/home/index"
                 bgImage="https://file.jiayu.world/image/weixinmini/title.png">
         <block slot="content"
                style="color: #fff;">{{ options.name }}</block>
      </cu-custom>
      <view class="bg">
         <view class="handle-bar">
            <picker @change="cityChange"
                    :value="cityIndex"
                    :range="cityList"
                    range-key="name">
               <view class="picker">
                  {{ cityList[cityIndex].name }}
                  <text class="yicon icon-xiala"></text>
               </view>
            </picker>
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
                  @click="skipMyCoachTrainPage"></view>
         </view>
      </view>
      <!-- 流派 -->
      <view class="swiper-item uni-bg-red" style="height:86vh">
         <!-- <view class="semesterType position-sticky">
        <template v-for="item in semesterType">
          <view :class="[activeType.value == item.value ? 'active-status type-item' : 'type-item']" @click="typeChange(item)" :key="item.value">
            {{ item.label }}
          </view>
        </template>
      </view> -->
         <scroll-view scroll-y
                      @scrolltolower="handleScrollToLower"
                      style="height: 100%;padding-bottom: 40rpx;"
                      v-if="semesterList.length">
            <view class="content-list">
               <view class="item-list"
                     v-for="item in semesterList"
                     :key="item.id"
                     @click="skipSemesterDetailsPage(item.id)">
                  <image :src="item.picture"></image>
                  <view class="introduce">
                     <text class="title">{{ item.name }}</text>
                     <view class="address">
                        <text class="iconSchool"></text>
                        <view>培训校区：{{ item.schoolName }}</view>
                     </view>
                     <!-- <view class="time">
                    <text class="yicon icon-time1"></text>
                    <view>报名时间：{{ item.register_start_at }}~{{ item.register_end_at }}</view>
                  </view> -->
                     <!-- 定金模式不显示金额-->
                     <view class="payment">
                        <button class="reserveBg"
                                v-if="item.registerMode == 10">
                           {{ "定金" + parseFloat(item.registerMoney) + "元" }}
                        </button>
                        <button class="full-payment"
                                v-else>立即支付</button>
                     </view>
                  </view>
               </view>
            </view>
         </scroll-view>
      </view>

      <button class="fixed-share-btn"
              @click="showShareModal">
         <view class="yicon icon-share"></view>
      </button>
      <view class="cu-modal bottom-modal"
            :class="menuVisible ? 'show' : ''"
            @tap="hideModal">
         <view class="cu-dialog"
               @tap.stop="">
            <view style="background-color: #e5e5e5;">
               <view class="cu-list menu text-center">
                  <view class="cu-item"
                        @tap="hideModal">
                     <button class="cu-btn content text-grey"
                             style="height: 100upx; justify-content: center;"
                             open-type="share">分享给朋友</button>
                  </view>
                  <view class="cu-item"
                        style="border-bottom: none;"
                        @tap="saveShare">
                     <view class="content">
                        <text class="text-grey">生成卡片保存分享</text>
                     </view>
                  </view>
                  <view class="cu-item"
                        style="margin-top: 8upx;"
                        @tap="hideModal">
                     <view class="content">
                        <text class="text-grey">取消</text>
                     </view>
                  </view>
               </view>
            </view>
         </view>
      </view>

      <view v-if="isLoadingComplete && !semesterList.length"
            class="no-data">暂无相关数据</view>

      <share-modal :visible="shareVisible"
                   :shareImage="shareImage"></share-modal>
      <!--  #ifdef  MP-WEIXIN -->
      <canvasdrawer :painting="painting"
                    @getImage="getShareImage" />
      <!--  #endif -->

      <is-login :isVisible="loginTemplateVisible"
                @cancel="cancelLogin($event)"></is-login>
   </view>
</template>

<script>
import { mapState } from "vuex";
import isLogin from "../../../components/login/login.vue";
import shareOption from "./share-image-options";
import { loginBack } from "@/utils/loginBack.js";

export default {
   data() {
      return {
         options: {},
         tabActive: 0,
         current: 0,
         cityList: [{ name: "全国", id: -1 }],
         semesterList: [],
         cityIndex: 0,
         keyword: "",
         //分享
         menuVisible: false,
         shareVisible: false,
         shareImage: "",
         painting: {},
         semesterType: [
            { label: "常规课", value: 1 },
            { label: "工作坊", value: 2 },
            { label: "名师培训", value: 3 },
         ],
         activeType: null,
         pageIndex: 1,
         pageSize: 10,
         haveMore: false,
         isShare: false,
         isLoginLink: false,
         loginTemplateVisible: false,
         isLoadingComplete: false,
         onoff: true, // 防止持续点击
         shareData: {},
         scene: false,
         uid: null,
         otherToken: false,
         on_off: true,
         isShare: false
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
      if (options.scene) {
         let data = decodeURIComponent(options.scene);
         let params = {};
         data.split(",").forEach((item) => {
            let currentParams = item.split("=");
            params[currentParams[0]] = currentParams[1];
         });
         this.scene = params;
         let isShareObj = { isShare: true, uid: params.uid, shareData: this.scene };
         uni.setStorageSync("isShareObj", JSON.stringify(isShareObj));
      } else {
         let _data= decodeURIComponent(options.data)
         this.options = JSON.parse(_data);
         let isShareObj = uni.getStorageSync("isShareObj");
         if (options.isShare == 'true') {
            this.isShare = JSON.parse(options.isShare);
            this.uid = options.uid;
            this.shareData = JSON.parse(options.shareData);
            let isShareObj = { isShare: this.isShare, uid: this.uid, shareData: this.shareData };
            uni.setStorageSync("isShareObj", JSON.stringify(isShareObj));
         } else if (isShareObj) {
            let isShareObjs = JSON.parse(isShareObj);
            this.isShare = isShareObjs.isShare;
            this.uid = isShareObjs.uid;
            this.shareData = isShareObjs.shareData;
         }
      }
      this.getSemesterList();
      this.getCityList();
      this.otherToken = uni.getStorageSync("otherToken");
      let isEnter = uni.getStorageSync("isEnter");
      if (this.otherToken) {
         this.shareData = await this.getshareInfo(1);
         //普通用户分享还是之前uid - 如果是销售分享出去则替换为自己uid
         this.uid = this.shareData.uid || this.uid;
      } else if (isEnter !== false) {
         await loginBack({}, async () => {
            this.shareData = await this.getshareInfo(1);
            this.uid = this.shareData.uid || this.uid;
         });
      } else {
         //取消登录则只获取分享信息
         this.shareData = await this.getshareInfoNoToken(1);
      }
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
       let _shareData={...this.shareData}
      delete _shareData.name
      return {
         title: this.shareData.name,
         path: "/coachPages/coach-train/home/genre?data=" + JSON.stringify(this.options) + "&uid=" + this.uid + "&shareData=" + JSON.stringify(_shareData) + "&isShare=true",
         imageUrl: this.shareData.wxIconUrl,
      };
   },
   //分享朋友圈
   onShareTimeline() {
       let _shareData={...this.shareData}
      delete _shareData.name
      return {
         title: this.shareData.name,
         query: "data=" + JSON.stringify(this.options) + "&uid=" + this.uid + "&shareData=" + JSON.stringify(_shareData) + "&isShare=true",
         imageUrl: this.shareData.wxIconUrl,
      };
   },
   methods: {
      //上拉触底
      handleScrollToLower() {
         if (!this.haveMore) return;
         this.pageIndex = this.pageIndex + 1;
         this.getSemesterList();
      },
      generateShareParams() {
         let query = "isShare=true";
         if (this.currentMemberId) {
            query += "&school_share_member_id=" + this.currentMemberId;
         }
         if (this.shareSalesmanId) {
            query += "&share_salesman_id=" + this.shareSalesmanId;
         }
         return query;
      },

      getCityList() {
         this.api.get("/api/school/index/open/city/list", {}, { type: "other" }).then((res) => {
            this.cityList = [...this.cityList, ...res];
         });
      },

      typeChange(item) {
         this.activeType = item;
         this.getSemesterList(true);
      },

      colse() {
         this.activeType = null;
         this.getSemesterList(true);
      },

      getSemesterList(isReset = false) {
         let params = {
            current: isReset ? 1 : this.pageIndex,
            size: this.pageSize,
            category: this.activeType ? this.activeType.value : "",
            semesterCategoryId: this.scene ? this.scene.id : this.options.id,
         };
         if (this.cityList.length && this.cityList[this.cityIndex].id > -1) {
            params.cityId = this.cityList[this.cityIndex].id;
         }
         //查询
         this.keyword ? (params.name = this.keyword) : null;
         //二级查询
         this.activeType ? (params.type = this.activeType.value) : null;
         this.isLoadingComplete = false;
         params.queryType = 1;
         this.api.get("/api/school/semester/open/list", params, { type: "other" }).then((res) => {
            if (isReset) {
               this.semesterList = res.records || [];
            } else {
               this.semesterList = this.semesterList.concat(res.records);
            }
            this.isLoadingComplete = true;
            this.pageIndex<res.pages? (this.haveMore=true):(this.haveMore=false);
            uni.hideNavigationBarLoading();
            uni.stopPullDownRefresh();
         });
      },

      cityChange(event) {
         this.cityIndex = event.detail.value;
         this.getSemesterList(true);
      },

      search() {
         this.getSemesterList(true);
      },

      //全面详情
      skipSemesterDetailsPage(id) {
         let _isSignUpData = encodeURIComponent(JSON.stringify(this.isSignUpData));
         this.onoff = true;
         //是否分享
         uni.navigateTo({
            url: "/coachPages/coach-train/semester-details/index?semester_id=" + id + "&genreSemester_id=" + id + "&isSignUp=false&genre=true" + "&uid=" + this.uid + "&shareData=" + _isSignUpData,
         });
      },

      skipMyCoachTrainPage() {
         if (this.on_off) {
            this.on_off = false;
            let params = this.scene ? this.scene : {};
            this.otherToken
               ? uni.navigateTo({
                  url: "/coachPages/coach-train/my-coach-train/index?isRegister=true",
               })
               : loginBack(params, () => {
                  uni.navigateTo({
                     url: "/coachPages/coach-train/my-coach-train/index?isRegister=true",
                  });
               });
         }
      },

      cancelLogin(event) {
         this.loginTemplateVisible = false;
      },
      // 分享按钮点击事件
      async showShareModal() {
         // 展示选择分享框
         let params = this.scene ? this.scene : {};
         if (this.otherToken) {
            this.shareData = await this.getshareInfo(1);
            this.uid = this.shareData.uid || this.uid;
            this.menuVisible = true;
         } else {
            loginBack(params, async () => {
               this.shareData = await this.getshareInfo(1);
               this.uid = this.shareData.uid || this.uid;
               this.menuVisible = true;
            });
         }
      },
      //分享数据  顶部的 ... 分享好友的功能
      async getshareInfo(type) {
         let params = {
            categoryId: this.scene ? this.scene.id : this.options.id,
            id: this.scene ? this.scene.id : this.options.id,
            type: 30,
            //1好友 2图片分享
            shareType: type,
         };
         return await this.api.get("/api/school/share/getShareCode", params, { type: "other" });
      },
      async getshareInfoNoToken(type) {
         let params = {
            categoryId: this.scene ? this.scene.id : this.options.id,
            id: this.scene ? this.scene.id : this.options.id,
            type: 30,
            //1好友 2图片分享
            shareType: type,
         };
         return await this.api.get("/api/school/share/open/getShareCode", params, { type: "other" });
      },
      hideModal() {
         // 隐藏选择分享框
         this.menuVisible = false;
         this.shareVisible = false;
      },

      async saveShare() {
         // 生成卡片分享
         this.menuVisible = false;
         this.shareData = await this.getshareInfo(2);
         if (!this.shareImage) {
            let data = shareOption;
            data.views[1].url = this.shareData.posterShareUrl;
            data.views[2].content = this.shareData.name;
            data.views[3].content = "fineyoga 梵音瑜伽";
            //二维码相等最后一项url
            data.views[data.views.length - 1].url = this.shareData.wxacodeUrl;
            this.painting = data;
            uni.showLoading({
               title: "分享图片生成中",
               mask: true,
            });
         } else {
            this.shareVisible = true;
         }
      },

      getShareImage(event) {
         this.shareImage = event.detail.tempFilePath;
         uni.hideLoading();
         this.shareVisible = true;
      },

      saveShareImage() {
         this.shareVisible = false;
         uni.saveImageToPhotosAlbum({
            filePath: this.shareImage,
            success: () => {
               uni.showToast({
                  title: "保存图片成功",
                  icon: "success",
                  duration: 2000,
               });
            },
            fail: (error) => {
               console.log("error===>", error);
            },
         });
      },
   },
};
</script>

<style lang="scss">
.bg {
   background: url("/static/images/tabbar/revision/title2.png") no-repeat;
   background-size: 100%;
   height: 112upx;
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
      color: #ffff;
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

.semesterType {
   display: flex;
   justify-content: space-around;
   padding: 50upx 32upx 8upx;
   background: #f9f9f9;
   height: 122rpx;
   width: 100%;
   overflow: hidden;
   &.position-sticky {
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 10;
   }
   .type-item {
      border: 1px solid #ebd9cd;
      border-radius: 32upx;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 64upx;
      padding: 0 54rpx;
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
      center;
   background-size: 125%;
}

.content-list {
   padding: 32upx;
   height: auto;
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
   padding-top: 40upx;
   text-align: center;
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
   .cardImg {
      width: 690rpx;
      height: 320rpx;
      background: #f1e8e1;
      border-radius: 20rpx;
      margin-bottom: 20rpx;
   }
}

.fixed-share-btn {
   width: 60upx;
   height: 60upx;
   padding: 0;
   border-radius: 50%;
   background-image: linear-gradient(-58deg, #ff401f 2%, #ff711e 75%);
   box-shadow: 0 4px 8px 0 rgba(255, 69, 31, 0.4);
   position: fixed;
   z-index: 10;
   bottom: 223upx;
   right: 50upx;
   color: white;
   display: flex;
   align-items: center;
   justify-content: center;
   .yicon {
      font-size: 36rpx;
   }
}
</style>
