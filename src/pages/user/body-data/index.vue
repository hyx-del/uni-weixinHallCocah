<template>
    <view class="container" :class="{'page-bg': isLoaded && bodyData.length }">
        <cu-custom bgColor="bg-white" :isBack="true"><block slot="content">体测数据</block></cu-custom>

        <view class="page-content" v-if="isLoaded && bodyData.length">
            <view class="news">最新记录：{{ latestTime }}</view>
            <view class="list">

            </view>
            <view class="cell" hover-class="cell--hover" hover-stay-time="70" v-for="item in bodyData" :key="item.id">
                <!-- <view class="cell__left-icon">
                    <image src="/static/images/weight.png" />
                </view> -->
                <view class="cell__title">{{ item.name }}</view>
                <view class="cell__value">
                    <text>{{ item.value ? item.value : '--' }}</text>
                    <text v-if="item.unit && item.value" style="margin-left: 4px;">{{ item.unit }}</text>
                </view>
            </view>
        </view>
        <view class="no-data"  v-else-if="isLoaded && !bodyData.length">
            <view class="image-wrap">
                <image src="/static/images/no-data.png" mode="widthFix" />
            </view>
            <view class="desc">暂无体测数据</view>
            <view class="btn-wrap">
                <button class="cu-btn y-btn" @click="backHome">返回首页</button>
            </view>
        </view>

        <!-- <view class="cell" @click="jumpToWeight" hover-class="cell--hover" hover-stay-time="70">
            <view class="cell__left-icon">
                <image src="/static/images/height.svg" />
            </view>
            <view class="cell__title">身高</view>
            <view class="cell__value">168 cm</view>
        </view>
        <view class="cell" @click="jumpToWeight" hover-class="cell--hover" hover-stay-time="70">
            <view class="cell__left-icon">
                <image src="/static/images/bmi.png" />
            </view>
            <view class="cell__title">BMI</view>
            <view class="cell__value">20.5</view>
        </view>
        <view class="cell" @click="jumpToWeight" hover-class="cell--hover" hover-stay-time="70">
            <view class="cell__left-icon">
                <image src="/static/images/xiongwei.png" />
            </view>
            <view class="cell__title">胸围</view>
            <view class="cell__value">--</view>
        </view>
        <view class="cell" @click="jumpToWeight" hover-class="cell--hover" hover-stay-time="70">
            <view class="cell__left-icon">
                <image src="/static/images/yaowei.png" />
            </view>
            <view class="cell__title">腰围</view>
            <view class="cell__value">--</view>
        </view> -->
        <!-- <view class="cell" @click="jumpToWeight" hover-class="cell--hover" hover-stay-time="70">
            <view class="cell__left-icon">
                <image src="/static/images/tunwei.svg" />
            </view>
            <view class="cell__title">臀围</view>
            <view class="cell__value">--</view>
            <view class="cell__right-icon">
                <view class="cuIcon-right right-icon"></view>
            </view>
        </view> -->
    </view>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            latestTime: '',
            bodyData: [],
            isLoaded: false,
        }
    },
    computed: mapState(['memberId']),
    onLoad() {
        this.getBodyData();
    },
    methods: {
        getBodyData() {
            // this.api.post("hall/member/member/body-indicator/current", { member_id: this.memberId }).then(ret => {
            //     if (ret.indicator_date) {
            //         this.latestTime = ret.indicator_date;
            //         this.bodyData = ret.indicator_data;
            //     }
            //     this.isLoaded = true;
            // })
        },
        jumpToWeight() {
            console.log("weight");
        },
        backHome() {
            uni.switchTab({
                url: "/pages/index/index",
            })
        }
    }
}
</script>
<style lang="scss">
    .news {
        height: 80upx;
        text-align: center;
        line-height: 80upx;
        color: #4A4D62;
        background-color: white;
    }
    .list {
        padding-top: 32upx;
    }
    .cell {
        display: flex;
        background-color: white;
        padding: 40upx 32upx;
        align-items: center;
        position: relative;
        &:not(:last-child)::after {
            position: absolute;
            content: ' ';
            pointer-events: none;
            right: 0;
            bottom: 0;
            left: 30upx;
            border-bottom: 1px solid #E5E5E5;;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
        }

        &__title {
            font-size: 32upx;
            color: #222527;
            flex: 1;
            line-height: 1;
        }
        &__value {
            flex: 1;
            text-align: right;
            font-size: 36upx;
            line-height: 1;
            color: #222527;
        }
        &__left-icon {
            width: 44upx;
            height: 44upx;
            margin-right: 16upx;
            image {
                width: 100%;
                height: 100%;
            }
        }
        &__right-icon {
            margin-left: 16upx;
        }

        &__left-icon, &__right-icon {

        }
    }
    
    .cell--hover {
        background-color: #e8e8e8;
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
