<template>
   <view class="container page-bg">
      <cu-custom bgColor="bg-white"
                 :isBack="true">
         <!-- <block slot="backText">返回</block> -->
         <block slot="content">个人信息</block>
      </cu-custom>
      <view class="info-content">
         <view class="y-cell border-top"
               hover-class="cell--hover"
               hover-stay-time="70">
            <view class="y-cell__title">手机号</view>
            <view class="y-cell__value">{{ memberInfo.contact }}</view>
            <!-- <view class="cuIcon-right y-cell__right-icon"></view> -->
         </view>
         <view class="y-cell"
               hover-class="cell--hover"
               hover-stay-time="70"
               data-type="birthday"
               @click="editInfo">
            <view class="y-cell__title">生日</view>
            <view class="y-cell__value">{{ memberInfo.birthday || '' }}</view>
            <view class="cuIcon-right y-cell__right-icon"></view>
         </view>
         <view class="y-cell"
               hover-class="cell--hover"
               hover-stay-time="70"
               data-type="gender"
               @click="editInfo">
            <view class="y-cell__title">性别</view>
            <view class="y-cell__value">
               <text v-if="memberInfo.gender == 1">男</text>
               <text v-else-if="memberInfo.gender == 2">女</text>
               <text v-else>未知</text>
            </view>
            <view class="cuIcon-right y-cell__right-icon"></view>
         </view>
         <view class="y-cell border-bottom"
               hover-class="cell--hover"
               hover-stay-time="70"
               data-type="address"
               @click="editInfo">
            <view class="y-cell__title">地址</view>
            <view class="y-cell__value">{{ memberInfo.address || '' }}</view>
            <view class="cuIcon-right y-cell__right-icon"></view>
         </view>

         <!-- <view class="y-cell mt32 border-top border-bottom" hover-class="cell--hover" hover-stay-time="70">
                <view class="y-cell__title">积分</view>
                <view class="y-cell__value">0</view>
                <view class="cuIcon-right y-cell__right-icon"></view>
            </view> -->
         <view class="y-cell mt32 border-top border-bottom"
               hover-class="cell--hover"
               hover-stay-time="70">
            <view class="y-cell__title">注册日期</view>
            <view class="y-cell__value">{{ memberInfo.registerTime }}</view>
            <!-- <view class="cuIcon-right y-cell__right-icon"></view> -->
         </view>
      </view>
   </view>
</template>

<script>
import { mapState } from 'vuex';
export default {
   data() {
      return {
         memberInfo: {},
         pageInit: true,
      }
   },
   computed: mapState(['ossPath', 'memberId']),
   filters: {
      dateFormat(date) {
         if (date) {
            let d = new Date(date);
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            let day = d.getDate();
            return year + "-" + month + "-" + day;
         }
         return '';
      }
   },
   onLoad() {


      this.getMemberInfo();
   },
   onShow() {
      if (this.pageInit) {
         this.pageInit = false;
         return;
      }
      this.getMemberInfo();
   },
   methods: {
      getMemberInfo() {
         this.api.get("/api/hall/member/member/login/info", {}, this.$other).then(ret => {
            this.memberInfo = ret;
            console.log("info===>", ret);
            uni.setStorageSync("memberInfo", JSON.stringify(ret));
         })
      },
      editInfo(event) {
         const { type } = event.currentTarget.dataset;
         let url = "/pages/user/info-update/index";
         if (type) {
            url = url + "?" + type + "=true";
         }
         uni.navigateTo({
            url: url
         })
      }
   }
}
</script>

<style lang="scss">
.info-content {
   padding-top: 32upx;
}
.mt32 {
   margin-top: 32upx;
}
.border-top {
   border-top: 1px solid #e5e5e5;
}
.border-bottom {
   border-bottom: 1px solid #e5e5e5;
}

.y-cell {
   width: 100%;
   display: flex;
   padding: 0 32upx;
   background-color: #fff;
   color: #323233;
   overflow: hidden;
   line-height: 1;
   height: 104upx;
   align-items: center;
   position: relative;
}

.y-cell:after {
   content: " ";
   position: absolute;
   pointer-events: none;
   box-sizing: border-box;
   left: 15px;
   right: 0;
   bottom: 0;
   transform: scaleY(0.5);
   border-bottom: 1px solid #ebedf0;
}
.y-cell:not(:last-child)::after {
   content: " ";
   position: absolute;
   pointer-events: none;
   box-sizing: border-box;
   left: 15px;
   right: 0;
   bottom: 0;
   -webkit-transform: scaleY(0.5);
   transform: scaleY(0.5);
   border-bottom: 1px solid #ebedf0;
}

.y-cell__title,
.y-cell__value {
   flex: 1;
}
.y-cell__label {
   color: #999999;
   font-size: 12px;
   margin-top: 3px;
   line-height: 18px;
}
.y-cell__value {
   color: #999999;
   overflow: hidden;
   text-align: right;
   position: relative;
   vertical-align: middle;
}

.y-cell__left-icon,
.y-cell__right-icon {
   min-width: 1em;
   line-height: 24px;
   // height: 100%;
}

.y-cell__right-icon {
   color: #969799;
   margin-left: 5px;
   line-height: 24px;
}

.y-cell__left-icon {
   margin-right: 5px;
}

.cell--hover {
   background-color: #e5e5e5;
}
</style>
