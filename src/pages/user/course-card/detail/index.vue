<template>
    <view class="container page-bg">
        <cu-custom bgColor="bg-white" :isBack="true"><block slot="content">课程卡详情</block></cu-custom>
        <view class="content-wrapper" v-if="courseCard.id">
            <view class="card">
                <view class="title">{{ courseCard.name }}</view>
                <view class="info-item">
                    <view class="label">类型</view>
                    <view class="value">
                        <text v-if="courseCard.type == 1">次卡</text>
                        <text v-else-if="courseCard.type == 2">期限卡</text>
                    </view>
                </view>
                <view class="info-item" v-if="courseCard.cardNo">
                    <view class="label">卡号</view>
                    <view class="value">{{ courseCard.cardNo }}</view>
                </view>
                <view class="info-item">
                    <view class="label">余额</view>
                    <view class="value">
                        <text v-if="courseCard.type == 1">{{ courseCard.balance }}次</text>
                        <text v-else-if="courseCard.type == 2">{{ courseCard.balance }}天</text>
                    </view>
                </view>
                <view class="info-item">
                    <view class="label">期限</view>
                    <view class="value">
                        <text>{{ courseCard.startDate }}</text>
                        <text style="margin: 0 8upx;">-</text>
                        <text>{{ courseCard.endDate }}</text>
                    </view>
                </view>
                <view class="info-item">
                    <view class="label">简介</view>
                    <view class="value">{{ courseCard.introduction || '' }}</view>
                </view>
                <view class="tag bg1" v-if="courseCard.status == -30">请假中</view>
                <view class="tag bg2" v-else-if="courseCard.status == -10">已停卡</view>
                <view class="tag bg3" v-else-if="courseCard.status == 30">已转卡</view>
                <view class="tag bg3" v-else-if="courseCard.status == -20">已关卡</view>
            </view>
            <view class="card">
                <view class="title">使用说明</view>
                <view class="tip">
                    <view>
                        <text v-if="courseCard.courseType == 1">限团课；</text>
                        <text v-if="courseCard.courseType == 2">限私教课；</text>
                    </view>
                    <view v-if="courseCard.maxCompanion">可同行{{ courseCard.maxCompanion }}人约课；</view>
                    <view v-if="courseCard.maxOrder">可提前预约{{ courseCard.maxOrder }}节课；</view>
                    <view v-if="courseCard.classLimit">
                        <text v-if="courseCard.classLimit.cycle_type == 'day'">每天</text>
                        <text v-else-if="courseCard.classLimit.cycle_type == 'week'">每周</text>
                        <text v-else-if="courseCard.classLimit.cycle_type == 'month'">每月</text>
                        <text>可上</text>
                        <text>{{ courseCard.classLimit.count }}</text>
                        <text>节课；</text>
                    </view>
                    <view v-if="courseCard.timeLimit" class="flex">
                        <text>限预约</text>
                        <view v-if="courseCard.timeLimit.cycle_type == 'day'">
                            <text>每天</text>
                            <text>{{ courseCard.timeLimit.start_time }}</text>
                            <text>-</text>
                            <text>{{ courseCard.timeLimit.end_time }}</text>
                            <text>的课程。</text>
                        </view>
                        <view v-else-if="courseCard.timeLimit.cycle_type == 'week'">
                            <text>每周</text>
                            <text>{{ weeks[courseCard.timeLimit.week_day] }}</text>
                            <text>{{ courseCard.timeLimit.start_time }}</text>
                            <text>-</text>
                            <text>{{ courseCard.timeLimit.end_time }}</text>
                            <text>的课程。</text>
                        </view>
                        <view v-else-if="courseCard.timeLimit.cycle_type == 'month'">
                            <text>每月</text>
                            <text>{{ courseCard.timeLimit.month_day }}号</text>
                            <text>{{ courseCard.timeLimit.start_time }}</text>
                            <text>-</text>
                            <text>{{ courseCard.timeLimit.end_time }}</text>
                            <text>的课程。</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="card">
                <view class="title">适用门店</view>
                <view class="tip">
                    <view v-if="courseCard.generalType == 1">梵音全国任意门店</view>
                    <view v-else-if="courseCard.generalType == 2">{{ courseCard.applicableHall }}下任意门店</view>
                    <view v-else-if="courseCard.generalType == 3">只适用于{{ courseCard.applicableHall }}</view>
                    <view v-else-if="courseCard.generalType == 4">适用于{{ courseCard.applicableHalls }}</view>
                </view>
            </view>
            <view class="btn-wrap">
                <button class="cu-btn bg-primary" @click="skipUseLogPage">查看使用记录</button>
                <button class="cu-btn bg-primary" style="margin-top: 16px;" v-if="courseCard.contract_view_url" @click="preview">预览电子合同</button>
            </view>
        </view>
    </view>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            courseCard: {},
            weeks: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        }
    },
    computed: mapState(['memberId']),
    onLoad(options) {
        // console.log("options", options);
        this.getCourseCardDetail(options);
    },
    methods: {
        getCourseCardDetail(opts = {}) {
            let params = {
                memberCourseCardId: opts.id || this.courseCard.id,
            }
            this.api.get("/api/hall/member/course/card/detail", params,this.$other).then(data => {
                if (data.classLimit) {
                    data.classLimit = JSON.parse(data.classLimit);
                }
                if (data.timeLimit) {
                    data.timeLimit = JSON.parse(data.timeLimit);
                }
                this.courseCard = data || {};
            })
        },
        skipUseLogPage() {
            uni.navigateTo({
                url: "/pages/user/course-card/record/index?id=" + this.courseCard.id + "&type=" + this.courseCard.type
            })
        },
        preview() {
            this.$store.commit("setPreviewUrl", this.courseCard.contract_view_url);
            uni.navigateTo({
                url: "/pages/user/course-card/preview/index",
            })
        }
    },
}
</script>
<style lang="scss">
    .content-wrapper {
        padding: 32upx;
        padding-bottom: 0; 
        color: #222527;  
    }
    .card {
        padding: 32upx;
        margin-bottom: 32upx;
        background: white;
        border-radius: 20upx;
        position: relative;
        .tag {
            position: absolute;
            top: 0;
            right: 62upx;
            font-size: 26upx;
            padding: 8upx 24upx;
            color: white;
            border-radius: 0 0 12upx 12upx;
            &.bg1 {
                background: #48C5B6;
            }
            &.bg2 {
                background: #FF7171;
            }
            &.bg3 {
                background: #CCCCCC;
            }
        }
        .title {
            font-size: 34upx;
            margin-bottom: 24upx;
            font-weight: bold;
        }
        .tip {
            color:#484F55;
            line-height: 50upx;
        }
        .info-item {
            display: flex;
            &:not(:last-child) {
                margin-bottom: 16upx;
            }
            .label {
                color: #636F7C;
                margin-right: 24upx;
            }
            .value {
                flex: 1;
            }
        }
    }
    .flex {
        display: flex;
    }
    .btn-wrap {
        margin-top: 32upx;
        margin-bottom: 48upx;
        display: flex;
        justify-content: center;
        flex-direction: column;
        button {
            width: 400upx;
            margin: 0 auto;
            border-radius: 20upx;
            height: 100upx;
            font-size: 32upx;
        }
        .bg-primary {
            background: #F08336;
            color: white;
        }
    }
</style>