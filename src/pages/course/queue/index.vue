<template>
	<view class="container page-bg fixed-page-large">
		<cu-custom bgColor="bg-white" :isBack="true"><block slot="content">添加排队</block></cu-custom>
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
                    <view class="value" v-if="course.hall_id == 58">{{ course.city_name || '线上' }} {{ course.hall_name }}</view>
                    <view class="value" v-else >{{ course.hall_full_address }}</view>
                </view>
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
                                :value="0"  :disabled="disabled"></radio>
                            </label>
                            <view class="other">
                                <view class="handle-link" @click="showPayModal">
                                    <text>选择其他课程卡</text>
                                    <view class="icon cuIcon-right right-icon"></view>
                                </view>
                            </view>
                        </view>
                        <view class="pay-item" v-else-if="courseCardLoading">
                            <label class="flex justify-between align-center">
                                <view class="image">
                                    <image src="../../../static/images/card/class-card.svg" mode="widthFix" />
                                </view>
                                <view class="label">课程卡</view>
                                <view class="value" style="color: #ccc;">暂无课程卡</view>
                                <view class="y-radio"></view>
                            </label>
                            <view class="other-tip">如需购买课程卡，请联系您的会籍顾问或点击右上角"在线客服"咨询。</view>
                        </view>
                        <view class="pay-item" v-for="(item, index) in defaultPayMode" :key="index">
                            <label class="flex justify-between align-center">
                                <view class="image">
                                    <image :src="item.icon" mode="widthFix" />
                                </view>
                                <view class="label">{{ item.name }}</view>
                                <!-- 这一行是占位 -->
                                <view class="value"></view>
                                <radio class="bg-primary round" :class="payChannelIndex == item.index  ?'checked':''" :checked="payChannelIndex == item.index ?true:false"
                                    :value="item.index" :disabled="disabled"></radio>
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
                <view class="order-info__item">
                    <view class="label">排队人数</view>
                    <view class="number">
                        <view class="yicon icon-minus-circle" @click="onMinus"></view>
                        <view class="total"> 
                            <text>{{ currentNumber }}</text>
                            <text class="unit">/{{ maxNumber }}人</text>
                        </view>
                        <view class="yicon icon-plus-circle" @click="onPlus"></view>
                    </view>
                </view>

                <view class="order-info__item coupon-wrap" v-if="!hasCourseCard">
                    <view class="label">优惠券</view>
                    <view class="value coupon" @click="skipCouponsPage(1)">
                        <view class="no-card" v-if="checkedCardCoupons.length">不可使用优惠券</view>
                        <view class="money-wrap" v-else-if="checkedCoupons.length">
                            <view class="unit">-￥</view>
                            <view class="money">{{ couponTotal }}</view>
                        </view>
                        <view class="tag" v-else-if="couponsList.length">{{ couponsList.length }}张可用</view>
                        <view class="no-card" v-else>无可用优惠券</view>
                    </view>
                    <view class="icon cuIcon-right right-icon"></view>
                </view>

                <view class="order-info__item coupon-wrap">
                    <view class="label">联卡券</view>
                    <view class="value coupon" @click="skipCouponsPage(2)">
                        <view class="no-card" v-if="checkedCoupons.length">不可使用联卡券</view>
                        <view class="money-wrap" v-else-if="checkedCardCoupons.length">
                            <!-- <view class="unit">-￥</view> -->
                            <view class="coupon_name">{{ checkedCardCoupons[0].coupon_name }}</view>
                        </view>
                        <view class="tag" v-else-if="cardCouponList.length">{{ cardCouponList.length }}张可用</view>
                        <view class="no-card" v-else>无可用联卡券</view>
                    </view>
                    <view class="icon cuIcon-right right-icon"></view>
                </view>
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
                    <view class="total" v-if="checkedCardCoupons.length">￥0</view>
                    <view class="total" v-else-if="hasCourseCard">
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
                    // { name: '课程卡', channel: 10, icon: "../../../static/images/card/class-card.svg", },
                    // { name: '余额支付', channel: 20, icon: "../../../static/images/money.svg", index: 1 },
                    // { name: '微信支付', channel: 30, icon: "../../../static/images/card/wechat.svg", index: 2 }
                ],
                maxNumber: 0,
                maxOrder: 3,
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
                hasCourseCard: false,
                errorMessage: '',

                couponTotal: 0,
                checkedCoupons: [],
                couponsList: [],
                pageInit: true,
                courseCardImageNum: 6,
                hasRecharge: false,
                remark: '',
                courseCardLoading: false,
                checkedCardCoupons: [],
                cardCouponList: [],
                disabled: false,
                isCreateOrder: false,
			}
        },
        computed: {
            ...mapState(['memberId', 'openId', 'account', 'appId'])
        },
		onLoad(options) {
            console.log("options", options);
            this.api.get("hall/course/index/course-plan/detail", {id: options.id },this.$other).then(ret => {
                let arr = [];
                if (ret.balance_price || ret.balance_price === 0) {
                    arr.push({ name: '余额支付', channel: 20, icon: "../../../static/images/money.svg", index: 1, });
                }
                if (ret.price || ret.price === 0) {
                    arr.push({ name: '微信支付', channel: 30, icon: "../../../static/images/card/wechat.svg", index: arr.length ? 2 : 1, })
                }
                this.defaultPayMode = arr;
                this.course = ret;
                this.maxNumber = this.maxOrder;
                this.getCourseCardList(options);
            })
            this.getCouponsList();
            this.getCourseCardCouponList();

            if (!this.account.account_id) {
                this.$store.dispatch("getAccountInfo");
            }
        },
        onShow() {
            if (this.hasRecharge) {
                this.hasRecharge = false;
                this.$store.dispatch("getAccountInfo");
            }
            if (this.pageInit) {
                this.pageInit = false;
                return ;
            }
            if (this.checkedCardCoupons.length) { // 有使用联卡券 限制只能预约一个人
                this.maxNumber = 1;
                this.currentNumber = 1;
                this.payChannelIndex = -1;
                this.disabled = true;
            }
            this.priceCalc();
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
                    let imageIndex = 1;
                    options.forEach(item => {
                        item.channel = 10; // 会员卡支付
                        if (imageIndex > this.courseCardImageNum) {
                            imageIndex = 1;
                        }
                        item.image = `../../../static/images/card/card${imageIndex}.svg`;
                        imageIndex++;
                    });

                    // this.paymentModes.unshift(...options);
                    if (!options.length) {
                        this.payChannelIndex = 1;
                        this.hasCourseCard = false;
                    } else {
                        this.hasCourseCard = true;
                    }
                    this.paymentModes = options;
                    this.courseCardLoading = true;

                    this.setOrderMaxNumber();
                    this.priceCalc();
                })
            },
            getCouponsList() {
                let params = {
                    member_id: this.memberId,
                    expired: 0, // 可使用
                    used: 2, // 未使用
                    status: 1, // 已上线
                    use_limit: 1, // 团课
                    type: 1, // 代金券
                    effective: true,
                }
                this.api.get("member/member/coupon/list", params).then(data => {
                    this.couponsList = data || [];;
                })
            },

            getCourseCardCouponList() {
                let params = {
                    member_id: this.memberId,
                    expired: 0, // 可使用
                    used: 2, // 未使用
                    status: 1, // 已上线
                    use_limit: 1, // 团课
                    type: 2, // 联卡券
                }
                this.api.get("member/member/coupon/list", params).then(data => {
                    this.cardCouponList = data || [];;
                })
            },

            skipCouponsPage(type = 1) {
                if (type === 1 && this.checkedCardCoupons.length) { // 已选择联卡券， 不可选择
                    return ;
                } else if (type === 2 && this.checkedCoupons.length) { // 已选择优惠券， 不可选择联卡券
                    return ;
                }
                let ids = [];
                if (type == 1) {
                    ids = this.checkedCoupons.map(item => item.id);
                } else {
                    ids = this.checkedCardCoupons.map(item => item.relation_id)
                }
                let url = "/pages/user/coupons-selected/index?use_limit=1&type=" + type;
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
                    hall_id: this.course.hall_id,
                    course_plan_id: this.course.id,
                    amount: this.currentNumber,
                    member_id: this.memberId,
                };
                if (this.remark) {
                    params.remark = this.remark;
                }
                if (this.checkedCardCoupons.length) {
                    params.payment = {
                        channel: 50, // 联卡券支付
                        coupon: this.checkedCardCoupons[0],
                    }
                    params.extra = { openid: this.openId, app_id: this.appId }
                } else if (this.payChannelIndex == 0) {
                    if (!this.paymentModes.length) {
                        return ;
                    }
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
                this.isCreateOrder = true;

                // 优惠
                params.privileges = this.checkedCoupons || [];

                this.api.post("hall/course/member/course-plan-order/queue", params).then(ret => {
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
                            },
                            complete: () => {
                                this.isCreateOrder = false;
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
            priceCalc(isPayTypeChange = false) {
                let params = {
                    hall_id: this.course.hall_id,
                    course_plan_id: this.course.id,
                    amount: this.currentNumber,
                    member_id: this.memberId,
                }
                if (this.checkedCardCoupons.length) {
                    params.payment = {
                        channel: 50, // 联卡券支付
                        coupon: this.checkedCardCoupons[0],
                    }
                } else if (this.payChannelIndex == 0) {
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
                let url = "/pages/course/result/index?queue=1";
                if (orderId) {
                    url = url + "&orderId=" + orderId;
                }
                uni.navigateTo({
                    url: url,
                })
            },
            toFailPage(message = '') {
                // let url = "/pages/course/result/index?success=" + 0 + "&queue=1";
                // if (message) {
                //     url = url + "&message=" + message; 
                // }
                // uni.navigateTo({
                //     url: url,
                // })
                uni.showModal({
                    title: "排队失败",
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
            remarkChange(event) {
                this.remark = event.detail.value;
            },
            payChannelChange(e) {
                this.payChannelIndex = e.detail.value;
                if (!parseInt(this.payChannelIndex)) {
                    this.checkedCoupons = [];
                }
                this.setOrderMaxNumber();
                this.priceCalc();
            },
            payCardChange(e) {
                this.payType = e.detail.value;
                if (parseInt(this.payChannelIndex)) {
                    this.payChannelIndex = 0;
                }
                this.setOrderMaxNumber();
                this.priceCalc(true);
            },
            setOrderMaxNumber() {
                if (this.checkedCardCoupons.length) { // 有使用联卡券 限制预约人数
                    this.currentNumber = 1;
                    this.maxNumber = 1;
                    return ;
                }
                this.currentNumber = 1;
                let currentPayment = this.paymentModes[this.payType];
                if (parseInt(this.payChannelIndex)) {
                    this.maxNumber = this.maxOrder;
                } else {
                    this.maxNumber = currentPayment.max_companion;
                }
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

    .order-info__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .right-icon {
            color: #C2C4CA;
        }
        .label {
            font-size: 30upx;
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

    .coupon-wrap {
        padding-top: 16upx;
        margin-top: 16upx;
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
                .coupon_name {
                    font-size: 28upx;
                }
            }
            .no-card {
                color: #ccc;
            }
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
