<template>
	<view class="container page-bg">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="content">我的课表</block>
		</cu-custom>

		<view class="wrap" v-if="itemWidth">
			<view class="header" :style="'top:' + CustomBar + 'px'">
				<view class="title">
					<view class="picker">
						{{ coursePlanList[index].semesterName }}
					</view>
				</view>

				<view class="operation">
					<view class="left-wrap">
						<view class="preWeek" @click="getPreWeek">
							{{ planData.lastDate ? '上一周' : '' }}
						</view>
						<view class="today" @click="getCurrentWeek()" v-if="isToday">今天</view>
					</view>
					<view class="week">第 {{ planData.weekNum || 0 }} 周</view>
					<view class="nextWeek" @click="getNextWeek">
						{{ planData.nextDate ? '下一周' : '' }}
					</view>
				</view>

				<view class="tab">
					<scroll-view
						:scroll-x="true"
						:scroll-with-animation="true"
						:scroll-left="scrollX"
					>
						<view class="scroll-wrap" :style="'width:' + maxWidth + 'px'">
							<view
								class="nav"
								v-for="(item, index) in weeksList"
								:key="index"
								@click="switchTap(index)"
								:style="'width:' + itemWidth + 'px'"
							>
								<view :class="['dateTime', item.isActive ? 'active-time' : '']">
									<view class="week">{{ item.name }}</view>
									<view class="date">{{ item.months }}/{{ item.date }}</view>
								</view>
							</view>
						</view>
						<scroll-view
							:scroll-y="true"
							:style="{ height: setHeight, width: maxWidth + 'px' }"
						>
							<view class="tabel-body" :style="'width:' + maxWidth + 'px'">
								<view class="tr" v-for="(row, index) in row" :key="index">
									<view
										class="td"
										v-for="item in weeksList"
										:key="item.name"
										:style="'width:' + itemWidth + 'px'"
									>
										<view class="item-td" v-if="item.list[index]">
											<view class="time">
												{{ item.list[index].startTime.slice(0, -3) }}-{{
													item.list[index].endTime.slice(0, -3)
												}}
											</view>
											<view class="class-name">
												{{ item.list[index].courseName }}
											</view>
											<view class="coach-name">
												{{ item.list[index].coachName }}
											</view>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			CustomBar: this.CustomBar,
			weekNum: 0,
			weeksList: [
				{ name: '周一', list: [], isActive: false },
				{ name: '周二', list: [], isActive: false },
				{ name: '周三', list: [], isActive: false },
				{ name: '周四', list: [], isActive: false },
				{ name: '周五', list: [], isActive: false },
				{ name: '周六', list: [], isActive: false },
				{ name: '周日', list: [], isActive: false },
			],
			semester_id: '',
			semesterList: [],
			coursePlanList: [],
			itemWidth: 0,
			scrollX: 0,
			maxWidth: 0,
			isToday: false,
			todayDate: this.getWeekDate().text,
			currentTime: null,
			start_time: null,
			end_time: null,
			row: [],
			index: 0,
			isLoading: true,
			// 总数据
			planData: {},
			// 请求参数
			params: {},
		};
	},

	onLoad(option) {
		let screenWidth = uni.getSystemInfoSync().windowWidth; // 获取手机屏幕的宽度
		this.itemWidth = screenWidth / 4; // 计算显示每个item的宽度
		this.maxWidth = this.itemWidth * this.weeksList.length; // 计算页面的最大宽度
		this.semester_id = option.semester_id;
		this.getCurrentWeek(); // 获取当前周的日期
		this.currenActivePosition(); // 页面加载时计算选中的位置
		// 赋值请求参数
		this.params = {
			semesterId: option.semester_id,
		};
	},
	computed: {
		setHeight() {
			const headerHeight = this.CustomBar * 2 + (100 + 16 * 2 + 42 + 8 * 2 + 12);
			return `calc(100vh - ${headerHeight}rpx)`;
		},
	},
	watch: {
		params() {
			// 参数变了重新请求数据
			this.getCoursePlanList();
		},
	},
	methods: {
		getIndex(semesterId) {
			// 页面初始化时，选中当前学期
			this.coursePlanList.forEach((item, index) => {
				item.semester_id == semesterId ? (this.index = index) : '';
			});
			this.setWeekdata(this.index);
		},

		currenActivePosition() {
			// 设置页面初始化时，当前选中的位置
			this.weeksList.forEach((item, index) => {
				item.dateTime == this.currentTime ? this.switchTap(index) : '';
			});
		},

		/**
		 * 设置导航滚动的距离
		 * index 当前选中的导航的下标
		 */
		switchTap(index) {
			let maxScrollx = (this.weeksList.length + 1) * this.itemWidth; // 最大的移动位置
			let scrollX = this.itemWidth * index - this.itemWidth;

			if (scrollX < 0) {
				scrollX = 0;
			} else if (scrollX >= maxScrollx) {
				scrollX = maxScrollx;
			}

			this.scrollX = scrollX;
			this.changActiveStatus(index);
		},

		changActiveStatus(index) {
			// 导航点击背景切换
			if (this.weeksList[index].dateTime != this.todayDate) {
				this.isToday = true;
			} else {
				this.isToday = false;
			}

			this.weeksList.forEach((item, i) => {
				item.isActive = false;
				if (i == index) {
					item.isActive = true;
				}
			});
		},

		getCurrentWeek() {
			// 当前周
			this.isToday = false;
			this.currentTime = this.getWeekDate().text;
			this.currenActivePosition();
			this.setDateTime(this.getWeekDate().text);
			// 赋值当前时间
			this.params = {
				...this.params,
				startDate: this.getWeekDate().text,
			};
		},

		getNextWeek() {
			// 下一周
			if (this.planData.nextDate) {
				this.setDateTime(this.planData.nextDate);
				this.isToday = true;
				// 赋值下一周的开始时间
				this.params = {
					...this.params,
					startDate: this.planData.nextDate,
				};
			}
		},

		getPreWeek() {
			if (this.planData.lastDate) {
				// 设置时间
				this.setDateTime(this.planData.lastDate);
				// 上一周
				this.isToday = true;
				// 赋值上一周一周的开始时间
				this.params = {
					...this.params,
					startDate: this.planData.lastDate,
				};
			}
		},

		setDateTime(startTime) {
			console.log(new Date().getDate(), '开始时间啊');
			this.weeksList = this.weeksList.map((item, index) => {
				return { ...item, ...this.getWeekDate(startTime, index) };
			});
			console.log(this.weeksList, '第一次');
		},
		getWeekDate(startTime, index = 0) {
			// 重新计算时间
			let newTime = null;
			if (startTime) {
				newTime = Date.parse(new Date(startTime)) + 1000 * 60 * 60 * 24 * index;
			}
			let date = new Date();
			if (newTime) {
				date = new Date(newTime); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
			}
			const years = date.getFullYear();
			const months =
				date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
			const day = date.getDate() + index < 10 ? '0' + date.getDate() : date.getDate();
			return {
				years,
				months,
				date: day,
				name: '周' + '日一二三四五六'.charAt(date.getDay()),
				text: `${years}-${months}-${day}`,
			};
		},

		getCoursePlanList() {
			this.api
				.get('/api/school/course-plan/list', this.params, { type: 'other' })
				.then(data => {
					this.coursePlanList = [data];
					this.planData = data;
					if (this.isLoading) {
						// 当数据请求完毕时，同时是第一次请求才执行
						this.getIndex(this.semester_id);
						// this.initWeekNum(this.index);
						this.isLoading = false;
					}

					this.setWeekdata(this.index);
				});
		},

		/**
		 * 页面初始化需要的数据
		 * index 选择学期的下标
		 */
		setWeekdata(index) {
			let maxRows = 0;
			this.weeksList.forEach(item => {
				item.list = [];
			});
			const list = this.coursePlanList[index].coursePlanDateVoList || [];
			this.weeksList.forEach(weekItem => {
				list.forEach(courseItem => {
					if (weekItem.text == courseItem.date) {
						weekItem.list = courseItem.coursePlanDetailVOList;
					}
				});

				if (weekItem.list.length > maxRows) {
					maxRows = weekItem.list.length;
				}
			});
			this.row = Array(maxRows)
				.fill()
				.map((x, i) => i);
		},
	},
};
</script>

<style lang="scss">
.container {
	background: #ffffff;
}

.wrap {
	flex: 1;
	.header {
		display: flex;
		flex-direction: column;
		position: sticky;
		left: 0;
		z-index: 999;
		width: 100%;
		background: #ffffff;

		.title {
			display: flex;
			justify-content: center;
			height: 42upx;
			margin-top: 8upx;
			text {
				font-size: 30upx;
				font-weight: 600;
				line-height: 42upx;
				color: #222527;
			}
		}

		.operation {
			display: flex;
			font-size: 28upx;
			color: #484f55;
			line-height: 40upx;
			padding: 0 40upx;

			.left-wrap,
			.week,
			.nextWeek {
				flex: 1;
				font-weight: 400;
			}

			.left-wrap {
				display: flex;
				.today {
					margin-left: 40upx;
					color: #ff5500;
				}
			}

			.week {
				text-align: center;
			}

			.nextWeek {
				text-align: right;
			}
		}

		.tab {
			display: flex;
			margin-top: 16upx;
			.scroll-wrap {
				display: flex;
				background: #fbfcfb;
				height: 100upx;
			}
			.nav {
				flex: 1;
				padding: 8upx 20upx;
				.dateTime {
					display: flex;
					flex-direction: column;
					align-content: center;
					justify-content: center;
					padding: 10upx 50upx 9upx 50upx;
					font-size: 24upx;
					color: #1a3a63;
					font-weight: 400;

					.date {
						font-size: 20upx;
						line-height: 28upx;
						font-weight: 400;
						margin-top: 4upx;
					}
				}

				.active-time {
					background: #dbe7ee;
					border-radius: 12upx;
				}
			}
		}
	}

	.tabel-body {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding-top: 8rpx;
		.tr {
			display: flex;
		}
		.td {
			padding: 0 4upx;
			margin-bottom: 8upx;
			.item-td {
				background: #e7f6ff;
				border-radius: 8upx;
				padding: 24upx 16upx 0 16upx;
				height: 236upx;

				.time,
				.class-name {
					font-size: 24upx;
					line-height: 33upx;
					font-weight: 600;
					color: #1a3a63;
				}

				.class-name {
					margin: 12upx 0 8upx 0;
				}

				.coach-name {
					color: #999999;
					font-size: 20upx;
					font-weight: 400;
					line-height: 28upx;
				}
			}
			// margin:0 9upx 8upx 0;
		}
	}
}
</style>
