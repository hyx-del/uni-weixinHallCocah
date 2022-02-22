<template>
    <view class="container">
		<cu-custom bgColor="bg-white" :isBack="true"><block slot="content">课程详情</block></cu-custom>
        <view class="article-banner"  :style="{'background-image': 'url(' + ossPath + course.picture + ')' }">
            <!-- <image v-if="hasLoading && !course.picture" :src="'https://zhongle-store.oss-cn-hangzhou.aliyuncs.com/mini/article2.png'" />
            <image v-else-if="course.picture" :src="ossPath + course.picture" /> -->
        </view>
        <view class="article-content-wrapper">
            <view class="article-title">{{ course.name || '' }}</view>
            <view class="article-content">
                {{ course.introduction || '' }}
            </view>
        </view>
	</view>
</template>

<script>
    import { mapState } from 'vuex';
	export default {
		data() {
			return {
                isShare: false,
                StatusBar: this.StatusBar,
                CustomBar: this.CustomBar,
                scrollTop: 0,
                course: {},
                hasLoading: false, 
			}
        },
        computed: {
            ...mapState([ "ossPath", "isLogin"])
        },
		onLoad(options) {
            let url = "hall/course/index/detail";
            this.api.get(url, {id: options.id }).then(ret => {
                this.hasLoading = true;
                if (ret.price) {
                    ret.price = parseFloat(ret.price);
                }
                this.course = ret;
            })
        },
        onPageScroll(event) {
            this.scrollTop = event.scrollTop;
        },
		methods: {
            BackPage() {
                if (this.isShare) {
                    uni.reLaunch({
                        url: '/pages/tabbar/home'
                    })
                } else {
                    uni.navigateBack({
                        delta: 1,
                    })
                }
            },

		}
	}
</script>

<style lang="scss">
    .article-banner {
        height: 430upx;
        overflow: hidden;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }
    .article-banner image{
        width: 100%;
        // height: 100%;
    }
    .article-content-wrapper {
        margin-top: -30upx;
        border-radius: 20upx 20upx 0 0;
        padding: 40upx 32upx 0 32upx;
        background-color: white;
        z-index: 5;
    }

    .article-title {
        font-size: 48upx;
        color: #222527;
        margin-bottom: 16upx;

    }
</style>
