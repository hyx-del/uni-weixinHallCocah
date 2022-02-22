<template>
	<view class="container page-bg">
		<cu-custom bgColor="bg-white" :isBack="true"><block slot="content">FineYoga课程</block></cu-custom>
        <view class="list">
            <view class="list__item" v-for="(item, index) in list" :key="item.id" :data-id="item.id" @click="detail">
                <view class="item__image">
                    <image :src="ossPath + item.picture + ossResize" />
                </view>
                <view class="item__info">
                    <view class="title">{{ item.name }}</view>
                </view>
            </view>
        </view>
	</view>
</template>

<script>
    import {  mapState } from 'vuex';
	export default {
		data() {
			return {
                CustomBar: this.CustomBar,
                keyword: '',
                list: [],
                pageIndex: 1,
                pageSize: 10,
                hasMore: false,
                ossResize: "?x-oss-process=image/resize,m_fill,w_600,h_300",
			}
        },
        computed: mapState(['ossPath']),
		onLoad() {
            this.getList(true);
        },
        onPullDownRefresh() {
            uni.showNavigationBarLoading();
            this.getList(true);
        },
        onReachBottom() {
            if (!this.hasMore) return ;
            uni.showNavigationBarLoading();
            this.getList();
        },
		methods: {
            getList(isReset = false) {
                let params = {
                    page: isReset ? 1 : (this.pageIndex + 1),
                    size: this.pageSize
                }
                this.api.post("hall/course/index/list", params).then(ret => {
                    if (isReset) {
                        this.list = ret.data || [];
                    } else {
                        this.list = this.list.concat(ret.data);
                    }
                    this.pageIndex = ret.current_page;
                    if (ret.last_page > ret.current_page) {
                        this.hasMore = true;
                    } else {
                        this.hasMore = false;
                    }
                    uni.hideNavigationBarLoading();
                    uni.stopPullDownRefresh();
                })
            },
            detail(event) {
                let id = event.currentTarget.dataset.id;
                uni.navigateTo({
                    url: "/pages/course/detail/index?id=" + id,
                })
            }
		}
	}
</script>

<style lang="scss">
         
    .list {
        padding: 0 32upx;
        padding-top: 32upx;
    }

    .list__item {
        margin-bottom: 32upx;
        background-color: white;
        border-radius: 20upx;
        overflow: hidden;
        .item__image {
            height: 377upx;
            image {
                width: 100%;
                height: 100%;
            }
        }
        .item__info {
            padding: 32upx;
            .title {
                font-size: 34upx;
                color: #222527;
            }
        }
    }

</style>
