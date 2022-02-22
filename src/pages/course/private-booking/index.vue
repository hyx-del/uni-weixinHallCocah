<template>
	<view class="container page-bg fixed-page-large">
		<cu-custom bgColor="bg-white" :isBack="true"><block slot="content">课程预约</block></cu-custom>
        <view class="content-wrapper">
            <view class="card">
                <view class="title">核对预约信息</view>
                <view class="info-item">
                    <view class="label">课程</view>
                    <view class="value">{{ order.course_name }}（私教）</view>
                </view>
                <view class="info-item">
                    <view class="label">教练</view>
                    <view class="value">{{ order.coach_name }}</view>
                </view>
                <view class="info-item">
                    <view class="label">时间</view>
                    <view class="value">{{ order.date }} {{ order.start_at }}-{{ order.end_at }}</view>
                </view>
                <view class="info-item">
                    <view class="label">场馆</view>
                    <view class="value">{{ order.hall_name }}</view>
                </view>

                <button class="contact-btn" open-type="contact">
                    <image class="img" src="/static/images/contact.svg" />
                    <text>在线客服</text>
                </button>
            </view>

            
            <view class="card remark-card">
                <view class="remark-wrapper">
                    <view class="label">备注</view>
                    <view style="flex: 1;" class="input-wrap">
                        <input class="input" @input="remarkChange" placeholder="（选填）"/>
                    </view>
                </view>
            </view>

            <view class="pay-card">
                <radio-group class="block" @change="payChannelChange">
                    <view class="pay-list menu text-left">
                        <view class="pay-item" v-if="paymentModes.length">
                            <label class="flex justify-between align-center">
                                <view class="image">
                                    <image src="../../../static/images/card/class-card.svg" mode="widthFix" />
                                </view>
                                <view class="label">课程卡</view>
                                <view class="value">{{ paymentModes[payType].name }}</view>
                                <radio class="bg-primary round" :class="payChannelIndex == 0  ?'checked':''" :checked="payChannelIndex == 0 ?true:false"
                                :value="0"></radio>
                            </label>
                            <view class="other">
                                <view class="handle-link" @click="showPayModal">
                                    <text>选择其他课程卡</text>
                                    <view class="icon cuIcon-right right-icon"></view>
                                </view>
                            </view>
                        </view>
                        <view class="pay-item" v-else-if="isCourseCardLoading">
                            <label class="flex justify-between align-center">
                                <view class="image">
                                    <image src="../../../static/images/card/class-card.svg" mode="widthFix" />
                                </view>
                                <view class="label">课程卡</view>
                                <view class="value" style="color: #ccc;">暂无课程卡</view>
                                <view class="y-radio"></view>
                            </label>
                            <!--  v-if="!defaultPayMode.length" -->
                            <view class="other-tip">如需购买课程卡，请联系您的会籍顾问或点击右上角"在线客服"咨询。</view>
                        </view>

                        <view class="pay-item" v-for="(item, index) in defaultPayMode" :key="index">
                            <label class="flex justify-between align-center">
                                <view class="image">
                                    <image :src="item.icon" mode="widthFix" />
                                </view>
                                <view class="label">{{ item.name }}</view>
                                <view class="value"></view>
                                <radio class="bg-primary round" :class="payChannelIndex == item.index  ?'checked':''" :checked="payChannelIndex == item.index ?true:false"
                                    :value="item.index"></radio>
                            </label>
                            <view class="other" v-if="item.channel == 20">
                                <view style="margin-right: 8upx;">余额</view>
                                <view style="margin-right: 8upx;">￥{{ account.balance || '0.00' }}</view>
                                <view class="handle-link" @click="skipRechargePage">
                                    <text>充值</text>
                                    <view class="icon cuIcon-right right-icon"></view>
                                </view>
                            </view>
                        </view>
                    </view>
                </radio-group>
            </view>

            <view class="card">
                <view class="title">温馨提示</view>
                <view style="color: 484F55;">开课前1小时以上可以取消预约，支持退款</view>
            </view>
        </view>

        <view class="cu-modal bottom-modal" :class="payModalVisible ? 'show' : ''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-bar bg-white justify-end">
					<view class="content">选择课程卡</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close"></text>
					</view>
				</view>
				<view>
                    <scroll-view scroll-y style="height: 200px;">
                        <radio-group class="block" @change="payCardChange">
                            <view class="cu-list menu text-left">
                                <view class="cu-item" v-for="(item,index) in paymentModes" :key="index">
                                    <label class="flex justify-between align-center flex-sub">
                                        <view class="card-image">
                                            <image :src="item.image" />
                                        </view>
                                        <view class="flex-sub">{{ item.name }}</view>
                                        <view class="card-no">{{ item.card_no || ''}}</view>
                                        <radio class="bg-primary round" :class="payType == index  ?'checked':''" :checked="payType == index ?true:false"
                                        :value="index"></radio>
                                    </label>
                                </view>
                            </view>
                        </radio-group>
                    </scroll-view>
				</view>
			</view>
		</view>

        <view class="footer">
            <view class="pay-footer-wrap">
                <view class="text" v-if="!errorMessage">
                    <view class="label">合计：</view>
                    <view class="total" v-if="hasCourseCard">
                        {{ total }}<text class="unit" v-if="total">次</text>
                    </view>
                    <view class="total" v-else>
                        <text class="unit">￥</text>{{ total }}
                    </view>
                    <view class="discount-wrap" v-if="!hasCourseCard && checkedCoupons.length">
                        已优惠￥{{ couponTotal }}
                    </view>
                </view>
                <view class="text" v-else>
                    <view class="error">{{ errorMessage }}</view>
                </view>
                <view class="confirm-btn" :class="errorMessage ? 'disabled' : ''" @click="submitOrder">提交订单</view>
            </view>
        </view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
	export default {
		data() {
			return {
                payModalVisible: false,
                payType: 0,
                payChannelIndex: 0,
                paymentModes: [],
                defaultPayMode: [
                    // { name: '余额支付', channel: 20, icon: "../../../static/images/money.svg", index: 1 },
                    // { name: '微信支付', channel: 30, icon: "../../../static/images/card/wechat.svg", index: 2 }
                ],
                num: 0,
                total: 0,
                order: {},
                amount: 1,
                hasCourseCard: false,
                errorMessage: '',

                couponTotal: 0,
                checkedCoupons: [],
                couponsList: [],
                pageInit: true,
                courseCardImageNum: 6,
                hasRecharge: false,
                remark: '',
                isPaymentModeLoading: false,
                isCourseCardLoading: false,
                isCreateOrder: false,
			}
        },
        computed: mapState(['memberId', 'openId', 'account', 'appId']),
		onLoad(options) {
            let data = uni.getStorageSync("private_data");
            this.order = JSON.parse(data);
            this.getPaymentMode();
            this.getCourseCardList();
            
            this.$store.dispatch("getAccountInfo");
            // this.getCouponsList();
        },
        onShow() {
            if (this.hasRecharge) {
                this.hasRecharge = false;
                this.$store.dispatch("getAccountInfo");
            }
            // if (this.pageInit) {
            //     this.pageInit = false;
            //     return ;
            // }
            // this.priceCalc();
        },
		methods: {
            getPaymentMode() {
                let params = {
                    id: this.order.course_id,
                    hall_id: this.order.hall_id,
                }
                this.api.get("hall/course/index/get-payment-mode", params).then(ret => {
                    let arr = [];
                    if (ret.balance_price) {
                        arr.push({ name: '余额支付', channel: 20, icon: "../../../static/images/money.svg", index: 1, });
                    }
                    if (ret.price) {
                        arr.push({ name: '微信支付', channel: 30, icon: "../../../static/images/card/wechat.svg", index: arr.length ? 2 : 1, })
                    }
                    this.defaultPayMode = arr;
                    this.isPaymentModeLoading = true;
                    console.log("支付方式======");
                    if (this.isCourseCardLoading) {
                        this.priceCalc();
                    }
                })
            },
            getCourseCardList() {
                let params = {
                    member_id: this.memberId,
                    course_id: this.order.course_id,
                    hall_id: this.order.hall_id,
                }
                this.api.get("hall/course/member/course-plan-order/member-course-cards-available", params).then(data => {
                    let options = data || [];
                    let imageIndex = 1;
                    options.forEach(item => {
                        item.channel = 10; // 会员卡支付
                        if (imageIndex > this.courseCardImageNum) {
                            imageIndex = 1;
                        }
                        item.image = `../../../static/images/card/card${imageIndex}.svg`;
                        imageIndex++;
                    });

                    if (!options.length) {
                        this.payChannelIndex = 1;
                        this.hasCourseCard = false;
                    } else {
                        this.hasCourseCard = true;
                    }
                    // this.paymentModes.unshift(...options);
                    this.paymentModes = options;
                    this.isCourseCardLoading = true;
                    console.log("课程卡======");
                    if (this.isPaymentModeLoading) {
                        this.priceCalc();
                    }
                })
            },
            getCouponsList() {
                let params = {
                    member_id: this.memberId,
                    expired: 0, // 可使用
                    used: 2, // 未使用
                    status: 1, // 已上线
                    use_limit: 2, // 私教
                }
                this.api.get("member/member/coupon/list", params).then(data => {
                    this.couponsList = data || [];;
                })
            },
            skipCouponsPage() {
                let ids = this.checkedCoupons.map(item => item.id);
                let url = "/pages/user/coupons-selected/index?use_limit=2";
                if (ids.length) {
                    url += "&ids=" + JSON.stringify(ids);
                }
                uni.navigateTo({
                    url: url,
                })
            },
            skipRechargePage() {
                this.hasRecharge = true;
                uni.navigateTo({
                    url: "/pages/user/recharge/index"
                })
            },
            submitOrder() {
                if (this.errorMessage) {
                    // uni.showToast({
                    //     icon: "none",
                    //     title: this.errorMessage,
                    // })
                    return ;
                }
                if (this.isCreateOrder) return ;
                let params = {
                    hall_id: this.order.hall_id,
                    coach_id: this.order.coach_id,
                    course_id: this.order.course_id,
                    member_id: this.memberId,
                    date: this.order.date,
                    start_at: this.order.start_at,
                    end_at: this.order.end_at,
                    amount: this.amount,
                }
                if (this.remark) {
                    params.remark = this.remark;
                }
                if (parseInt(this.payChannelIndex) && !this.defaultPayMode.length) {
                    uni.showToast({
                        icon: 'none',
                        title: "没有支持的支付方式",
                    })
                    return  ;
                }
                if (!parseInt(this.payChannelIndex)) { // 课程卡
                    let currentPayment = this.paymentModes[this.payType];
                    params.payment = {
                        channel: currentPayment.channel,
                        member_course_card_id: currentPayment.id,
                    }
                } else {
                    let payment = this.defaultPayMode[parseInt(this.payChannelIndex) - 1];
                    params.payment = { channel: payment.channel }
                    params.extra = { openid: this.openId, app_id: this.appId }
                }

                // 优惠
                params.privileges = this.checkedCoupons || [];

                this.isCreateOrder = true;
                console.log("params", params, this.paymentModes);

                this.api.post("hall/course/member/course-plan-order/create", params).then(ret => {
                    this.isCreateOrder = false;
                    if (ret.trade_info && ret.trade_info.prepay_data) {
                        let orderInfo = ret.trade_info.prepay_data;
                        uni.requestPayment({
                            provider: 'weixin',
                            // orderInfo: {}, //微信、支付宝订单数据
                            timeStamp: orderInfo.timeStamp,
                            signType: orderInfo.signType,
                            paySign: orderInfo.paySign,
                            package: orderInfo.package,
                            nonceStr: orderInfo.nonceStr,
                            success: (res) => {
                                this.toSuccessPage(ret.id);
                            },
                            fail: (err) => {
                               this.toFailPage("支付失败");
                            }
                        });
                    } else {
                        this.toSuccessPage(ret.id);
                    }
                }).catch(error => {
                    this.isCreateOrder = false;
                    this.toFailPage(error.message);
                })
            },
            remarkChange(event) {
                this.remark = event.detail.value;
            },
            priceCalc() {
                let params = {
                    hall_id: this.order.hall_id,
                    course_id: this.order.course_id,
                    member_id: this.memberId,
                    amount: this.amount,
                }
                if (this.payChannelIndex && !this.defaultPayMode.length) {
                    this.errorMessage = "没有支持的支付方式";
                    return ;
                }
                if (this.payChannelIndex == 0) {
                    let currentPayment = this.paymentModes[this.payType];
                    params.payment = {
                        channel: currentPayment.channel,
                        member_course_card_id: currentPayment.id,
                    }
                } else {
                    let payment = this.defaultPayMode[parseInt(this.payChannelIndex) - 1];
                    params.payment = { channel: payment.channel }
                }

                // 优惠
                params.privileges = this.checkedCoupons || [];

                this.api.post("hall/course/member/course-plan-order/price-calculate", params).then(data => {
                    this.errorMessage = '';
                    this.total = parseFloat(data.actual_total);
                    if (!parseInt(this.payChannelIndex)) { // 课程卡
                        this.hasCourseCard = true;
                    } else {
                        this.hasCourseCard = false;
                    }
                }).catch(error => {
                    if (error.message) {
                        this.errorMessage = error.message;
                    }
                })
            },
            toSuccessPage(orderId) {
                let url = "/pages/course/result/index";
                if (orderId) {
                    url = url + "?orderId=" + orderId;
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
                // uni.navigateTo({
                //     url: url,
                // })
                uni.showModal({
                    title: "预约失败",
                    content: message,
                    showCancel: false,
                })
            },
            showPayModal() {
                this.payModalVisible = true;
            },
            hideModal() {
                this.payModalVisible = false;
            },
            payChannelChange(e) {
                this.payChannelIndex = e.detail.value;
                if (!parseInt(this.payChannelIndex)) {
                    this.checkedCoupons = [];
                }
                this.priceCalc();
            },
            payCardChange(e) {
                this.payType = e.detail.value;
                if (parseInt(this.payChannelIndex)) {
                    this.payChannelIndex = 0;
                }
                this.priceCalc();
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
        // padding-top: 8upx;
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

    .contact-btn {
        position: absolute;
        top: 32upx;
        right: 16upx;
        background-color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 1;
        padding: 0 16rpx;
        font-size: 28upx;
        color: #484F55;
        &::after {
            border: none;
        }
        .img {
            width: 36upx;
            height: 36upx;
            margin-bottom: 8upx;
        }
    }
    .pd32 {
        padding: 32upx!important;
    }
    .pay-card {
        padding: 0 32upx;
        margin-bottom: 32upx;
        background: white;
        border-radius: 20upx;
        position: relative;
        .pay-list {

        }
        .pay-item {
            padding: 32upx 0;
            position: relative;
            color: #222527;
            overflow: hidden;
            &:not(:last-child):after {
                position: absolute;
                top: 0;
                left: 0;
                box-sizing: border-box;
                width: 200%;
                height: 200%;
                border-bottom: 1upx solid #ddd;
                border-radius: inherit;
                content: " ";
                transform: scale(.5);
                transform-origin: 0 0;
                pointer-events: none
            }
            radio {
                transform: scale(0.8);
            }

            .image {
                width: 50upx;
                margin-right: 24upx;
                max-height: 50upx;
                overflow: hidden;
            }
            .label {
                // flex: 1;
                font-size: 34upx;
            }
            .value {
                flex: 1;
                text-align: right;
                font-size: 30upx;
                margin-right: 16upx;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .other {
                font-size: 30upx;
                margin-top: 24upx;
                display: flex;
                align-items: center;
                .right-icon {
                    color: #C2C4CA;
                    font-size: 24upx;
                    height: 24upx;
                    margin-left: 8upx;
                }
            }
            .other-tip {
                font-size: 30upx;
                margin-top: 24upx;
                text-align: center;
                color: #F08336;
            }
            .handle-link {
                color: #636F7C;
                display: flex;
                align-items: center;
            }
        }
        .y-radio {
            width: 38upx;
            height: 38upx;
            border-radius: 50%;
            border: 2upx solid #D0D0D0;
        }
    }
    .remark-card {
        padding: 26upx 32upx!important;
    }
    .remark-wrapper {
        display: flex;
        align-items: center;
        .label {
            font-size: 30upx;
            line-height: 1;
            margin-right: 24upx;
        }
        .input-wrap {
            text-align: right;
        }
        .input {
            &::-webkit-input-placeholder {
                color: #cccccc;
            }
        }
    }
    .coupon-wrap {
        .icon {
            color: #C2C4CA;
        }
        .coupon {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            padding-right: 8upx;
            .tag {
                padding: 4upx 16upx;
                background: #FF6464;
                border-radius: 12upx 0 12upx 0;
                font-size: 24upx;
                color: #FFFFFF;
            }
            .money-wrap {
                display: flex;
                align-items: center;
                color: #FF0000;
                .unit {
                    font-size: 24upx;
                }
                .money {
                    font-size: 30upx;
                }
            }
            .no-card {
                color: #ccc;
            }
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
    }

    .fixed-page-large {
        padding-bottom: 128upx;
        padding-bottom: calc(constant(safe-area-inset-bottom) + 128upx);
        padding-bottom:  calc(env(safe-area-inset-bottom) + 128upx);
    }

    .pay-footer-wrap {
        height: 128upx;
        padding: 24upx 32upx;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        .text {
            flex: 1;
            display: flex;
            align-items: center;
            overflow: hidden;
            .label {
                font-size: 30upx;
                color: #222527;
            }
            .error {
                font-size: 30upx;
                color: #FF0000;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
        .discount-wrap {
            margin-left: 16upx;
            font-size: 28upx;
            color: #FF0000;
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
            &.disabled {
                color: #999999;
                background: #F2F2F2;
            }
        }
    }
    .cu-dialog {
        .card-image {
            width: 50upx;
            height: 50upx;
            border-radius: 5upx;
            overflow: hidden;
            margin-right: 32upx;
            image {
                width: 100%;
                height: 100%;
            }
        }
        
        .card-no {
            padding-right: 24upx;
            color: #636F7C;
        }
    }
</style>
