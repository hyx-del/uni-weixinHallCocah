<template>
	<view class="container page-bg">
		<view class='cu-custom'>
            <view class="cu-bar fixed" :style="style">
                <view class="action" @click="BackPage">
                    <text v-if="isShare" class='cuIcon-homefill'></text>
                    <text v-else class='cuIcon-back'></text>
                </view>
                <view v-if="scrollTop > 50" class="content" :style="[{top:StatusBar + 'px'}]">
					门店详情
				</view>
            </view>
        </view>
        
        <swiper autoplay="true" indicator-active-color="white" circular="true" class="banner" duration="1000" :indicator-dots="true" :interval="3000" current="0" indicator-color="rgba(255,255,255,0.6)">
            <swiper-item class="banner-item" v-for="(url, index) in shop.images" :key="index" @click="bannerHandle">
                <image :src="url.pictures"></image>
                <!-- <image :src="ossPath + shop.picture"></image> -->
            </swiper-item>
        </swiper>

        <view class="btn-wrap">
            <button class="cu-btn bg-primary" @click="nowReservation">课程表</button>

            <view class="tip">请点击”课程表“约课</view>
        </view>

        <scroll-view class="scroll-wrap" scroll-y >

            <view class="content-wrapper">
                <view class="card">
                    <view class="title">场馆介绍</view>
                    <!-- <view class="hall-time">营业时间：周一至周五6:30-21:00  周末及公众假期 8:00-18:00</view> -->
                    <view class="hall-time">{{ shop.openTimeIntro|| '' }}</view>
                    <view class="hall-content">
                        {{ shop.description || '' }}
                        <!-- 蓝堡会馆坐拥大望路优越地段，会馆使用面积600平方米，设有4间瑜伽课室，其中包括高温课室、艾扬格课室、
                        空中瑜伽教室，另有私教教室，培训教练总部区，环境自然舒适。每星期提供超过80节瑜伽课堂，200平方米的宽敞更衣室、
                        沐浴间。交通便利，近大望路E出口地铁站，只需1分钟即可到达。 -->
                    </view>
                </view>
                <view class="card">
                    <view class="title">联系方式</view>
                    <view class="contact-info">
                        <view class="contact-info-item">
                            <view class="yicon icon-address"></view>
                            <!-- <text v-if="shop.id == 58 || shop['province_id'] == 820302">{{ shop["city_name"] }} {{ shop["name"] }}</text> -->
                            <text >{{ shop.address }}</text>
                        </view>
                        <view class="contact-info-item">
                            <view class="yicon icon-tel"></view>
                            <text>{{ shop.phone }}</text>
                            <view class="copy" @click="copyPhone">复制</view>
                        </view>
                        <view class="contact-info-item">
                            <view class="yicon">
                                <image class="img" src="/static/images/contact2.svg" />
                            </view>
                            <text>在线客服</text>
                            <button class="contact-btn" open-type="contact">立即咨询</button>
                        </view>
                    </view>
                    <!-- <button class="cu-btn bg-green" open-type="contact">
                        <image class="img" src="/static/images/contact.svg" />
                        <text>在线咨询客服</text>
                    </button> -->
                </view>
                <view class="card">
                    <view class="title">上课须知</view>
                    <view class="tip" v-if="shop.id == 58">
                        <view>1、开课前1小时之内不能取消课程。</view>
                        <view>2、开课前1小时以上可以预约和取消课程</view>
                        <view>3、课程开始前90分钟会有短信提醒。</view>
                        <view>4、排队成功的课程会发短信提醒（课前90分钟不再发短信提醒）。</view>
                        <view>5、准备好瑜伽垫,砖,抱枕等辅具。</view>
                        <view>6、请选择宽敞,明亮，网络信号好的练习环境，独立的空间为宜，确保大家在上课过程中不受外界干扰。</view>
                    </view>
                    <view class="tip" v-else>
                        <view>1、开课前1小时以上可以预约课程。</view>
                        <view>2、开课前1小时以上可以取消预约，支持退款。</view>
                        <view>3、课程开始前90分钟会有短信提醒。</view>
                        <view>4、到店上课时需要在前台扫码签到。</view>
                        <view>5、上完课后可以对老师课程进行评价。</view>
                        <view>6、为保障会员上课质量，开课后不允许再进出教室。</view>
                    </view>
                </view>
            </view>
        </scroll-view>


        <!-- <view class="footer">
            <view class="footer-btn" @click="nowReservation">查看课程表</view>
        </view> -->
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
                shop: {},
                scrollTop: 0,
                toBooking: false,
			}
        },
        computed: {
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
            ...mapState(["ossPath"])

        },
		onLoad(options) {
            console.log("options", options);
            this.api.get("/api/hall/home/open/detail", {id: options.id},this.$other).then(ret => {
                let images = [];
                if (Array.isArray(ret.picturesList)) {
                    images = [...ret.picturesList];
                } else if (ret.picture) {
                    images = [ret.picture];
                }
                ret.images = images;
                this.shop = ret ;
                console.log("shop===>", ret);
                if (this.toBooking) {
                    this.nowReservation();
                }
            }).catch(() => {
                uni.navigateBack({
                    delta: 1,
                })
            })
        },
        onPageScroll(event) {
            this.scrollTop = event.scrollTop;
        },

		methods: {
            nowReservation() {
                if (!this.shop.id) {
                    this.toBooking = true;
                    return ;
                }
                uni.navigateTo({
                    url: '/pages/course/list/index?hall_id=' + this.shop.id + "&city_id=" + this.shop.cityId,
                })
            },
            copyPhone() {
                uni.setClipboardData({
                    data: this.shop.phone,
                    success (res) {
                        uni.getClipboardData({
                            success (res) {
                                console.log("getClipboardData", res.data) // data
                            }
                        })
                    }
                })
                // uni.makePhoneCall({
                //     phoneNumber: this.shop.phone,
                // })
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
            bannerHandle() {

            }
		}
	}
</script>

<style lang="scss">
    .content-wrapper {
        padding: 0 32upx;
        // padding-top: 32upx;
    }
    .banner {
        height: 500upx;    
        &-item {
            image {
                width: 100%;
                height: 100%;
            }
        }
    }
    .scroll-wrap {
        height: calc(100vh - 720upx);
    }
    .hall-time {
        margin-bottom: 24upx;
        color: #484F55;
        line-height: 48upx;
    }
    .hall-content {
        color: #484F55;
        line-height: 50upx;
    }
    .card {
        padding: 32upx;
        margin-bottom: 32upx;
        background: white;
        border-radius: 20upx;
        .title {
            font-size: 34upx;
            color: #222527;
            margin-bottom: 24upx;
            font-weight: bold;
        }
        // .
        
        .tip {
            color:#484F55;
            line-height: 50upx;
        }
    }
    .contact-info {
        .contact-info-item:last-child {
            margin-bottom: 0;
        }
    }
    .contact-btn {
        padding: 0 16upx;
        background: white;
        font-size: 24rpx;
        line-height: 1.5;
        text-align: left;
        margin: 0;
        color: #F08336;
        &::after {
            border: none;
        }
    }
    .contact-info-item {
        color: #484F55;
        display: flex;
        align-items: center;
        margin-bottom: 24upx;
        .yicon {
            color: #F08336;
            font-size: 32upx;
        }
        .img {
            width: 32upx;
            height: 32upx;
        }
        text {
            margin-left: 16upx;
        }
        .copy {
            font-size: 24upx;
            margin-left: 16upx;
            color: #F08336;
        }
    }
    .btn-wrap {
        padding: 32upx;
        padding-bottom: 0;
        .tip {
            color:  #F08336;
            text-align: center;
            margin-top: 24upx;
            line-height: 40upx;
            margin-bottom: 24upx;
        }
    }
    .bg-primary {
        width: 100%;
        height: 100upx;
        background: #F08336;
        border-radius: 20upx;
        color: white;
        font-size: 36upx;
    }
    .footer-btn {
        background: #F08336;
        height: 100upx;
        font-size: 32upx;
        text-align: center;
        line-height: 100upx;
        color: #FFFFFF;
    }
</style>
