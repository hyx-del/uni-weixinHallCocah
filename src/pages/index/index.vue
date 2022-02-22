<template>
	<view class="container">
		<!-- <cu-custom bgColor="bg-white"><block slot="content">梵音瑜伽</block></cu-custom> -->
		<cu-custom bgColor="bg-white">
			<block slot="content">{{ $t("name") }}</block>
		</cu-custom>
		<swiper
			autoplay="true"
			indicator-active-color="white"
			circular="true"
			class="banner"
			duration="1000"
			:indicator-dots="true"
			:interval="3000"
			current="0"
			indicator-color="rgba(255,255,255,0.6)"
		>
			<swiper-item
				class="banner-item"
				v-for="(item, index) in bannerList"
				:key="index"
				:data-index="index"
				@click="bannerHandle"
			>
				<!-- <image :src="ossPath + item.image" mode="widthFix"></image> -->
				<image
					:src="ossPath+item.thumb_url"
					mode="aspectFill"
				></image>
			</swiper-item>
		</swiper>
		<view class="menu">
			<view class="menu_item">
				<view
					class="menu_item-wrap"
					@click="skipReservationPage"
				>
					<view class="menu_item-icon">
						<image
							src="../../static/images/changguan.svg"
							alt=""
						>
					</view>
					<view class="menu_item-name">场馆</view>
				</view>
			</view>
			<view class="menu_item">
				<view
					class="menu_item-wrap"
					@click="skipCoachPage"
				>
					<view class="menu_item-icon">
						<image
							src="../../static/images/jiaolian.svg"
							alt=""
						>
					</view>
					<view class="menu_item-name">教练</view>
				</view>
			</view>
			<view class="menu_item">
				<view
					class="menu_item-wrap"
					@click="skipCoursePage"
				>
					<view class="menu_item-icon">
						<image
							src="../../static/images/kecheng.svg"
							alt=""
						>
					</view>
					<view class="menu_item-name">课程</view>
				</view>
			</view>
			<view class="menu_item">
				<view
					class="menu_item-wrap"
					@click="skipCoachTrainPage"
				>
					<view class="menu_item-icon">
						<image
							src="../../static/images/jiaopei.svg"
							alt=""
						>
					</view>
					<view class="menu_item-name">教培</view>
				</view>
			</view>
		</view>
		<view class="section pt24">
			<view class="title-wrap">
				<view class="title">FineYoga资讯</view>
				<view
					class="more"
					@click="moreArticle"
				>
					<text>更多</text>
					<view class="cuIcon-right right-icon"></view>
				</view>
			</view>
			<view
				class="news-item"
				v-for="article in articleList"
				:key="article.id"
				:data-id="article.id"
				@click="articleDetail"
			>
				<view class="news-item__info">
					<view class="news-item__name">{{ article.title }}</view>
				</view>
				<view class="news-item__image">
					<image
						:src="ossPath + article.thumb_media_url + articleOssCrop"
						mode="aspectFill"
					/>
				</view>
			</view>
		</view>

		<view class="section shops">
			<view
				class="shop-image"
				@click="toShop1"
			>
				<!-- <image src="https://fanyin-oss.fineyoga.com/admin/video-tmp-1.jpg" mode="widthFix" /> -->
				<image
					src="https://fanyin-oss.fineyoga.com/admin/livevideoclass.jpg"
					mode="widthFix"
				/>
			</view>
			<!-- <view class="shop-image" @click="toShop2">
                <image src="https://fanyin-oss.fineyoga.com/admin/video-tmp-2.jpg" mode="widthFix" />
            </view> -->
		</view>

		<view class="section">
			<view class="title-wrap">
				<view class="title">FineYoga课程</view>
				<view
					class="more"
					@click="moreCourse"
				>
					<text>更多</text>
					<view class="cuIcon-right right-icon"></view>
				</view>
			</view>
			<view class="course-list">
				<view
					class="course-item"
					v-for="(course) in courseList"
					:key="course.id"
					:data-id="course.id"
					@click="courseDetail"
				>
					<view class="course__image">
						<image
							:src="ossPath + course.picture + courseOssCrop"
							mode="aspectFill"
						/>
					</view>
					<view class="course__info">
						<view class="course__name">
							{{ course.name }}
						</view>
						<view class="course__desc">
							{{ course.introduction || '' }}
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="section pt24">
			<view class="title-wrap">
				<view class="title">会馆教练</view>
				<view
					class="more"
					@click="moreCouch"
				>
					<text>更多</text>
					<view class="cuIcon-right right-icon"></view>
				</view>
			</view>
		</view>
		<scroll-view
			scroll-x="true"
			class="coach-list"
		>
			<view
				class="coach-item-wrapper"
				v-for="(coach) in coachList"
				:data-id="coach.id"
				:key="coach.image"
			>
				<view
					class="coach-item"
					:data-id="coach.id"
					@click="coachDetail"
				>
					<!-- :style="{'background-image': 'url(' + coach.image + ')' }" -->
					<view
						class="coach__image"
						:style="{'background-image': 'url(' + ossPath + coach.avatar + ')' }"
					>
						<!-- <image :src="ossPath + coach.avatar" /> -->
					</view>
					<view class="coach__name">{{ coach.name }}</view>
				</view>
			</view>
		</scroll-view>

		<!-- <view class="section">
            <view class="title-wrap">
                <view class="title">名师培训</view>
                <view class="more" @click="moreTeacher">
                    <text>更多</text>
                    <view class="cuIcon-right right-icon"></view>
                </view>
            </view>
        </view>

        <swiper class="card-banner" :indicator-dots="false" :circular="true"
		 :autoplay="true" interval="5000" duration="400" previous-margin="186rpx" next-margin="186rpx" @change="cardSwiper">
			<swiper-item v-for="(item,index) in 3" :key="index" :class="cardCur == index ? 'active' : 'quiet'">
				<view class="swiper-item">
                    <view class="desc">2019 Michelle Wing 儿童、青少年 、亲子瑜伽教师培训认证课程</view>
                    <view class="image-box">
                    </view>
                    <view class="address">北京</view>
				</view>
			</swiper-item>
		</swiper> -->

		<view class="tip">校长助理投诉与建议：15814493602（微信同号）</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			cardCur: 0,
			coachList: [],
			bannerList: [],
			courseList: [],
			articleList: [],
			articleOssCrop: "?x-oss-process=image/resize,m_fill,w_448,h_252",
			courseOssCrop: "?x-oss-process=image/resize,m_fill,w_320,h_180",

		}
	},
	computed: mapState(['ossPath','isLogin','currentMemberId']),
	onLaunch(){
	},
	onLoad(options) {
		if(options['share_member_id']) {
			this.$store.commit("setShareMemberId",options['share_member_id']);
		}
		this.getBannerList();
		this.getCourseList();
		this.getCoachList();
		this.getArticleList();
	},
	onShareAppMessage(res) {
		if(res.from==='button') {// 来自页面内分享按钮
			console.log(res.target)
		}
		return {
			title: "fineyoga 梵音瑜伽",
			path: "/pages/index/index?"+this.generateShareParams(),
			imageUrl: 'https://fanyin-oss.fineyoga.com/mini/share-img2.png',
			success: function(res) { },
			fail: function(res) {
				// 转发失败
			}
		}
	},
	onShareTimeline() {
		return {
			title: "fineyoga 梵音瑜伽",
			query: this.generateShareParams(),
		}
	},
	methods: {
		generateShareParams() {
			let query="";
			if(this.currentMemberId) {
				query="share_member_id="+this.currentMemberId
			}
			return query;
		},
		getBannerList() {
			this.api.get("mix/cms/index/material/detail",{ label: "pro_first_banner" }).then(data => {
				//data = (data || []).filter(item => item.instance_id == 10);
				if(data.content.length) {
					// let config = data[0].config;
					this.bannerList=data.content;
				}
			})
		},
		getCourseList() {
			this.api.post("hall/course/index/list",{ size: 2 }).then(ret => {
				this.courseList=ret.data||[];
			})
		},
		getCoachList() {
			this.api.post("hall/course/index/coach/list",{ size: 6 }).then(ret => {
				this.coachList=ret.data||[];
			})
		},
		getArticleList() {
			let params={
				page: 1,
				size: 2,
				tag: "mp_information",
				type: 1 // 文章
			}
			this.api.get("mix/cms/index/collection/detail",params).then(ret => {
				let data=ret.list||{};
				this.articleList=data.data||[];
			})
		},
		change() {
			if(this.$i18n.locale=="en") {
				this.$i18n.locale="cn";
			} else {
				this.$i18n.locale="en";
			}
		},
		bannerHandle(event) {
			const { index }=event.currentTarget.dataset;
			let data=this.bannerList[index];
			console.log(data)
			if(data.linkType==10&&data.link) { // 文章

				uni.navigateTo({
					url: "/pages/news/detail/index?id="+data.link,
				})
			} else if(data.linkType==20&&data.link) {
				if(data.link.indexOf("mnp://")>-1) {
					uni.navigateTo({
						url: data.link.split("mnp:/")[1],
					})
				}
			} else if(data.linkType==30&&data.link) {
				if(data.link.indexOf("http://")>-1||data.link.indexOf("https://")>-1) {
					uni.navigateTo({
						url: "/pages/webview/index?url="+data.link,
					})
				}
			}
		},
		cardSwiper(e) {
			this.cardCur=e.detail.current
		},

		skipCoursePage() {
			uni.navigateTo({
				url: "/pages/course/list2/index"
			})
		},

		skipReservationPage() {
			uni.switchTab({
				url: "/pages/reservation/index"
			});
		},

		skipCoachPage() {
			uni.navigateTo({
				url: "/pages/coach/list/index"
			})
		},
		skipCoachTrainPage() {
			uni.navigateTo({
				url: "/coachPages/coach-train/home/index"
			})
		},
		// skipVideoPage() {
		//     uni.navigateTo({
		//         url: "/pages/video/list/index"
		//     })
		// },
		toShop1() {
			uni.navigateTo({
				url: "/pages/reservation/detail/index?id=58"
			})
		},
		toShop2() {
			uni.navigateTo({
				url: "/pages/reservation/detail/index?id=59"
			})
		},
		courseDetail(event) {
			const { id }=event.currentTarget.dataset;
			uni.navigateTo({
				url: "/pages/course/detail/index?id="+id,
			})
		},
		coachDetail(event) {
			const { id }=event.currentTarget.dataset;
			uni.navigateTo({
				url: "/pages/coach/detail/index?id="+id,
			})
		},
		moreCouch() {
			uni.navigateTo({
				url: "/pages/coach/list/index"
			})
		},
		moreArticle() {
			uni.switchTab({
				url: "/pages/news/index"
			})
		},
		moreTeacher() {
			uni.navigateTo({
				url: "/pages/coach/teacher/index"
			})
			// uni.getLocation({
			//     type: 'gcj02', //返回可以用于uni.openLocation的经纬度
			//     success: function (res) {
			//         const latitude = res.latitude;
			//         const longitude = res.longitude;
			//         uni.openLocation({
			//             latitude: latitude,
			//             longitude: longitude,
			//             success: function () {
			//                 console.log('success');
			//             }
			//         });
			//     }
			// });
		},
		moreCourse() {
			uni.navigateTo({
				url: "/pages/course/list2/index"
			})
		},
		articleDetail(event) {
			const { id }=event.currentTarget.dataset;
			uni.navigateTo({
				url: "/pages/news/detail/index?id="+id,
			})
		}
	}
}
</script>

<style lang="scss">
.banner {
	margin-top: 0upx;
	width: 100%;
	height: 375upx;
	&-item {
		width: 100%;
		height: 100%;
		transform: translate(0%, 0%) translateZ(0px);
		will-change: auto;
	}
	image {
		width: 100%;
		height: 100%;
	}
}
.section {
	padding: 0 32upx;
	.title-wrap {
		display: flex;
		padding: 16upx 0;
		.title {
			font-size: 38upx;
			color: #222527;
			flex: 1;
		}
		.more {
			display: flex;
			align-items: center;
			color: #636f7c;
			padding-left: 32upx;
			font-size: 24upx;
		}
		.right-icon {
			font-size: 20upx;
		}
	}
	.news-item {
		display: flex;
		padding: 16upx 0;
		&__info {
			flex: 1;
			padding-right: 24upx;
			display: flex;
			align-items: center;
		}
		&__name {
			word-break: break-all;
			display: -webkit-box;
			overflow: hidden;
			text-overflow: ellipsis;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}
		&__image {
			width: 224upx;
			height: 126upx;
			border-radius: 8upx;
			// background: #ccc;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
}

.shops {
	display: flex;
	margin-top: 16upx;
	.shop-image {
		flex: 1;
		image {
			width: 100%;
		}
	}
}

.menu {
	padding: 32upx;
	display: flex;
	&_item {
		display: flex;
		justify-content: center;
		flex: 1;
		&-wrap {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		&-icon {
			width: 80upx;
			height: 80upx;
			border-radius: 16upx;
			// background-color: #f5f5f5;
			overflow: hidden;

			> image {
				height: 80upx;
				width: 80upx;
			}
		}
		&-name {
			margin-top: 8upx;
			font-size: 24upx;
			color: #484f55;
		}
	}
}
.pt32 {
	padding-top: 32upx;
}
.pt24 {
	padding-top: 24upx;
}

.coach-list {
	padding-top: 8upx;
	padding-bottom: 32upx;
	width: 100%;
	display: flex;
	flex-wrap: nowrap;
	white-space: nowrap;
	.coach-item-wrapper {
		display: inline-block;
		margin-right: 32rpx;
	}
	.coach-item-wrapper:first-child {
		margin-left: 32upx;
	}
}

.coach-item {
	width: 160upx;
	display: flex;
	flex-direction: column;
	.coach__image {
		width: 160upx;
		height: 160upx;
		border-radius: 50%;
		overflow: hidden;
		background-size: cover;
		background-position: center;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.coach__name {
		margin-top: 16upx;
		font-size: 24upx;
		color: #222527;
		text-align: center;
	}
}

.card-banner {
	height: 496upx;
	margin-top: 8upx;
	margin-bottom: 32upx;
	.swiper-item {
		background-image: linear-gradient(
			180deg,
			#ffa928 0%,
			rgba(255, 169, 40, 0.3) 100%
		);
		border-radius: 20upx;
		display: block;
		height: 100%;
		overflow: hidden;
		position: relative;
		padding: 24upx;
		padding-bottom: 80upx;
	}
	.quiet .swiper-item {
		transform: scale(0.85);
		transform-origin: 50% 50%;
		transition: all 0.18s ease-in 0s;
	}
	swiper-item.active .swiper-item {
		transform: none;
		transition: all 0.18s ease-in 0s;
	}
	.desc {
		font-size: 30upx;
		color: #ffffff;
	}
	.address {
		width: 100%;
		background-color: rgb(228, 118, 28);
		line-height: 80upx;
		position: absolute;
		left: 0;
		bottom: 0;
		text-align: center;
		color: white;
	}
}

.course-list {
	padding-bottom: 16upx;
}
.course-item {
	display: flex;
	padding: 16upx 0;
	.course__image {
		width: 320upx;
		height: 180upx;
		border-radius: 8upx;
		overflow: hidden;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.course__info {
		flex: 1;
		overflow: hidden;
		margin-left: 24upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.course__name {
		width: 100%;
		font-size: 30upx;
		color: #222527;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 16upx;
	}
	.course__desc {
		font-size: 24upx;
		color: #999999;

		word-break: break-all;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
}
.tip {
	background: #f7cf01;
	font-size: 24upx;
	text-align: center;
	color: rgba(0, 0, 0, 0.85);
	line-height: 24upx;
	padding: 28upx;
}
</style>
