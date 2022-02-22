<template>
	<view class="container page-bg">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="content">我的证书</block>
		</cu-custom>

		<view>
			<view class="wrap" v-if="credentialList.length">
				<view
					class="img-list"
					v-for="(item, index) in credentialList"
					:key="index"
					@click="lookCredential(index)"
				>
					<image :src="item.certificate" mode="scaleToFill"></image>
				</view>
			</view>

			<view class="not-credential" v-if="!credentialList.length">
				<image src="../../static/images/certificate.png"></image>
				<view>暂无证书</view>
				<button class="go-sign-up" @click="goSignUp">去报名</button>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			credentialList: [],
		};
	},

	computed: mapState(['ossPath']),

	onLoad() {
		this.getAllCredential();
	},

	methods: {
		goSignUp() {
			uni.navigateTo({
				url: '/coachPages/coach-train/home/index',
			});
		},

		getAllCredential() {
			this.api.post('school/member/certificate/get-list').then(res => {
				// this.credentialList = res;
			});
			this.api
				.get('/api/school/member/certificate/list', null, { type: 'other' })
				.then(res => {
					this.credentialList = res;
				});
		},

		lookCredential(index) {
			uni.navigateTo({
				url: `/coachPages/coach-train/look-credential/index?index=${index}`,
			});
		},
	},
};
</script>

<style lang="scss">
.wrap {
	flex: 1;
	padding: 32upx 32upx 0 32upx;

	.img-list {
		width: 686upx;
		height: 484upx;
		margin-bottom: 32upx;
		image {
			width: 686upx;
			height: 484upx;
		}
	}
}

.not-credential {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;

	image {
		width: 300upx;
		height: 273upx;
		margin-top: 201upx;
	}

	view {
		font-size: 32upx;
		color: #999999;
		font-weight: 400;
		margin-top: 81upx;
	}

	.go-sign-up {
		margin-top: 100upx;
		background: #f08336;
		color: #fff;
		border-radius: 50upx;
		padding: 28upx 117upx;
		line-height: 45upx;
		font-size: 32upx;
	}
}
</style>
