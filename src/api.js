/*
 * @Author: jiu yin
 * @Date: 2021-09-22 11:23:48
 * @LastEditTime: 2021-11-08 17:15:59
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \weixinmini-school\src\api.js
 *  “jiu”
 */
import { store } from "./store/index";
import * as envConfig from "../env";
console.log("config===>", envConfig);
let isRespones = true;
//拦截器
uni.addInterceptor("request", {
  //请求
  invoke(args) {},
  //响应
  success(args) {
    let { data } = args;
    if (data.code == 401 && isRespones) {
      isRespones = false;
      console.log("token凭证过期", args);
      goLogin();
      return;
    }
  },
  fail(err) {
    console.log("响应失败", err);
  },
  // complete(res) {
  //   console.log('interceptor-complete',res)
  // }
});
let config = {
  baseUrl: envConfig.baseUrl,
  otherUrl: envConfig.otherUrl,
};
let goLogin = () => {
  // 清除内部token
  uni.showModal({
    //全款定金
    title: "登录过期请重新登录",
    confirmText: "去登录",
    showCancel: false,
    success: () => {
      isRespones = true;
      // 清除内部token
      uni.removeStorageSync("otherToken");
      uni.navigateTo({
        url: "/pages/login/index",
      });
    },
  });
};
let api = {
  config: config,
  apiStash: [],
  setConfig(data) {
    if (data.host) {
      data.baseUrl = (data.scheme || "https") + "://" + data.host + "/";
    }
    this.config = Object.assign(this.config, data);
    console.log("setConfig====>", this.config);
  },
  get(url, params = {}, options = {}) {
    return this.request(url, "GET", params, options);
  },
  post(url, body = {}, options = {}) {
    return this.request(url, "POST", body, options);
  },
  put(url, body = {}, options = {}) {
    return this.request(url, "PUT", body, options);
  },
  delete(url, params = {}, options = {}) {
    return this.request(url, "DELETE", params, options);
  },
  request(url, method, data, options) {
    // 区分外包和内部接口
    let urls = this.config.baseUrl + url;
    if (options.type === "other") {
      urls = this.config.otherUrl + url;
    }
    // this.addToken(options);
    // 外包token
    let token = uni.getStorageSync("token");
    // 内部token
    let otherToken = "";
    if (url.includes("auth/oauth/token")) {
      otherToken = "Basic c2Nob29sTXA6WVhCd09tRndjQQ==";
    } else {
      otherToken = `Bearer ${uni.getStorageSync("otherToken")}`;
    }

    return new Promise((resolve, reject) => {
      uni.request({
        url: urls,
        method,
        data,
        header: {
          Authorization: "Bearer " + token,
          "auth-type": "member",
          sAuthorization: otherToken,
          // 内部
          Platform: "WechatMP",
        },
        success: (response) => this.handleSuccess(response, resolve, reject, options.type),
        fail: (error) => reject(this.handleError(error)),
      });
    });
  },

  handleSuccess(response, resolve, reject, type) {
    var body = response.data;
    if (response.statusCode >= 200 && response.statusCode < 300) {
      resolve(body.data || body.paginate || body.pagination || body);
    } else {
      reject(this.handleError(response));
    }
  },
  handleError(response) {
    var error = response.data;
    console.log("api===>请求错误", response);
    if (response.statusCode == 422) {
      uni.showModal({
        content: "验证错误",
        showCancel: false,
      });
      console.log("api===>", "验证错误");
    } else if (response.statusCode == 400) {
      // uni.showModal({
      //     content: error.message,
      //     showCancel: false
      // });
    } else if (response.statusCode == 401) {
      // 清除内部token
      uni.removeStorageSync("otherToken");
      // 外包逻辑
      if (error.message == "Jwt iss is required.") {
        uni.removeStorageSync("token");
        store.dispatch("getToken", true);
      } else if (error.message == "Invalid Token.") {
        uni.removeStorageSync("token");
      }
    }
    return error;
  },
};

module.exports = api;
