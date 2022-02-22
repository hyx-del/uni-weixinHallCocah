<template>
    <view class="container page-bg fixed-page-large">
        <cu-custom bgColor="bg-white" :isBack="true">
            <block slot="content">查看身份证照片</block>
        </cu-custom>

        <view class="card-img">
            <text class="iconfont-spin cuIcon-loading1" v-if="isLoading"></text>
            <image :src='ossPath + credImg' mode='widthFix' v-else></image>
        </view>

        <!-- footer -->
        <view class="footer">
            <view class="footer-wrap" @click="uploadAgain">
                <text>重新上传</text>
            </view>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            type: null,
            credImg: '',
            isLoading: false,
        }
    },
    computed: {
        ...mapState(['baseUrl', 'ossPath']),
    },

    onLoad(options) {
        this.type = options.type;
        this.credImg = options.credImg;

    },

    methods: {
        uploadAgain() {
            uni.chooseImage({
                success: res => {
                    this.isLoading = true;
                    const tempFilePaths = res.tempFilePaths;
                    uni.uploadFile({
                        url: this.baseUrl + 'file/upload/image?bucket=admin',
                        filePath: tempFilePaths[0],
                        name: 'images[]',
                        success: (uploadFileRes) => {
                            const files = JSON.parse(uploadFileRes.data);
                            this.credImg = files.data[0];
                            this.isLoading = false;
                            this.backUpdateData();
                        }
                    });
                }
            })
        },

        backUpdateData() {
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2];
            if (this.type == 1) {
                prevPage.$vm.front = this.credImg;
            } else {
                prevPage.$vm.reverseSide = this.credImg;
            }
        }
    }
}
</script>

<style lang="scss">
.card-img {
    padding: 32upx 0;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    text {
        font-size: 50upx;
    }

    image {
        max-width: 750upx;
        height: auto;
        // height: 1105upx;
        // width: 100%;
        // transform:rotate(90deg);
    }
}
.footer-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    max-height: 120upx;
    opacity: 0.6;
    padding: 38upx 295upx 37upx 295upx;
    background: #000000;
    > text {
        font-size: 32upx;
        color: #ffffff;
        font-weight: 400;
    }
}
.fixed-page-large {
    padding-bottom: 120upx;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 120upx);
    padding-bottom: calc(env(safe-area-inset-bottom) + 120upx);
}
</style>