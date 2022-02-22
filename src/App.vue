<script>
    import Vue from 'vue';
    import {upData} from "@/utils/upData.js"
	export default {
		onLaunch: function(options) {
            // todo:: 下次升级移除token_remove
            let currentDate = new Date();
            let date = new Date("2020-02-23");
            let isRemove = uni.getStorageSync("token_remove");
            if (!isRemove && currentDate.getTime() < date.getTime()) {
                uni.removeStorageSync("token");
                uni.setStorageSync("token_remove", 1);
            }
        //强制更新
         upData()
         console.log('App Launch', options);
            // this.$store.dispatch("getToken", true);

            // uni.getProvider({
			// 	service: 'oauth',
			// 	success: (result) => {
            //         console.log("result", result);
            //         this.getToken();
			// 	},
			// 	fail: (error) => {
			// 		console.log('获取登录通道失败', error);
			// 	}
            // });

            // 获取系统状态栏信息
            uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
                        Vue.prototype.CustomBar = e.statusBarHeight + 50;
                        Vue.prototype.Custom = {
                            bottom: 58,
                            height: 32,
                            left: 278,
                            right: 365,
                            top: 26,
                            width: 87,
                        }
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN || MP-QQ
					Vue.prototype.StatusBar = e.statusBarHeight;
					let capsule = wx.getMenuButtonBoundingClientRect();
					if (capsule) {
						Vue.prototype.Custom = capsule;
						// Vue.prototype.capsuleSafe = uni.upx2px(750) - capsule.left + uni.upx2px(750) - capsule.right;
						Vue.prototype.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					}
                    if(Vue.prototype.CustomBar < 20){
                        Vue.prototype.CustomBar = 84;//刘海屏 标题栏高度
                        Vue.prototype.StatusBar = 44 ;//一般手机电池一栏高度
                    }
					// #endif	

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
                    // #endif
                    
                    console.log("StatusBar====>", Vue.prototype.StatusBar, "CustomBar=====>", Vue.prototype.CustomBar);
				}
			})
		},
		onShow: function() {
            console.log('App Show')
            this.$store.dispatch("getUserInfo");
		},
		onHide: function() {
			console.log('App Hide')
        },
        methods: {
            
        },
	}
</script>

<style lang="scss">
	/*每个页面公共css */
    @import "colorui/main.css";
	@import "colorui/icon.css";
	@import "./icon.css";

    /*每个页面公共css */
    uni-page-body {
        height: 100%;
    }
	page {
		height: 100%;
        font-size: 28upx;
        background-color: white;
		// line-height: 1.8;
    }
    .page-bg {
        background-color: #F5F5F5;
    }
	
    .bg-white {
        color: #000000;
    }
    .fix-iphonex-button {
        bottom: 68upx !important;
    }

    .footer {
        box-shadow: 0upx -1upx 2upx 0upx rgba(0,0,0,0.1);
        background: white;
        position: fixed;
        width: 100%;
        bottom: 0px;
        z-index: 10;
        padding-bottom: constant(safe-area-inset-bottom);  
        padding-bottom: env(safe-area-inset-bottom);  
    }

    .iphonex-footer {
        background: white;
        padding-bottom: 68upx;
    }
    .fixed-page {
        padding-bottom: 100upx;
        padding-bottom: calc(constant(safe-area-inset-bottom) + 100upx);
        padding-bottom:  calc(env(safe-area-inset-bottom) + 100upx);
    }
    .container {
        min-height: 100vh;
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .page {
        height: 100%;
    }
    .cu-bar .content{
        font-size: 36upx;
        font-weight: bold;
    }
    .cu-bar .action>text[class*="cuIcon-"], .cu-bar .action>view[class*="cuIcon-"] {
        font-size: 40upx;
    }

    .img {
        vertical-align: top;
        max-width: 100%;
        width: 100%;
    }
    view{
        box-sizing: border-box;
    }

    checkbox.bg-primary[checked] .wx-checkbox-input,
    checkbox.bg-primary.checked .uni-checkbox-input,
    radio.bg-primary[checked] .wx-radio-input,
    radio.bg-primary.checked .uni-radio-input {
        border-color: #F08336!important;
        background-color: #F08336!important;
	    color: white;
    }

    /** uni-app 相关组件样式 */
    .placeholder{
        font-size: 32upx;
        color: #999999;
        font-weight: 400;
    }
</style>
