<template>
	<view class="container page-bg">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="content">{{ title[activeTitleIndex] }}</block>
		</cu-custom>

		<view class="wrap">
			<!-- 性别 -->
			<view class="sex" v-if="activeTitleIndex == 0">
				<view
					class="sex-group"
					v-for="item in sex"
					:key="item.value"
					@click="sexChange(item.value)"
				>
					<view class="title">{{ item.name }}</view>
					<icon type="success_no_circle" size="20" color="#F08336" v-if="item.checked" />
				</view>
			</view>

			<!-- 身份证 -->
			<view class="card" v-if="activeTitleIndex == 1">
				<view class="card-group">
					<view class="title">身份证号</view>
					<view class="card-input">
						<input
							placeholder-class="placeholder"
							placeholder="请输入身份证号"
							v-model="detail.idCard"
						/>
					</view>
				</view>

				<view class="card-group">
					<view class="title">身份证照片</view>
					<view class="card-img">
						<view class="show-card" @click="updateImg(1)">
							<image :src="ossPath + detail.front"></image>
							<text class="card-title">头像页</text>
						</view>

						<view class="show-card" @click="updateImg(2)">
							<image :src="ossPath + detail.reverse"></image>
							<text class="card-title">国徽页</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 家庭住址 -->
			<view class="address" v-if="activeTitleIndex == 2">
				<textarea
					class="textarea"
					placeholder-class="placeholder"
					placeholder="请输入家庭住址"
					v-model="detail.address"
				></textarea>
			</view>

			<!-- 紧急联系人 -->
			<view class="linkman" v-if="activeTitleIndex == 3">
				<input
					placeholder-class="placeholder"
					type="number"
					placeholder="请输入紧急联系人电话"
					v-model="detail.emergencyContact"
				/>
			</view>

			<view class="but">
				<button class="cancel" @click="cancel">取消</button>
				<button class="finish" @click="save">完成</button>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { isCardID } from '@/utils/tools';
export default {
	data() {
		return {
			title: ['性别设置', '设置身份证信息', '设置家庭住址', '设置紧急联系人'],
			sex: [
				{ name: '男', value: 1, checked: true },
				{ name: '女', value: 2, checked: false },
			],
			userInfo: {},
			activeTitleIndex: null,
			gender: 1,
			detail: {
				front: '',
				reverse: '',
			},
		};
	},

	computed: {
		...mapState(['ossPath', 'baseUrl']),
	},

	onLoad(options) {
		this.activeTitleIndex = options.index;
		this.getUserInfo();
	},

	methods: {
		sexChange(value) {
			this.sex.forEach(sexItem => {
				if (sexItem.value == value) {
					sexItem.checked = true;
					this.gender = value;
				} else {
					sexItem.checked = false;
				}
			});
		},

		updateImg(index) {
			uni.chooseImage({
				success: res => {
					const tempFilePaths = res.tempFilePaths;
					uni.uploadFile({
						url: this.baseUrl + 'file/upload/image?bucket=admin',
						filePath: tempFilePaths[0],
						name: 'images[]',
						success: uploadFileRes => {
							const files = JSON.parse(uploadFileRes.data);
							if (index == 1) {
								this.detail.front = files.data[0];
								console.log(this.detail);
							} else {
								this.detail.reverse = files.data[0];
							}
						},
					});
				},
			});
		},

		getUserInfo() {
			this.api.get('/api/school/member/user/detail', {}, { type: 'other' }).then(res => {
				this.detail = { ...res, ...this.detail };
				if (res.idCardImages) {
					this.detail.front = res.idCardImages.front;
					this.detail.reverse = res.idCardImages.reverse;
				}
				this.sexChange(res.gender);
			});
			// this.api.post('school/member/information/detail').then(res => {
			//     this.detail = {...res, ...this.detail};
			//     if (res.idCardImages) {
			//         this.detail.front = res.idCardImages.front;
			//         this.detail.reverse = res.idCardImages.reverse;
			//     }
			//     this.sexChange(res.gender);
			// })
		},

		cancel() {
			uni.navigateBack({
				delta: 1,
			});
		},

		save() {
			console.log(isCardID('1278637812631'), '身份验证');
			switch (this.activeTitleIndex) {
				case '1':
					if (this.detail.idCard) {
						const { valid, error } = isCardID(this.detail.idCard);
						if (!valid) {
							uni.showToast({
								icon: 'none',
								title: error,
							});
							return;
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: '请输入身份证号',
						});
						return;
					}
					break;
				case '2':
					if (!this.detail.address) {
						uni.showToast({
							title: '请输入家庭住址',
							icon: 'none',
						});
						return;
					}
					break;
				case '3':
					if (this.detail.emergencyContact) {
						if (!/^[1]([3-9])[0-9]{9}$/.test(this.detail.emergencyContact)) {
							uni.showToast({
								title: '请输入正确的电话',
								icon: 'none',
							});
							return;
						}
					} else {
						uni.showToast({
							title: '请输入联系人电话',
							icon: 'none',
						});
						return;
					}
					break;

				default:
					break;
			}
			this.update();
		},

		update() {
			let params = {};
			this.setParams(params);
			this.api
				.put(
					'/api/school/member/user/update',
					{ ...this.detail, ...params },
					{ type: 'other' }
				)
				.then(res => {
					uni.showToast({
						title: '修改成功',
						duration: 2000,
						success: () => {
							uni.navigateBack({
								delta: 1,
							});
						},
					});
				});
			// this.api
			// 	.post('school/member/information/update', params)
			// 	.then(res => {
			// 		uni.showToast({
			// 			title: '修改成功',
			// 			duration: 2000,
			// 			success: () => {
			// 				uni.navigateBack({
			// 					delta: 1,
			// 				});
			// 			},
			// 		});
			// 	})
			// 	.catch(error => {
			// 		uni.showModal({
			// 			title: '修改失败',
			// 			content: error.message,
			// 			showCancel: false,
			// 		});
			// 	});
		},

		setParams(params) {
			switch (parseInt(this.activeTitleIndex)) {
				case 0:
					params.gender = this.gender;
					break;
				case 1:
					params.idCard = this.detail.idCard;
					if (this.detail.front && this.detail.reverse) {
						params.idCardImages = {
							front: this.detail.front,
							reverse: this.detail.reverse,
						};
					}
					break;
				case 2:
					params.address = this.detail.address;
					break;
				case 3:
					params.emergencyContact = this.detail.emergencyContact;
					break;
				default:
					break;
			}
		},
	},
};
</script>

<style lang="scss">
.wrap {
	.sex,
	.card {
		margin-top: 32upx;
		background: #ffffff;

		.sex-group {
			padding: 40upx 32upx;
			border-bottom: 1upx solid #cccccc;
			display: flex;
			justify-content: space-between;
			align-items: center;

			> .title {
				color: #222527;
				font-size: 32upx;
				font-weight: 400;
			}
		}

		.card-group {
			padding: 40upx 32upx;
			border-bottom: 1upx solid #cccccc;
			display: flex;
			align-items: center;

			.title {
				color: #798188;
				font-size: 32upx;
				font-weight: 400;
			}

			.card-input {
				margin-left: 58upx;
			}

			.card-img {
				display: flex;
				margin-left: 26upx;
				.show-card {
					height: 152upx;
					width: 244upx;
					background: #d8d8d8;
					border-radius: 12upx;
					margin-right: 14upx;
					position: relative;
					image {
						height: 152upx;
						width: 244upx;
						border-radius: 12upx;
					}
					.card-title {
						position: absolute;
						bottom: 0;
						left: 0;
						height: 60upx;
						width: 100%;
						font-size: 32upx;
						text-align: center;
						line-height: 60upx;
						background: #373737;
						color: #999999;
						border-radius: 0upx 0upx 12upx 12upx;
					}
				}

				.show-card:last-of-type {
					margin-right: 0;
				}
			}
		}

		.form-group:last-of-type {
			border: none;
		}
	}

	.address,
	.linkman {
		margin-top: 32upx;
		background: #ffffff;
		padding: 40upx 32upx;
		.textarea {
			width: 100%;
			max-height: 80upx;
			caret-color: #f67b25;
		}
	}

	input {
		height: 38upx;
		font-size: 32upx;
		caret-color: #f67b25;
		color: #222527;
	}

	.but {
		margin-top: 40upx;
		padding: 0 32upx;
		display: flex;
		.cancel {
			font-size: 32upx;
			line-height: 45upx;
			font-weight: 400;
			color: #f08336;
			padding: 28upx 133upx;
			border-radius: 50upx;
			background: rgba(240, 131, 50, 0.1);
			margin-right: 24upx;
		}

		.finish {
			font-size: 32upx;
			line-height: 45upx;
			font-weight: 400;
			color: #ffffff;
			background: #f08336;
			padding: 28upx 133upx;
			border-radius: 50upx;
		}

		button::after {
			border: none;
			outline: none;
		}
	}
}
</style>
