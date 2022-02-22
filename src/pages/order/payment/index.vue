<template>
    <view class="container page-bg fixed-page">
        <cu-custom bgColor="bg-white" :isBack="true"><block slot="content">订单结算</block></cu-custom>
        <view class="order-content">
            <view class="order-item">
                <view class="order-info">
                    <view class="left">
                        <view class="yicon icon-shop"></view>
                        <view class="name">FineYoga 梵音瑜伽</view>
                        <view class="cuIcon-right right-icon"></view>
                    </view>
                    <view class="right">已支付</view>
                </view>
                <view class="products">
                    <view class="product-item" v-for="(product) in 2" :key="product">
                        <view class="product-item__image">

                        </view>
                        <view class="product-item__info">
                            <view class="product-item__name">【新店预售】北京22-世贸天阶店</view>
                            <view class="product-item__price">￥200</view>
                            <view class="handle-btn" @click="orderDetail">详情</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        
        <view class="footer">
            <view class="action-wrap">
                <view class="info">
                    <view class="total-price">
                        合计：
                        <text class="total">￥200</text>
                    </view>
                    <view class="total-price-bottom">不含运费</view>
                </view>
                <view class="pay-btn" @click="pay">结算<text v-if="totalAmount">({{ totalAmount }})</text></view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            totalAmount: 0,
        }
    },
    onLoad() {

    },
    methods: {
        orderDetail() {
            uni.navigateTo({
                url: "/pages/order/detail/index?id=" + 1,
            })
        },
        pay() {
            // this.totalAmount++;
            uni.navigateTo({
                url: "/pages/order/pay-result/index?order_id=" + 1,
            })
        }
    }
}
</script>
<style lang="scss">
    .order-content {
        padding: 0 32upx;
        padding-top: 32upx;
    }
    .order-item {
        background-color: white;
        border-radius: 20upx;
        margin-bottom: 32upx;  
    }
    .order-info {
        display: flex;
        padding: 24upx;
        align-items:center;
        .left {
            flex: 1;
            display: flex;
            align-items:center;
        }
        .right {
            font-size: 24upx;
            color: #F08336;
        }
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

    .action-wrap {
        height: 100upx;
        display: flex;
        .info {
            flex: 1;
            padding: 12upx 32upx;
            display: flex;
            flex-direction: column;
        }
        .total-price {

        }
        .total {
            font-size: 30upx;
            color: #FF0000;
        }
        .total-price-bottom {
            font-size: 24upx;
            color: #888;
        }
        .pay-btn {
            width: 265upx;
            height: 100%;
            font-size: 32upx;
            background: #F08336;
            color: white;
            text-align: center;
            line-height: 100upx;
        }
    }
</style>
