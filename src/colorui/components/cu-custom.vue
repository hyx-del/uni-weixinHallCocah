<template>
	<view>
		<view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<view class="action" @tap="BackPage" v-if="isBack && !isHome">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>

                <view class="action border-custom-home" :style="customStyle" @tap="toHome" v-if="isHome">
					<text class="cuIcon-homefill"></text>
				</view>

                <view class="action border-custom" v-if="isCustom" :style="customStyle">
                    <text class="cuIcon-back" @tap="BackPage"></text>
                    <text class="cuIcon-homefill" @tap="toHome"></text>
                </view>
				<view class="content" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
                CustomBar: this.CustomBar,
                Custom: this.Custom,
			};
		},
		name: 'cu-custom',
		computed: {
			style() {
				var StatusBar= this.StatusBar;
				var CustomBar= this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
                }
                if (this.color) {
                    style = `${style}color: ${this.color};`
                }
                if (this.backgroundColor) {
                    style = `${style}background-color: ${this.backgroundColor};`
                }
				return style
            },
            customStyle() {
                return `
                    width: ${ this.isHome ? this.Custom.width / 2 : this.Custom.width }px;
                    height:${this.Custom.height}px;
                    margin-left:calc(750rpx - ${this.Custom.right}px);
                `
            }
		},
		props: {
			bgColor: {
				type: String,
				default: ''
            },
            backgroundColor: {
                type: String,
                default: '',
            },
            color: {
                type: String,
                default: '',
            },
            backUrl: {
                type: String,
                default: '',
            },
			isBack: {
				type: [Boolean, String],
				default: false
            },
            isCustom: {
                type: [Boolean, String],
                default: false
            },
            isHome: {
                type: [Boolean, String],
                default: false
            },
			bgImage: {
				type: String,
				default: ''
			},
		},
		methods: {
			BackPage() {
                if (this.isHome) {
                    this.toHome();
                } else {
                    if (this.backUrl) {
                        uni.redirectTo({
                            url: this.backUrl,
                        })
                    } else {
                        if (getCurrentPages().length < 2 && 'undefined' !== typeof __wxConfig) {
                            let url = '/' + __wxConfig.pages[0]
                            return uni.redirectTo({url})
                        }
                        uni.navigateBack({
                            delta: 1
                        });
                    }
                }
            },
            toHome(){
                if (typeof __wxConfig !== "undefined") {
                    let url = "/" + __wxConfig.pages[0];
                    return uni.reLaunch({
                        url: url,
                    })
                }
                uni.reLaunch({
                    url: '/pages/index/index',
                })
            }
		}
	}
</script>

<style>

</style>
