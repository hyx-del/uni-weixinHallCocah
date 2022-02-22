<template>
	<view class="container">
		<cu-custom bgColor="bg-white" :isBack="true"><block slot="content">意见反馈</block></cu-custom>

		<view class="page-content-outer">
			<view class="form-group">
				<view class="title">城市</view>
				<picker @change="cityChange" :value="cityIndex" :range="cityList" range-key="name">
					<view class="picker">
						<view class="picker-value" :class="cityIndex > -1 ? '' : 'no-data'">
							{{ cityIndex > -1 ? cityList[cityIndex].name : '选择城市' }}
						</view>
						<view class="cuIcon-right right-icon"></view>
					</view>
				</picker>
			</view>

			<view class="form-group" v-if="hallList.length">
				<view class="title">场馆</view>
				<picker @change="hallChange" :value="hallIndex" :range="hallList" range-key="name">
					<view class="picker">
						<view class="picker-value" :class="hallIndex > -1 ? '' : 'no-data'">
							{{ hallIndex > -1 ? hallList[hallIndex].name : '选择场馆' }}
						</view>
						<view class="cuIcon-right right-icon"></view>
					</view>
				</picker>
			</view>
			<view class="form-group mb32">
				<textarea class="textarea" v-model="message" placeholder="请描述您的反馈内容~"></textarea>
			</view>
			<view class="log" @click="showLogs">
				<text>查看以往反馈记录</text>
				<view class="cuIcon-right right-icon"></view>
			</view>
			<button class="cu-btn comment-btn bg-primary" @click="submitFeedback">提交</button>
		</view>
	</view>
</template>
<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			cityList: [],
			hallList: [],
			cityIndex: -1,
			hallIndex: -1,
			message: '',
			account: {},
		};
	},
	computed: mapState(['ossPath', 'memberId']),
	onLoad() {
		this.getCityList();
	},
	methods: {
		submitFeedback() {
			if (!this.account.city_id) {
				uni.showToast({
					icon: 'none',
					title: '请选择城市',
				});
				return;
			}
			if (!this.account.hall_id) {
				uni.showToast({
					icon: 'none',
					title: '请选择场馆',
				});
				return;
			}
			if (!this.message) {
				uni.showToast({
					icon: 'none',
					title: '请填写内容',
				});
				return;
			}
			let params = {
				hall_id: this.account.hall_id,
				content: this.message,
				member_id: this.memberId,
			};
			this.api.post('hall/member/suggestion/create', params).then(ret => {
				uni.showToast({
					icon: 'none',
					duration: 2000,
					title: '反馈成功',
					success: () => {
						uni.navigateBack({
							delta: 1,
						});
					},
				});
			});
		},
		showLogs() {
			uni.navigateTo({
				url: '/pages/user/feedback-log/index',
			});
		},
		getCityList() {
			this.api.post('hall/member/member/hall/select').then(data => {
				this.cityList = data || [];
			});
		},
		getHallList(city_id) {
			this.api.post('hall/member/member/hall/select', { city_id }).then(data => {
				this.hallList = data || [];
			});
		},
		cityChange(event) {
			this.cityIndex = event.detail.value;
			let id = this.cityList[this.cityIndex].id;
			this.account.city_id = id;
			if (this.account.hall_id) {
				this.account.hall_id = '';
			}
			this.hallIndex = -1;
			this.getHallList(id);
		},
		hallChange(event) {
			this.hallIndex = event.detail.value;
			this.account.hall_id = this.hallList[this.hallIndex].id;
		},
	},
};
</script>
<style lang="scss">
.page-content-outer {
	padding: 0 64upx;
	padding-top: 100upx;
}
.form-group {
	display: flex;
	align-items: center;
	font-size: 30upx;
	margin-bottom: 40upx;
	&.mb32 {
		margin-bottom: 32upx;
	}
	.title {
		width: 80upx;
		color: #484f55;
		margin-right: 16upx;
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

.textarea {
	width: 100%;
	height: 228upx;
	background: #ffffff;
	border: 1px solid #cccccc;
	border-radius: 8upx;
	padding: 24upx;
	&:focus {
		border-color: #f08336;
	}
	&::-webkit-input-placeholder {
		color: rgba(0, 0, 0, 0.25);
	}
}
.log {
	color: #f08336;
	padding: 8upx 0;
	display: flex;
	align-items: center;
	.right-icon {
		margin-left: 8upx;
	}
}

.bg-primary {
	background: #f08336;
}
.comment-btn {
	background: #f08336;
	width: 100%;
	height: 94upx;
	border-radius: 8upx;
	font-size: 32upx;
	color: #ffffff;
	margin-top: 120upx;
}
</style>
