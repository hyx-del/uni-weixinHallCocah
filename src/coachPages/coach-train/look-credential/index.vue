<template>
	<view class="container page-bg fixed-page-large">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="content">查看证书</block>
		</cu-custom>

		<template v-if="credentialDetail">
			<view class="wrap">
				<image
					v-if="credentialDetail.certificate"
					:src="credentialDetail.certificate"
				></image>
				<view class="not-credential" v-else>
					<image src="../../static/images/certificate.png"></image>
					<view>暂无证书</view>
				</view>
			</view>

			<view class="footer" v-if="credentialDetail.certificate">
				<view class="footer-wrap" @click="download">
					<text>下载证书</text>
				</view>
			</view>

			<view class="cu-load load-modal" v-if="loadModal">
				<!-- <view class='cuIcon-emojifill text-orange'></view> -->
				<view class="gray-text">{{ progress }}%</view>
			</view>
		</template>
	</view>
</template>

<script>
export default {
	data() {
		return {
			credentialDetail: null,
			loadModal: false,
			progress: 0,
		};
	},

	onLoad(options) {
		this.getCredentialDetail(options.index);
	},

	methods: {
		getCredentialDetail(index) {
			// this.api.post('school/member/certificate/get-list', { semester_id: id }).then(res => {
			//     this.credentialDetail = res;
			// })
			this.api
				.get('/api/school/member/certificate/list', null, { type: 'other' })
				.then(res => {
					this.credentialDetail = res[index];
				});
		},

		download() {
			this.loadModal = true;
			var downloadTask = uni.downloadFile({
				url: this.credentialDetail.certificate,
				success: res => {
					this.saveFile(res.tempFilePath);
				},
			});

			downloadTask.onProgressUpdate(res => {
				this.progress = res.progress;
				if (res.progress == 100) {
					this.loadModal = false;
				}
			});
		},

		saveFile(path) {
			uni.saveImageToPhotosAlbum({
				filePath: path,
				success: res => {
					console.log(res);
					uni.showToast({
						title: '下载成功',
					});
				},
			});
		},
	},
};
</script>

<style lang="scss">
.wrap {
	flex: 1;
	padding-top: 32upx;
	display: flex;
	justify-content: center;
	align-items: center;

	image {
		width: 100%;
	}

	.not-credential {
		flex: 1;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;

		image {
			width: 300upx;
			height: 273upx;
		}

		view {
			font-size: 32upx;
			color: #999999;
			font-weight: 400;
			margin-top: 81upx;
		}
	}
}
.footer-wrap {
	display: flex;
	justify-content: center;
	align-items: center;
	max-height: 120upx;
	opacity: 0.6;
	padding: 38upx 295upx 37upx 295upx;
	background: #000000;
	> text {
		font-size: 32upx;
		color: #ffffff;
		font-weight: 400;
	}
}
.fixed-page-large {
	padding-bottom: 120upx;
	padding-bottom: calc(constant(safe-area-inset-bottom) + 120upx);
	padding-bottom: calc(env(safe-area-inset-bottom) + 120upx);
}

.cu-load.load-modal:after {
	width: 60rpx !important;
	height: 60rpx !important;
}

.cu-load.load-modal {
	width: 100rpx !important;
	height: 100rpx !important;
}
</style>
