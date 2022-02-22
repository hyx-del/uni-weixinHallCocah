<template>
  <view class="container page-bg fixed-page-large">
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="content">{{ genre ? "学期报名" : "全面课程报名" }}</block>
    </cu-custom>

    <!-- 表单 -->
    <view class="form" v-if="isDetails" @click="hideDropdown">
      <view class="form-group">
        <text class="title">{{ genre ? "学期" : "全面课程" }}</text>
        <text class="inputrt textStyle">{{ semester_name }}</text>
      </view>

      <view class="form-group" v-if="genre">
        <view>
          <text class="must-fill">*</text>
        </view>
        <view class="title lf">住宿</view>
        <!-- 学期有提供住宿 可选择是否住宿 -->
        <view class="inputrt input-group" v-if="isContainQuarterage">
          <picker @change="dormChange" :value="dormIndex" :range="dormList" range-key="name" style="width: 100%;">
            <view class="picker">
              <view class="picker-value" :class="dormIndex > -1 ? 'active-value' : 'no-data'">
                {{ dormIndex > -1 ? dormList[dormIndex].name : "请选择是否住宿" }}
              </view>
            </view>
          </picker>
          <text class="right cuIcon-right"></text>
        </view>
        <text v-else style="color: #798188;" class="inputrt input-group">否</text>
      </view>

      <view class="form-group" v-if="genre">
        <view>
          <text class="must-fill">*</text>
        </view>
        <view class="title lf">供餐</view>
        <view class="inputrt input-group" v-if="mealStatus">
          <picker @change="mealStatusChange" :value="mealStatusIndex" :range="mealStatusList" range-key="name" style="width: 100%;">
            <view class="picker">
              <view class="picker-value" :class="mealStatusIndex > -1 ? 'active-value' : 'no-data'">
                {{ mealStatusIndex > -1 ? mealStatusList[mealStatusIndex].name : "请选择是否供餐" }}
              </view>
            </view>
          </picker>
          <text class="right cuIcon-right"></text>
        </view>
        <text v-else style="color: #798188;" class="inputrt input-group">否</text>
      </view>

      <view class="form-group">
        <text class="must-fill">*</text>
        <view class="title lf">姓名</view>
        <view class="inputrt input-group">
          <input placeholder-class="placeholder" type="text" placeholder="请输入姓名" v-model="username" />
        </view>
      </view>

      <view class="form-group">
        <text class="must-fill">*</text>
        <view class="title lf">性别</view>
        <view class="inputrt input-group">
          <picker @change="sexChange" :value="sexIndex" :range="sexList" range-key="name" style="width: 100%;">
            <view class="picker">
              <view class="picker-value" :class="sexIndex > -1 ? 'active-value' : 'no-data'">
                {{ sexIndex > -1 ? sexList[sexIndex].name : "请选择性别" }}
              </view>
            </view>
          </picker>
          <text class="right cuIcon-right"></text>
        </view>
      </view>

      <view class="form-group">
        <text class="must-fill">*</text>
        <view class="title lf">手机号</view>
        <view class="area-code">+86</view>
        <view class="phone">
          <input placeholder-class="placeholder" type="number" placeholder="请输入手机号" v-model="contact" disabled="true" />
        </view>
      </view>

      <!-- <view class="form-group">
                <text class="must-fill">*</text>
                <view class="title lf">验证码</view>
                <view class="code input-group">
                    <input placeholder-class='placeholder' type="number" placeholder="请输入验证码" style="width:50%" v-model="code">
                    <text class="getCode" @click="getCode" v-if="!isSendCode">获取验证码</text>
                    <text class="getCode" v-if="isSendCode">重新获取({{overtime}})</text>
                </view>
            </view> -->

      <view class="form-group market">
        <view class="title">销售</view>
        <view class="inputrt input-group" v-if="!staff.salesmanId">
          <view class="market-select">
            <view class="input-wrap" @click.stop="">
              <input type="text" v-if="!currentUser || !currentUser.id" v-model="keyword" placeholder="选填" @input="onChange" @focus="focus" />
              <view class="right-text" v-if="currentUser && currentUser.id">
                <text>{{ currentUser.name }}</text>
              </view>
            </view>

            <view class="dropdown-wrap">
              <view class="dropdown" v-if="showDropdown && salesmanList.length" @click.stop="">
                <view class="dropdown-item" v-for="item in salesmanList" :key="item.id" @click="selectUser(item)">
                  <text>{{ item.name }}</text>
                  <text v-if="item.shortMobile">({{ item.shortMobile }})</text>
                </view>
              </view>
            </view>
          </view>
          <view class="right clear" v-if="currentUser && currentUser.id" @click="clearUser">
            <text class="cuIcon-close"></text>
          </view>
          <!-- <text class="right cuIcon-right"></text> -->
        </view>

        <view class="inputrt input-group staffName" v-else>
          {{ staff.salesmanName }}
        </view>
      </view>

      <view class="form-group pr">
        <view class="title">身份证号</view>
        <view class="card input-group">
          <input placeholder-class="placeholder" placeholder="请输入身份证号" v-model="idCard" :disabled="idCardIrrevocable" />
        </view>
      </view>

      <view class="photo-group" v-if="!cardImgIrrevocable">
        <view class="title">身份证照片</view>
        <view class="card-img">
          <view class="show-card" @click="updateImg(1)" v-if="!front">
            <image :src="ossPath + front" />
            <text class="card-title">头像页</text>
          </view>

          <view class="show-card" @click="viewCard(1)" v-if="front">
            <image :src="ossPath + front" />
            <text class="card-title">头像页</text>
          </view>

          <view class="show-card" @click="updateImg(2)" v-if="!reverseSide">
            <image :src="ossPath + reverseSide" />
            <text class="card-title">国徽页</text>
          </view>

          <view class="show-card" @click="viewCard(2)" v-if="reverseSide">
            <image :src="ossPath + reverseSide" />
            <text class="card-title">国徽页</text>
          </view>
        </view>
      </view>

      <view class="address-group pr">
        <view class="title">家庭住址</view>
        <view class="address input-group">
          <textarea class="textarea-style" placeholder-class="placeholder" placeholder="请输入住址" v-model="address" />
        </view>
      </view>

      <view class="form-group pr">
        <view class="title">紧急联系人</view>
        <view class="linkman input-group">
          <input placeholder-class="placeholder" type="number" placeholder="请输入紧急联系人电话" v-model="emergencyContact" />
        </view>
      </view>
    </view>

    <!-- footer -->
    <view class="footer">
      <view class="footer-wrap" @click="skipcashierDeskPage">
        <text>提交报名表</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      genre: null,
      //住宿
      dormList: [
        { id: 1, name: "是" },
        { id: 0, name: "否" },
      ],
      //供餐
      mealStatusList: [
        { id: 1, name: "是" },
        { id: -1, name: "否" },
      ],
      sexList: [
        { id: 1, name: "男" },
        { id: 2, name: "女" },
      ],

      // isSendCode: false,
      isSubmit: false, // 是否提交过表单、防止重复提交
      onoff: false,
      idCardIrrevocable: false,
      cardImgIrrevocable: false,
      isDetails: false,
      showDropdown: false,
      //住宿
      dormIndex: 0,
      sexIndex: 0,
      //供餐
      mealStatusIndex: 0,
      // overtime: 60,

      staff: {
        // 点击分享链接报名参数
        salesmanName: null,
        salesmanId: null,
      },
      mainCourseId: null,
      semesterId: null,
      semester_name: null,
      is_contain_quarterage: true,
      username: null,
      emergencyContact: null,
      contact: null,
      // code: null,
      // codeToken: null,
      idCard: null,
      idCardParams: null,
      address: null,
      front: null,
      reverseSide: null,
      currentUser: {},
      timer: null,
      keyword: null,
      salesmanList: [],
      scene: {},
      uid: null,
      //详情中携带接口较快住宿
      isContainQuarterage: true,
      //供餐
      mealStatus: true,
      isShare: false,
    };
  },

  computed: {
    ...mapState(["baseUrl", "ossPath", "schoolShareMemberId"]),
  },

  onLoad(option) {
   let _params= decodeURIComponent(option.params)
    let data = JSON.parse(_params);
    this.scene = JSON.parse(option.scene) ||{};
    console.log(this.scene);
    if (option.uid != "undefined" &&option.uid!='') {
      this.uid = JSON.parse(option.uid);
    }
    this.isShare = JSON.parse(option.isShare);
    //是否学期流派过来的
    this.genre = data.genre;
    this.mainCourseId = data.mainCourseId;
    this.semesterId = data.semesterId;
    this.semester_name = data.name;
    if (!data.isContainQuarterage) {
      this.isContainQuarterage = false;
    }
    if (data.mealStatus == -1) {
      this.mealStatus = false;
    }
    this.getUserInfo();
  },

  methods: {
    dormChange(event) {
      this.dormIndex = event.detail.value;
    },
    mealStatusChange(event) {
      this.mealStatusIndex = event.detail.value;
    },

    sexChange(event) {
      this.sexIndex = event.detail.value;
    },

    getSalesmanlist(keyword) {
      let params = {
        functions: 32, // 教培销售
      };
      if (keyword) {
        params["keyWord"] = keyword;
      }
      this.api.get("/api/school/staffs/list", params, { type: "other" }).then((res) => {
        this.salesmanList = res || [];
      });
    },

    clearUser() {
      this.currentUser = {};
      this.keyword = "";
      this.salesmanList = [];
    },

    hideDropdown() {
      this.showDropdown = false;
      if (!this.currentUser || !this.currentUser.id) {
        this.keyword = "";
      }
      this.salesmanList = [];
    },

    focus() {
      this.showDropdown = true;
    },

    onChange(event) {
      if (!this.keyword) {
        this.salesmanList = [];
        return;
      }
      this.getSalesmanlist(this.keyword);
    },

    selectUser(item) {
      this.showDropdown = false;
      this.currentUser = item;
      if (item.shortMobile) {
        this.keyword = `${item.name}(${item.shortMobile})`;
      } else {
        this.keyword = item.name;
      }
    },

    updateImg(index) {
      uni.chooseImage({
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          uni.uploadFile({
            url: this.baseUrl + "file/upload/image?bucket=admin",
            filePath: tempFilePaths[0],
            name: "images[]",
            success: (uploadFileRes) => {
              const files = JSON.parse(uploadFileRes.data);
              if (index == 1) {
                this.front = files.data[0];
              } else {
                this.reverseSide = files.data[0];
              }
            },
          });
        },
      });
    },

    viewCard(type) {
      // 重新上传身份证
      if (this.onoff) {
        // 防止重复点击
        return;
      }
      this.onoff = true;
      if (type == 1) {
        // 正面
        this.onoff = false;
        uni.navigateTo({
          url: "/coachPages/coach-train/card-details/index?credImg=" + this.front + "&type=1",
        });
      } else {
        this.onoff = false;
        uni.navigateTo({
          url: "/coachPages/coach-train/card-details/index?credImg=" + this.reverseSide + "&type=2",
        });
      }
    },
    // 提交报名表，跳转收银台
    skipcashierDeskPage() {
      //验证销售
      this.hideDropdown();
      let IdCardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
      let content;
      switch (true) {
        //不为空 验证没通过 禁用关闭状态
        case this.idCard != null && this.idCard != "" && !IdCardReg.test(this.idCard) && !this.idCardIrrevocable:
          content = "请输入正确身份证号";
          break;
        case this.sexIndex == -1:
          content = "请输入性别";
          break;
        default:
          break;
      }
      if (content) {
        return uni.showToast({
          icon: "none",
          title: content,
        });
      }

      if (!this.isSubmit) {
        this.isSubmit = true;
        this.register();
      }
    },

    register() {
      //  校验姓名必填
      let _reg = /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/;
      console.log(!_reg.test(this.username));
      if (!_reg.test(this.username)) {
        uni.showToast({
          title: "请输入中文姓名",
          icon: "none",
          duration: 2000,
        });
        this.isSubmit = false;
        return false;
      }
      // 紧急联系人如果填写了,长度必须 等于等于 11  位
      if (this.emergencyContact && this.emergencyContact.length < 11) {
        uni.showToast({
          title: "紧急联系人填写错误",
          icon: "none",
          duration: 2000,
        });
        this.isSubmit = false;
        return false;
      }
      // 提交报名表
      let params = {
        mainCourseId: this.mainCourseId,
		    semesterId: this.semesterId,
        contact: this.contact,
        emergencyContact: this.emergencyContact,
        address: this.address,
        gender: this.sexList[this.sexIndex].id,
        ...this.scene,
         name: this.username,
      };
      console.log(params);
      if (this.isContainQuarterage) {
        params.isQuarterage = this.dormList[this.dormIndex].id;
      } else {
        // 不提供住宿
        params.isQuarterage = 0;
      }

      params.idCard = this.idCardIrrevocable ? this.idCardParams : this.idCard;

      if (this.front && this.reverseSide) {
        // 身份证照片
        params.idCardImages = {
          front: this.front,
          reverse: this.reverseSide,
        };
      }

      if (this.schoolShareMemberId) {
        // 分享链接发起人的id
        params.share_member_id = this.schoolShareMemberId;
      }
      // 通过分享链接报名的销售id
      params.salesmanId =this.staff.salesmanId? [this.staff.salesmanId] :this.currentUser.id? [this.currentUser.id]:null;

      if (this.mealStatus) {
        params.isMealStatus = this.mealStatusList[this.mealStatusIndex].id;
      } else {
        // 学期不提供餐
        params.isMealStatus = -1;
      }
      // 如果是全面课程那么就  住宿 与 供餐都默认配置为 否
      if (!this.genre) {
        params.isQuarterage = 0;
        params.isMealStatus = -1;
      }
      console.log(params);
      //流派学期/全面课程 报名
      this.api.post(this.genre ? "/api/school/semester/register" : "/api/school/maincourse/register", params, { type: "other" }).then((res) => {
        console.log(res);
        if (res.studentMainCourseId || res.studentSemesterId) {
          uni.showToast({
            title: "报名成功",
            duration: 2000,
            success: () => {
              //报名id
              this.toPaymentPage(res.studentMainCourseId, res.studentSemesterId);
            },
          });
        } else if (res.code == 201) {
          uni.showModal({
            title: "已提交重复报名，未支付状态",
            confirmText: "去支付",
            showCancel: false,
            success: () => {
              this.toPaymentPage(res.studentMainCourseId, res.studentSemesterId);
            },
          });
        } else {
          uni.showModal({
            title: "报名失败",
            content: res.msg,
            showCancel: false,
            success: () => {
              this.isSubmit = false;
              uni.navigateBack({
                delta: 1,
              });
            },
          });
        }
        this.isSubmit = false;
      });
    },

    // 去支付页面
    toPaymentPage(id, idsemester) {
      let isSignUpData = {
        mainCourseId: this.mainCourseId,
        semesterId: this.semesterId,
        student_mainCourseId: id,
        student_SemesterId: idsemester,
        genre: this.genre,
        isSignUp: true,
      };
      const _url = "/coachPages/coach-train/cashier-desk/index?data=";
      uni.navigateTo({
        //学期ID 报名ID 是全面还是学期报名
        url: _url + JSON.stringify(isSignUpData),
      });
    },

    getUserInfo() {
      // 获取会员信息
      let params = { ...this.scene };
      if (this.uid) {
        params.uid = this.uid;
        params.isFx = 1;
      }
      // if (this.schoolShareMemberId) {
      //     params.share_member_id = this.schoolShareMemberId;
      // }
      this.api.get("/api/school/member/user/detail", params, { type: "other" }).then((res) => {
        if (!res) {
          return;
        }
        this.contact = res.contact;
        this.sexIndex = res.gender - 1;
        this.emergencyContact = res.emergencyContact;
        this.username = res.name;
        this.contact = res.contact;
        this.idCard = this.idCardParams = res.idCard;
        this.address = res.address;

        if (res.idCardImages) {
          this.front = res.idCardImages.front;
          this.reverseSide = res.idCardImages.reverse;
        }

        if (this.idCard) {
          this.idCardIrrevocable = true;
        }

        if (this.front && this.reverseSide) {
          this.cardImgIrrevocable = true;
        }

        //分享销售
        if (this.scene.isFx || this.isShare) {
          this.staff.salesmanId = res.salesmanId;
          this.staff.salesmanName = res.salesmanName;
        }

        this.setCard();

        this.isDetails = true;
      });
    },

    setCard() {
      // 设置身份证格式
      if (!this.idCard) {
        return;
      }
      let items = this.idCard.toString();
      let len = items.length;
      let head = items.substr(0, 4);
      let mid = "**********";
      let tail = items.substr(len - 4, 4);
      this.idCard = "" + head + mid + tail;
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  margin: 32upx 0;
  background: #ffffff;
  .form-group {
    display: flex;
    padding: 40upx 0;
    border-bottom: 1upx solid #eee;
    align-items: center;
    line-height: 45upx;
    .must-fill {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #ff0000;
      margin-left: 12upx;
    }
    .title {
      margin-left: 32upx;
      font-size: 32upx;
      color: #798188;
    }

    .lf {
      margin-left: 8upx;
    }

    .right {
      margin-right: 36upx;
      color: #c2c4ca;
    }

    .staffName {
      line-height: 42upx;
      font-size: 32upx;
    }

    input {
      caret-color: #f67b25;
      color: #222527;
      font-size: 32upx;
      height: 45upx;
      width: 100%;
    }
  }

  .form-group:last-of-type {
    border: none;
  }

  .photo-group {
    display: flex;
    padding: 40upx 0;
    line-height: 45upx;
    border-bottom: 1px solid #eee;
    .title {
      margin-left: 32upx;
      font-size: 32upx;
      color: #798188;
    }
  }

  .address-group {
    display: flex;
    padding: 40upx 0;
    line-height: 45upx;
    border-bottom: 1px solid #eee;
    justify-content: center;
    .title {
      margin-left: 32upx;
      font-size: 32upx;
      color: #798188;
    }
  }

  .pr {
    padding-right: 32upx;
  }

  .input-group {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .getCode {
      font-size: 32upx;
      font-weight: 400;
      color: #f67b25;
      margin-right: 32upx;
    }

    .picker {
      .picker-value {
        font-size: 32upx;
        color: #999999;
        font-weight: 400;
      }
      .active-value {
        color: #222527;
      }
    }

    .quarterage {
      font-size: 32upx;
      color: #222527;
      font-weight: 400;
    }

    .textarea-style {
      max-height: 90upx;
      width: 100%;
      caret-color: #f67b25;
      color: #222527;
      font-size: 32upx;
      z-index: 0;
    }
  }

  .card,
  .address {
    margin-left: 56upx;
  }

  .card-img,
  .linkman {
    margin-left: 24upx;
  }

  .card-img {
    display: flex;
    .show-card {
      height: 152upx;
      width: 244upx;
      background: #d8d8d8;
      border-radius: 12upx;
      margin-right: 14upx;
      position: relative;
      image {
        height: 152upx;
        width: 244upx;
        border-radius: 12upx;
      }
      .card-title {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 60upx;
        width: 100%;
        font-size: 32upx;
        text-align: center;
        line-height: 60upx;
        background: #373737;
        color: #999999;
        border-radius: 0upx 0upx 12upx 12upx;
      }
    }
  }

  .phone {
    font-size: 32upx;
    line-height: 45upx;
  }

  .area-code {
    margin-left: 88upx;
    margin-right: 52upx;
    font-size: 32upx;
    line-height: 42upx;
  }

  .inputrt {
    margin-left: 120upx;
  }

  .textStyle {
    font-size: 32upx;
    font-weight: 400;
    text-align: left;
    color: #222527;
  }
}
.market {
  position: relative;
}
.market-select {
  display: flex;
  align-items: center;
  line-height: 30upx;
  .input-wrap {
    flex: 1;
    input {
      width: 100%;
      border: none;
    }
    .right-text {
      line-height: 42upx;
      font-size: 32upx;
    }
  }
  .icon {
    font-size: 30upx;
    color: #c2c4ca;
    margin-left: 30upx;
  }
}

.dropdown-wrap {
  position: absolute;
  top: 137upx;
  left: 0;
  right: 0;
  z-index: 99;
}

.dropdown {
  border-radius: 0 0 20upx 20upx;
  height: 400upx;
  background-color: white;
  // padding: 0 40upx;
  overflow: auto;
  &-item {
    padding: 24upx 32upx;
    color: #484f55;
    font-size: 28upx;
    border-bottom: 1px solid #e5e5e5;
  }
}

.footer-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 120upx;
  padding: 38upx 295upx 37upx 295upx;
  background: #f67b25;
  > text {
    font-size: 32upx;
    color: #ffffff;
  }
}
.fixed-page-large {
  padding-bottom: 120upx;
  padding-bottom: calc(constant(safe-area-inset-bottom) + 120upx);
  padding-bottom: calc(env(safe-area-inset-bottom) + 120upx);
}
</style>
