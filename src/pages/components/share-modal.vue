<template>
    <view class="cu-modal center-modal share-modal" :class="visible?'show':''" @tap="hideModal">
        <view class="dialog" style="width: 578upx;" @tap.stop>
            <view class="modal-share-image">
                <image :src="shareImage" style="width: 100%;" mode="widthFix"/>
            </view>
            <view class="close-btn" @tap="hideModal">
                <view class="yicon icon-circle-close"></view>
            </view>
            <view class="save-btn" @click="saveShareImage">保存并分享</view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    props: {
        visible: Boolean,
        shareImage: String,
    },
    methods: {
        hideModal() {
            this.$parent.hideModal();
        },
        saveShareImage() {
            this.$parent.saveShareImage();
        }
    }
}
</script>
<style lang="scss">

.share-modal {
    .dialog {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        margin-left: auto;
        margin-right: auto;
        width: 40px;
        max-width: 100%;
        background-color: white;
        border-radius: 10rpx;
        overflow: initial;
    }
    .modal-share-image {
        image {
            vertical-align: top;
        }
    }
    .close-btn {
        position: absolute;
        right: 0;
        top: -80upx;
        font-size: 48upx;
        color: white;
    }
    .icon-circle-close:before {
        color: white;
    }
    .save-btn {
        width: 450upx;
        height: 90upx;
        position: absolute;
        bottom: -130upx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30upx;
        color: white;
        background-image: linear-gradient(-58deg, #FF401F 2%, #FF711E 75%);
        border-radius: 44upx;
        left:50%;
        transform: translateX(-50%);
    }
}
</style>

