<template>
	<view class="container">
		<cu-custom bgColor="bg-white" :isBack="true"><block slot="content">签到结果</block></cu-custom>
        <view class="content-wrapper">
            <view class="success">
                <view class="success-content">
                    <view class="image">
                        <image src="/static/images/success.svg" />
                    </view>
                    <view class="title">签到成功</view>
                    <!-- <view class="tip">热爱瑜伽的你，请按时到店上课哦</view> -->
                </view>
            </view>
            <!-- <view class="fail" v-else>
                <view class="fail-content">
                    <view class="image">
                        <image src="/static/images/fail.svg" />
                    </view>
                    <view class="title">{{ isQueue ? '排队' : '预约' }}失败</view>
                    <view class="reason">{{ errorMessage }}</view>
                </view>
            </view> -->

            <view class="btns">
                <button class="cu-btn handle-btn primary-btn" @click="backHome">返回首页</button>
            </view>
        </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
                isSuccess: true,
                errorMessage: '',
			}
        },
       
		onLoad(options) {
            if (options.success) {
                this.isSuccess = true;
            } else {
                this.isSuccess = false;
            }
            if (options.message) {
                this.errorMessage = options.message;
            }
        },
      
		methods: {
            backHome() {
                uni.reLaunch({
                    url: "/pages/index/index",
                })
            },
		}
	}
</script>

<style lang="scss">
    .content-wrapper {

    }
   
    .success {
        height: 100%;
        padding-top: 156upx;
        display: flex;
        flex-direction: column;
        .image {
            width: 542upx;
            height: 400upx;
            image {
                width: 100%;
                height: 100%;
            }
        }
        .success-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 24upx;
        }
        .yicon {
            font-size: 80upx;
            color: #F08336;
        }

        .title {
            font-size: 48upx;
            color: #222527;
            line-height: 1;
            margin-top: 80upx;
        }
       
        .tip {
            font-size: 30upx;
            color: #F08336;
            margin-top: 40upx;
        }
    }

    .fail {
        height: 100%;
        padding-top: 156upx;
        display: flex;
        flex-direction: column;
        align-items: center;
        .title {
            font-size: 48upx;
            color: #222527;
            text-align: center;
            line-height: 1;
            margin-top: 80upx;
        }
        .reason {
            font-size: 30upx;
            color: #999999;
            text-align: center;
            margin-top: 32upx;
        }
    }
    .btns {
        display: flex;
        justify-content:center;
        margin-top: 60upx;
        .handle-btn {
            width: 400upx;
            height: 100upx;
            text-align: center;
            line-height: 100upx;
            border-radius: 20upx;
            font-size: 32upx;
        }
        .primary-btn {
            background: #F08336;
            color: white;
        }
        .secondary-btn {
            background: rgba(#F08336, 0.1);
            color: #F08336;
        }

    }
</style>
