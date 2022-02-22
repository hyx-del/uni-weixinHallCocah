<template>
    <view class="container">
        <view class='cu-custom'>
            <view class="cu-bar fixed" :style="style">
                <view class="action" :style="customStyle" @click="BackPage">
                    <text v-if="isShare" class='cuIcon-homefill'></text>
                    <text v-else class='cuIcon-back' :style="{color: scrollTop > 100 ? 'block': 'white'}"></text>
                </view>
                <view v-if="scrollTop > 50" class="content" :style="[{top:StatusBar + 'px'}]">
					资讯详情
				</view>
            </view>
        </view>

        <view class="article-banner" :style="{'background-image': 'url(' + ossPath + article.thumb_media_url + ')' }">
            <!-- <image :src="ossPath + article.thumb_media_url" mode="center" /> -->
        </view>
        <view class="article-content-wrapper" v-if="isLoadingComplete">
            <view class="article-title">{{ article.title }}</view>
            <view class="article-info">
                <view class="date">{{ article.created_at }}</view>
                <view class="yicon icon-hot"></view>
                <view class="heat">{{ article.reading_volume }}</view>
            </view>
            <view class="article-content">
                <!-- <uParse :content="article.content" @preview="previewImage"/> -->
                <wxparse :content="articleContent" @atap="wxParseTagATap"></wxparse>
            </view>
        </view>

        <button class="fixed-share-btn" @click="showShareModal">
            <view class="yicon icon-share"></view>
        </button>

        <view class="cu-modal bottom-modal" :class="menuVisible?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<view style="background-color: #e5e5e5;">
					<view class="cu-list menu text-center">
                        <view class="cu-item" @tap="hideModal">
                            <button class="cu-btn content text-grey" 
                            style="height: 100upx;justify-content:center;" @tap="share" open-type='share'>分享给朋友</button>
                        </view>
                        <view class="cu-item" style="border-bottom: none;" @tap="saveShare">
                            <view class="content">
                                <text class="text-grey">生成卡片保存分享</text>
                            </view>
                        </view>
                        <view class="cu-item" style="margin-top: 8upx;" @tap="hideModal">
                            <view class="content">
                                <text class="text-grey">取消</text>
                            </view>
                        </view>
                    </view>
				</view>
			</view>
		</view>
        
        <share-modal :visible="shareVisible" :shareImage="shareImage"></share-modal>

        <!--  #ifdef  MP-WEIXIN -->
        <canvasdrawer :painting="painting" @getImage="getShareImage"/>
        <!--  #endif -->

        <view class="cu-modal auth-modal" :class="authVisible ?'show':''">
            <view class="cu-dialog">
                <view class="image-wrap">
                    <image src="/static/images/auth.svg" mode="widthFix" />
                </view>
                <view class="modal__name">您还未登录</view>
                <view class="modal__desc">请先登录后再进行操作</view>
                <view class="btn-wrapper">
                    <view class="default-btn" @click="noLogin">暂不登录</view>
                    <button open-type="getUserInfo" @getuserinfo="onGetUserInfo" class="primary-btn">立即登录</button>
                </view>
            </view>
        </view>

        <!-- <view class="footer">
            <view class='action-tab' v-if="articleType == 'normal'">
                <view class='action-tab-item' @click="collectionArticle" v-if="!isCollected">
                    <view class="yicon icon-heart" style="color: #ff0000;"></view>
                    收藏
                </view>
                <view class='action-tab-item' @click="collectionArticle" v-else>
                    <view class="yicon icon-heart-selected" style="color: #ff0000;"></view>
                    已收藏
                </view>
                <view class='action-tab-item'>
                    <view class="yicon icon-comment"></view>
                    评论
                </view>
            </view>

            <view class='action-tab' v-else>
                <view class="num-wrap">
                    <text>人数：</text>
                    <view class="stepper custom-class">
                        <view class="minus-class stepper__minus" hover-class="stepper__minus--hover" hover-stay-time="70" @click="onMinus"></view>
                        <view class="input-class stepper__input-wrapper">
                            <input type="digit" class="stepper__input" v-model="amount"
                            >
                        </view>
                        <view class="plus-class stepper__plus" hover-class="stepper__plus--hover" hover-stay-time="70" @click="onPlus"></view>
                    </view>
                </view>
                <view class="pay-btn" @click="nowPay">立即支付定金</view>
            </view>
        </view> -->

    </view>
</template>
<script>
import { mapState } from 'vuex';
import shareOption from './share-image-options';
import uParse from '../../../components/uParse/src/wxParse.vue'
import wxParse from '../../../wxcomponents/wxParse/wxParse.js';

export default {
    components: {
        uParse,
    },
    data() {
        return {
            articleType: "normal",
            menuVisible: false,
            shareVisible: false,
            shareImage: "",
            painting: {},
            article: {},
            CustomBar: this.CustomBar,
            StatusBar: this.StatusBar,
            Custom: this.Custom,
            isShare: false,
            scrollTop: 0,
            isCollected: false,
            amount: 1,
            maxAmount: 10,
            isLoadingComplete: false,
            articleContent: [],
            authVisible: false,
            aHref: '',
        }
    },
    computed: {
        ...mapState(['appId', 'ossPath', 'currentMemberId', 'isAuth', 'isLogin']),
        mimiProgarmImage() {
            // 生成二维码 scene 不能大于32字符
            return this.api.config.baseUrl + "member/member/wxcode/share" + "?scene=id="
            + (this.article.id || 1)
            + ",isShare=1"
            + ",uid=" + (this.currentMemberId || '')
            + "&page=" + encodeURI("pages/news/detail/index")
        },
        style() {
            let alpha = 0;
            if (this.scrollTop > 100) {
                alpha = 1;
            } else if (this.scrollTop <= 100 && this.scrollTop > 50) {
                alpha = this.scrollTop / 100;
            } else {
                alpha = 0;
            }
            return `
                height:${this.CustomBar}px;
                padding-top:${this.StatusBar}px;
                background-color: rgba(255, 255, 255, ${alpha});
            `
        },
        customStyle() {
            return `
                width: ${this.Custom.width / 2}px;
                height:${this.Custom.height}px;
                margin-left:calc(750rpx - ${this.Custom.right}px);
            `
        }
    },
    watch: {
        isLogin(value) {
            if (value && this.aHref) {
                uni.navigateTo({
                    url: this.aHref,
                })
            }
        },
    },
    onLoad(options) {
        if (options['share_member_id']) {
            this.$store.commit("setShareMemberId", options['share_member_id']);
        }
        if (options.scene) {
            let data = decodeURIComponent(options.scene);
            let params = {};
            data.split(",").forEach(item => {
                let currentParams = item.split("=");
                params[currentParams[0]] = currentParams[1];
            })
            if (params['uid']) {
                this.$store.commit("setShareMemberId", params['uid']);
            }
            this.article.id = params.id;
            // this.isShare = !!params.isShare;
            this.isShare = true;
        } else {
            if (options.id) {
                this.article.id = options.id;
            }
            if (options.label) {
                this.article.label = options.label;
            }
            if (options.isShare) {
                this.isShare = !!options.isShare;
            }
            // options.type == 1 ? this.articleType = "normal" : this.articleType = "normal1";
        }
        this.getDetail();
    },
    onShareAppMessage() {
        return {
            title: this.article.title,
            path: '/pages/news/detail/index?' + this.generateShareParams(),
            imageUrl: this.ossPath + this.article.thumb_media_url,
            // imageUrl: 'https://zhongle-store.oss-cn-hangzhou.aliyuncs.com/mini/article2.png',
            success: (res) => {},
            fail: (res) => {
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
    onPageScroll(event) {
        this.scrollTop = event.scrollTop;
    },
    methods: {
        wxParseTagATap(e) {
            let href = e.detail.src;
            if (!href) return ;
            console.log(this.isLogin, href);
            if (href.indexOf("/pages/user/") === 0) {
                if (!this.isLogin) {
                    this.aHref = href;
                    if (this.isAuth) {
                        this.$store.dispatch("getToken");
                    } else {
                        this.showAuthModal();
                    }
                } else {
                    uni.navigateTo({
                        url: href,
                    });
                }
            } else if (href.indexOf("/pages/") === 0){
                uni.navigateTo({
                    url: href,
                });
            }
        },
        generateShareParams() {
            let query = "id=" + this.article.id + "&isShare=true";
            if (this.currentMemberId) {
                query += ("&share_member_id=" + this.currentMemberId)
            }
            return query;
        },
        getDetail() {
            let params = {};
            if (this.article.id) {
                params.id = this.article.id;
            } else if (this.article.label) {
                params.label = this.article.label;
            }
            this.api.get("mix/cms/index/material/detail", params).then(data => {
                this.article = data || {};
                if (this.article.content) {
                    wxParse.wxParse('articleContent', 'html', this.article.content, this);
                    console.log("articleContent", this.articleContent);
                }
                this.isLoadingComplete = true;
            })
        },
        collectionArticle() {
            let action = this.isCollected ? 'remove' : 'add';
            this.api.post("store/i/member/collection/" + action, { target_type: 3, target_id: this.article.id }).then(() => {
                uni.showToast({
                    title: this.isCollected ? '取消收藏成功' : '收藏成功',
                    icon: "none",
                })
                this.isCollected = !this.isCollected;
            })
        },
        BackPage() {
            if (this.isShare) {
                uni.reLaunch({
                    url: '/pages/index/index'
                })
            } else {
                uni.navigateBack({
                    delta: 1,
                })
            }
        },
        previewImage(event) {
            console.log("预览图片", event);
        },
        nowPay() {
            uni.navigateTo({
                url: "/pages/order/payment/index?id=" + 1,
            })
        },
        onMinus() {
            if (this.amount <= 1) return ;
            this.amount -= 1;
        },
        onPlus() {
            if (this.amount >= this.maxAmount) return ;
            this.amount += 1;
        },
        share() {
            //#ifdef APP-PLUS
            uni.share({
                provider: 'weixin',
                scene: "WXSceneSession",
                type: 0,
                imageUrl: 'https://zhongle-store.oss-cn-hangzhou.aliyuncs.com/mini/article2.png',
                title: this.article.title,
                href: "https://www.fineyoga.com/",
                miniProgram: {
                    id: 'wx229688353bf58d42',
                    path: 'pages/trunk/index/index',
                    type: 0,
                    webUrl: 'http://uniapp.dcloud.io'
                },
                success: ret => {
                    console.log(JSON.stringify(ret));
                }
            });
            //#endif
        },
        showShareModal() {
            this.menuVisible = true;
        },
        saveShare() {
            this.menuVisible = false;
            if (!this.shareImage) {
                let data = shareOption;
                data.views[1].url = this.ossPath + this.article.thumb_media_url + "?x-oss-process=image/crop,w_500,h_500,g_center";
                data.views[2].content = this.article.title;
                data.views[3].content = "fineyoga 梵音瑜伽";
                data.views[data.views.length - 1].url = this.mimiProgarmImage;
                this.painting = data;
                uni.showLoading({
                    title: "分享图片生成中",
                    mask: true,
                })
            } else {
                this.shareVisible = true;
            }
        },
        hideModal() {
            this.menuVisible = false;
            this.shareVisible = false;
        },
        getShareImage(event) {
            console.log(event);
            this.shareImage = event.detail.tempFilePath;
            uni.hideLoading();
            this.shareVisible = true;
        },

        saveShareImage() {
            this.shareVisible = false;
            uni.saveImageToPhotosAlbum({
                filePath: this.shareImage,
                success: () => {
                    uni.showToast({
                        title: "保存图片成功",
                        icon: "success",
                        duration: 2000,
                    })
                },
                fail: (err) => {
                    console.log("Err=====", err);
                }
            })
        },
        noLogin() {
            this.authVisible = false;
        },

        onGetUserInfo(event) {
            if (event.detail.userInfo) {
                this.$store.commit("setIsAuth", true);
                this.$store.dispatch("getToken", true);
            }
            this.authVisible = false;
        },

        showAuthModal() {
            this.authVisible = true;
        },
    }
}
</script>
<style lang="scss">
	// @import url("../../../components/uParse/src/wxParse.css");

    .article-page {
        background-color: white;
        padding-bottom: 100upx;
        padding-bottom: calc(100upx + constant(safe-area-inset-bottom));
        padding-bottom: calc(100upx + env(safe-area-inset-bottom));
    }
    .article-banner {
        height: 375upx;
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
    .article-info {
        display: flex;
        font-size: 24upx;
        color: #888888;
        .date {
            margin-right: 24upx;
        }
        .heat {
            margin-left: 8upx;
        }
    }

    .article-content {
        font-size: 28upx;
        color: #484F55;
        text-align: justify;
        line-height: 50upx;
        margin-top: 32upx;
        padding-bottom: 32upx;
        // .p {
        //     margin-bottom: 32upx;
        // }
        // .img {
        //     width: 100%;
        // }
        .y-video {
            display: none;
        }
        img {
            max-width: 100%;
        }
        .image-wrap {
            margin-bottom: 32upx;
            image {
                vertical-align: top;
            }
        }
    }

    .action-tab {
        height: 100upx;
        display: flex;
        &-item {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28upx;
            color: #222527;
            background-color: white;
            line-height: 1;
            &.share {
                width: 280upx;
                color: #FFFFFF;
                border-radius: 0;
                background-image: linear-gradient(-58deg, #FF401F 2%, #FF711E 75%);
            }
            .yicon {
                margin-right: 8upx;
            }
        }
        .num-wrap {
            flex: 1;
            padding: 0 32upx;
            display: flex;
            align-items: center;
        }
        .pay-btn {
            width: 322upx;
            background: #02B94E;
            font-size: 32upx;
            color: #FFFFFF;
            text-align: center;
            line-height: 100upx;
        }
    }
    button.share::after {
        border: none;
        border-radius: 0;
    }
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
        }
        .modal-share-image {
            image {
                vertical-align: top;
            }
        }
        .close-btn {
            position: absolute;
            right: 0;
            top: -88upx;
            font-size: 48upx;
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

    .stepper {
        color: #666;
        &__minus {
            border-radius: 2px 0 0 2px;
        }
        &__plus {
            border-radius: 0 2px 2px 0;
        }
        .stepper__minus::after {
            display: none;
        }
        &__minus, &__plus {
            display: inline-block;
            vertical-align: middle;
            background-color: white;
            position: relative;
            // width: 32px;
            // height: 30px;
            width: 70upx;
            height: 60upx;
            padding: 5px;
            border: 1px solid #ccc;
            box-sizing: border-box;
            &--hover {
                background-color: #e8e8e8;
            }
            &--disabled {
                background-color: #f8f8f8;
                &::after, &::before {
                    background-color: #c9c9c9;
                }
            }
            &::before, &::after {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
                background-color: #7d7e80;
                content: '';
            }
        }
        &__minus::before, &__plus::before {
            width: 9px;
            height: 1px;
        }

        &__minus::after, &__plus::after {
           width: 1px;
            height: 9px;
        }
        
        &__input-wrapper {
            display: inline-block;
            vertical-align: middle;
            background-color: white;
            position: relative;
            // width: 40px;
            // height: 30px;
            width: 100upx;
            height: 60upx;
            padding: 1px;
            font-size: 14px;
            color: #999;
            text-align: center;
            border: 1px solid #ccc;
            border-width: 1px 0;
            border-radius: 0;
            box-sizing: border-box;
            &--disabled {
                color: #c9c9c9;
                background-color: #f8f8f8;
            }
        }
        &__input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            min-height: 0;
            appearance: none;
            height: 100%;
        }
    }

    .fixed-share-btn {
        width: 60upx;
        height: 60upx;
        padding: 0;
        border-radius: 30upx;
        background-image: linear-gradient(-58deg, #FF401F 2%, #FF711E 75%);
        box-shadow: 0 4px 8px 0 rgba(255,69,31,0.40);
        position: fixed;
        z-index: 10;
        bottom: 200upx;
        right: 32upx;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .fixed-share-btn::after {
        border: none;
    }
</style>
