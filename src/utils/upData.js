/*
 * @Author: jiu yin
 * @Date: 2021-11-03 10:33:25
 * @LastEditTime: 2021-12-02 09:28:24
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \weixinmini-school\src\utils\upData.js
 * jiu
 */
export const upData = () => {
   // 获取小程序更新机制兼容
   if (uni.canIUse("getUpdateManager")) {
      const updateManager = uni.getUpdateManager();
      // 检查是否有新版本发布
      if (updateManager) {
         updateManager.onCheckForUpdate(function(res) {
            if (res.hasUpdate) {
               //小程序有新版本，则静默下载新版本，做好更新准备
               updateManager.onUpdateReady(function() {
                  uni.showModal({
                     title: "更新提示",
                     content: "新版本已经准备好，是否重启应用？",
                     showCancel: false,
                     success: function(res) {
                        if (res.confirm) {
                           //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                           updateManager.applyUpdate();
                        }
                        // else if (res.cancel) {
                        //     //如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                        //     uni.showModal({
                        //       title: "温馨提示",
                        //       content: "我们已经做了新的优化，请及时更新哦~",
                        //       showCancel: false, //隐藏取消按钮，也可显示，取消会走res.cancel，然后从新开始提示
                        //       success: function(res) {
                        //         //第二次提示后，强制更新
                        //         if (res.confirm) {
                        //           // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        //           updateManager.applyUpdate();
                        //         } else if (res.cancel) {
                        //           //重新回到版本更新提示
                        //           autoUpdate();
                        //         }
                        //       },
                        //     });
                        //   }
                     },
                  });
               });
               // 新的版本下载失败
               updateManager.onUpdateFailed(function() {
                  uni.showModal({
                     title: "温馨提示",
                     content: "新版本已经上线，请您删除当前小程序，重新搜索打开",
                  });
               });
            }
         });
      }
   } else {
      // 提示用户在最新版本的客户端上体验
      uni.showModal({
         title: "温馨提示",
         content: "当前微信版本过低，可能无法使用该功能，请升级到最新版本后重试。",
      });
   }
};
