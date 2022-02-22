<template>
	<view class="container page-bg">
		<view
			class="cu-bar fixed"
			:style="{
				height: CustomBar + 'px',
				'padding-top': StatusBar + 'px',
				'background-color': '#ffffff',
			}"
		>
			<view class="action" @click="BackIndexPage">
				<text class="cuIcon-back" style="color:block"></text>
			</view>
			<view class="content" :style="{ top: StatusBar + 'px' }">我的教培</view>
		</view>

		<view
			class="wrap"
			:style="{ 'margin-top': CustomBar + 'px' }"
			v-if="isRegister && isLoadSuccess"
		>
			<!-- 头像区域 -->
			<view class="head" @click="skipPersonalDataPage" v-if="user">
				<view class="logo">
					<image :src="user.avatar ? user.avatar : `/static/images/tabbar/revision/avater.png`" />
				</view>
				<view class="rt">
					<view class="user">
						<view class="name">{{ user.name }}</view>
						<view class="credential" @click.stop="skipCredentialPage">
							<image src="/static/images/my-jiaopei.png" />
							{{ user.certificateNum }} 证书
						</view>
					</view>
					<text class="icon cuIcon-right"></text>
				</view>
			</view>

			<!-- 资料是否完善 -->
			<view class="datum" v-if="user.status == -1">
				<view class="title">完善个人资料，以便录入学籍</view>
				<view class="btn" @click="skipPersonalDataPage">去完善</view>
			</view>

			<view class="entrance">
				<view class="myregister" @click="skipOrderPage">
					<image src="../../static/images/dingdan.svg" />
					<text>我的订单</text>
				</view>
				<view class="myorder" @click="skipMySignUpPage">
					<image src="../../static/images/baoming.svg" />
					<text>我的报名</text>
				</view>
			</view>

			<!-- 学期课表 -->
			<view class="semester-timetable">
				<view class="title">
					<text class="semester-name">
						{{
							classScheduleList.length
								? classScheduleList[current].semesterName
								: '我的课表'
						}}
					</text>
					<view
						class="more"
						v-if="classScheduleList.length && classScheduleList[current].semesterId"
						@click="skipCoursePlanPage"
					>
						<text>查看课表</text>
						<text class="icon cuIcon-right"></text>
					</view>
				</view>

				<view class="time-steps" v-if="classScheduleList.length">
					<!-- 多个学期 -->
					<swiper
						class="swiper"
						indicator-dots="true"
						@change="semesterChange($event)"
						indicator-color="rgba(216,216,216,1)"
						indicator-active-color="rgba(240,131,54,1)"
						v-if="classScheduleList.length > 1"
					>
						<swiper-item v-for="(item, index) in classScheduleList" :key="index">
							<view style="margin-top: 30upx;">
								<scroll-view
									scroll-y="true"
									style="height:258upx"
									v-if="item.coursePlanDetailVOList.length"
								>
									<timeline>
										<timelineItem
											v-for="(course, i) in item.coursePlanDetailVOList"
											:key="i"
											:leftTime="course.startTime"
											color="#6C7D91"
										>
											<view class="tripItem">
												<view class="class-name">
													{{ course.courseName }}
												</view>
												<view class="coach-name">
													{{ course.coachName }}
												</view>
											</view>
										</timelineItem>
									</timeline>
								</scroll-view>

								<view
									class="todyclass"
									v-if="!item.coursePlanDetailVOList.length && item.hasCoursePlan"
								>
									<image src="../../static/images/relax.png" />
									<view>今日无课，好好休息吧~</view>
								</view>

								<view class="no-course" v-if="!item.hasCoursePlan">
									<image src="../../static/images/no-course.png" />
									<view>暂无课表~</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
					<!-- 一个学期 -->
					<template v-if="classScheduleList.length == 1">
						<view
							v-for="(item, index) in classScheduleList"
							:key="index"
							class="oneSemester"
						>
							<scroll-view
								scroll-y="true"
								class="scroll"
								v-if="item.coursePlanDetailVOList.length"
							>
								<timeline>
									<timelineItem
										v-for="(course, i) in item.coursePlanDetailVOList"
										:key="i"
										:leftTime="course.start_at"
										color="#6C7D91"
									>
										<view class="tripItem">
											<view class="class-name">{{ course.course_name }}</view>
											<view class="coach-name">{{ course.coach_name }}</view>
										</view>
									</timelineItem>
								</timeline>
							</scroll-view>

							<view
								class="todyclass"
								v-if="!item.coursePlanDetailVOList.length && item.hasCoursePlan"
							>
								<image src="../../static/images/relax.png" />
								<view>今日无课，好好休息吧~</view>
							</view>

							<view class="no-course" v-if="!item.hasCoursePlan">
								<image src="../../static/images/no-course.png" />
								<view>暂无课表~</view>
							</view>
						</view>
					</template>
				</view>

				<view class="no-course" v-if="!classScheduleList.length">
					<view style="margin: 30upx 0;">
						<image src="../../static/images/no-course.png" />
						<view>暂无课表~</view>
					</view>
				</view>
			</view>

			<view class="more-activity">
				<view class="title">
					<text class="title-name">更多报名活动</text>
					<view class="more" @click="skipRegisterListPage">
						<text>查看全部</text>
						<text class="icon cuIcon-right"></text>
					</view>
				</view>

				<view class="list">
					<view
						class="list-item"
						v-for="(item, index) in moreRegister"
						:key="index"
						@click="skipSemesterDetail(item)"
					>
						<image :src="item.coverUrl" />
						<view class="rt-content">
							<view class="semester-name">{{ item.name }}</view>
							<view class="introduction">{{ item.school_name }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 没有报名 -->
		<view v-if="!isRegister" :style="{ 'margin-top': CustomBar + 'px' }" class="no-register">
			<image src="../../static/images/list-empty.png" />
			<view class="title">暂无报名信息</view>
			<view class="prompt">请报名后再来查看我的教培</view>
			<button class="btn" @click="goRegister">
				<view>去报名</view>
			</button>
		</view>
	</view>
</template>

<script>
import timeline from '../../../components/chenbin-timeline/timeLine.vue';
import timelineItem from '../../../components/chenbin-timeline/timelineItem.vue';

import { mapState } from 'vuex';
export default {
	data() {
		return {
			CustomBar: this.CustomBar,
			StatusBar: this.StatusBar,
			user: null,
			moreRegister: [],
			classScheduleList: [],
			isRegister: true,
			isLoadSuccess: false,
			current: 0,
		};
	},

	computed: mapState(['ossPath']),

	components: {
		timeline,
		timelineItem,
	},

	onLoad(option) {
		if (!JSON.parse(option.isRegister)) {
			this.isRegister = JSON.parse(option.isRegister);
		} else {
			Promise.all([this.getuserInfo(), this.getclassSchedule(), this.getMoreRegister()])
				.then(res => {
					this.isLoadSuccess = true;
				})
				.catch(error => {
					uni.showModal({
						title: '错误提示',
						content: '请求错误!',
					});
				});
		}
	},

	onPullDownRefresh() {
		uni.showNavigationBarLoading();
		if (this.isRegister) {
			Promise.all([this.getuserInfo(), this.getMoreRegister(), this.getclassSchedule()]).then(
				res => {
					uni.hideNavigationBarLoading();
					uni.stopPullDownRefresh();
				}
			);
		}
	},

	methods: {
		BackIndexPage() {
			uni.switchTab({
				url: '/pages/index/index',
			});
		},

		skipPersonalDataPage() {
			uni.navigateTo({
				url: '/coachPages/coach-train/personal-data/index',
			});
		},

		semesterChange(event) {
			this.current = event.detail.current;
		},

		getuserInfo() {
			// this.api.post('school/member/information/get-list').then(res => {
			// 	this.user = res;
			// 	this.$store.commit('setCurrentMemberId', res.id || '');
			// });

			this.api.get('/api/school/member/student/detail', {}, { type: 'other' }).then(res => {
				if (res) {
					this.user = res;
					this.$store.commit('setCurrentMemberId', res.id || '');
				}
			});
		},

		getMoreRegister() {
			this.api
				.get('/api/school/semester/open/category/list', { size: 3 }, { type: 'other' })
				.then(res => {
					if (res.records && res.records.length) {
						this.moreRegister = res.records;
					}
				});
		},

		getclassSchedule() {
			// this.api.post('school/member/course-plan/get-list', { status: 1 }).then(res => {
			// 	this.classScheduleList = res;
			// });
			this.api.get('/api/school/course-plan/list-day', null, { type: 'other' }).then(res => {
				this.classScheduleList = res;
			});
		},

		skipOrderPage() {
			uni.navigateTo({
				url: '/coachPages/coach-train/order/index',
			});
		},

		skipMySignUpPage() {
			uni.navigateTo({
				url: '/coachPages/coach-train/my-sign-up/index?genre=' + true,
			});
		},

		skipRegisterListPage() {
			uni.navigateTo({
				url: '/coachPages/coach-train/home/index',
			});
		},

		skipSemesterDetail(item) {
			uni.navigateTo({
				url: '/coachPages/coach-train/home/genre?data=' + JSON.stringify(item),
			});
			// uni.navigateTo({
			// 	url:
			// 		'/coachPages/coach-train/semester-details/index?semester_id=' +
			// 		id +
			// 		'&isSignUp=false',
			// });
		},

		skipCredentialPage() {
			uni.navigateTo({
				url: '/coachPages/coach-train/my-credential/index',
			});
		},

		skipCoursePlanPage() {
			const { semesterId } = this.classScheduleList[this.current];
			uni.navigateTo({
				url: `/coachPages/coach-train/schedule/index?semester_id=${semesterId}`,
			});
		},

		goRegister() {
			uni.navigateTo({
				url: '/coachPages/coach-train/home/index',
			});
		},
	},
};
</script>

<style lang="scss">
.wrap {
	padding: 32upx;
	.head {
		display: flex;
		background: #ffffff;
		border-radius: 20upx;
		padding: 50upx 32upx;
		margin-bottom: 24upx;

		.logo {
			image {
				width: 160upx;
				height: 160upx;
				border-radius: 50%;
			}
		}

		.rt {
			flex: 1;
			margin-left: 32upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.user {
				.name {
					color: #222527;
					font-size: 40upx;
					font-weight: bold;
					line-height: 56upx;
				}

				.credential {
					display: inline-block;
					margin-top: 22upx;
					border-radius: 50upx;
					background: #ff6e2e;
					color: #ffffff;
					font-size: 24upx;
					line-height: 24upx;
					font-weight: 400;
					padding: 12upx 18upx 12upx 55upx;
					text-align: center;
					position: relative;
					image {
						width: 60upx;
						height: 60upx;
						position: absolute;
						top: -7upx;
						left: -14upx;
					}
				}
			}

			.icon {
				color: #c2c4ca;
				font-size: 32upx;
			}
		}
	}

	.datum {
		margin-bottom: 24upx;
		padding: 20upx 32upx;
		border-radius: 20upx;
		background: #ffffff;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.title {
			color: #484f55;
			font-size: 28upx;
			font-weight: 400;
		}

		.btn {
			border: 1upx solid #ff5500;
			padding: 12upx 40upx;
			color: #ff5500;
			font-size: 28upx;
			line-height: 28upx;
			border-radius: 34upx;
		}
	}

	.semester-timetable {
		margin-bottom: 24upx;
		padding: 0 32upx;
		border-radius: 20upx;
		background: #ffffff;
		display: flex;
		flex-direction: column;
		.title {
			flex: 1;
			display: flex;
			justify-content: space-between;
			padding: 24upx 0;
			border-bottom: 1upx solid #cccccc;

			.semester-name {
				color: #222527;
				font-size: 30upx;
				font-weight: bold;
				line-height: 42upx;
			}

			.more {
				color: #798188;
				font-size: 28upx;
				font-weight: 400;
				line-height: 40upx;
			}
		}

		.time-steps {
			.oneSemester {
				height: 320upx;
				padding: 30upx 0;
			}
			.scroll {
				height: 100%;
			}
		}

		.swiper {
			height: 320upx;
		}

		.tripItem {
			.class-name {
				font-size: 30upx;
				color: #222527;
				font-weight: 400;
				line-height: 42upx;
			}

			.coach-name {
				font-size: 24upx;
				font-weight: 400;
				color: #636f7c;
				line-height: 33upx;
				margin-top: 16upx;
			}
		}

		.swiper,
		.oneSemester {
			.todyclass,
			.no-course {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				flex-direction: column;
				align-items: center;
				image {
					width: 129upx;
					height: 180upx;
				}

				view {
					font-size: 30upx;
					color: rgba(153, 153, 153, 1);
					margin-top: 24upx;
					line-height: 42upx;
				}
			}
			.todyclass > image {
				width: 233upx;
			}
		}

		> .no-course {
			height: 320upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			> view {
				height: 100%;
				image {
					width: 129upx;
					height: 180upx;
				}
				view {
					font-size: 30upx;
					color: rgba(153, 153, 153, 1);
					margin-top: 24upx;
					line-height: 42upx;
				}
			}
		}
	}

	.more-activity {
		padding: 0 32upx;
		border-radius: 20upx;
		background: #ffffff;
		display: flex;
		flex-direction: column;
		.title {
			flex: 1;
			display: flex;
			justify-content: space-between;
			padding: 24upx 0;
			border-bottom: 1upx solid #cccccc;

			.title-name {
				color: #222527;
				font-size: 30upx;
				font-weight: bold;
				line-height: 42upx;
			}

			.more {
				color: #798188;
				font-size: 28upx;
				font-weight: 400;
				line-height: 40upx;
			}
		}

		.list {
			.list-item {
				padding: 32upx 0;
				display: flex;
				image {
					width: 240upx;
					height: 120upx;
					border-radius: 12upx;
					background: #cccccc;
				}

				.rt-content {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					margin-left: 24upx;

					.semester-name {
						font-size: 30upx;
						font-weight: 500;
						color: #222527;
						line-height: 42upx;
					}

					.introduction {
						margin-top: 16upx;
						font-size: 24upx;
						color: #636f7c;
						line-height: 33upx;
					}
				}
			}
		}
	}

	.entrance {
		display: flex;
		margin: 24upx 0;

		.myregister,
		.myorder {
			flex: 1;
			display: flex;
			justify-content: center;
			padding: 34upx 65upx 34upx 74upx;
			font-weight: bold;
			color: #222527;
			font-size: 32upx;
			background: #ffffff;
			border-radius: 12upx;
			image {
				height: 45upx;
				width: 40upx;
				margin-right: 22upx;
			}

			text {
				line-height: 45upx;
			}
		}
		.myregister {
			margin-right: 24upx;
		}
	}
}

.no-register {
	flex: 1;
	background: #ffffff;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	image {
		width: 366upx;
		height: 300upx;
	}

	.title {
		font-size: 40upx;
		color: #222527;
		line-height: 56upx;
		font-size: 400;
		margin-top: 80upx;
	}

	.prompt {
		margin-top: 24upx;
		font-size: 30upx;
		font-weight: 400;
		color: #999999;
		line-height: 42upx;
	}

	.btn {
		margin-top: 120upx;
		background: #f08336;
		border-radius: 50upx;
		padding: 28upx 152upx;
		line-height: 45upx;
		border: none;

		view {
			font-size: 32upx;
			color: #ffffff;
		}
	}
}
</style>
