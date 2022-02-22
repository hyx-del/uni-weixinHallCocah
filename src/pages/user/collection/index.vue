<template>
    <view class="container">
        <cu-custom bgColor="bg-white" :isBack="true"><block slot="content">我的收藏</block></cu-custom>
        <view class="no-data">
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
            CustomBar: this.CustomBar,
            keyword: '',
            list: [
                { title: "【新店预售】北京22-世贸天阶店开始预售啦！", img: '' },
                { title: "FineYoga 梵音用教学征服了大上海瑜伽会员", },
                // { title: "饶校长分享关于财富，感情，健康，人际关系的烦恼", },
            ]
        }
    },
    computed: mapState(['ossPath']),
    onLoad() {

    },
    methods: {
        articleDetail(event) {
            let index = event.currentTarget.dataset.index;
            let type = (index > 1 ? 1 : 2);
            uni.navigateTo({
                url: "/pages/news/detail/index?id=1&type=" + type,
            })
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
   .search-box {
        width: 100%;
        z-index: 12;
        box-sizing: border-box;
        padding: 16upx 32upx;
        background-color: white;
        &.position-sticky {
            position: sticky;
            top: 0;
            left: 0;
            width: 100%;
        }
        input {
            margin-left: 20upx; 
            background-color: transparent;
            color: #000;
            flex: 1;
        }
        .search {
            height: 60upx;
            display: flex;
            flex-direction: row;
            align-items: center;
            color: #999;
            background: #F5F5F5;
            border-radius: 40upx;
        }
        .search-icon {
            margin-left: 24upx;
            width: 34upx;
            height: 34upx;
            display: inline-block;
        }
    }

    .article-list {
        padding: 0 32upx;
        padding-top: 32upx;
    }

    .article-item {
        margin-bottom: 32upx;
        background-color: white;
        border-radius: 20upx;
        overflow: hidden;
        .image-box {
            height: 377upx;
            background-color: #f1f1f1;
            image {
                width: 100%;
                height: 100%;
            }
        }
        .article-info {
            padding: 32upx;
            .title {
                font-size: 34upx;
                color: #222527;
            }
        }
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