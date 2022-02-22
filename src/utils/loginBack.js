/*
 * @Author: jiu yin
 * @Date: 2021-11-02 13:03:51
 * @LastEditTime: 2021-12-03 13:55:23
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \weixinmini-school\src\utils\loginBack.js
 * jiu
 */
// 登录回调
import * as api from "@/api";

export const loginBack = (params = {}, callback) => {
  uni.login({
    provider: "weixin",
    success: ({ code }) => {
      uni.showLoading({
        title: "加载中",
        icon: "none",
        mask: true,
        success: () => {
          // 获取伽遇token
          api
            .post(
              "/auth/oauth/token",
              { code, grant_type: "wechat2" },
              {
                type: "other",
              }
            )
            .then(({ access_token }) => {
              if (access_token) {
                uni.setStorageSync("otherToken", access_token);
                // 获取外包token
                api
                  .post("/app/api/user/jiayu/token", null, {
                    type: "other",
                  })
                  .then(({ access_token }) => {
                    if (access_token) {
                      uni.setStorageSync("token", access_token);
                      uni.hideLoading();
                      api.get("/api/school/member/student/init", params, { type: "other" }).then((res) => {
                      uni.setStorageSync("isEnter",true);
                        // 回调
                        callback();
                      });
                    }
                  })
                  .catch(() => uni.hideLoading());
              } else {
                // 没有绑定手机号
                uni.showToast({
                  title: "请先登录",
                  icon: "none",
                  mask: true,
                  success: () => {
                    uni.navigateTo({
                      url: "/pages/login/index",
                    });
                  },
                });
              }
            })
            .catch(() => uni.hideLoading());
        },
      });
    },
  });
};
