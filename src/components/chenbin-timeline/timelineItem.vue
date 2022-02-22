<!--
 * @Author: 郑晶
 * @Date: 2021-09-29 09:54:42
 * @LastEditors: 郑晶
 * @LastEditTime: 2021-10-18 09:54:50
 * @Descripttion: 
-->
<template>
	<view class="timelineItem">
		<view class="timeItem">
			<view class="leftTime">
				{{ leftTime }}
			</view>
			<view class="line">
				<view class="out" :style="{ background: color == '' ? '' : color }"></view>
			</view>
			<view class="rightContent">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		leftTime: {
			type: String,
			default: '',
		},
		color: {
			type: String,
			default: '',
		},
	},
	data() {
		return {};
	},
};
</script>

<style scoped lang="scss">
.timelineItem {
	.timeItem {
		display: flex;
		.leftTime {
			width: 100rpx;
			font-size: 22rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #6c7d91;
			display: flex;
			align-items: center;
			margin-right: 6rpx;
		}
		.line {
			width: 1px;
			background: rgba(204, 204, 204, 1);
			position: relative;
			.out {
				position: absolute;
				top: 47%;
				left: 50%;
				transform: translateX(-50%);
				display: flex;
				justify-content: center;
				align-items: center;
				width: 10rpx;
				height: 10rpx;
				background: rgba(236, 104, 23, 0.6);
				border-radius: 50%;
			}
		}
		.rightContent {
			flex: 1;
			padding: 16rpx 0 16rpx 42rpx;
			min-height: 50rpx;
		}
	}
}
</style>
