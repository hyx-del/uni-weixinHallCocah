<template>
	<view class="container">
		<cu-custom bgColor="bg-white" :isBack="true"><block slot="content">{{ isQueue ? '排队' : '预约' }}结果</block></cu-custom>
        <view class="content-wrapper">
            <view class="success">
                <view class="success-content">
                    <!-- <view class="image">
                        <image src="/static/images/success.svg" />
                    </view> -->
                    <view class="title">{{ isQueue ? '排队' : '预约' }}成功</view>
                    <view class="tip" v-if="!isQueue">热爱瑜伽的你，请按时到店上课哦</view>
                    <view class="tip" v-else >排队中，请耐心等待</view>
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
            <view v-if="isQueue">
                 <!-- v-if="isSuccess" -->
                <view class="btns">
                    <button class="cu-btn handle-btn primary-btn" @click="backHome">返回首页</button>
                </view>
            </view>
            <view v-else>
                <!-- v-if="isSuccess" -->
                <view class="btns" >
                    <button class="cu-btn handle-btn primary-btn" @click="toView">查看预约</button>
                    <button class="cu-btn handle-btn default-btn mt32" @click="backHome">返回首页</button>
                </view>
            </view>

            <view class="info-wrapper" v-if="orderId">
                <view class="card">
                    <view class="card__title">预约信息</view>
                    <view class="info-cell">
                        <view class="label">课程</view>
                        <view class="value">{{ detail.name }}</view>
                    </view>
                    <view class="info-cell">
                        <view class="label">类型</view>
                        <view class="value">{{ courseTypes[detail.course_detail.type] }}</view>
                    </view>
                    <view class="info-cell">
                        <view class="label">时间</view>
                        <view class="value">{{ detail.date }}</view>
                    </view>
                    <view class="info-cell">
                        <view class="label">地点</view>
                        <view class="value flex-center">
                            <text>{{ detail.hall_name }}</text>
                            <text v-if="detail.classroom_name" style="margin-left: 4upx;">{{ detail.classroom_name }}</text>
                            <!-- <view class="address-icon yicon icon-coordinate" @tap="showMap"></view> -->
                        </view>
                    </view>
                </view>
                <view class="card">
                    <view class="card__title">温馨提示</view>
                    <view style="color: 484F55;">开课前1小时以上可以取消预约，支持退款</view>
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
                isSuccess: true,
                errorMessage: '',
                isPrivateBooking: false,
                isQueue: false,
                courseTypes: {
                    1: "团课",
                    2: "私教课",
                    3: "企业课",
                },
                detail: {},
                orderId: null,
			}
        },
       computed: mapState(['memberId']),
		onLoad(options) {
            // if (options.success && parseInt(options.success)) {
            //     this.isSuccess = !!options.success;
            // } else {
            //     this.isSuccess = false;
            // }
            if (options.queue) {
                this.isQueue = true;
            }
            if (options.message) {
                this.errorMessage = options.message;
            }
            if (options.private) {
                this.isPrivateBooking = true;
            }
            if (options.orderId) {
                this.orderId = options.orderId;
                this.getBookingDetail();
            }
        },
      
		methods: {
            getBookingDetail() {
                let params = {
                    id: this.orderId,
                    member_id: this.memberId,
                }
                this.api.get("hall/member/member/course-plan-orders/detail", params).then(data => {
                    if (data.id && data.payments && data.payments.length) {
                        data.paymentType = data.payments[0].channel;
                    }
                    if (data.paymentType == 10) { // 课程卡支付
                        data.total = parseInt(data.total);
                    }
                    if (data.course_detail) {
                        data.date = data.course_detail.date + " " + data.course_detail.start_time + " - " + data.course_detail.end_time;
                    }
                    this.detail = data || {};
                    console.log("预约详情", this.detail);
                });
            },
            anewReservation() {
                if (this.isPrivateBooking) {
                    
                }
                uni.navigateBack({
                    delta: 1,
                })
            },
            toView() {
                uni.reLaunch({
                    url: "/pages/user/booking/index?isHome=true",
                })
            },
            saveImage() {
                
            },
            backHome() {
                uni.switchTab({
                    url: "/pages/index/index"
                })
            }
		}
	}
</script>

<style lang="scss">
    .content-wrapper {

    }
   
    .success {
        height: 100%;
        padding-top: 170upx;
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
        }
        .yicon {
            font-size: 80upx;
            color: #F08336;
        }

        .title {
            font-size: 48upx;
            color: #222527;
            line-height: 1;
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
        margin-bottom: 100upx;
        flex-direction: column;
        align-items: center;
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
        .default-btn {
            color: #F08336;
            background: white;
            border: 2upx solid #F08336;
        }
    }
    .mt32 {
        margin-top: 32upx;
    }

    .info-wrapper {
        padding: 0 32upx;
        .card {
            padding: 32upx;
            color: #222527;
            &__title {
                font-size: 34upx;
                margin-bottom: 24upx;
            }
            .info-cell {
                display: flex;
                margin-bottom: 16upx;
                line-height: 40upx;
                .label {
                    color: #636F7C;
                    margin-right: 24upx;
                }
                .value {
                    flex: 1;
                    color: #222527;
                }
            }
        }
    }
</style>
