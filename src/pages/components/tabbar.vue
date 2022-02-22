<template>
    <view class="tab-bar">
        <view class="tab-bar-border"></view>
        <view class="tab-bar-item" v-for="(item, index) in list" :key="index" :data-path="item.pagePath" :data-index="index" @tap="switchTab">
            <image :class="{large: index === 2}" :src="selected === index ? item.selectedIconPath : item.iconPath"></image>
            <view class="text" :style="{color: selected === index ? selectedColor : color}">{{ item.text }}</view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            "backgroundColor": "#ffffff",
            "color": "#636F7C",
            "selectedColor": "#F08336",
            "list": [
                {
                    "pagePath": "/pages/index/index",
                    "iconPath": "/static/images/tabbar/home.png",
                    "selectedIconPath": "/static/images/tabbar/home-selected.png",
                    "text": "首页"
                },
                {
                    "pagePath": "/pages/news/index",
                    "iconPath": "/static/images/tabbar/news.png",
                    "selectedIconPath": "/static/images/tabbar/news-selected.png",
                    "text": "资讯"
                },
                {
                    "pagePath": "/pages/reservation/index",
                    "iconPath": "/static/images/tabbar/fine.png",
                    "selectedIconPath": "/static/images/tabbar/reservation.png"
                },
                {
                    "pagePath": "/pages/shop/index",
                    "iconPath": "/static/images/tabbar/shop.png",
                    "selectedIconPath": "/static/images/tabbar/shop-selected.png",
                    "text": "商城"
                },
                {
                    "pagePath": "/pages/user/home/index",
                    "iconPath": "/static/images/tabbar/mine.png",
                    "selectedIconPath": "/static/images/tabbar/mine-selected.png",
                    "text": "我的"
                }

            ]
        }
    },
    computed: {
        selected(){
            return this.$store.state.nowPageIndex;
        },
    },
    methods: {
        switchTab(event) {
            const data = event.currentTarget.dataset
			this.$store.commit("changePage", parseInt(data.index));
        }
    }

}
</script>
<style lang="scss">
    .tab-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 48px;
        background: white;
        display: flex;
        padding-bottom: env(safe-area-inset-bottom);
        &-border {
            background-color: rgba(0, 0, 0, 0.33);
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 1px;
            transform: scaleY(0.5);
        }
        &-item {
            flex: 1;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;  
            image {
                width: 27px;
                height: 27px;
            }
            image.large {
                width: 34px;
                height: 34px;
            }
            .text {
                font-size: 10px;   
            }
        }
    }


</style>