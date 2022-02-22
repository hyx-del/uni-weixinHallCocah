<template>
	<view class="container page-bg">
        <cu-custom bgColor="bg-white" :isBack="true"><block slot="content">退款</block></cu-custom>
        <view class="content-wrap">
            <view class="card large">
                <view>退款金额</view>
                <view class="input-wrapper">
                    <text class="unit">￥</text>
                    <input class="input" placeholder-class="phcolor" type="number" v-model="amount" placeholder="0.00">
                </view>
                <view class="line"></view>
                <view class="total-wrap" style="margin-top: 40upx;">
                    <text style="color: #999999;">余额 ￥{{ account.balance }}</text>
                    <view style="color: #636F7C;margin-left: 8px;" @tap="allRefund">全部退款</view>
                </view>
                <view class="btns-wrap">
                    <button class="cu-btn bg-primary" @tap="refund">退款</button>
                </view>
            </view>
            <view class="card">
                <view class="card__title">温馨提示</view>
                <view class="card__content">
                    充值余额退款将扣除15%手续费
                </view>
            </view>
        </view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
	export default {
		data() {
			return {
                // amount: '0.00',
                amount: '',
			}
        },
        computed: mapState(['account']),
		onLoad() {

		},
		methods: {
            refund() {
                if (!parseFloat(this.amount)) {
                    uni.showToast({
                        icon: 'none',
                        title: "请输入退款金额",
                    })
                    return ;
                }
                
            },
            allRefund() {
                this.amount = this.account.balance;
            }
		}
	}
</script>

<style lang="scss">
    .content-wrap {
        padding: 32upx;
        padding-bottom: 0;
    }
    .card {
        padding: 32upx;
        margin-bottom: 32upx;
        background: #FFFFFF;
        border-radius: 20upx;
        &.large {
            padding: 43upx;
        }
        &__title {
            font-size: 32upx;
            color: #222527;
            margin-bottom: 24upx;
        }
        &__content {
            color: #484F55;
        }
        .line {
            margin: 8upx 0;
            border-top: 1px solid #CCCCCC;
        }
    }
    .input-wrapper {
        color: #222527;
        display: flex;
        margin-top: 56upx;
        margin-bottom: 16upx;
        .unit {
            font-size: 48upx;
        }
        .input {
            height: 80upx;
            flex: 1;
            font-size: 80upx;
            line-height: 80upx;
        }
        .phcolor {
            color: #222527;
        }
    }
    .total-wrap {
        display: flex;
    }
    .btns-wrap {
        margin-top: 80upx;
        button {
            width: 100%;
            border-radius: 20upx;
            height: 100upx;
            line-height: 1;
            font-size: 32upx;
        }
        .bg-primary {
            background: #F08336;
            color: white;
        }
    }
</style>
