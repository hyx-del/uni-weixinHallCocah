<template>
	<view class="container page-bg">
        <cu-custom bgColor="bg-white"><block slot="content">资讯</block></cu-custom>
		<view class="search-box position-sticky" :style="'top:' + CustomBar + 'px'">
            <view class="search circle">
                <view class="search-icon">
                    <icon type="search" color="#999" size="17"></icon>
                </view>
                <input type="text" placeholder="搜索你关心的资讯" v-model="keyword" @confirm="search" confirm-type='search' />
            </view>
        </view>

        <view class="article-list">
            <view class="article-item" v-for="article in articleList" :key="article.id" :data-id="article.id" @click="articleDetail">
                <view class="image-box">
                    <image :src="ossPath + article.thumb_media_url + ossResize" />
                </view>
                <view class="article-info">
                    <view class="title">{{ article.title }}</view>
                </view>
            </view>
        </view>

        <view v-if="isLoadingComplete && !articleList.length" class="no-data">暂无相关数据</view>
	</view>
</template>

<script>
    import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
    import {  mapState } from 'vuex';
	export default {
        components: {
            MescrollUni
        },
		data() {
			return {
                CustomBar: this.CustomBar,
                keyword: '',
                articleList: [],
                pageIndex: 1,
                haveMore: false,
                pageSize: 10,
                isLoadingComplete: false,
                ossResize: "?x-oss-process=image/resize,m_fill,w_600,h_300",
			}
        },
        computed: mapState(['ossPath', "shareMemberId"]),
		onLoad() {
            console.log("ossPath===>", this.ossPath);
            // this.getList(true);
            this.getNewsList(true);
        },
        onReachBottom() {
            if (!this.haveMore) return ;
            this.pageIndex = this.pageIndex + 1;
            // this.getList();
            this.getNewsList();
        },
        onPullDownRefresh() {
            uni.showNavigationBarLoading();
            // this.getList(true);
            this.getNewsList(true);
        },
		methods: {
            getList(isReset = false) {
                let params = {
                    page: isReset ? 1 : this.pageIndex,
                    size: this.pageSize,
                }
                if (this.keyword) {
                    params.keyword = this.keyword;
                }
                this.isLoadingComplete = false;
                
                this.api.get("mix/cms/index/material/list", params).then(ret => {
                    if (isReset) {
                        this.articleList = ret.data || [];
                    } else {
                        this.articleList = this.articleList.concat(ret.data);
                    }

                    this.isLoadingComplete = true;
                    if (ret.last_page > ret.current_page) {
                        this.haveMore = true;
                    } else {
                        this.haveMore = false;
                    }
                    uni.hideNavigationBarLoading();
                    uni.stopPullDownRefresh();
                })
            },
            getNewsList(isReset = false) {
                let params = {
                    tag: "mp_information",
                    page: isReset ? 1 : this.pageIndex,
                    size: this.pageSize,
                    type: 1 // 文章
                }
                if (this.keyword) {
                    params.keyword = this.keyword;
                }
                
                this.isLoadingComplete = false;
                this.api.get("mix/cms/index/collection/detail", params).then(ret => {
                    let data = ret.list;
                    if (isReset) {
                        this.articleList = data.data || [];
                    } else {
                        this.articleList = this.articleList.concat(data.data);
                    }

                    this.isLoadingComplete = true;
                    if (data.last_page > data.current_page) {
                        this.haveMore = true;
                    } else {
                        this.haveMore = false;
                    }
                    uni.hideNavigationBarLoading();
                    uni.stopPullDownRefresh();
                })
            },
            search() {
                // this.getList(true);
                this.pageIndex = 1;
                this.getNewsList(true);
            },
            articleDetail(event) {
                const { id } = event.currentTarget.dataset;
                uni.navigateTo({
                    url: "/pages/news/detail/index?id=" + id,
                })
            }
		}
	}
</script>

<style lang="scss">
         
    .search-box {
        width: 100%;
        z-index: 12;
        box-sizing: border-box;
        padding: 16upx 32upx;
        background-color: white;
        &.position-sticky {
            position: sticky;
            top: 0;
            left: 0;
            width: 100%;
        }
        input {
            margin-left: 20upx; 
            background-color: transparent;
            color: #000;
            flex: 1;
        }
        .search {
            height: 60upx;
            display: flex;
            flex-direction: row;
            align-items: center;
            color: #999;
            background: #F5F5F5;
            border-radius: 40upx;
        }
        .search-icon {
            margin-left: 24upx;
            width: 34upx;
            height: 34upx;
            display: inline-block;
        }
    }

    .article-list {
        height: 100%;
        padding: 0 32upx;
        // padding-top: 32upx;
        .article-item:first-child {
            margin-top: 32upx;
        }
    }

    .article-item {
        margin-bottom: 32upx;
        background-color: white;
        border-radius: 20upx;
        overflow: hidden;
        .image-box {
            height: 344upx;
            // background-color: #ccc;
            image {
                width: 100%;
                height: 100%;
            }
        }
        .article-info {
            padding: 32upx;
            .title {
                font-size: 34upx;
                color: #222527;
            }
        }
    }
    .no-data {
        text-align: center;
    }
</style>
