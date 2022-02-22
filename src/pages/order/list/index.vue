<template>
    <view class="container" :class="{'page-bg': isLoading && orderList.length }">
        <cu-custom bgColor="bg-white" :isBack="true"><block slot="content">我的订单</block></cu-custom>
        <view class="order-content" v-if="orderList.length">
            <view class="order-item" v-for="(order) in orderList" :key="order.id">
                <view class="order-info">
                    <view class="left">
                        <view class="yicon icon-order"></view>
                        <view class="name">{{ order.id }}</view>
                        <!-- <view class="yicon icon-shop"></view> -->
                        <view class="cuIcon-right right-icon"></view>
                    </view>
                    <view class="right">{{ order.status ? '已支付' : '未支付' }}</view>
                </view>
                <view class="products">
                    <view class="product-item" @click="productDetail">
                        <view class="product-item__image">
                            <image :src="ossPath + order.thumbnail + ossResize" />
                        </view>
                        <view class="product-item__info">
                            <view class="product-item__name">{{ order.activity.name }}</view>
                            <view class="product-item__price">￥<text class="bold">{{ order.total }}</text></view>
                            <!-- <view class="handle-btn" :data-id="product.id" @click.stop="orderDetail">详情</view> -->
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="no-data" v-else-if="isLoading && !orderList.length">
            <view class="image-wrap">
                <image src="/static/images/no-data.png" mode="widthFix" />
            </view>
            <view class="desc">暂无数据</view>
            <view class="btn-wrap">
                <button class="cu-btn y-btn" @click="backHome">返回首页</button>
            </view>
        </view>
    </view>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            orderList: [],
            ossResize: "?x-oss-process=image/resize,m_fill,w_300,h_300",
            isLoading: false,
        }
    },
    computed: mapState(['memberId', 'ossPath']),
    onLoad() {
        this.getList();
    },
    methods: {
        getList() {
            this.api.get("presell/member/order/list", { member_id: this.memberId }).then(data => {
                (data || []).forEach(item => {
                    if (item.activity && item.activity.images.length) {
                        item.thumbnail = item.activity.images[0];
                    }
                });
                this.orderList = data || [];
                this.isLoading = true;
            })
        },
        orderDetail(event) {
            const { id } = event.target.dataset;
            uni.navigateTo({
                url: "/pages/order/detail/index?id=" + id,
            })
        },
        productDetail() {
            console.log("产品详情");
            
        },
        backHome() {
            uni.switchTab({
                url: "/pages/index/index",
            })
        },
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
        margin-bottom: 24upx;
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
            // background-color: #f1f1f1;
            overflow: hidden;
            image {
                width: 100%;
                height: 100%;
            }
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
    .bold {
        font-weight: bold;
    }
    .no-data {
        padding-top: 204upx;
        padding-bottom: 120upx;
        .image-wrap {
            width: 180upx;
            height: 280upx;
            margin: 0 auto;
            image {
                width: 100%;
                height: 100%;
            }
        }
        .desc {
            margin-top: 60upx;
            font-size: 30upx;
            text-align: center;
            color: #484f55;
            line-height: 42upx;
        }
        .btn-wrap {
            width: 400upx;
            margin: 0 auto;
            margin-top: 64upx;
            .y-btn {
                width: 100%;
                height: 100upx;
                background: #f08336;
                border-radius: 20upx;
                font-size: 32upx;
                color: #ffffff;
            }
        }
    }
</style>
