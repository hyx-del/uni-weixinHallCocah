<template>
   <view class="container page-bg"
         :class="(countPrice && isPayment) || !isSignUp ? 'fixed-page-large' : ''">
      <view class="cu-custom">
         <view class="cu-bar fixed"
               :style="style">
            <view class="action"
                  @click="gotoPage">
               <text class="cuIcon-back"
                     :style="{ color: scrollTop > 50 ? 'block' : 'white' }"></text>
            </view>
            <view v-if="scrollTop > 50"
                  class="content"
                  :style="[{ top: StatusBar + 'px' }]">
               学期详情
            </view>
         </view>
      </view>
      <view class="wrap-main"
            v-if="semesterDetail">
         <view class="article-banner">
            <image :src="genre ? semesterDetail.picture : semesterDetail.coverUrl"
                   mode="scaleToFill"></image>
         </view>

         <view class="warpBox">
            <view class="nav"
                  v-if="isSignUp">
               <view v-for="(item, index) in navList"
                     :key="index"
                     @click="navChange(item.id)">
                  <text :class="item.id == activeNav ? 'active' : ''">{{ item.label }}</text>
                  <text :class="item.id == activeNav ? 'active active-bor border' : 'border'"></text>
               </view>
            </view>
            <!-- 介绍 -->
            <view v-if="activeNav == 1 && semesterDetail"
                  class="warpall">
               <!-- 内容部分 -->
               <view class="details-info">
                  <!-- 定金模式不显示金额 -->
                  <!-- <view class="price" v-if="semesterDetail.register_mode != 10">
            <text class="unit">￥</text>
            <text class="sum">{{ price }}</text>
          </view> -->
                  <view class="title">{{ semesterDetail.name }}</view>
                  <view class="titleInfo">
                     <view class="placeIcon">培训校区：{{ genre ? semesterDetail.schoolName : semesterDetail.address }}</view>
                     <view v-if="isShare && uid && uid!='null' && !isSignUp &&semesterDetail.userName!=null">
                        <view>姓名：&emsp;&emsp;{{ semesterDetail.userName }}</view>
                        <view>联系电话：{{ genre?semesterDetail.contact:semesterDetail.phone }}</view>
                     </view>
                     <view class="phoneIcon"
                           v-else>联系电话：{{ genre ? semesterDetail.contact : semesterDetail.phone }}</view>
                  </view>
               </view>

               <!-- 地图 -->
               <!-- <view class="map">
                    <map class="map-content" :latitude="latitude" :longitude="longitude" z-index="0">
                        <view class="map-cover" @click='openLocation'>
                            <view class="map-address">
                                <image class="iconp" src="/static/images/point.png"></image>
                                <view class="map-text">{{ semesterDetail.school_address }}</view>
                            </view>
                            <view class="map-long">距离您{{distance ? distance : '__'}}km</view>
                        </view>
                    </map>
                </view> -->

               <view class="wrap">
                  <!-- 全面课程有效期 -->
                  <view v-if="!genre">
                     <view class="vi"
                           style="width: 100%;">
                        <p class="vib1">培训派别</p>
                        <text>{{ semesterDetail.categoryName }}</text>
                     </view>
                     <view class="vi"
                           style="width: 100%; margin-top: 20rpx;">
                        <p class="vib2">培训有效期</p>
                        <text>{{ semesterDetail.trainValidDayName }}</text>
                     </view>
                  </view>

                  <!-- 流派有效期 -->
                  <view v-else>
                     <view class="avatar">
                        <view>
                           已报名学员
                           <text>{{ semesterDetail.registeredNumber }}/{{ semesterDetail.number }}</text>
                        </view>
                        <view class="avatarList">
                           <image :src="item.avatar ? item.avatar : '/static/images/tabbar/revision/avater.png'"
                                  v-for="(item, index) in semesterDetail.studentAvatar"
                                  :key="index"></image>
                        </view>
                     </view>
                     <view class="factions"
                           style="margin-bottom: 20rpx;">
                        <view class="vi">
                           <p class="vib11">报名时间</p>
                           <text>{{ semesterDetail.registerStartAt }}～{{ semesterDetail.registerEndAt }}</text>
                        </view>
                        <view class="vi">
                           <p class="vib2">培训时间</p>
                           <text>{{ semesterDetail.startDate }}～{{ semesterDetail.endDate }}</text>
                        </view>
                     </view>
                     <view class="vi"
                           style="width: 690rpx;">
                        <p class="vib1">培训地点</p>
                        <text>{{ semesterDetail.provinceName }}&nbsp; {{ semesterDetail.cityName }}&nbsp; {{ semesterDetail.address }}</text>
                     </view>
                  </view>

                  <!-- 培训介绍 -->
                  <view class="introduce-content">
                     <text class="title">培训介绍</text>
                     <view v-if="semesterDetail"
                           class="parse-container">
                        <wxparse :content="intro"></wxparse>
                     </view>
                  </view>
               </view>
            </view>
            <!-- 费用明细 -->
            <view v-if="activeNav == 2"
                  class="cost">
               <!-- 倒计时 -->
               <!-- <view class="no-payment" v-if="semesterDetail && orderIsLoading && !orderIsEnd">
          <view class="pay-time">
            <view class="title">等待支付中</view>
            <view class="count-down">{{ countdownStr }}后订单将自动关闭</view>
          </view>
          <image src="../../static/images/wallet.svg"></image>
        </view> -->

               <view class="balance-pay">
                  <!-- 尾款待支付  -->
                  <view class="have-paid-sum"
                        v-if="paid.length">
                     <view class="title">已支付</view>
                     <view class="earnest"
                           v-for="(item, index) in paid"
                           :key="index">
                        <text>{{ item.typeName }}</text>
                        <text>￥{{ item.total }}</text>
                     </view>
                  </view>

                  <view class="unpaid"
                        v-if="needPay.length">
                     <view class="title">
                        <text>待支付</text>
                     </view>

                     <view class="unpaid-info">
                        <view class="list"
                              v-for="(item, index) in needPay"
                              :key="index">
                           <view class="checkbox-group">
                              <text>{{ item.typeName }}</text>
                           </view>
                           <text>￥{{ item.total }}</text>
                        </view>

                        <view class="total"
                              v-if="genre">合计：￥{{ countPrice }}</view>
                     </view>
                  </view>
               </view>
            </view>
         </view>

         <!-- 学期按钮 -->
         <view class="footer"
               v-if="genre">
            <view class="pay-footer"
                  v-if="semesterDetail && !isSignUp">
               <button :class="valid ? 'valid' : 'earnest'"
                       @click="skipSignUpPage()"
                       v-if="semesterDetail.registerMode == 10">
                  <view>{{ "支付定金 ￥" + semesterDetail.earnest }}</view>
               </button>
               <button :class="valid ? 'valid' : 'full-payment'"
                       @click="skipSignUpPage()"
                       v-else>
                  <view>立即报名</view>
               </button>
            </view>
         </view>

         <!-- 全面按钮 -->
         <view class="footer"
               v-else>
            <view class="pay-footer"
                  v-if="semesterDetail.status && !isSignUp">
               <button :class="valid ? 'valid' : 'earnest'"
                       @click="skipSignUpPage()"
                       v-if="semesterDetail.registerMode == 10">
                  <view>{{ "支付定金 ￥" + semesterDetail.earnest }}</view>
               </button>
               <button :class="valid ? 'valid' : 'full-payment'"
                       @click="skipSignUpPage()"
                       v-else>
                  <view>立即报名</view>
               </button>
            </view>
         </view>

         <view class="footer"
               @click="skipReportCard"
               v-if="isSignUp && semesterDetail.student_semester_status == 40">
            <view class="footer-wrap"
                  @click="lookMyGrade()">
               <text>已结业，查看成绩单</text>
            </view>
         </view>

         <!--student_semester_status  10 -> 待支付(待报到) 30  -->
         <view class="footer"
               v-if="isSignUp && orderIsLoading">
            <view class="pay-footer"
                  @click="nowPay()">
               <button class="earnest">
                  <view>立即支付</view>
               </button>
            </view>
         </view>
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
                             open-type="share">
                        分享给朋友
                     </button>
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
import wxParse from "../../../wxcomponents/wxParse/wxParse.js";
import { loginBack } from "@/utils/loginBack.js";

export default {
   data() {
      return {
         //是否是流派跳转
         genre: false,
         semesterDetail: null,
         isSignUp: false,
         btnValue: "",
         scrollTop: 0,
         isShare: false,
         CustomBar: this.CustomBar,
         StatusBar: this.StatusBar,
         Custom: this.Custom,
         // latitude: null,
         // longitude: null,
         // isopenLocation: true,
         // distance: null,

         menuVisible: false,
         shareVisible: false,
         shareImage: "",
         painting: {},
         isSignUpData: {},
         navList: [
            { id: 1, label: "学期介绍" },
            { id: 2, label: "费用明细" },
         ],
         activeNav: 1,
         needPay: [],
         paid: [],
         countPrice: null,
         loginTemplateVisible: false,
         isLoginLink: false,
         intro: [],
         schoolAddress: "",
         currentDate: null,
         timer: null,
         orderEndDate: null,
         orderCountdown: "",
         orderIsEnd: false,
         orderIsLoading: false,
         staff: {},
         studentSemesterId: null,
         isPayment: false,
         //分享数据
         shareData: {},
         //分享携带页面参数
         scene: {},
         //分享携带
         uid: null,
         //登录后报名时并不能携带自己
         uids: null,
         //有效期
         valid: false,
         otherToken: false,
         on_off: true,
      };
   },
   components: {
      isLogin,
   },

   watch: {},

   computed: {
      ...mapState(["ossPath", "isLogin", "isAuth", "currentMemberId", "schoolShareMemberId", "shareSalesmanId"]),

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


      price() {
         if (!this.semesterDetail) {
            return;
         }
         const data = this.semesterDetail;
         return parseFloat(data.tuition);

         if (data.quarterage == 0) {
            return parseFloat(data.quarterage) + parseFloat(data.tuition);
         } else {
            let min = parseFloat(data.tuition);
            let max = parseFloat(data.quarterage) + parseFloat(data.tuition);
            return min + "~" + max;
         }
      },
      countdownStr() {
         return this.orderCountdown;
      },
   },

   async onLoad(options) {
      console.log("进入详情参数===>", options);
      if (options["school_share_member_id"]) {
         this.$store.commit("setSchoolShareMemberId", options["school_share_member_id"]);
      } else {
         this.$store.commit("setSchoolShareMemberId", "");
      }
      if (options["share_salesman_id"]) {
         this.$store.commit("setShareSalesmanId", options["share_salesman_id"]);
      } else {
         this.$store.commit("setShareSalesmanId", "");
      }

      if (options.scene) {
         let data = decodeURIComponent(options.scene);
         let params = {};
         data.split(",").forEach((item) => {
            let currentParams = item.split("=");
            params[currentParams[0]] = JSON.parse(currentParams[1]);
         });

         if (params["uid"]) {
            this.$store.commit("setSchoolShareMemberId", params["uid"]);
         } else {
            this.$store.commit("setSchoolShareMemberId", "");
         }
         if (params["sid"]) {
            this.$store.commit("setShareSalesmanId", params["sid"]);
         } else {
            this.$store.commit("setShareSalesmanId", "");
         }

         this.semester_id = params.id;
         this.genreSemester_id = params.id;
         this.genre = parseInt(params.p) ? true : false;
         this.scene = params;
         this.isSignUp = false;
         this.isShare = true;
         this.uid = params.uid;
         console.log(this.scene, "海报分享");
         let isShareObj = { isShare: true, uid: params.uid, shareData: this.scene };
         uni.setStorageSync("isShareObj", JSON.stringify(isShareObj));
      } else {
         let isShareObj = uni.getStorageSync("isShareObj");
         console.log(isShareObj, "我是分享参数");
         console.log(options, "页面携带");
         if (options.isShare == 'true') {
            this.isShare = JSON.parse(options.isShare);
            this.uid = options.uid;
            this.uids = options.uid;
            this.scene = JSON.parse(options.shareData);
            console.log(this.scene, "后面额东西");
            let isShareObj = { isShare: this.isShare, uid: this.uid, shareData: this.scene };
            uni.setStorageSync("isShareObj", JSON.stringify(isShareObj));
         } else if (isShareObj) {
            let isShareObjs = JSON.parse(isShareObj);
            this.isShare = isShareObjs.isShare;
            this.uid = isShareObjs.uid;
            this.uids = isShareObjs.uid;
            this.scene = isShareObjs.shareData;
         }
         this.isSignUp = JSON.parse(options.isSignUp);
         //全面学期详情id
         this.semester_id = options.semester_id;
         this.genreSemester_id = options.genreSemester_id;
         //报名id
         this.studentSemesterId = options.student_Semester_id;
         this.genreStudentSemesterId = options.genreStudentSemesterId;
         this.activeNav = options.active;
         this.genre = JSON.parse(options.genre);
         // debugger
      }
      if (this.schoolShareMemberId || this.shareSalesmanId) {
         // if (this.schoolShareMemberId) {
         //     uni.setStorageSync("school_share_member_id", this.schoolShareMemberId);
         // }
         await this.getSalesmanInfo();
      }
      this.otherToken = uni.getStorageSync("otherToken");
      let isEnter = uni.getStorageSync("isEnter");
      let id = this.genre ? this.genreSemester_id : this.semester_id;
      if (id) {
         await this.getSemesterDetails(id);
         //主要分享携带
         if (this.otherToken) {
            this.shareData = await this.getshareInfo(1);
            //普通用户分享还是之前uid - 如果是销售分享出去则替换为自己uid
            this.uid = this.shareData.uid || this.uid;
         } else if (isEnter !== false) {
            await loginBack({}, async () => { this.shareData = await this.getshareInfo(1); this.uid = this.shareData.uid || this.uid; });
         } else {
            //取消登录则只获取分享信息
            this.shareData = await this.getshareInfoNoToken(1);
         }
         //换成自己的分享出去绑定，当前页面销售还是分享进来uid
      } else {
         uni.showToast({
            title: "数据异常",
            icon: "none",
            duration: 2000,
         });
      }
      // wx.getLocation({
      //     type: 'wgs84',
      //     success: (res) => {
      //         this.getDistance(res);
      //     }
      // });
   },

   onShow() {
      this.on_off = true;
   },

   destroyed() {
      console.log("销毁======");
      if (this.timer) {
         clearInterval(this.timer);
      }
   },

   onPageScroll(event) {
      this.scrollTop = event.scrollTop;
   },

   //分享好友
   onShareAppMessage() {
      console.log(this.uid, "好友里面");
      let _shareData = { ...this.shareData };
      delete _shareData.name;
      return {
         title: this.shareData.name,
         path: "/coachPages/coach-train/semester-details/index?semester_id=" + this.semester_id + "&isSignUp=false&genre=" + this.genre + "&genreSemester_id=" + this.genreSemester_id + "&uid=" + this.uid + "&isShare=true" + "&shareData=" + JSON.stringify(_shareData),
         imageUrl: this.shareData.wxIconUrl,
      };
   },

   //分享朋友圈
   onShareTimeline() {
      let _shareData = { ...this.shareData };
      delete _shareData.name;
      return {
         title: this.shareData.name,
         query: "semester_id=" + this.semester_id + "&isSignUp=false&genre=" + this.genre + "&genreSemester_id=" + this.genreSemester_id + "&uid=" + this.uid + "&isShare=true" + "&shareData=" + JSON.stringify(_shareData),
         imageUrl: this.shareData.wxIconUrl,
      };
   },

   methods: {
      gotoPage() {
         //  reLaunch 关闭所有之前打开的界面 ,打开某一个界面
         //  navigateTo   跳转到某一个界面
         uni.reLaunch({ url: "/coachPages/coach-train/home/index" });
      },
      getSalesmanInfo() {
         let params = {
            function: 32, // 教培销售
         };

         if (this.schoolShareMemberId) {
            params.share_member_id = this.schoolShareMemberId;
         }

         if (this.shareSalesmanId) {
            params.share_salesman_id = this.shareSalesmanId;
         }

         this.api.post("staff/index/getSalesmanInfo", params).then((ret) => {
            if (ret.id) {
               this.$store.commit("setShareSalesmanId", ret.id);
               // uni.setStorageSync("school_share_salesman_id", ret.id);

               this.staff = ret;
            }
         });
      },
      //详情
      async getSemesterDetails(id) {
         //是否我的报名过来
         if (!this.isSignUp) {
            let params = {
               id: id,
               queryType: 1,
               uid: this.uid || null,
            };
            console.log(params);
            // if (this.currentMemberId) {
            //     params.student_id = this.currentMemberId;
            // }
            //是否学期还是全面课程
            await this.api.get(this.genre ? "/api/school/semester/open/detail" : "/api/school/maincourse/open/detail", params, { type: "other" }).then((res) => {
               //学期ID 报名ID 是全面还是学期报名 是否報名
               this.semesterDetail = res || {};
               this.isSignUpData = {
                  //学期id
                  semesterId: res.id,
                  //全面学期id
                  mainCourseId: res.id,
                  student_SemesterId: res.registerId,
                  student_mainCourseId: res.registerId,
                  isSignUp: false,
                  //报名
                  isRegister: res.isRegister,
                  //支付
                  isPay: res.isPay,
                  //全款 定金
                  registerMode: res.registerMode,
                  name: res.name,
                  genre: this.genre,
                  //学期是否提供住宿 1:提供 0:不提供
                  isContainQuarterage: res.isContainQuarterage,
                  //是否供餐:1供餐 -1不供餐
                  mealStatus: res.mealStatus,
                  payOnline: res.payOnline,
               };
               if (this.genre) {
                  //学期判断过期时间
                  this.validTime();
               } else {
                  //全面判断上下线
                  this.valid = this.semesterDetail.status == 1 ? false : true;
               }

               if (res.training_address) {
                  this.schoolAddress = res.training_address;
               } else {
                  this.schoolAddress = res.school_address;
               }
               if (res.intro) {
                  wxParse.wxParse("intro", "html", this.semesterDetail.intro, this);
               }
            });
            return;
         }
         let params = {
            id: id,
            queryType: 2,
         };
         //报名id
         console.log(this.studentSemesterId, this.genreStudentSemesterId, "学期id");
         if (this.studentSemesterId || this.genreStudentSemesterId) {
            params.studentMainCourseId = this.studentSemesterId;
            params.studentSemesterId = this.genreStudentSemesterId;
         }
         this.api.get(this.genre ? "/api/school/semester/open/detail" : "/api/school/maincourse/open/detail", params, { type: "other" }).then((res) => {
            this.semesterDetail = res;
            this.isSignUpData = {
               //学期id
               semesterId: res.id,
               //全面学期id
               mainCourseId: res.id,
               student_SemesterId: res.registerId,
               student_mainCourseId: res.registerId,
               genre: this.genre,
               isSignUp: false,
               //报名
               isRegister: res.isRegister,
               //支付
               isPay: res.isPay,
               //全款 定金
               registerMode: res.registerMode,
               name: res.name,
               genre: this.genre,
               //学期是否提供住宿 1:提供 0:不提供
               isContainQuarterage: res.isContainQuarterage,
               //是否供餐:1供餐 -1不供餐
               mealStatus: res.mealStatus,
               payOnline: res.payOnline,
            };

            if (res.intro) {
               wxParse.wxParse("intro", "html", this.semesterDetail.intro, this);
            }
            //已支付
            this.paid = res.completePaid;
            //待支付
            this.needPay = res.agencyPaid;
            //未支付已报名  接口已算倒计时
            if (res.isPay == 0 && res.isRegister) {
               this.orderIsLoading = true;
            }
            this.setCountPrice();
         });
      },
      //有效期
      validTime() {
         if (this.semesterDetail.registerEndDate) {
            let a = this.semesterDetail.registerEndDate.replace(/-/g, "/");
            const newTime = new Date().getTime();
            const registerEndDate = new Date(a).getTime();
            if (newTime >= registerEndDate || this.semesterDetail.status != 1) this.valid = true;
         }
      },

      navChange(id) {
         this.activeNav = id;
      },

      setCountPrice() {
         // 计算全款，尾款的总计
         let countPrice = 0;
         this.needPay.forEach((item) => {
            countPrice += parseFloat(item.total);
         });
         this.countPrice = parseFloat(countPrice.toFixed(2));
      },

      nowPay() {
         let _isSignUpData = encodeURIComponent(JSON.stringify(this.isSignUpData));
         uni.navigateTo({
            //学期ID 报名ID 是全面 还是学期报名
            url: "/coachPages/coach-train/cashier-desk/index?data=" + _isSignUpData,
         });
      },

      lookMyGrade() {
         const data = this.semesterDetail;
         uni.navigateTo({
            url: "/coachPages/coach-train/report-card/index?class_id=" + data.class_id + "&audit=" + data.audit,
         });
      },

      //去报名
      async skipSignUpPage() {
         if (this.on_off) {
            this.on_off = false;
            this.validTime();
            if (this.valid) {
               uni.showModal({
                  //全款定金
                  title: this.genre ? this.semesterDetail.status != 1 ? "此学期已下线" : "此学期报名已过有效期" : "全面课程已下线",
                  confirmText: "知道了",
                  showCancel: false,
                  success: () => {
                     return;
                  },
               });
               return;
            }
            //是否登錄
            //学期ID 报名ID 是全面还是学期报名 是否報名
            this.otherToken
               ? this.goPay()
               : loginBack(this.scene, () => {
                  this.goPay();
               });
         }
      },

      goPay() {
         let { isPay, isRegister, payOnline } = this.isSignUpData;
         let _isSignUpData = encodeURIComponent(JSON.stringify(this.isSignUpData));
         switch (true) {
            case isRegister == 1 && isPay == 1:
               //是否報名并且已支付
               uni.showModal({
                  //全款定金
                  title: payOnline == 1 ? "你已报名，点击查看" : "已报名，你还有尾款待支付",
                  confirmText: "查看",
                  showCancel: false,
                  success: () => {
                     // 去我的报名
                     uni.navigateTo({
                        url: "/coachPages/coach-train/my-sign-up/index?genre=" + this.genre,
                     });
                  },
               });
               return;
               break;
            case isRegister == 1:
               //判断是否报名未支付
               uni.showModal({
                  title: "已提交重复报名，未支付状态",
                  confirmText: "去支付",
                  showCancel: false,
                  success: () => {
                     // 去支付页面
                     uni.navigateTo({
                        //学期ID 报名ID 是全面 还是学期报名
                        url: "/coachPages/coach-train/cashier-desk/index?data=" + _isSignUpData,
                     });
                  },
               });
               return;
               break;
            case this.semesterDetail.registeredNumber == this.semesterDetail.number && this.genre:
               //报名份额和人数相等已等
               uni.showModal({
                  title: "报名名额已满，您可以选择其他课程",
                  confirmText: "返回首页",
                  showCancel: false,
                  success: () => {
                     // 首页
                     uni.navigateTo({
                        url: "/coachPages/coach-train/home/index",
                     });
                  },
               });
               return;
               break;
            default:
               uni.navigateTo({
                  url: "/coachPages/coach-train/sign-up/index?params=" + _isSignUpData + "&scene=" + JSON.stringify(this.scene) + "&uid=" + this.uids + "&isShare=" + this.isShare,
               });
               break;
         }
      },

      cancelLogin(event) {
         this.loginTemplateVisible = false;
      },

      skipReportCard() {
         uni.navigateTo({
            url: "/coachPages/coach-train/report-card/index",
         });
      },

      // 分享按钮点击事件
      async showShareModal() {
         if (this.otherToken) {
            this.shareData = await this.getshareInfo(1);
            this.uid = this.shareData.uid || this.uid;
            this.menuVisible = true;
         } else {
            loginBack(this.scene, async () => {
               this.shareData = await this.getshareInfo(1);
               this.uid = this.shareData.uid || this.uid;
               this.menuVisible = true;
            });
         }
      },
      async getshareInfo(type) {
         let params = {
            id: this.isSignUpData.semesterId || this.isSignUpData.mainCourseId,
            type: this.genre ? 10 : 20,
            //1好友 2图片分享
            shareType: type,
         };
         return await this.api.get("/api/school/share/getShareCode", params, { type: "other" });
      },
      async getshareInfoNoToken(type) {
         let params = {
            id: this.isSignUpData.semesterId || this.isSignUpData.mainCourseId,
            type: this.genre ? 10 : 20,
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

<style lang="scss" scoped>
.wrap-main {
   flex: 1;
   background: #fff;
}

.article-banner {
   z-index: -2021;
   height: 375upx;
   overflow: hidden;
   background-size: cover;
   background-repeat: no-repeat;
   background-position: center;
   image {
      height: 375upx;
      width: 100%;
   }
}
.warpBox {
   transform: translateY(-48rpx);
   overflow: hidden;
   border-radius: 40rpx;
   background: #fff;

   .nav {
      display: flex;
      padding: 23upx 0 14upx 0;
      background: #ffffff;
      border-bottom: 1px solid #e5e5e5;
      > view {
         flex: 1;
         display: flex;
         justify-content: center;
         flex-direction: column;
         align-items: center;
         > text {
            font-size: 30upx;
            font-weight: 500;
         }
         .border {
            margin-top: 8upx;
            width: 32upx;
            height: 4upx;
            background: transparent;
            border-radius: 2upx;
         }
         .active {
            color: #f67b25;
         }
         .active-bor {
            background: #f67b25;
         }
      }
   }
   .warpall {
      .details-info {
         background: #ffffff;
         padding: 48rpx 30rpx 40rpx;

         .price {
            color: #ff0000;
            margin-bottom: 24upx;
            .unit {
               font-size: 32upx;
               font-weight: 500;
            }
            .sum {
               font-size: 48upx;
               font-weight: 500;
            }
         }
         // .reserve {
         //     margin-top: 33upx;
         //     display: flex;
         //     justify-content: space-between;
         //     .tag {
         //         border-radius: 12upx 0upx 12upx 0upx;
         //         padding: 4upx 12upx;
         //         background: #9b54ff;
         //         font-size: 24upx;
         //         font-weight: 400;
         //         color: #ffffff;
         //     }
         //     .reserve-number {
         //         font-size: 28upx;
         //         font-weight: 400;
         //         color: #999999;
         //     }
         // }
         .title {
            font-size: 34upx;
            font-weight: 600;
            color: #222527;
            margin-bottom: 30upx;
         }
         .titleInfo :first-child {
            margin-bottom: 20rpx;
         }
         .titleInfo {
            view {
               width: 100%;
               color: #666666;
               font-size: 26rpx;
               font-family: PingFangSC, PingFangSC-Regular;
               text-indent: 40rpx;
               margin-right: 50rpx;
            }

            .placeIcon {
               background: url("/static/images/tabbar/revision/place.png")
                  no-repeat;
               background-size: 28rpx;
            }
            .phoneIcon {
               background: url("/static/images/tabbar/revision/phone.png")
                  no-repeat;
               background-size: 28rpx;
            }
         }
         .address,
         .time {
            display: flex;
            > text {
               width: 35upx;
               height: 35upx;
               color: #f08336;
            }
            > view {
               margin-bottom: 16upx;
               font-size: 28upx;
               font-weight: 400;
               color: #222527;
               margin-left: 6upx;
            }
         }
      }
   }
}

.map {
   margin: 0;
   .map-content {
      width: 100%;
      height: 230upx;
      .map-cover {
         border-radius: 12upx;
         box-shadow: 0px 2upx 12upx 0upx rgba(0, 0, 0, 0.1);
         width: 670upx;
         margin: 40upx 40upx 0;
         display: flex;
         flex-flow: column;
         background-color: #ffffff;
         .map-address {
            display: flex;
            font-size: 28upx;
            font-weight: 400;
            color: #222527;
            margin: 26upx 32upx 12upx 32upx;
            .iconp {
               width: 30upx;
               height: 30upx;
               margin-right: 13upx;
            }
            .map-text {
               text-overflow: ellipsis;
               white-space: nowrap;
            }
         }
         .map-long {
            font-size: 32upx;
            font-weight: bold;
            text-align: left;
            color: #222527;
            line-height: 45upx;
            margin: 0 0 26upx 32upx;
         }
      }
   }
}

.wrap {
   background: #ffffff;
   padding: 0 32upx;
   .complete-student {
      // padding: 40upx 0;
      padding-bottom: 40upx;
      border-bottom: 1px solid #e5e5e5;
      > .title {
         margin-bottom: 28upx;
         .title-name {
            font-size: 34upx;
            color: #222527;
            font-weight: bold;
         }
         .ratio {
            margin-left: 12upx;
            font-size: 28upx;
            color: #999999;
            font-weight: 400;
         }
      }
      .head-portrait {
         display: flex;
         overflow-x: auto;
         > image {
            flex: none;
            border-radius: 100%;
            width: 60upx;
            height: 60upx;
            margin-right: 12upx;
         }
      }
   }

   .vi {
      padding: 0 20rpx;
      width: 334rpx;
      height: 150rpx;
      background: #f9f9f9;
      border-radius: 10rpx;
      p {
         font-size: 34upx;
         font-weight: 600;
         color: #4b4b4b;
         padding-top: 10rpx;
         line-height: 74rpx;
         text-indent: 42rpx;
      }
      text {
         color: #666666;
         font-size: 24rpx;
      }
   }
   .vib1 {
      background: url("/static/images/tabbar/revision/genre.png") no-repeat 0
         center;
      background-size: 32rpx;
   }
   .vib2 {
      background: url("/static/images/tabbar/revision/time.png") no-repeat 0
         center;
      background-size: 32rpx;
   }

   .avatar {
      view {
         padding-bottom: 18rpx;
         color: #4b4b4b;
         font: 600 26rpx "PingFangSC";
         text {
            display: inline-block;
            text-indent: 10rpx;
            color: #999999;
            font-size: 22rpx;
         }
      }
      .avatarList {
         display: flex;
         flex-wrap: wrap;
         image {
            margin-right: 10rpx;
            margin-bottom: 10rpx;
            display: block;
            width: 56rpx;
            height: 56rpx;
            border-radius: 28rpx;
         }
      }
   }

   .factions {
      background: #fff;
      padding: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      @extend .vi;
      .vib1 {
         background: url("/static/images/tabbar/revision/genre.png") no-repeat 0
            center;
         background-size: 32rpx;
      }
      .vib2 {
         background: url("/static/images/tabbar/revision/time.png") no-repeat 0
            center;
         background-size: 32rpx;
      }
      .vib11 {
         background: url("/static/images/tabbar/revision/applyTime.png")
            no-repeat 0 center;
         background-size: 32rpx;
      }
   }
   .train-info {
      padding: 40upx 0;
      border-bottom: 1px solid #e5e5e5;
      > .title {
         font-size: 34upx;
         color: #222527;
         font-weight: bold;
         margin-bottom: 24upx;
      }
      > .train-info-content {
         font-size: 28upx;
         line-height: 50upx;
         color: #484f55;
         font-weight: 400;
      }
   }

   .introduce-content {
      padding: 40upx 0;
      > .title {
         font-size: 34upx;
         color: #222527;
         font-weight: bold;
         margin-bottom: 24upx;
      }
      .parse-container {
         margin-top: 24upx;
         view {
            max-width: 100%;
         }
      }
   }
}

// .count-down {
//     padding: 17upx 32upx;
//     background-color: #fff9ed;
//     color: #ff6010;
//     font-size: 30upx;
//     font-weight: 500;
//     text-align: center;
// }

.cost {
   .have-paid {
      background: #ffffff;
      border-radius: 20upx;
      padding: 32upx;
      margin: 34upx 32upx 0 32upx;
      .title {
         font-size: 34upx;
         font-weight: 500;
         color: #222527;
      }
      .cost-info {
         margin-top: 40upx;
         view {
            font-size: 32upx;
            font-weight: 400;
            color: #222527;
            display: flex;
            justify-content: space-between;
            margin-bottom: 24upx;
         }
         view:last-of-type {
            margin-bottom: 0;
         }
         .total {
            color: #ff5500;
            font-weight: 600;
         }
      }
   }

   .balance-pay {
      padding: 34upx 32upx 0 32upx;
      .have-paid-sum {
         border-radius: 20upx;
         background: #ffffff;
         box-shadow: 0px 1px 8px 0px rgba(33, 15, 2, 0.12);
         margin-bottom: 32upx;
         padding: 32upx;
         .title {
            font-size: 40upx;
            color: #222527;
            font-weight: bold;
         }
         .earnest {
            margin-top: 40upx;
            display: flex;
            justify-content: space-between;
            color: #222527;
            font-size: 28upx;
            font-weight: 400;
            text:last-child {
               font-weight: 600;
               color: #333333;
               font-size: 32upx;
            }
         }
      }

      .unpaid {
         margin-bottom: 20rpx;
         padding: 32upx;
         border-radius: 20upx;
         background: #ffffff;
         box-shadow: 0px 1px 8px 0px rgba(33, 15, 2, 0.12);
         .title {
            display: flex;
            view {
               height: 38upx;
               width: 38upx;
               margin-right: 16upx;
               border: 3upx solid #d0d0d0;
               border-radius: 100%;
            }
            text {
               color: #222527;
               font-size: 34upx;
               font-weight: bold;
            }
         }

         .unpaid-info {
            margin-top: 40upx;
            > .list {
               display: flex;
               justify-content: space-between;
               align-items: center;
               margin-bottom: 24upx;
               font-size: 28upx;
               font-weight: 400;
               color: #222527;
               text:last-child {
                  font-weight: 600;
                  color: #333333;
                  font-size: 32upx;
               }
               > .checkbox-group {
                  display: flex;
                  text {
                     font-size: 28upx;
                     font-weight: 400;
                  }

                  > .checkbox {
                     height: 38upx;
                     width: 38upx;
                     margin-right: 16upx;
                     border-radius: 100%;
                     border: 3upx solid #d0d0d0;
                  }
               }
            }

            .total {
               display: flex;
               justify-content: flex-end;
               font-size: 36upx;
               color: #ff5500;
               font-weight: 600;
            }
         }
      }
   }
}

.fixed-share-btn {
   width: 60upx;
   height: 60upx;
   padding: 0;
   border-radius: 30upx;
   background-image: linear-gradient(-58deg, #ff401f 2%, #ff711e 75%);
   box-shadow: 0 4px 8px 0 rgba(255, 69, 31, 0.4);
   position: fixed;
   z-index: 10;
   bottom: 200upx;
   right: 32upx;
   color: white;
   display: flex;
   align-items: center;
   justify-content: center;
}

.fixed-share-btn::after {
   border: none;
}

.checked {
   height: 38upx;
   width: 38upx;
   margin-right: 16upx;
   background: #f67b25;
   border-radius: 100%;
   border: 3upx solid #f67b25;
   display: flex;
   justify-content: center;
   align-items: center;
   &::before {
      font-family: "cuIcon";
      content: "\e645";
      color: #ffffff;
   }
}

.pay-footer {
   position: relative;
   position: flex;
   bottom: 0;
   left: 0;
   z-index: 2021;
   width: 100%;
   justify-content: center;
   height: 130upx;
   display: flex;
   padding: 15upx 32upx;
   background: #ffffff;
   button::after {
      border: none;
      outline: none;
   }

   .full-payment,
   .earnest,
   .over,
   .valid {
      display: flex;
      margin: 0;
      border-radius: 50upx;
      width: 100%;
      justify-content: center;
      align-items: center;

      view {
         color: #ffffff;
         font-size: 32upx;
         line-height: 32upx;
      }
   }

   .earnest {
      background: linear-gradient(90deg, #ff9096, #fd6771);
      padding: 28upx 0 27upx 0;
   }

   .full-payment {
      background: linear-gradient(90deg, #b699f3, #8e80f3);
      padding: 28upx 0 27upx 0;
   }
   .valid {
      background: #f5f5f5;
      cursor: not-allowed;
      view {
         color: #b8b8b8;
      }
   }
   .over {
      border: 1upx solid #919da7;
      background: #919da7;
      padding: 28upx 0 27upx 0;
   }
}

.article-content {
   font-size: 28upx;
   color: #484f55;
   text-align: justify;
   line-height: 50upx;
   margin-top: 32upx;
   padding-bottom: 32upx;

   img {
      max-width: 100%;
   }
   .image-wrap {
      margin-bottom: 32upx;
      image {
         vertical-align: top;
      }
   }
}

.footer-wrap {
   height: 130upx;
   padding: 38upx 231upx 37upx 231upx;
   display: flex;
   background: linear-gradient(90deg, #ff9096, #fd6771);
   justify-content: center;
   align-items: center;
   width: 100%;
   text {
      color: #ffffff;
      font-size: 32upx;
      font-weight: 500;
   }
}

.fixed-page-large {
   padding-bottom: 130upx;
   padding-bottom: calc(constant(safe-area-inset-bottom) + 130upx);
   padding-bottom: calc(env(safe-area-inset-bottom) + 130upx);
}

.no-payment {
   display: flex;
   background: linear-gradient(270deg, #ffa735, #f67b25);
   padding: 36upx 120upx 36upx 100upx;
   justify-content: space-between;

   .pay-time {
      color: #ffffff;
      font-weight: 400;

      .title {
         line-height: 42upx;
         font-size: 30upx;
      }

      .count-down {
         font-size: 24upx;
         line-height: 33upx;
         margin-top: 8upx;
      }
   }

   image {
      height: 87upx;
      width: 103upx;
   }
}
</style>
