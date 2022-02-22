<template>
    <view class="container page-bg">
		<cu-custom bgColor="nav-bg" :isBack="true"><block slot="content">订单详情</block></cu-custom>
        <view class="padding nav-bg">
            已支付
        </view>
        <view class="content-wrap">
            <view class="card card--order">
                <!-- <view class="shop-info" @click="shopDetail">
                    <view class="yicon icon-shop"></view>
                    <view class="name">FineYoga 梵音瑜伽</view>
                    <view class="cuIcon-right right-icon"></view>
                </view> -->
                <view class="product-item" v-for="(product) in 1" :key="product">
                    <view class="product-item__image">

                    </view>
                    <view class="product-item__info">
                        <view class="product-item__name">【新店预售】北京22-世贸天阶店</view>
                        <view class="product-item__price">￥200</view>
                        <view class="handle-btn" @click="refund">退款</view>
                    </view>
                </view>
            </view>

            <view class="card">
                <view class="info-item">
                    <view class="label">报名人数</view>
                    <view class="value">1</view>
                </view>
                <view class="info-item">
                    <view class="label">单价</view>
                    <view class="value">￥200</view>
                </view>
                <view class="info-item total">
                    <view>合计</view>
                    <view class="red">￥200</view>
                </view>
            </view>

            <view class="card">
                <view class="info-item">
                    <view class="label">订单编号</view>
                    <view class="value" style="display: flex;">
                        2019061750059072
                        <view class="copy-no" @click="copyNo">复制</view>
                    </view>
                </view>
                <view class="info-item">
                    <view class="label">下单时间</view>
                    <view class="value">2019-06-17 11:30</view>
                </view>
                <view class="info-item">
                    <view class="label">付款时间</view>
                    <view class="value">2019-06-17 11:31</view>
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
            order: {},
            orderId: '',
        }
    },
    computed: mapState(["memberId"]),

    onLoad(options) {
        this.orderId = options.id;
        this.api.get("mix/presell/member/order/detail", { member_id: this.memberId, id: options.id }).then(ret => {
            console.log("订单", ret);
            this.order = ret;
        })
    },
    methods: {
        shopDetail() {
            console.log("shopDetail");
            
        },
        refund() {
            console.log("退款");
        },
        copyNo() {
            uni.setClipboardData({
                data: '2019061750059072',
                success (res) {
                    uni.getClipboardData({
                        success (res) {
                            console.log("getClipboardData", res.data) // data
                        }
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss">
    .nav-bg {
        background-color: #F08336;
        color: white;
    }
    .padding {
        height: 144upx;
        padding: 0 32upx;
        font-size: 48upx;
        line-height: 1;
    }
    .content-wrap {
        padding: 0 32upx;
        margin-top: -40upx;
    }
    .card {
        padding: 32upx;
        background: #FFFFFF;
        border-radius: 20upx;
        margin-bottom: 32upx;
        &--order {
            padding: 0;
            padding-top: 24upx;
        }
        .info-item {
            display: flex;
            justify-content: space-between;
            &:not(:last-child) {
                margin-bottom: 16upx;
            }
            &.total {
                font-size: 36upx;
                line-height: 1;
            }
            .red {
                color: #FF0000;
            }
            .label {
                color: #636F7C;
            }
            .value {
                color: #222527;
            }
            .copy-no {
                padding-left: 16upx;
                color: #F08336;
                font-size: 24upx;
            }
        }
    }
    .shop-info {
        display: flex;
        padding: 24upx;
        align-items:center;
        .name {
            margin: 0 16upx;
        }
    }
    .product-item {
        display: flex;
        padding: 0 24upx;
        padding-bottom: 24upx;
        &__image {
            width: 180upx;
            height: 180upx;
            margin-right: 24upx;
            border-radius: 8upx;
            background-color: #cccccc;
            overflow: hidden;
        }
        &__info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
        }
        &__name {
            color: #222527;
            word-break: break-all;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
        }
        &__price {
            color: #FF0000;
        }
        .handle-btn {
            padding: 8upx 24upx;
            font-size: 24upx;
            color: #636F7C;
            border: 1px solid #999999;
            border-radius: 8upx;
            position: absolute;
            right: 0;
            bottom: 0;
        }
    }
</style>
