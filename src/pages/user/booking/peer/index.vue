<template>
	<view class="container page-bg fixed-page">
		<cu-custom bgColor="bg-white" :isBack="true"><block slot="content">添加{{ isQueue ? '排队' : '同行' }}</block></cu-custom>
        <view class="content-wrapper">
            <view class="card">
                <view class="title">核对预约信息</view>
                <view class="info-item name-wrap">
                    <view class="label">课程</view>
                    <view class="course-name">{{ course.course_name }}</view>
                    <view class="labels" v-if="course.array_course_label && course.array_course_label.length">
                        <view class="label-item" v-for="(label, index) in course.array_course_label" :key="index">{{ label }}</view>
                    </view>
                </view>
                <view class="info-item">
                    <view class="label">类型</view>
                    <view class="value">{{ courseTypes[course.course_type] }}</view>
                    <!-- <view class="value">团课</view> -->
                </view>
                <view class="info-item">
                    <view class="label">时间</view>
                    <view class="value">{{ course.date }} {{ course.start_time }}-{{ course.end_time }}</view>
                </view>
                <view class="info-item">
                    <view class="label">地点</view>
                    <!-- <view class="value">朝阳区西大望路3号蓝堡国际2座16层（近新光天地）</view> -->
                    <!-- 58 -> 线上实授课门店id  -->
                    <view class="value" v-if="course.hall_id == 58">{{ course.city_name || '线上' }} {{ course.hall_name }}</view>
                    <view class="value" v-else >{{ course.hall_full_address }}</view>
                </view>
            </view>
            <view class="card pay-card">
                <view class="order-info__item">
                    <view class="label">{{ isQueue ? '排队' : '预约' }}人数</view>
                    <view class="number">
                        <view class="yicon icon-minus-circle" @click="onMinus"></view>
                        <view class="total"> 
                            <text>{{ currentNumber }}</text>
                            <text class="unit">/{{ maxNumber }}人</text>
                        </view>
                        <view class="yicon icon-plus-circle" @click="onPlus"></view>
                    </view>
                </view>
                <view class="order-info__item payment-wrap">
                    <view class="label">支付方式</view>
                    <view class="value payment-selected">{{ paymentModes[payType].name }}</view>
                </view>
            </view>
            <view class="card">
                <view class="title">温馨提示</view>
                <view style="color: 484F55;">开课前1小时以上可以取消预约，支持退款</view>
            </view>
        </view>

        <view class="footer">
            <view class="pay-footer-wrap">
                <view class="text">
                    <view class="label">合计：</view>
                    <view class="total">
                        {{ total }}<text class="unit" v-if="total">次</text>
                    </view>
                </view>
                <view class="confirm-btn" @click="submitOrder">提交订单</view>
            </view>
        </view>
	</view>
</template>

<script>
    import { mapState } from 'vuex';
	export default {
		data() {
			return {
                payType: 0,
                paymentModes: [],
                maxNumber: 0,
                currentNumber: 1,
                course: {
                    type: 1,
                },
                courseTypes: {
                    1: "团课",
                    2: "私教课",
                    3: "企业课",
                },
                num: 0,
                total: 0,
                options: {
                    // id: 课程计划id
                    // order_id:
                    // hall_id: 
                    // amount: 已预约数量
                    // course_card_id
                },
                isQueue: false,
			}
        },
        computed: mapState(['memberId', 'openId']),
		onLoad(options) {
            this.options = options;
            if (options.queue) {
                this.isQueue = true;
            }
            console.log("options", options);
            this.api.get("hall/course/index/course-plan/detail", {id: options.id }).then(ret => {
                this.course = ret;
                this.getCourseCardList(options);
            })
        },

		methods: {
            getCourseCardList(opts) {
                let params = {
                    member_id: this.memberId,
                    course_plan_id: opts.id,
                    hall_id: opts.hall_id,
                }
                this.api.get("hall/course/member/course-plan-order/member-course-cards-available", params).then(data => {
                    let options = data || [];
                    let payIndex = 0;
                    options.forEach((item, index) => {
                        if (item.id == this.options.course_card_id) {
                            payIndex = index;
                        }
                        item.channel = 10; // 会员卡支付
                    });
                    this.paymentModes.push(...options);
                    this.payType = payIndex;
                    this.setOrderMaxNumber();
                    this.priceCalc();
                })
            },
            submitOrder() {
                if (!this.paymentModes.length) {
                    return ;
                }
                let params = {
                    id: this.options.order_id,
                    amount: this.currentNumber,
                    member_id: this.memberId,
                };

                let currentPayment = this.paymentModes[this.payType];
                if (currentPayment.channel == 10) {  // 会员卡支付
                    params.payment = {
                        channel: currentPayment.channel,
                        member_course_card_id: currentPayment.id,
                    }
                }
                if (this.isQueue) {
                    console.log("排队==>", params, );
                    this.api.post("hall/course/member/course-plan-order/add-queue", params).then(ret => {
                        if (ret.trade_info && ret.trade_info.prepay_data) {
                            let orderInfo = ret.trade_info.prepay_data;
                        } else {
                            this.toSuccessPage();
                        }
                    }).catch(error => {
                        this.toFailPage(error.message);
                    })
                } else {
                    console.log("params", params, this.paymentModes);
                    this.api.post("hall/course/member/course-plan-order/add-companion", params).then(ret => {
                        if (ret.trade_info && ret.trade_info.prepay_data) {
                            let orderInfo = ret.trade_info.prepay_data;
                        } else {
                            this.toSuccessPage();
                        }
                    }).catch(error => {
                        this.toFailPage(error.message);
                    })
                }
            },
            priceCalc() {
                let params = {
                    hall_id: this.course.hall_id,
                    course_plan_id: this.course.id,
                    amount: this.currentNumber,
                    member_id: this.memberId,
                }
                let currentPayment = this.paymentModes[this.payType];
                params.payment = {
                    channel: currentPayment.channel,
                }
                if (currentPayment.channel == 10) {  // 会员卡支付
                    params.payment.member_course_card_id = currentPayment.id;
                }
                // params.privileges  // 优惠
                this.api.post("hall/course/member/course-plan-order/price-calculate", params).then(data => {
                    this.errorMessage = '';
                    this.total = parseFloat(data.actual_total);
                }).catch(error => {
                    if (error.message) {
                        this.errorMessage = error.message;
                    }
                })
            },
            toSuccessPage() {
                let url = "/pages/course/result/index?orderId=" + this.options.order_id;
                if (this.isQueue) {
                    url = url + "&queue=true";
                }
                uni.navigateTo({
                    url: url,
                })
            },
            toFailPage(message = '') {
                // let url = "/pages/course/result/index?success=" + 0;
                // if (message) {
                //     url = url + "&message=" + message; 
                // }
                // if (this.isQueue) {
                //     url = url + "&queue=true"; 
                // }
                // uni.navigateTo({
                //     url: url,
                // })
                uni.showModal({
                    title: this.isQueue ? "排队失败" : "预约失败",
                    content: message,
                    showCancel: false,
                })
            },
            setOrderMaxNumber() {
                this.currentNumber = 1;
                let currentPayment = this.paymentModes[this.payType];
                let courseMaxOrder = this.course.max_order - this.course.has_order;
                let maxNumber = 0;
                if (currentPayment.channel == 10) {  // 会员卡支付
                    // maxNumber = Math.min(currentPayment.max_companion, courseMaxOrder) - parseInt(this.options.amount || 0);
                    maxNumber = Math.min((currentPayment.max_companion-currentPayment.has_order),courseMaxOrder);
                } else {
                    maxNumber = courseMaxOrder;
                }
                console.log("maxNumber====>", currentPayment.max_companion, courseMaxOrder, "max===", maxNumber);
                if (maxNumber < 1) maxNumber = 1;
                this.maxNumber = maxNumber;
            },
            onMinus() {
                if (this.currentNumber <= 1) return ;
                this.currentNumber -= 1;
                this.priceCalc();
            },
            onPlus() {
                if (this.currentNumber >= this.maxNumber) return ;
                this.currentNumber += 1;
                this.priceCalc();
            }
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
        position: relative;
        .head {
            display: flex;
            align-items: center;
            margin-bottom: 24upx;
            .title {
                margin-bottom: 0;
            }
        }
        .title {
            font-size: 34upx;
            color: #222527;
            margin-bottom: 24upx;
            font-weight: bold;
        }
        .people {
            font-size: 28upx;
            color: #999999;
            margin-left: 16upx;
        }
    }
    .payment-wrap {
        padding-top: 16upx;
        margin-top: 16upx;
    }
    .pay-card {
        .order-info__item {
            display:flex;
            justify-content: space-between;
            .label {
                font-size: 30upx;
            }
            .payment-selected {
                flex: 1;
                text-align: right;
                padding-right: 8upx;
            }
            .number {
                display: flex;
                align-items: center;
                .yicon {
                    color: #999999;
                    font-size: 40upx;
                }
                .total {
                    min-width: 114upx;
                    text-align: center;
                }
                .unit {
                    color: #636F7C;
                }
            }
        }
        .pay-total-wrap {
            display:flex;
            justify-content: space-between;
            padding-top: 40upx;
            border-top: 1px solid #e5e5e5;
            .label {
                font-size: 30upx;
            }
            .total {
                font-size: 36upx;
                font-weight: bold;
                .unit {
                    font-size: 28upx;
                }
            }
        }
        .pay-item {
            font-size: 30upx;
        }
    }
    .name-wrap {
        white-space: nowrap;
        align-items: center;
    }
    .labels {
        display: flex;
        white-space: nowrap;
        .label-item {
            margin-left: 12upx;
            border: 1upx solid #F08336;
            border-radius: 4upx;
            padding: 4upx 4upx;
            color: #F08336;
            font-size: 22upx;
            line-height: 22upx;
            white-space: nowrap;
            font-weight: 400;
        }
    }
    .info-item {
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
        
        .course-name {
            color: #222527;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }

.pay-footer-wrap {
        height: 128upx;
        padding: 24upx 32upx;
        display: flex;
        align-items: center;
        justify-content: center;
        .text {
            flex: 1;
            display: flex;
            align-items: center;
            .label {
                font-size: 30upx;
                color: #222527;
            }
        }
        .total {
            font-size: 48upx;
            color: #FF0000;
            display: flex;
            align-items: center;
            .unit {
                font-size: 28upx;
            }
        }
        .confirm-btn {
            width: 208upx;
            height: 80upx;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F08336;
            border-radius: 12upx;
            font-size: 32upx;
            color: #FFFFFF;
            text-align: center;
            line-height: 1;
        }
    }
</style>
