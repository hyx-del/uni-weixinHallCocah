<template>
    <view class="container">
        <cu-custom bgColor="bg-white" :isBack="true"><block slot="content">私教预约</block></cu-custom>
        <view class="page-content">
            <view class="form-group">
                <view class="title">场馆</view>
                <picker @change="hallChange" :value="hallIndex" disabled :range="hallList" range-key="name" >
                    <view class="picker">
                        <view class="picker-value" :class="hallIndex>-1 ? '' : 'no-data'">
                            {{hallIndex>-1?hallList[hallIndex].name:'选择场馆'}}
                        </view>
                        <!-- <view class="cuIcon-right right-icon"></view> -->
                    </view>
                </picker>
            </view>
            <view class="form-group">
                <view class="title">教练</view>
                <picker @change="coachChange" :value="coachIndex" :range="coachList" range-key="name">
                    <view class="picker">
                        <view class="picker-value" :class="coachIndex>-1 ? '' : 'no-data'">
                            {{coachIndex>-1?coachList[coachIndex].name:'请选择教练'}}
                        </view>
                        <view class="cuIcon-right right-icon"></view>
                    </view>
                </picker>
            </view>
            <view class="form-group">
                <view class="title">课程</view>
                <picker @change="courseChange" :value="courseIndex" :range="courseList" range-key="name">
                    <view class="picker">
                        <view class="picker-value" :class="courseIndex>-1 ? '' : 'no-data'">
                            {{courseIndex>-1?courseList[courseIndex].name:'请选择课程'}}
                        </view>
                        <view class="cuIcon-right right-icon"></view>
                    </view>
                </picker>
            </view>
            <view class="form-group">
                <view class="title">日期</view>
                <picker mode="date" :value="date" :start="startDate" @change="dateChange">
					<view class="picker">
                        <view class="picker-value" :class="date ? '' : 'no-data'">
                            {{ date ? date : '请选择日期' }}
                        </view>
                        <view class="cuIcon-right right-icon"></view>
					</view>
				</picker>
            </view>
            <view class="form-group">
                <view class="title">开始时间</view>
                <picker mode="time" :value="start_at" :end="end_at" data-type="start" @change="timeChange">
					<view class="picker">
                        <view class="picker-value" :class="start_at ? '' : 'no-data'">
                            {{ start_at ? start_at : '请选择开始时间' }}
                        </view>
                        <view class="cuIcon-right right-icon"></view>
					</view>
				</picker>
            </view>
             <view class="form-group">
                <view class="title">结束时间</view>
                <picker mode="time" :value="end_at" :start="start_at" data-type="end" @change="timeChange">
                    <view class="picker">
                        <view class="picker-value" :class="end_at ? '' : 'no-data'">
                            {{ end_at ? end_at : '请选择结束时间' }}
                        </view>
                        <view class="cuIcon-right right-icon"></view>
					</view>
				</picker>
             </view>
        </view>
        <view class="btns-wrap">
            <button class="cu-btn bg-primary" @tap="confirm">确认预约</button>
        </view>
    </view>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            hallList: [],
            hallIndex: -1,
            courseList: [],
            courseIndex: -1,
            coachList: [],
            coachIndex: -1,
            startDate: '',
            date: '',
            city_id: '',
            hall_id: '',
            start_at: '',
            end_at: '',
            isConfirmBooking: false,
            params: {},
        }
    },
    computed: mapState(['memberId', 'isLogin']),
    watch: {
        memberId() {
            if (this.isConfirmBooking) {
                this.infoCheck();
            }
        }
    },
    onLoad(options) {
        if (options.city_id) {
            this.city_id = options.city_id;
            this.getHallList();
        }
        if (options.hall_id) {
            this.hall_id = options.hall_id;
        }
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        this.startDate = year + '-' + month + '-' + day;
        this.getCourseList();
        this.getCoachList();
    },
    methods: {
        confirm() {
            if (!this.params.course_id) {
                uni.showToast({
                    icon: 'none',
                    title: "请选择课程",
                })
                return ;
            }
            if (!this.params.coach_id) {
                uni.showToast({
                    icon: 'none',
                    title: "请选择教练",
                })
                return ;
            }
            if (!this.date || !this.start_at || !this.end_at) {
                uni.showToast({
                    icon: "none",
                    title: "请选择时间",
                })
                return ;
            }
            if (!this.isLogin) {
                this.isConfirmBooking = true;
                this.$store.dispatch("getToken");
            } else {
                this.infoCheck();
            }
        },
        infoCheck() {
            let params = {
                member_id: this.memberId,
                hall_id: this.hall_id,
                date: this.date,
                start_at: this.start_at,
                end_at: this.end_at,
                course_id: this.params.course_id,
                coach_id: this.params.coach_id,
            }

            let data = Object.assign({}, params);
            this.hallList.forEach((item, index) => {
                if (item.id == data.hall_id) data.hall_name = item.name;
            })
            data.course_name = this.courseList[this.courseIndex].name;
            data.coach_name = this.coachList[this.coachIndex].name;
            uni.setStorageSync("private_data", JSON.stringify(data));
            uni.navigateTo({
                url: "/pages/course/private-booking/index",
            })
            // this.api.post("hall/course/member/course-plan-order/check-and-get-price", params).then(ret => {
            //     if (ret && ret.price) {
            //         data = { ...data, ...ret };
            //     }
            // })
        },
        getHallList(isReset = false) {
            let params = {
                page: 1,
                size: 100,
                city_id: this.city_id,
            }
            this.api.post("hall/index/list", params).then(ret => {
                this.hallList = ret.data || [];
                if (this.hall_id) {
                    this.hallList.forEach((item, index) => {
                        if (item.id == this.hall_id) this.hallIndex = index;
                    })
                }
            })
        },
        getCourseList(coach_id) {
            let params = {
                type: 2, // 私教课
                // size: 100,
            }
            if (coach_id) {
                params.coach_id = coach_id;
            }
            this.api.get("hall/course/index/get-list", params).then(data => {
                if (this.params.course_id) {
                    (data || []).forEach((item, index) => {
                        if (this.params.course_id == item.id) {
                            this.courseIndex = index;
                        }
                    })
                }
                this.courseList = data || [];
            })
        },
        getCoachList(course_id) {
            let params = {
                hall_id: this.hall_id,
                // size: 100,
            }
            if (course_id) {
                params.course_id = course_id;
            }

            this.api.get("hall/course/index/coach/get-list", params).then(data => {
                if (this.params.coach_id) {
                    (data || []).forEach((item, index) => {
                        if (item.id == this.params.coach_id) {
                            this.coachIndex = index;
                        }
                    })
                }
                this.coachList = data || [];
            })
        },
        hallChange(event) {
            this.hallIndex = event.detail.value;
        },
        courseChange(event) {
            this.courseIndex = event.detail.value;
            let course = this.courseList[this.courseIndex];
            this.params.course_id = course.id;
            this.getCoachList(course.id);
        },
        coachChange(event) {
            this.coachIndex = event.detail.value;
            let coach = this.coachList[this.coachIndex];
            this.params.coach_id = coach.id;
            this.getCourseList(coach.id);
        },
        dateChange(event) {
            this.date = event.detail.value;
        },
        timeChange(event) {
            const { type } = event.currentTarget.dataset;
            if (type == 'start') {
                this.start_at = event.detail.value;
            } else {
                this.end_at = event.detail.value;
            }
        }
    }
}
</script>
<style lang="scss">
    .page-content {
        padding: 100upx 82upx 0 32upx;
	}
    .btns-wrap {
        margin-top: 160upx;
        padding: 0 175upx;
        button {
            width: 100%;
            border-radius: 20upx;
            height: 100upx;
            line-height: 1;
            font-size: 32upx;
        }
        .bg-primary {
            background: #F08336;
            color: white;
        }
    }
    .form-group {
        display: flex;
        align-items: center;
        font-size: 30upx;
        margin-bottom: 40upx;
        .title {
            width: 140upx;
            text-align: right;
            // width: 76upx;
            color: #484F55;
            margin-right: 16upx;
        }
        .input-wrap {
            flex: 1;
            position: relative;
        }
        input {
            width: 100%;
            height: 74upx;
            border: 2upx solid #CCCCCC;
            padding: 0 32upx;
            border-radius: 10upx;
        }
        .input-placeholder {
            color: #999999;
        }
        picker {
            flex: 1;
        }
        .picker {
            width: 100%;
            height: 74upx;
            border: 2upx solid #CCCCCC;
            padding: 0 32upx;
            padding-right: 28upx;
            border-radius: 10upx;
            display: flex;
            align-items: center;
            color: #484F55;
            .no-data {
                color: #999999;
            }
            .right-icon {
                color:#C2C4CA;
            }
        }
        .picker-value {
            flex: 1;
        }
    }
</style>