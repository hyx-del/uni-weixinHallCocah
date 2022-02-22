<template>
    <view class="container page-bg">
        <cu-custom bgColor="bg-white" :isBack="true">
            <block slot="content">成绩单</block>
        </cu-custom>

        <template v-if="reportCardList.length">
            <view class="wrap" v-if="audit == 10">
                <view class="header">
                    <view class="title">
                        <text>{{reportCardList[0].semester_name}}</text>
                    </view>
                </view>

                <view class="tabel">
                    <view class="tab-head">
                        <text>课程</text>
                        <text>成绩</text>
                    </view>
                    <view class="tab-body">
                        <scroll-view :scroll-y='true' style="height:373upx">
                            <view class="list" v-for="(item, index) in reportCardList" :key="index">
                                <text>{{item.course_name}}</text>
                                <text :class="isfail(item) ? 'fail' : ''">{{item.score}}</text>
                            </view>
                        </scroll-view>
                    </view>

                    <view class="tab-footer">
                        <text>综合得分</text>
                        <text>{{total}}</text>
                    </view>
                </view>

                <view class="user" v-if="total >= 60">{{reportCardList[0].student_name}}，恭喜你出色完成所有课程，成为一名正式的瑜伽注册教练！</view>
                <view class="user" v-else>{{reportCardList[0].student_name}}，很遗憾，你的成绩未达标，请继续努力，早日成为一名合格的瑜伽注册教练！</view>

                <view class="look-certificate" v-if="total > 0">
                    <button class="btn" @click="lookCredential">
                        <text>查看证书</text>
                    </button>
                </view>

                <view class="time">毕业时间：{{end_date[0]}}年{{end_date[1]}}月{{end_date[2]}}日</view>
            </view>

            <!-- 暂无成绩单 -->
            <view class="not-result" v-if="audit == -10">
                <image src='../../static/images/robot.png'></image>
                <view class="title">暂无成绩单</view>
                <view class="hint">成绩统计中，请稍后查看</view>
            </view>
        </template>

    </view>
</template>

<script>
export default {
    data() {
        return {
            reportCardList: [],
            total: null,
            end_date: null,
            semester_id: null,
            audit: 10,
        }
    },

    onLoad(option) {
        this.audit = option.audit;
        if (option.audit == 10) {
            this.getreportCard(option.class_id);
        }
    },

    methods: {
        lookCredential() {
            uni.navigateTo({
                url: '/coachPages/coach-train/look-credential/index?semester_id=' + this.semester_id,
            })
        },

        getreportCard(id) {
            this.api.post('school/member/transcript/detail', { class_id: id }).then(res => {
                if (!res.length) {
                    return;
                }

                this.reportCardList = res;
                this.semester_id = res[0].semester_id;
                let total = 0;

                res.forEach(item => {
                    total += parseFloat(item.score);
                });
                this.total = (total / res.length).toFixed(2);
                this.setEndDat();
            })
        },

        isfail(item) {
            return parseFloat(item.score) < 60
        },

        setEndDat() {
            this.end_date = this.reportCardList[0].semester_end_date.split('-');
        }
    }
}
</script>

<style lang="scss">
.wrap {
    flex: 1;
    background-image: url("https://fanyin-oss.fineyoga.com/mini/ebuw7XeW4XsAhIhN008.png");
    background-repeat: no-repeat;
    background-size: 100%;
    background-color: #fff2f0;

    .header {
        margin-top: 48upx;
        display: flex;
        flex-direction: column;
        align-items: center;

        .title {
            max-width: 600upx;
            min-height: 157upx;
            font-size: 48upx;
            font-weight: 600;
            width: 559upx;
            display: flex;
            padding-top: 39upx;
            justify-content: center;
            background-image: url("https://fanyin-oss.fineyoga.com/mini/ebzngvwJ0JCLjEb70Dr.png");
            background-repeat: no-repeat;
            background-size: 100%;

            text {
                color: #222527;
                line-height: 67upx;
                text-align: center;
            }
        }

        .coach {
            margin-top: 52upx;
            font-size: 28upx;
            font-weight: 500;
            color: #484f55;
        }
    }

    .tabel {
        margin-top: 40upx;
        padding: 0 68upx;
        .tab-head {
            padding: 0 12upx;
            display: flex;
            justify-content: space-between;
            font-size: 34upx;
            font-weight: 600;
            color: #222527;
        }

        .tab-body {
            margin: 24upx 0;
            padding: 0 12upx;
            .list {
                display: flex;
                justify-content: space-between;
                font-size: 30upx;
                font-weight: 500;
                color: #222527;
                margin-bottom: 24upx;
                line-height: 42upx;
                .fail {
                    color: rgba(255, 0, 0, 1);
                }
            }
            .list:last-of-type {
                margin-bottom: 0;
            }
        }

        .tab-footer {
            padding: 6upx 12upx;
            background: #f4bdb3;
            color: #222527;
            font-size: 30upx;
            font-weight: 500;
            display: flex;
            justify-content: space-between;
            align-content: center;
            line-height: 42upx;
        }
    }

    .user {
        margin: 40upx 80upx;
        font-size: 30upx;
        font-weight: 400;
        color: #222527;
    }

    .look-certificate {
        display: flex;
        justify-content: center;
        .btn {
            margin: 0;
            padding: 28upx 102upx;
            border-radius: 50upx;
            background: #f4bdb3;
            line-height: 45upx;
            text {
                font-size: 32upx;
                font-weight: 500;
            }
        }

        button::after {
            border: none;
            outline: none;
        }
    }

    .time {
        margin-top: 57upx;
        display: flex;
        justify-content: center;
        font-size: 28upx;
        color: #484f55;
    }
}

.not-result {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    image {
        margin-top: 200upx;
        width: 300upx;
        height: 342upx;
    }

    .title {
        font-size: 40upx;
        margin-top: 80upx;
        font-weight: 500;
        color: #222527;
    }

    .hint {
        font-size: 30upx;
        color: #999999;
        font-weight: 400;
        margin-top: 24upx;
    }
}
</style>