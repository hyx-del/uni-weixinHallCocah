<template>
    <view class="container">
        <cu-custom bgColor="bg-white" :isBack="true"><block slot="content">反馈记录</block></cu-custom>
        <view class="list">
            <view class="list-item" v-for="(log, index) in logs" :key="index">
                <view class="head">
                    <view>{{ log.comment_at }}</view>
                    <view class="name">{{ log.hall }}</view>
                </view>
                <view class="content">{{ log.content }}</view>
                <view class="reply" v-if="log.reply_at">
                    <view class="reply_content">管理员回复：{{ log.reply_content }}</view>
                    <view class="reply_date">{{ log.reply_at }}</view>
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
            logs: [],
        }
    },
    computed: mapState(["memberId"]),
    created() {
        this.getFeedbackLog();
    },
    methods: {
        getFeedbackLog() {
            this.api.get("hall/member/suggestion/list", { member_id: this.memberId }).then(ret => {
                console.log("记录", ret);
                this.logs = ret;
            })
        }
    }
}
</script>
<style lang="scss">
    .list {
        &-item {
            padding: 32upx 48upx;
            .head {
                color: #484F55;
                display: flex;
                justify-content: space-between;
                font-size: 30upx;
                margin-bottom: 24upx;
                .name {
                    text-align: right;
                    flex: 1;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
            }
            .content {
                color: #636F7C;
                margin-bottom: 24upx;
            }
            .reply {
                background: #fafafa;
                border-radius: 8px;
                margin-top: 12upx;
                padding: 24upx;
                position: relative;
                &::before {
                    content: " ";
                    position: absolute;
                    top: -8upx;
                    left: 32upx;
                    width: 16upx;
                    height: 16upx;
                    background: #fafafa;
                    transform: rotate(45deg);
                }
                .reply_content {
                    color: #222527;
                    margin-bottom: 24upx;
                }
                .reply_date {
                    color: rgba(0,0,0,0.35);
                    text-align: right;
                }
            }
        }
    }
</style>