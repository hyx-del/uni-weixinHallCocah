<template>
	<view class="container page-bg">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="content">个人资料</block>
		</cu-custom>

		<view class="wrap" v-if="userdetail">
			<view class="form-group">
				<text class="title">姓名</text>
				<text class="rt">{{ userdetail.name }}</text>
			</view>

			<view class="form-group">
				<text class="title">手机号</text>
				<text class="rt">{{ userdetail.contact }}</text>
			</view>

			<view class="form-group" @click="skipSettingInfoPage(0)">
				<view class="title">性别</view>
				<view class="rt">
					<text>{{ userdetail.gender == 1 ? '男' : '女' }}</text>
					<text class="icon cuIcon-right"></text>
				</view>
			</view>

			<view class="form-group" @click="skipSettingInfoPage(1)">
				<view class="title">身份证信息</view>
				<view class="rt">
					<text :class="setCard ? '' : 'important'">
						{{ setCard ? setCard : '请完善身份证信息' }}
					</text>
					<text class="icon cuIcon-right"></text>
				</view>
			</view>

			<view class="form-group" @click="skipSettingInfoPage(2)">
				<view class="title">家庭住址</view>
				<view class="rt">
					<text :class="userdetail.address ? '' : 'no-important'">
						{{ userdetail.address ? userdetail.address : '请完善家庭住址' }}
					</text>
					<text class="icon cuIcon-right"></text>
				</view>
			</view>

			<view class="form-group" @click="skipSettingInfoPage(3)">
				<view class="title">紧急联系人</view>
				<view class="rt">
					<text :class="userdetail.emergencyContact ? '' : 'no-important'">
						{{ userdetail.emergencyContact || '请完善紧急联系人电话' }}
					</text>
					<text class="icon cuIcon-right"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userdetail: null,
			data: 5555,
		};
	},

	computed: {
		setCard() {
			if (!this.userdetail) {
				return;
			}
			let item = this.userdetail.idCard;
			if (!item) {
				return false;
			}
			let items = item.toString();
			let len = items.length;
			let head = items.substr(0, 4);
			let mid = '**********';
			let tail = items.substr(len - 4, 4);
			return '' + head + mid + tail;
		},
	},

	onShow() {
		this.getUserdetail();
	},

	methods: {
		skipSettingInfoPage(index) {
			uni.navigateTo({
				url: '/coachPages/coach-train/setting-info/index?index=' + index,
			});
		},

		getUserdetail() {
			this.api.get('/api/school/member/user/detail', {}, { type: 'other' }).then(res => {
				if (res) {
					this.userdetail = res;
				}
			});
		},
	},
};
</script>

<style lang="scss">
.wrap {
	background: #fff;
	margin-top: 32upx;
	padding: 0 32upx;
	.form-group {
		padding: 32upx 0;
		border-bottom: 1upx solid #cccccc;
		display: flex;
		justify-content: space-between;
		font-size: 32upx;
		.title {
			color: #798188;
			font-weight: 400;
			line-height: 45upx;
		}

		.rt {
			display: flex;
			color: #222527;
			font-weight: 400;
			line-height: 45upx;
			.icon {
				color: #c2c4ca;
				font-size: 24upx;
				margin-left: 24upx;
			}

			.no-important {
				color: #999999;
			}

			.important {
				color: #ff5500;
			}
		}
	}

	.form-group:last-of-type {
		border-bottom: 1upx solid transparent;
	}
}
</style>
