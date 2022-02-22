<template>
	<view class="container page-bg">
		<cu-custom bgColor="bg-white" :isBack="true"><block slot="content">会馆教练</block></cu-custom>
		<view class="search-box position-sticky" :style="'top:' + CustomBar + 'px'">
            <view class="search circle">
                <view class="search-icon">
                    <icon type="search" color="#999" size="17"></icon>
                </view>
                <input type="text" placeholder="搜索会馆教练" v-model="keyword" @confirm="search" confirm-type='search' />
            </view>
        </view>
        <view class="list">
            <view class="list__item" v-for="(item, index) in list" :key="item.id" :data-id="item.id" :data-index="index" @click="coachDetail">
                <view class="item__image">
                    <image :src="ossPath + item.coach_avatar + ossResize" />
                </view>
                <view class="item__info">
                    <view class="title">
                        <text>{{ item.name }}</text>
                        <text v-if="item.name_en">({{ item.name_en }})</text>
                    </view>
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
                haveMore: false,
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
            if (!this.haveMore) return ;
            this.getList();
        },
		methods: {
            getList(isReset = false) {
                let params = {
                    page: isReset ? 1 : (this.pageIndex + 1),
                    size: this.pageSize
                }
                if (this.keyword) {
                    params.keyword = this.keyword;
                }
                this.api.post("hall/course/index/coach/list", params).then(ret => {
                    (ret.data || []).forEach(coach => {
                        if (coach.display_photos && coach.display_photos.length > 0) {
                            coach.coach_avatar = coach.display_photos[0];
                        } else {
                            coach.coach_avatar = coach.avatar;
                        }
                    });
                    if (isReset) {
                        this.list = ret.data || [];
                    } else {
                        this.list = this.list.concat(ret.data);
                    }
                    this.pageIndex = ret.current_page;
                    if (ret.last_page > ret.current_page) {
                        this.haveMore = true;
                    } else {
                        this.haveMore = false;
                    }
                    uni.hideNavigationBarLoading();
                    uni.stopPullDownRefresh();
                })
            },
            search() {
                this.getList(true);
            },
            coachDetail(event) {
                const { id } = event.currentTarget.dataset;
                uni.navigateTo({
                    url: "/pages/coach/detail/index?id=" + id,
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
