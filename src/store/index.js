import Vue from 'vue';
import Vuex from 'vuex';
import * as api from '../api';
import * as envConfig from '../../env';

Vue.use(Vuex);
// let salesmanId = uni.getStorageSync("school_share_salesman_id");
// let memberId = uni.getStorageSync("school_share_member_id");
let userMemberId = uni.getStorageSync('current_member_id');

const store = new Vuex.Store({
	state: {
		ossPath: envConfig.ossPath,
		baseUrl: envConfig.baseUrl,
		appId: envConfig.appId,
		// appId: "wx665579227fc9866c",
		isLogin: false,
		nowPageIndex: 0,
		memberId: -1,
		currentMemberId: userMemberId || '',
		userInfo: {},
		courseTypeMap: {
			1: '团课',
			2: '私教课',
			3: '企业课',
		},
		cityList: [],
		openId: '',
		account: {},
		isAuth: false,
		shareMemberId: '',
		previewUrl: '',

		// 教培专用
		schoolShareMemberId: '', // 分享会员
		shareSalesmanId: '', // 分享销售
	},
	mutations: {
		setUserInfo(state, userInfo) {
			state.userInfo = { ...state.userInfo, ...userInfo };
		},
		changeLoginStatus(state, status) {
			state.isLogin = status;
		},
		changePage(state, pageIndex) {
			state.nowPageIndex = pageIndex;
		},
		setMemberId(state, id) {
			state.memberId = id;
		},
		setCurrentMemberId(state, id) {
			state.currentMemberId = id;
		},
		setSchoolShareMemberId(state, id) {
			state.schoolShareMemberId = id;
		},
		setShareSalesmanId(state, id) {
			state.shareSalesmanId = id;
		},
		setOpenId(state, id) {
			state.openId = id;
		},
		setCityList(state, citys) {
			state.cityList = citys;
		},
		setAccount(state, data) {
			state.account = data;
		},
		setIsAuth(state, isauth) {
			state.isAuth = isauth;
		},
		setShareMemberId(state, memberId) {
			state.shareMemberId = memberId;
		},
		setPreviewUrl(state, url) {
			state.previewUrl = url;
		},
	},
	getters: {},
	actions: {
		getAccountInfo() {
			api.get('/api/hall/course/plan/member/account', {},{type:'other'}).then(data => {this.commit('setAccount', data);});
		},
		getUserInfo() {
			//#ifdef MP-WEIXIN
			// 出现在微信小程序
			uni.getSetting({
				success: e => {
					console.log('用户授权', e);
					if (e.authSetting['scope.userInfo']) {
						// uni.getUserInfo({
						//     lang: 'zh_CN',
						//     success: (userInfo) => {
						//         console.log("userInfo", userInfo);
						//         this.commit("setUserInfo", userInfo.userInfo);
						//     }
						// });
						this.commit('setIsAuth', true);
					} else {
						this.commit('setIsAuth', false);
					}
				},
			});
			//#endif

			//#ifdef MP-ALIPAY
			// 支付宝小程序
			my.getAuthCode({
				scopes: 'auth_user',
				success: res => {
					uni.getUserInfo({
						lang: 'zh_CN',
						success: userInfo => {
							this.commit('setUserInfo', userInfo.userInfo);
						},
					});
				},
			});
			//#endif

			//#ifdef APP-PLUS
			uni.getUserInfo({
				lang: 'zh_CN',
				success: userInfo => {
					this.commit('setUserInfo', userInfo.userInfo);
					// uni.showModal({
					//     content: "info" + JSON.stringify(userInfo),
					//     showCancel: false,
					// })
				},
			});
			//#endif
		},

		getToken({ state }, forceLogin) {
			uni.login({
				success: ({ code }) => {
					uni.getUserInfo({
						lang: 'zh_CN',
						success: ({ iv, encryptedData, userInfo }) => {
							// 外包登錄 ~~~~~~~~~~~~~~~
							let params = {
								code,
								iv,
								encryptedData,
								grant_type: 'mini_program',
								from: 'hall',
							};
							api.post('member/member/signin', params)
								.then(ret => {
									if (ret.access_token) {
										uni.setStorageSync('token', ret.access_token);
										this.commit('changeLoginStatus', true);
										// this.commit("setMemberId", ret.id);
									}
									if (ret.openId) {
										this.commit('setOpenId', ret.openId);
									}
									if (ret.errCode) {
										uni.removeStorageSync('token');
										uni.navigateTo({
											url: '/pages/member/register/index',
										});
									}
								})
								.catch(error => {
									console.log('error===>', error);
									if (error.code == 'USER_NOT_EXIST') {
										uni.removeStorageSync('token');
										if (forceLogin) {
											uni.reLaunch({
												url: '/pages/member/register/index',
											});
										} else {
											uni.navigateTo({
												url: '/pages/member/register/index?isBack=true',
											});
										}
									} else {
										uni.hideLoading();
										uni.showModal({
											title: '登录失败',
											content: error.message || error.cause,
											showCancel: false,
										});
									}
								});
						},
					});
				},
				fail: e => {
					console.log('fail', e);
					uni.showModal({
						content: '登录失败,原因为: ' + e.errMsg,
						showCancel: false,
					});
				},
			});
		},
	},
});

export default store;
