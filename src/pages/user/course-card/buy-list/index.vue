<template>
    <view class="container page-bg">
        <cu-custom bgColor="bg-white" :isBack="true"><block slot="content">购卡</block></cu-custom>
        <view class="card-list">
            <view class="card-item" v-for="(card, index) in courseCardList" :key="index" 
            :data-id="card.id" :data-index="index" @click="courseCardDetail">
                <view class="card-item-wrap">
                    <view class="logo"></view>
                    <view class="card-info">
                        <view class="name">{{ card.name }}</view>
                        <view class="card-no">{{ card.card_no || '' }}</view>
                    </view>
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
            courseCardList: [],
            disabledCourseCardList: [],
            isLoadingComplete: false,
        }
    },
    computed: mapState(['memberId']),
    onLoad() {
        this.getCourseCardList();
    },
    onPullDownRefresh() {
        uni.showNavigationBarLoading();
        this.getCourseCardList();
    },
    methods: {
        getCourseCardList() {
            let params = {
                // member_id: this.memberId,
                type: 1, // 1->次卡 2->期限卡
                online: true, // 线上
            }
            this.api.post("hall/member/member/course-card/online-list", params).then(data => {
                console.log("data===>", data);
                this.courseCardList = data;
                this.isLoadingComplete = true;
                
                uni.hideNavigationBarLoading();
                uni.stopPullDownRefresh();
            })
        },
        courseCardDetail(event) {
            const { id, index } = event.currentTarget.dataset;
            let type = this.courseCardList[index].type;
            uni.navigateTo({
                url: "/pages/user/course-card/detail/index?id=" + id,
            })
        },
        nowPurchase() {
            console.log("购卡");
        },
        skipCloseCardPage() {
            uni.navigateTo({
                url: "/pages/user/course-card/close-card/index",
            })
        }
    }
}
</script>
<style lang="scss">
    .card-list {
        padding: 0 32upx;
        padding-top: 32upx;
    }
    .card-item {
        height: 344upx;
        padding: 32upx;
        margin-bottom: 32upx;
        background: #3B3B3B;
        border-radius: 20upx;
        color: white;
        display: flex;
        &-wrap {
            width: 100%;
            height: 100%;
            position: relative;
            background-image: url("../../../../static/images/biglogo.png");
            background-position: right 0upx bottom 40upx;
            background-repeat: no-repeat;
            background-size: 265upx;
            display: flex;
            position: relative;
        }
        .logo {
            width: 80upx;
            height: 80upx;
            overflow: hidden;
            border-radius: 50%;
            margin-right: 24upx;
            background-image: url("../../../../static/images/card-logo.png");
            background-repeat: no-repeat;
            background-size: 100%;
            image {
                width: 100%;
                height: 100%;
            }
        }
        .card-info {
            flex: 1;
            .name {
                font-size: 30upx;
            }
            .desc {
                font-size: 24upx;
                color: rgba(255, 255, 255, 0.5);
                margin-top: 4upx;
            }
            .card-no {
                font-size: 30upx;
                margin-top: 40upx;
                text-shadow: 0 2px 4px rgba( #000000, 0.5);
                letter-spacing: 1px;
            }
        }
    }
</style>
