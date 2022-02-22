<template>
  <div class="login">
    <myHead title="授权登录" backUrl="pages/coach/list/index" :leftText="null" :leftIcon="null" />

    <div class="login_mid">
      <div class="">
        <image class="login_logo" src="/static/images/card/card6.svg" mode="widthFix" />
        <div class="login_tit">梵音瑜伽</div>
        <div class="login_p">让更多人受益于瑜伽&冥想</div>
      </div>
    </div>
    <div class="login_bot">
      <button v-if="userInfo" class="login_bots btn_main_s78" open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号认证</button>
      <button v-if="!userInfo" class="login_bots btn_main_s78" @click="getUserInfos">
        微信一键登录
      </button>
      <button class="login_bots btn_main_s78 empty" @click="backPage">
        取消
      </button>
    </div>
    <div class="login_bottom">
      <p>登录/注册即视为你同意</p>
      <span
        class="login_jp"
        @click="
          jumps('pages/about/index', {
            url: 'https://file.jiayu.world/common/file/yhxy.html',
          })
        "
      >
        《梵音瑜伽用户协议》
      </span>
      和
      <span
        class="login_jp"
        @click="
          jumps('pages/about/index', {
            url: 'https://file.jiayu.world/common/file/yszc.html',
          })
        "
      >
        《梵音瑜伽隐私政策》
      </span>
    </div>
  </div>
</template>

<script>
/*
 * 登录页面
 * */
import { backPage, getCurrentPageUrl, jumps } from "@/utils/tools";
import * as api from "../../api";

export default {
  name: "index",
  data() {
    return {
      name: "string",
      uuid: "",
      userInfo: null,
      on_off: true,
      on_offphone: true,
    };
  },
  porps: [],

  onLoad() {
    // 初始化登录
    this.initLogin();
  },
  onShow() {
    this.on_off = true;
    this.on_offphone = true;
  },
  computed: {
    // h5页面
    jumps() {
      return jumps;
    },
  },
  methods: {
    // 初始化登录
    initLogin() {
      uni.login({
        provider: "weixin",
        success: ({ code }) => {
          api
            .post(
              "/auth/oauth/token",
              { code, grant_type: "wechat2" },
              {
                type: "other",
              }
            )
            .then(({ uuid, access_token }) => {
              if (access_token) {
                uni.setStorageSync("otherToken", access_token);
               uni.setStorageSync("isEnter",true);
                uni.showToast({
                  title: "登录成功",
                  mask: true,
                  duration: 1000,
                  success: () => {
                    this.backPage();
                  },
                });
              } else {
                this.uuid = uuid;
              }
            });
        },
      });
    },
    // 返回上一页
    backPage() {
      uni.navigateBack({
        success: () => {
          uni.setStorageSync("isEnter",false);
          let page = getCurrentPages().pop(); //跳转页面成功之后
          if (!page) return;
          page.onLoad(page.options); // page自带options对象.
        },
      });
    },
    // 获取手机号
    getPhoneNumber({ detail }) {
      if (this.on_offphone) {
        this.on_offphone = false;
        console.log("获取手机号牌");
        const { encryptedData, iv } = detail;
        api
          .post(
            "/auth/oauth/token",
            {
              userInfo: JSON.stringify({ ...this.userInfo, uuid: this.uuid }),
              encryptedData,
              iv,
              grant_type: "wechat2",
            },
            {
              type: "other",
            }
          )
          .then(({ access_token }) => {
            if (access_token) {
              // 登录后获取详情绑定数据
              uni.setStorageSync("otherToken", access_token);
              let scene = uni.getStorageSync("scene");
              let params = scene ? scene : {};
              uni.setStorageSync("isEnter",true);
              this.api.get("/api/school/member/student/init", params, {
                type: "other",
              });
              uni.showToast({
                title: "登录成功",
                mask: true,
                duration: 1000,
                success: () => {
                  this.backPage();
                },
              });
            }
          });
      }
    },
    // 获取基本信息
    getUserInfos() {
      if (this.on_off) {
        this.on_off = false;
        uni.getUserProfile({
          desc: "用于完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: ({ userInfo }) => {
            let { avatarUrl, nickName, gender } = userInfo;
            this.userInfo = {
              headimgurl: avatarUrl,
              nickName,
              sex: gender,
            };
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/colorui/common.scss";
.login {
  .login_mid {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    height: 600rpx;
    padding-top: 200rpx;
    text-align: center;
    .login_logo {
      width: 160rpx;
      margin-bottom: 20rpx;
    }
    .login_tit {
      width: 100%;
      margin-bottom: 10rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    .login_p {
      width: 100%;
      font-size: 24rpx;
      color: #666;
    }
  }

  .login_bot {
    box-sizing: border-box;
    padding: 143rpx 30rpx;
    .login_bots {
      display: block;
      margin-bottom: 10px;
    }
  }

  .login_bottom {
    position: fixed;
    @include safe(bottom, 10);
    left: 0;
    z-index: 10;
    width: 100%;
    box-sizing: border-box;
    padding: 0 30rpx;
    font-size: 24rpx;
    color: #666;
    text-align: center;
    .login_jp {
      color: $c_main;
    }
  }
}
</style>
