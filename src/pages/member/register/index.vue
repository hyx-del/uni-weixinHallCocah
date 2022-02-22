<template>
    <view class="container">
        <cu-custom bgColor="bg-white" :isBack="isBack" :isHome="!isBack"><block slot="content">注册账号</block></cu-custom>
        <view class="page-content">
            <view class="logo-wrap">
                <view class="logo">
                    <image src="../../../static/images/logo.svg" />
                </view>
            </view>
            <view class="input-group">
                <view class="form-group">
                    <view class="title">姓名</view>
                    <view class="input-wrap">
                        <input type="text" v-model="account.name" placeholder="请输入姓名">
                    </view>
                </view>
                <view class="form-group">
                    <view class="title">手机号</view>
                    <view class="input-wrap">
                        <input type="number" v-model="account.contact" @blur="checkUser" placeholder="请输入手机号">
                    </view>
                    <!--  #ifdef  MP-WEIXIN -->
                    <!-- <button class='cu-btn bg-red shadow' open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号</button> -->
                    <!-- <button class='cu-btn bg-red shadow' @click="sendCode">获取验证码</button> -->
                    <!--  #endif -->
                </view>
                <view class="form-group">
                    <view class="title">验证码</view>
                    <view class="input-wrap--border">
                        <input type="text" v-model="account.vercode" placeholder="验证码">
                        <button class='cu-btn bg-color shadow sm code-btn' @click="sendCode">获取验证码<text v-if="time">({{ time }})</text></button>
                    </view>
                </view>
                <view class="form-group">
                    <view class="title">地区</view>
                    <view class="input-wrap--border" @click="toggleBottomPopup">
                        <input type="text" disabled='true' v-model="areaText" placeholder="省、市、区">
                    </view>
                </view>

                <!-- <view class="form-group">
                    <view class="title">城市</view>
                    <picker @change="cityChange" :value="cityIndex" :range="cityList" range-key="name">
                        <view class="picker">
                            <view class="picker-value" :class="cityIndex>-1 ? '' : 'no-data'">
                                {{cityIndex>-1?cityList[cityIndex].name:'选择城市'}}
                            </view>
                            <view class="cuIcon-right right-icon"></view>
                        </view>
                    </picker>
                </view>
                <view class="form-group" v-if="hallList.length">
                    <view class="title">场馆</view>
                    <picker @change="hallChange" :value="hallIndex" :range="hallList" range-key="name">
                        <view class="picker">
                            <view class="picker-value" :class="hallIndex>-1 ? '' : 'no-data'">
                                {{hallIndex>-1?hallList[hallIndex].name:'选择场馆'}}
                            </view>
                            <view class="cuIcon-right right-icon"></view>
                        </view>
                    </picker>
                </view> -->

                <view class="mpvue-picker">
                    <view :class="{'pickerMask':visible}" @click="maskClick" catchtouchmove="true"></view>
                    <view class="mpvue-picker-content " :class="{'mpvue-picker-view-show':visible}">
                        <view class="mpvue-picker__hd" catchtouchmove="true">
                            <view class="mpvue-picker__action" @click="onCancel">取消</view>
                            <view class="mpvue-picker__action confirm" @click="onConfirm">确定</view>
                        </view>
                        <picker-view indicator-style="height: 40px;" class="mpvue-picker-view" :value="pickerValue" @change="pickerChange">
                            <block>
                                <picker-view-column>
                                    <view class="picker-item" v-for="(item,index) in provinceDataList" :key="item.id">{{item.name}}</view>
                                </picker-view-column>
                                <picker-view-column>
                                    <view class="picker-item" v-for="(item,index) in cityDataList" :key="item.id">{{item.name}}</view>
                                </picker-view-column>
                                <picker-view-column>
                                    <view class="picker-item" v-for="(item,index) in areaDataList" :key="item.id">{{item.name}}</view>
                                </picker-view-column>
                            </block>
                        </picker-view>
                    </view>
                </view>

            </view>
            <view class="btn-row">
                <button class="primary" @tap="registerMember">注册</button>
            </view>
            <view class="action-row">
                <text @tap="jumpBindMember">绑定会员</text>
            </view>
        </view>
    </view>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'

    export default {
        components: {
        },
        data() {
            return {
                cityList: [],
                hallList: [],
                cityIndex: -1,
                hallIndex: -1,
                hasProvider: false,
                positionTop: 0,
                account: {},
                isBack: false,
                isGetCode: false,
                time: 0,
                visible: false,
                areaText: "",
                provinceDataList: [],
                cityDataList: [],
                areaDataList: [],
                pickerValue: [0, 0, 0],
            }
        },
        onLoad(options) {
            if (options.isBack) {
                this.isBack = true;
            }
            this.getCityList();
        },
        methods: {
            jumpBindMember() {
                console.log("isBack", this.isBack);
                if (this.isBack) {
                    uni.redirectTo({
                        url: "/pages/member/bind/index?isBack=true"
                    })
                } else {
                    uni.redirectTo({
                        url: "/pages/member/bind/index"
                    })
                }
            },
            // getCityList() {
            //     this.api.post("hall/member/member/hall/select").then(data => {
            //         this.cityList = data || [];
            //         // if (this.cityList.length) {
            //         //     this.getHallList(this.cityList[0].id);
            //         // }
            //     })
            // },
            // getHallList(city_id) {
            //     this.api.post("hall/member/member/hall/select", { city_id }).then(data => {
            //         this.hallList = data || [];
            //     })
            // },
            getCityList(id, type) {
                let params = {};
                if (id) params.id = id;
                this.api.get('hall/member/region/list', params).then((res) => {
                    if (type === 'province') {
                        this.cityDataList = res;
                        let id = res[0].id;
                        this.getCityList(id, 'city');
                    } else if (type === 'city') {
                        this.areaDataList = res;
                        // this.reStoreSelect();
                    } else {
                        this.provinceDataList = res;
                        if (!this.id) {
                            this.getCityList(res[0].id, 'province');
                        }
                    }
                })
            },
            // cityChange(event) {
            //     this.cityIndex = event.detail.value;
            //     let id = this.cityList[this.cityIndex].id;
            //     this.account.city_id = id;
            //     if (this.account.hall_id) {
            //         this.account.hall_id = '';
            //     }
            //     this.hallIndex = -1;
            //     this.getHallList(id);
            // },
            // toggleBottomPopup() {
            //     this.visible = !this.visible;
            // },
            onConfirm() {
                this.areaText = this.getLabel();
                this.visible = false;
                this.setSelectAddress();
                console.log("====pickerValue", this.pickerValue, this.account);
            },
            maskClick() {
                this.onCancel();
            },
			onCancel() {
                this.visible = false;
            },
            pickerChange(e) {
                 let changePickerValue = e.mp.detail.value;
                if (this.pickerValue[0] !== changePickerValue[0]) {
                    // 第一级滚动
                    this.getCityList(this.provinceDataList[changePickerValue[0]].id, 'province');
                    changePickerValue[1] = 0;
                    changePickerValue[2] = 0;
                } else if (this.pickerValue[1] !== changePickerValue[1]) {
                    // 第二级滚动
                    this.getCityList(this.cityDataList[changePickerValue[1]].id, 'city');
                    changePickerValue[2] = 0;
                }
                this.pickerValue = changePickerValue;
            },
            setSelectAddress () {
                this.account.province_id = this.provinceDataList[this.pickerValue[0]].id;
                this.account.city_id = this.cityDataList[this.pickerValue[1]].id;
                this.account.area_id = this.areaDataList[this.pickerValue[2]].id;
            },

            getLabel() {
                let pcikerLabel =
                    this.provinceDataList[this.pickerValue[0]].name +
                    '-' +
                    this.cityDataList[this.pickerValue[1]].name +
                    '-' +
                    this.areaDataList[this.pickerValue[2]].name;
                return pcikerLabel;
            },

            toggleBottomPopup() {
                this.visible = !this.visible;
            },

            hallChange(event) {
                this.hallIndex = event.detail.value;
                this.account.hall_id = this.hallList[this.hallIndex].id;
            },
            sendCode() {
                if (this.time) return ;
                if (!this.account.contact) {
                    uni.showToast({
                        icon: "none",
                        title: "请输入手机号",
                    })
                    return ;
                }
                this.api.post("member/vercode/send", { action: "mpsignup", contact: this.account.contact }).then(ret => {
                    this.isGetCode = true;
                    uni.showToast({
                        icon: "success",
                        title: "发送成功",
                    })
                    this.time = 60;
                    let timer = setInterval(() => {
                        this.time -= 1;
                        if (!this.time || this.time < 0) {
                            this.time = 0;
                            clearInterval(timer);
                        }
                    }, 1000)
                }).catch(error => {
                    let message = error.message || error.cause;
                    if (!message) return ;
                    uni.showToast({
                        icon: "none",
                        duration: 3000,
                        title: message,
                    })
                })
            },
            getPhoneNumber(event) {
                console.log("iv", event.detail.iv)
                console.log("encryptedData", event.detail.encryptedData)
            },
            registerMember() {
                if (!this.account.name || !this.account.name.length) {
                    this.showToast("姓名不能为空");
                    return;
                }
                if (!this.account.contact || !this.account.contact) {
                    this.showToast("手机号不能为空");
                    return;
                }
                // if (!this.isGetCode) {
                //     this.showToast("请先获取验证码");
                //     return;
                // }
                if (!this.account.vercode || this.account.vercode.length < 6) {
                    this.showToast("请输入6位数的验证码");
                    return ;
                }
                if (!this.account.province_id) {
                    this.showToast("请选择地区");
                    return ;
                }
                // if (!this.account.city_id) {
                //     this.showToast("请选择城市");
                //     return;
                // }
                // if (!this.account.hall_id) {
                //     this.showToast('请选择场馆');
                //     return;
                // }
                console.log("account===>", this.account);
                this.wechatLogin();
            },
            checkUser() {
                let mobile = this.account.contact;
                if (!mobile) return ;
                let params = {
                    account: mobile,
                }
                this.api.post("member/member/check-user", params).then(ret => {
                    if (ret.hasUser) {
                        uni.showToast({
                            icon: "none",
                            duration: 3000,
                            title: "用户已注册，是否进行绑定或更换手机注册。"
                        })
                    }
                }).catch(error => {
                    let message = error.message || error.cause;
                    if (error.data) {
                        message = error.data.message || error.data.cause;
                    }
                    if (message) {
                        uni.showToast({
                            icon: "none",
                            duration: 3000,
                            title: message,
                        })
                    }
                })
            },
            wechatLogin() {
               uni.login({
                    success: (res) => {
                        uni.getUserInfo({
                            lang: 'zh_CN',
                            success: (userInfo) => {
                                let params = {
                                    username: userInfo.userInfo.nickName,
                                    code: res.code,
                                    iv: userInfo.iv,
                                    encryptedData: userInfo.encryptedData,
                                }
                                this.register(params)
                            }
                        });
                    },
                    fail: (e) => {
                        console.log("fail", e);
                        uni.showModal({
                            content: "登录失败,原因为: " + e.errMsg,
                            showCancel: false
                        })
                    }
                });
            },
            register(data) {
                let params = {
                    ...this.account,
                    ...data,
                    // platform: 0, // 0 -> 小程序  1 -> 公众号
                    action: "mpsignup",
                    grant_type: "mini_program",
                    from: 'hall',
                }
                this.api.post("member/member/signup-v1", params).then(ret => {
                    if (ret.errCode && ret.errMsg) {
                        this.showToast(ret.errMsg);
                        return ;
                    }
                    if (ret.accessToken) {
                        uni.setStorageSync('token', ret.accessToken);
                        this.$store.commit("changeLoginStatus", true);
                    }
                    if (ret.openId) {
                        this.$store.commit("setOpenId", ret.openId);
                    }
                    // this.$store.commit("setMemberId", ret.id);
                    if (this.isBack) {
                        uni.navigateBack({
                            delta: 1,
                        })
                    } else {
                        uni.switchTab({
                            url: "/pages/user/home/index"
                        })
                    }
                }).catch(error => {
                    if (error.message) {
                        uni.showToast({
                            icon: "none",
                            title: error.message,
                        })
                    }
                })
            },
            showToast(title) {
                uni.showToast({
                    icon: "none",
                    title: title,
                })
            }
        },
    }
</script>

<style lang="scss">
    .action-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 40upx;
    }
    .action-row text {
        color: #484F55;
        padding: 0 10px;
    }

	.page-content {
        height: 100%;
		display: flex;
		flex: 1;
		flex-direction: column;
        padding: 32upx 82upx;
        padding-top: 0;
	}
	.input-group {
		position: relative;
    }
    .logo-wrap {
        display: flex;
        justify-content: center;
        margin-top: 50upx;
        margin-bottom: 100upx;
        .logo {
            width: 250upx;
            height: 120upx;
            image {
                width: 100%;
                height: 100%;
            }
        }
    }

    .form-group {
        display: flex;
        align-items: center;
        font-size: 30upx;
        margin-bottom: 40upx;
        .title {
            width: 106upx;
            color: #484F55;
            margin-right: 16upx;
        }
        .input-wrap {
            flex: 1;
            position: relative;
            input {
                width: 100%;
                height: 74upx;
                border: 2upx solid #CCCCCC;
                padding: 0 32upx;
                border-radius: 10upx;
            }

            &--border {
                flex: 1;
                height: 74upx;
                border: 2upx solid #CCCCCC;
                padding-right: 12upx;
                border-radius: 10upx;
                display: flex;
                align-items: center;
                input {
                    flex: 1;
                    height: 74upx;
                    padding: 0 32upx;
                }
            }
        }
        .input-placeholder {
            color: #999999;
        }
        picker {
            flex: 1;
        }
        .picker {
            width: 100%;
            height: 74upx;
            border: 2upx solid #CCCCCC;
            padding: 0 32upx;
            border-radius: 10upx;
            display: flex;
            align-items: center;
            .no-data {
                color: #999999;
            }
            .right-icon {
                color:#C2C4CA;
            }
        }
        .picker-value {
            flex: 1;
        }
    }

    .cu-form-group .title {
        width: 150upx;
    }
	.btn-row {
		margin-top: 20upx;
	}
	button.primary {
        color: white;
        background: #F08336;
        border-radius: 16upx;
    }
    .bg-color {
        background: #48C5B6;
        color: white;
    }
    .code-btn {
        // position: absolute;
        // right: 12upx;
        // top: 12upx;
        // z-index: 1000;
    }
    .pickerMask {
        position: fixed;
        z-index: 1000;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
    }
    .mpvue-picker-content {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        transition: all 0.3s ease;
        transform: translateY(100%);
        z-index: 3000;
    }
    .mpvue-picker-view-show {
        transform: translateY(0);
    }
    .mpvue-picker__hd {
        display: flex;
        padding: 9px 15px;
        background-color: #fff;
        position: relative;
        text-align: center;
        font-size: 17px;
    }
    .mpvue-picker__hd:after {
        content: ' ';
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid #e5e5e5;
        color: #e5e5e5;
        transform-origin: 0 100%;
        transform: scaleY(0.5);
    }
    .mpvue-picker__action {
        display: block;
        flex: 1;
        color: #1aad19;
    }
    .mpvue-picker__action.confirm {
        // @include text_color();
        color: #F08336;
    }

    .mpvue-picker__action:first-child {
        text-align: left;
        color: #888;
    }
    .mpvue-picker__action:last-child {
        text-align: right;
    }
    .picker-item {
        text-align: center;
        line-height: 40px;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
    }
    .mpvue-picker-view {
        position: relative;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 238px;
        background-color: rgba(255, 255, 255, 1);
    }

</style>
