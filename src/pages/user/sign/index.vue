<template>
    <view class="container page-bg">
        <!-- <cu-custom bgColor="bg-white" :isBack="true"><block slot="content">签到</block></cu-custom> -->
        <!-- <view class='cu-custom'>
            <view class="cu-bar fixed" :style="style">
                <view class="action" @click="backPage">
                    <text v-if="isShare" class='cuIcon-homefill'></text>
                    <text v-else class='cuIcon-back'></text>
                </view>
                <view class="content" :style="[{top:StatusBar + 'px'}]">签到</view>
            </view>
        </view> -->

        <cu-custom bgColor="bg-white" :isHome="isShare"><block slot="content">签到</block></cu-custom>


        <view class="coach-info position-sticky" :style="[{top: CustomBar + 'px'}]" v-if="memberName && hallName">
            <view class="flex1">签到人: {{ memberName || ''}}</view>
            <view class="flex1">会馆: {{ hallName || ''}}</view>
        </view>

        <view class="content-wrapper">
            <view class="card course-info" v-for="(order, index) in orderList" :key="order.id" :data-index="index" :data-id="order.id">
                <view class="head-info">
                    <view class="avatar">
                        <image :src="ossPath + order.coach_avatar + ossResize"/>
                    </view>
                    <view class="info">
                        <view class="course-name">{{ order.name }}</view>
                        <view class="user-info" style="margin-bottom: 8upx;">
                            <view class="left">
                                <view class="name">{{ order.coach_name }}</view>
                            </view>
                        </view>
                        <!-- <view v-if="order.status == 1">已完成</view>
                        <view v-else-if="order.status == -1">已取消</view>
                        <view v-else-if="order.status == 2">申请中</view>
                        <view v-else-if="order.status == 0">未完成</view> -->
                    </view>
                </view>
                <view class="tag" :class="order.course_type != 1 ? 'private' : 'team'">{{ courseTypeMap[order.course_type] }}</view>
                <view class="sign-btn" :class="order.can_sign ? '' : 'disabled'" :data-index="index" :data-id="order.id" @tap="signIn">签到</view>
                <view class="info-item">
                    <view class="yicon icon-classroom"></view>
                    <text>{{ order.hall_name }} </text>
                    <text v-if="order.classroom_name">{{ order.classroom_name }}</text>
                </view>
                <view class="info-item">
                    <view class="yicon icon-time"></view>
                    <text>{{ order.date }}</text>
                </view>
            </view>
            <view class="loading-text" v-if="loading">加载中...</view>
            <view class="loading-text" v-if="!loading && !orderList.length">暂无数据</view>
        </view>
    </view>
</template>
<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            CustomBar: this.CustomBar,
            StatusBar: this.StatusBar,
            orderList: [],
            loading: false,
            courseTypeMap: {
                1: "团课",
                2: "私教",
                3: "企业",
            },
            qrcodeId: '',
            isShare: false,
            memberName: "",
            hallName: "",
            ossResize: "?x-oss-process=image/resize,m_fill,w_300,h_300",
        }
    },
    computed: {
        ...mapState(['ossPath', 'memberId', 'isLogin']),
        style() {
            return `
                height:${this.CustomBar}px;
                padding-top:${this.StatusBar}px;
                background-color: rgba(255, 255, 255, 1);
            `
        },
    },
    watch: {
        isLogin (val) {
            if (val) {
                this.getOrderList();
            }
        }
    },
    onLoad(options) {
        this.loading = true;
        let url = decodeURIComponent(options.q);
        let qrcodeId = url.split("=")[1];
        console.log("options", options, qrcodeId);
        if (qrcodeId) {
            this.qrcodeId = qrcodeId;
            this.isShare = true;
        }
        if (options.id) {
            this.qrcodeId = options.id;
            this.isShare = true;
        }
        if (!this.isLogin) {
            this.$store.dispatch("getToken");
        } else {
            this.getOrderList();
        }
    },
    methods: {
        getOrderList() {
            this.loading = true;
            let params = {
                member_id: this.memberId,
                qrcode_id: this.qrcodeId,
            }
            this.api.get("hall/member/member/course-plan-orders/to-sign-list", params).then(data => {
                data.forEach(item => {
                    if (item.course_detail) {
                        item.date = item.course_detail.date + " " + item.course_detail.start_time + "-" + item.course_detail.end_time;
                    }
                });
                if (data && data.length) {
                    this.memberName = data[0].member_name;
                    this.hallName = data[0].hall_name;
                }

                this.orderList = data;
                this.loading = false;
            }).catch(error => {
                this.loading = false;
                if (error && error.message) {
                    uni.showToast({
                        icon: "none",
                        title: error.message,
                    })
                }
            })
        },
        signIn(event) {
            const { id, index } = event.currentTarget.dataset;
            let order = this.orderList[index];
            if (!order.can_sign) {
                return ;
            }
            let params = {
                id: id,
                member_id: this.memberId,
            }
            uni.showModal({
                title: "确认签到？",
                cancelText: "取消",
                confirmText: "确定",
                success: (res) => {
                    if (res.confirm) {
                        this.api.post("hall/course/member/course-plan-order/sign-in", params).then(ret => {
                            uni.redirectTo({
                                url: "/pages/user/sign-result/index"
                            })
                        }).catch(error => {
                            if (error.message) {
                                uni.showToast({
                                    icon: "none",
                                    title: error.message,
                                })
                            }
                        })
                    }
                }
            })
        },
        backPage() {
            uni.reLaunch({
                url: '/pages/index/index'
            })
        },
    }
}
</script>
<style lang="scss">
    .content-wrapper {
        padding: 0 32upx;
        padding-top: 32upx;   
    }
    .position-sticky {
        position: sticky;
        top: 0;
        left: 0;
        width: 100%;
        background-color: white;
        z-index: 10;
    }
    .coach-info {
        display: flex;
        height: 80upx;
        .flex1 {
            flex: 1;
            line-height: 80upx;
            text-align: center;
            padding: 0 16upx;
        }
    }
    .card {
        padding: 32upx;
        margin-bottom: 32upx;
        background: white;
        border-radius: 20upx;
    }
    .course-info {
        position: relative;
        
        .head-info {
            display: flex;
        }
        .avatar {
            width: 132upx;
            height: 132upx;
            border-radius: 8upx;
            margin-right: 24upx;
            overflow: hidden;
            image {
                width: 100%;
                height: 100%;
            }
        }
        .tag {
            &.private {
                background: #9472D8;
            }
            &.team {
                background: #48C5B6;
            }
            position: absolute;
            top: 0;
            right: 32upx;
            width: 72upx;
            height: 36upx;
            font-size: 20upx;
            line-height: 36upx;
            text-align: center;
            border-radius: 0 0 12upx 12upx;
            color: white;
        }
        .info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .course-name {
                font-size: 30upx;
                color: #222527;
                margin-bottom: 16upx;
            }
        }
        .user-info {
            display: flex;
            justify-content: space-between;
            .left {
                display: flex;
                align-items: center;
            }
            .name {
                color: #636F7C;
            }
            .star {
                display: flex;
                margin-left: 8upx;
                color: #FFD000;
                font-size: 20upx;
            }
        }
        .unit-price {
            color: #FF0000;
            font-size: 36upx;
            .unit {
                font-size: 28upx;
            }
        }
        .info-item {
            color: #222527;
            padding-left: 156upx;
            margin-top: 16upx;
            display: flex;
            align-items:center;
            .yicon {
                color: #F08336;
            }
            text {
                margin-left: 8upx;
            }
        }
    }
    .sign-btn {
        position: absolute;
        right: 32upx;
        top: 110upx;
        color: white;
        line-height: 1;
        padding: 16upx 32upx;
        background-color: #F08336;
        border-radius: 8upx;
        &.disabled {
            color: #999999;
            background: #F2F2F2;
        }
    }
    .loading-text {
        text-align: center;
        padding: 16upx;
    }
</style>