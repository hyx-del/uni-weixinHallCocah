<template>
    <view class="container page-bg">
        <cu-custom bgColor="bg-white" :isBack="true"><block slot="content">梵音视频</block></cu-custom>

        <view class="position-sticky" :style="'top:' + CustomBar + 'px'">
            <view class="handle-bar">
                <picker @change="categoryChange" :value="categoryIndex" :range="categorysList" range-key="name">
                    <view class="picker">
                        {{ categoryIndex > -1 ? categorysList[categoryIndex].name || '' : '全部分类' }}
                        <text class="yicon icon-xiala"></text>
                    </view>
                </picker>
                <view class="search-box">
                    <view class="search circle">
                        <view class="search-icon">
                            <icon type="search" color="#999" size="16"></icon>
                        </view>
                        <input type="text" placeholder="搜索视频" v-model="keyword" @confirm="searchVideo" confirm-type='search' />
                    </view>
                </view>
            </view>

            <scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
                <view class="flex text-center">
                    <view class="cu-item flex-sub" :class="index==tabIndex?'active':''" v-for="(item,index) in 3" :key="index" @tap="tabSelect" :data-id="index">
                        Tab{{index}}
                    </view>
                </view>
            </scroll-view>

            <scroll-view scroll-x class="categorys" scroll-with-animation>
                <view class="category-item" :class="{active: groupIndex == index }" v-for="(item, index) in groupList" 
                :key="index" :data-index="index" @click="groupSelect">分类{{ index + 1 }}</view>
            </scroll-view>
        </view>

        <view class="banner-wrap">
            <swiper class="screen-swiper" :autoplay="true" indicator-active-color="white" :circular="true" 
             :indicator-dots="true" indicator-color="rgba(255,255,255,0.6)" :interval="5000" :duration="500" current="0">
                <swiper-item class="banner-item" v-for="(item) in 2" :key="item" @click="bannerHandle">
                    <view class="image-box">
                        <image src="https://fanyin-oss.fineyoga.com/mini/banner.png"></image>
                    </view>
                </swiper-item>
            </swiper>
        </view>

        <view class="video-list">
            <view class="video_item" v-for="(video, index) in videoList" :key="index">
                <view class="video-cover">
                    <view class="play-btn" @click="playVideo"></view>
                </view>
                <view class="video-info">
                    <view class="video-name">Sherri实用流瑜伽26</view>
                    <view class="video-other">
                        <view class="date">
                            <text>上传时间：</text>
                            <text>2019-10-10</text>
                        </view>
                        <view class="duration">72分钟</view>
                    </view>
                </view>
            </view>
        </view>

    </view>
</template>
<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            CustomBar: this.CustomBar,
            keyword: '',
            videoList: [{}, {}, {}],
            categoryIndex: 0,
            categorysList: [{ name: "全部分类" }, { name: "分类1" }],
            tabIndex: 0,
            scrollLeft: 0,
            groupList: [],
            groupIndex: 0,
            pageIndex: 1,
        }
    },
    computed: mapState(['ossPath']),
    onLoad() {
        for (let index = 0; index < 10; index++) {
            this.groupList.push(index);
        }
        this.getList();
    },
    methods: {
        getList(isSearch = false) {
            let params = {
                page: isSearch ? 1 : this.pageIndex,
            }
            if (this.keyword) {
                params.keyword = this.keyword;
            }
            // if (this.groupList.length) {
            //     params.category_id = 
            // }
            console.log("params", params);
        },
        playVideo() {
            console.log("play video");
        },
        categoryChange(event) {
            this.categoryIndex = event.detail.value;
            console.log("categoryChange");
        },
        searchVideo() {
            console.log("keyword===>", this.keyword);
        },
        tabSelect(e) {
            this.tabIndex = e.currentTarget.dataset.id;
            this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
            console.log("tab Change");
        },
        groupSelect(event) {
            const { index } = event.currentTarget.dataset;
            this.groupIndex = index;
            console.log("group change==>groupIndex", this.groupIndex);
        },
        bannerHandle() {
            console.log("banner handle");
        }
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
        background-color: white;
    }
    .handle-bar {
        display: flex;
        padding: 16upx 32upx;
        background-color: white;
        .picker {
            height: 60upx;
            display: flex;
            align-items: center;
            font-size: 30upx;
            color: #484F55;
            .yicon {
                margin-left: 8upx;
            }
        }
    }
    .search-box {
        flex: 1;
        margin-left: 16upx;
        // width: 100%;
        z-index: 12;
        box-sizing: border-box;
        background-color: white;
        
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
    .cu-item.active {
        position: relative;
        color: #F08336;
        // border-bottom: 4upx solid;
    }
    .cu-item.active::after {
        content: " ";
        position: absolute;
        width: 32upx;
        height: 4upx;
        border-radius: 2upx;
        left: 50%;
        bottom: 10upx;
        transform: translateX(-16upx);
        background-color: #F08336;

    }
    .categorys {
        white-space: nowrap;
        padding: 20upx 0;
        background-color: white;
        .category-item {
            display: inline-block;
            padding: 8upx 30upx;
            border-radius: 24upx;
            overflow: hidden;
            font-size: 24upx;
            color: #888888;
            background: #F7F7F7;
            margin-right: 24upx;
            &:first-child {
                margin-left: 32upx;
            }
            &.active {
                background: rgba(240,131,54,0.10);
                color: #F08336;
            }
        }
    }

    .banner-wrap {
        // padding: 32upx;
        // padding-bottom: 0;
        padding-top: 32upx;
        .screen-swiper {
            min-height: 260upx;
        }
        .banner-item {
            padding: 0 32upx;
            width: calc(100% - 64upx)!important;
            .image-box {
                border-radius: 20upx;
                height: 100%;
                overflow: hidden;
            }
        }
    }


    .video-list {
        padding: 0 32upx;
        padding-top: 32upx;
    }
    .video_item {
        margin-bottom: 32upx;
        border-radius: 20upx;
        background-color: white;
        overflow: hidden;
        .video-cover {
            height: 384upx;
            background: #ddd;
            position: relative;
            .play-btn {
                width: 86upx;
                height: 86upx;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                background-color: white;
                transform: translate(-43upx, -43upx);
            }
        }
        .video-info {
            padding: 32upx;
            padding-top: 24upx;
            .video-name {
                font-size: 34upx;
                color: #222527;
                margin-bottom: 16upx;
            }
            .video-other {
                display: flex;
                justify-content: space-between;
                color: #666666;
            }
        }
    }


</style>