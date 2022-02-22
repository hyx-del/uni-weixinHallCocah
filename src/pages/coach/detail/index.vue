<template>
    <view class="container">
		<cu-custom bgColor="bg-white" :isBack="true"><block slot="content">教练详情</block></cu-custom>
        <view class="article-banner"  :style="{'background-image': 'url(' + ossPath + coach.coach_avatar + ')' }">
            <!-- <image v-if="hasLoading && !coach.avatar" :src="'https://zhongle-store.oss-cn-hangzhou.aliyuncs.com/mini/article2.png'" /> -->
            <!-- <image :src="ossPath + coach.avatar" /> -->
        </view>
        <view class="article-content-wrapper">
            <view class="article-title">{{ coach.name }}</view>
            <view class="article-content">
                {{ coach.profile || '' }}
            </view>
        </view>
	</view>
</template>
<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            coach: {},
            hasLoading: false, 
        }
    },
    computed: mapState(['ossPath']),
    onLoad(options) {
        this.api.get("hall/course/index/coach/detail", { id: options.id }).then(ret => {
            if (ret.display_photos && ret.display_photos.length) {
                ret.coach_avatar = ret.display_photos[0];
            } else {
                ret.coach_avatar = ret.avatar;
            }
            this.coach = ret;
            this.hasLoading = true;
        })
    },
    methods: {

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
    .article-content {
        font-size: 28upx;
        color: #484F55;
        line-height: 50upx;
        margin-top: 32upx;
        padding-bottom: 32upx;
    }
</style>