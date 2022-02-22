<template>
    <view class="container page-bg">
        <cu-custom bgColor="bg-white" :isBack="true"><block slot="content">名师培训</block></cu-custom>
        <scroll-view scroll-x class="position-sticky bg-white nav text-center" :style="'top:' + CustomBar + 'px'">
            <view class="cu-item" :class="index==tabIndex?'text-orange cur':''" v-for="(item,index) in tabs" :key="index" @tap="tabSelect" :data-id="index">
                {{ item }}
            </view>
		</scroll-view>
        <view class="list">
            <view class="list__item" v-for="(item, index) in 2" :key="index" :data-index="index" @click="detail">
                <view class="item__image">
                    <image src="https://fanyin-oss.fineyoga.com/mini/teacher1.png" />
                </view>
                <view class="item__info">
                    <view class="title">李靖老师【上海】正位疗理工作坊</view>
                    <view class="info-address">
                        <view class="yicon icon-classroom"></view>
                        <text>FineYoga梵音瑜伽上海区域会馆</text>
                    </view>
                    <view class="info-time">
                         <view class="yicon icon-time"></view>
                        <text>2019/07/19 - 07/23</text>
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
            tabIndex: 0,
            CustomBar: this.CustomBar,
            tabs: ["国际名师", "梵音名师"],
        }
    },
    methods: {
        detail() {

        },
        tabSelect(e) {
            this.tabIndex = e.currentTarget.dataset.id;
        },
        
    }
}
</script>
<style lang="scss">
    .position-sticky {
        position: sticky;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
        border-top: 1px solid #f1f1f1;
    }

    .list {
        padding: 0 32upx;
        padding-top: 32upx;
    }

    .list__item {
        margin-bottom: 32upx;
        background-color: white;
        border-radius: 20upx;
        overflow: hidden;
        .item__image {
            height: 377upx;
            image {
                width: 100%;
                height: 100%;
            }
        }
        .item__info {
            padding: 32upx;
            .title {
                font-size: 34upx;
                color: #222527;
            }
            .info-address , .info-time  {
                font-size: 28upx;
                color: #222527;
                display: flex;
                align-items: center;
                margin-top: 16upx;
            }
            .yicon {
                margin-right: 8upx;
                color: #F08336;
            }
        }
    }
</style>
