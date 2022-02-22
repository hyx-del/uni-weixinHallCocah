<template>
    <view class="container">
        <cu-custom bgColor="bg-white" :isBack="true"><block slot="content">使用记录</block></cu-custom>
        <view class="list">
            <view class="list_item" v-for="(item, index) in list" :key="index">
                <view class="date">{{ item.createdAt }}</view>
                <view class="info">
                    <view class="left">
                        <text v-if="item.type == 10">购卡</text>
                        <text v-if="item.type == 30">转卡</text>
                        <text v-if="item.type == 40">权益调整</text>
                        <text v-if="item.type == 80">约课</text>
                        <text v-if="item.type == -80">取消约课</text>
                        <text v-if="item.type == 90">排队</text>
                        <text v-if="item.type == -90">取消排队</text>
                    </view>
                    <view class="right" v-if="courseType == 1">
                        <text class="primary" v-if="item.amount > 0">+{{ item.amount }}</text>
                        <text class="blue" v-else-if="item.amount < 0">{{ item.amount }}</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="cu-load loading" v-if="isLoading"></view>
    </view>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            list: [],
            pageIndex: 1,
            haveMore: false,
            courseType: '',
            courseCardId: '',
            isLoading: true,
        }
    },
    computed: mapState(['memberId']),
    onLoad(options) {
        console.log("options", options);
        if (options.type) {
            this.courseType = options.type;
        }
        this.courseCardId = options.id;
        this.getRecordList()
    },
    onReachBottom() {
        if (!this.haveMore) return ;
        this.pageIndex += 1;
        this.getRecordList();
    },
    methods: {
        getRecordList() {
            let params = {
                memberCourseCardId: this.courseCardId,
                current: this.pageIndex,
                size: 20,
            }
            this.isLoading = true;
            this.api.get("/api/hall/member-course-card-log/list", params,this.$other).then(ret => {
                this.list = this.list.concat(ret.records || []);
                this.pageIndex = ret.current;
                if (ret.pages > ret.current) {
                    this.haveMore = true;
                } else {
                    this.haveMore = false;
                }
                this.isLoading = false;
            }).catch(err => {
                this.isLoading = false;
            })
        }
    }
}
</script>
<style lang="scss">
    .list {
        &_item {
            padding: 32upx 48upx;
            .date {
                font-size: 30upx;
                color: #484F55;
                margin-bottom: 24upx;
            }
            .info {
                font-size: 28upx;
                color: #636F7C;
                display: flex;
                justify-content: space-between;
                .primary {
                    color:#F08336;
                }
                .blue {
                    color:#48C5B6;
                }
            }
        }
    }
</style>