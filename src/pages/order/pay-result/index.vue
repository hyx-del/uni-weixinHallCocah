<template>
	<view class="container page-bg">
		<cu-custom bgColor="bg-white" :isBack="true"><block slot="content">支付结果</block></cu-custom>
        <view class="content-wrapper">
            <view class="card">
                <view class="success">
                    <view class="success-content">
                        <view class="top-content">
                            <view class="yicon icon-success"></view>
                            <view class="title">支付成功</view>
                            <view class="tip">￥200</view>
                        </view>
                        <view class="loading-btn" @click="toViewOrder">查看订单</view>
                    </view>
                    <view class="line"></view>
                    <view class="info">
                        <view class="info-item">
                            <view>订单编号</view>
                            <view>2019061750059072</view>
                        </view>
                        <view class="info-item">
                            <view>商品</view>
                            <view class="value">【新店预售】北京22-世贸天阶店 1件</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
        },
       
		onLoad() {

        },
      
		methods: {
            toViewOrder() {
                console.log("查看订单");
                uni.navigateTo({
                    url: "/pages/order/detail/index?order_id=" + 1,
                })
            },
		}
	}
</script>

<style lang="scss">
    .content-wrapper {
        padding: 0 32upx;
        padding-top: 32upx;
    }
    .card {
        padding: 32upx;
        margin-bottom: 32upx;
        background: white;
        border-radius: 20upx;
        height: 70vh;
    }
    .success {
        height: 100%;
        display: flex;
        flex-direction: column;
        .success-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items:center;
            justify-content: space-evenly;
        }
        .top-content {
            display: flex;
            flex-direction: column;
            align-items:center;
        }
        .yicon {
            font-size: 80upx;
            color: #F08336;
        }

        .title {
            font-size: 48upx;
            color: #222527;
            line-height: 1;
            margin-top: 40upx;
        }
        .tip {
            font-size: 30upx;
            color: #FF0000;
            margin-top: 40upx;
        }
        .line {
            border: 1px dashed #CCCCCC;
            position: relative;
            &::before {
                content: "";
                position: absolute;
                width: 32upx;
                height: 32upx;
                background: #f5f5f5;
                border-radius: 50%;
                top: -16upx;
                left: -48upx;
            }
            &::after {
                content: "";
                position: absolute;
                width: 32upx;
                height: 32upx;
                background: #f5f5f5;
                border-radius: 50%;
                top: -16upx;
                right: -48upx;
            }
        }
        .info {
            padding-top: 40upx;
            padding-bottom: 8upx;
            &-item {
                display: flex;
                justify-content: space-between;
                color: #636F7C;
                margin-bottom: 10upx;
                .value {
                    flex: 1;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    text-align: right;
                }
            }
        }
        .loading-btn {
            margin: 0 auto;
            width: 248upx;
            height: 74upx;
            text-align: center;
            line-height: 72upx;
            border: 1px solid #F08336;
            border-radius: 8upx;
            font-size: 30upx;
            color: #F08336;
        }
    }

    .fail {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .title {
            font-size: 48upx;
            color: #222527;
            text-align: center;
            line-height: 1;
            margin-top: 40upx;
        }
        .reason {
            font-size: 30upx;
            color: #FF0000;
            text-align: center;
            margin-top: 40upx;
        }
        .loading-btn {
            margin: 0 auto;
            width: 248upx;
            height: 74upx;
            text-align: center;
            line-height: 72upx;
            border: 1px solid #F08336;
            border-radius: 8upx;
            font-size: 30upx;
            color: #F08336;
        }
    }
    .btns {
        display: flex;
        justify-content:center;
        margin-top: 40upx;
        .handle-btn {
            width: 248upx;
            height: 74upx;
            text-align: center;
            line-height: 74upx;
            border-radius: 8upx;
            color: white;
            font-size: 30upx;
        }
        .reservation {
            background: #F08336;
            margin-right: 24upx;
        }
        .save {
            background: #48C5B6;
        }
    }
</style>
