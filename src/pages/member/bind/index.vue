<template>
	<view class="container">
		<cu-custom
			bgColor="bg-white"
			:isBack="isBack"
			:isHome="!isBack"
		>
			<block slot="content">绑定会员</block>
		</cu-custom>
		<view class="page-content">
			<view class="logo-wrap">
				<view class="logo">
					<image src="../../../static/images/logo.svg" />
				</view>
			</view>
			<view class="input-group">
				<view class="form-group">
					<view class="title">手机号</view>
					<view class="input-wrap">
						<input
							type="number"
							v-model="mobile"
							@blur="checkUser"
							placeholder="请输入手机号"
						>
					</view>
				</view>
				<view class="form-group">
					<view class="title">验证码</view>
					<view class="input-wrap--border">
						<input
							type="text"
							v-model="vercode"
							placeholder="验证码"
						>
						<button
							class='cu-btn bg-color shadow sm code-btn'
							@click="sendCode"
						>获取验证码<text v-if="time">({{ time }})</text></button>
					</view>
				</view>
			</view>
			<view class="btn-row">
				<button
					class="primary"
					@tap="bindMember"
				>绑定</button>
			</view>
			<view class="action-row">
				<text @tap="jumpRegistMember">注册账号</text>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState,mapMutations } from 'vuex'

export default {
	components: {
	},
	data() {
		return {
			mobile: '',
			vercode: '',
			isBack: false,
			time: 0,
		}
	},
	onLoad(options) {
		console.log("options",options);
		if(options.isBack) {
			this.isBack=true;
		}
	},
	methods: {
		jumpRegistMember() {
			if(this.isBack) {
				uni.redirectTo({
					url: "/pages/login/index"
				})
			} else {
				uni.redirectTo({
					url: "/pages/login/index"
				})
			}
		},
		bindMember() {
			if(!this.mobile) {
				uni.showToast({
					icon: "none",
					title: "请输入手机号",
				})
				return;
			} else if(!this.vercode) {
				uni.showToast({
					icon: "none",
					title: "请输入验证码",
				})
				return;
			} else if(this.vercode.length<6) {
				uni.showToast({
					icon: "none",
					title: "请输入6位数的验证码",
				})
				return;
			}

			this.wechatLogin();
		},
		checkUser() {
			if(!this.mobile) return;
			let params={
				account: this.mobile,
			}
			this.api.post("member/member/check-user",params).then(ret => {
				if(!ret.hasUser) {
					uni.showToast({
						icon: "none",
						duration: 3000,
						title: "用户不存在，请前往注册页面成为新会员。"
					})
				}
			}).catch(error => {
				if(error.data.message) {
					uni.showToast({
						icon: "none",
						duration: 3000,
						title: error.data.message
					})
				} else if(error.data.cause) {
					uni.showToast({
						icon: "none",
						duration: 3000,
						title: error.data.cause
					})
				}
			})
		},
		sendCode() {
			if(this.time) return;
			if(!this.mobile) {
				uni.showToast({
					icon: "none",
					title: "请输入手机号",
				})
				return;
			}
			this.api.post("member/vercode/send",{ action: "mpbind",contact: this.mobile }).then(ret => {
				uni.showToast({
					icon: "success",
					title: "发送成功",
				})
				this.time=60;
				let timer=setInterval(() => {
					this.time-=1;
					if(!this.time||this.time<0) {
						this.time=0;
						clearInterval(timer);
					}
				},1000)
			}).catch(error => {
				let message=error.message||error.cause;
				if(!message) return;
				uni.showToast({
					icon: "none",
					duration: 3000,
					title: message,
				})
			})
		},
		wechatLogin() {
			uni.login({
				success: (res) => {
					uni.getUserInfo({
						lang: 'zh_CN',
						success: (userInfo) => {
							let params={
								username: userInfo.userInfo.nickName,
								code: res.code,
								iv: userInfo.iv,
								encryptedData: userInfo.encryptedData,
							}
							this.confirmBindMember(params)
						}
					});
				},
				fail: (e) => {
					console.log("fail",e);
					uni.showModal({
						content: "登录失败,原因为: "+e.errMsg,
						showCancel: false
					})
				}
			});
		},
		confirmBindMember(data) {
			console.log("Data===>",data)
			let params={
				contact: this.mobile,
				vercode: this.vercode,
				...data,
				grant_type: 'mini_program',
				action: "mpbind",
				from: "hall",
				// platform: 0, // 0 -> 小程序  1 -> 公众号
			}
			this.api.post("member/member/bind-v1",params).then(ret => {
				// if (ret.id) {
				//     this.$store.commit("setMemberId", ret.id);
				// }
				if(ret.accessToken) {
					uni.setStorageSync('token',ret.accessToken);
					this.$store.commit("changeLoginStatus",true);
				}
				if(ret.openId) {
					this.$store.commit("setOpenId",ret.openId);
				}
				// this.$store.dispatch("getToken");
				// TODO  duration 2000 ,不要在 showToast里面再去写 setTimeout
				uni.showToast({
					icon: "success",
					title: "绑定成功",
					duration: 2000,
					complete: () => {
						if(this.isBack) {
							uni.navigateBack({
								delta: 1,
							})
						} else {
							uni.switchTab({
								url: "/pages/user/home/index"
							})
						}
					}
				})
			}).catch(error => {
				if(error.message) {
					uni.showToast({
						icon: "none",
						title: error.message,
					})
				}
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
	color: #484f55;
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
		color: #484f55;
		margin-right: 16upx;
	}
	.input-wrap {
		flex: 1;
		position: relative;
		input {
			width: 100%;
			height: 74upx;
			border: 2upx solid #cccccc;
			padding: 0 32upx;
			border-radius: 10upx;
		}

		&--border {
			flex: 1;
			height: 74upx;
			border: 2upx solid #cccccc;
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
		border: 2upx solid #cccccc;
		padding: 0 32upx;
		border-radius: 10upx;
		display: flex;
		align-items: center;
		.no-data {
			color: #999999;
		}
		.right-icon {
			color: #c2c4ca;
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
	background: #f08336;
	border-radius: 16upx;
}
.bg-color {
	background: #48c5b6;
	color: white;
}
.code-btn {
	// position: absolute;
	// right: 12upx;
	// top: 12upx;
	// z-index: 1000;
}
</style>