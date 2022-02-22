<template>
   <view class="container">
      <cu-custom bgColor="bg-white">
         <block slot="content">约课</block>
      </cu-custom>

      <view class="handle-bar position-sticky"
            :style="'top:' + CustomBar + 'px'">
         <picker @change="cityChange"
                 :value="cityIndex"
                 :range="cityList"
                 range-key="name">
            <view class="picker">
               {{ cityIndex > -1 ? cityList[cityIndex].name || '' : '选择城市' }}
               <text class="yicon icon-xiala"></text>
            </view>
         </picker>
         <view class="search-box">
            <view class="search circle">
               <view class="search-icon">
                  <icon type="search"
                        color="#999"
                        size="17"></icon>
               </view>
               <input type="text"
                      placeholder="搜索场馆"
                      v-model="keyword"
                      @confirm="search"
                      confirm-type='search' />
            </view>
         </view>
      </view>

      <swiper autoplay="true"
              indicator-active-color="white"
              circular="true"
              class="banner"
              duration="1000"
              :indicator-dots="true"
              :interval="3000"
              :current="swiperCurrent"
              indicator-color="rgba(255,255,255,0.6)"
              @change="swiperChange">
         <swiper-item class="banner-item"
                      v-for="(item,index) in bannerData"
                      :key="index"
                      :data-index="index"
                      @click="bannerDetail">
            <view class="banner-image-box">
               <image :src="ossPath+item.thumb_url"
                      mode="aspectFill"></image>
               <!-- <image src="/static/images/banner.jpg" mode="widthFix"></image> -->
            </view>
         </swiper-item>
      </swiper>
      <view class="shops">
         <view class="shop-item"
               v-for="(shop) in shops"
               :key="shop"
               :data-id="shop.id"
               @click="shopDetail">
            <view class="logo">
               <image :src="shop.picture" />
            </view>
            <view class="info">
               <view class="name">{{ shop.name }}</view>
               <!-- <view class="address"
                     v-if="shop.id == 58 || shop.province_id == 820302">{{ shop["city_name"] || '线上' }} {{ shop["name"] }}</view> -->
               <view >{{ shop.address }}</view>
            </view>
            <view class="tag"
                  v-if="shop.class_time && shop.class_time > 0">
               <text class="yicon1 icon-star"></text>
               <text style="margin-left: 8upx;">常用</text>
            </view>
         </view>
      </view>

      <view class="no-data"
            v-if="keyword && !shops.length">没有找到相关场馆</view>
   </view>
</template>

<script>
import { mapState } from 'vuex';
export default {
   data() {
      return {
         CustomBar: this.CustomBar,
         keyword: '',
         cityIndex: 0,
         cityList: [],
         bannerData: [],
         shops: [
            // { name: "蓝堡店", address: "北京市朝阳区世贸天阶时尚大厦15F", logo: "", },
            // { name: "蓝堡店", address: "北京市朝阳区世贸天阶时尚大厦15F", logo: "", },
            // { name: "蓝堡店", address: "北京市朝阳区世贸天阶时尚大厦15F", logo: "", },
            // { name: "蓝堡店", address: "北京市朝阳区世贸天阶时尚大厦15F", logo: "", },
         ],
         pageIndex: 1,
         pageSize: 20,
         hasMore: true,
         currentCityId: null,
         ossResize: "?x-oss-process=image/resize,m_fill,w_320,h_180",

      };
   },
   computed: mapState(['ossPath']),
   onLoad() {
      // uni.getLocation({
      //     type: 'wgs84',
      //     success: function (res) {
      //         console.log('当前位置的经度：' + res.longitude);
      //         console.log('当前位置的纬度：' + res.latitude);
      //         console.log("res====>", res);
      //     }
      // });
      this.getbannerList();
         let self = this;
         wx.getLocation({
            type: 'wgs84',
            success: function (res) {
               wx.request({
                  url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${res.latitude},${res.longitude}&key=QZDBZ-PASK6-FUZSR-E3BR7-LQPN3-OFBCB&get_poi=1`, data: {},
                  success: function (ops) {
                     console.log("=========opts", ops.data.result.ad_info);
                     let result = ops.data.result;
                     let adcode = (result.ad_info && result.ad_info.adcode) || '';
                     console.log(result.ad_info, "是啊");
                     self.getCurrentCityCode(adcode);
                  }
               });
            }
         });
      this.getCityList();
      // this.getHallList(true);
   },

   onReachBottom() {
      if (!this.hasMore) return;
      this.getHallList();
   },
   onPullDownRefresh() {
      uni.showNavigationBarLoading();
      this.getHallList(true);
   },
   methods: {
      getbannerList() {
         this.api.get("mix/cms/index/material/detail", { label: "pro_sec_banner" }).then(data => {
            if (data.content.length) {
               // let config = data[0].config;
               this.bannerData = data.content;
            }
         });
      },
      getCityList() {
         this.api.get("/api/hall/initial/data/open/city", {}, this.$other).then(data => {
            this.cityList = data || [];
            this.$store.commit("setCityList", data || []);
            if (this.currentCityId) {
               this.setCurrentCity();
            }
         });
      },
      getHallList(isReset) {
         let params = {
            page: isReset ? 1 : this.pageIndex + 1,
            size: this.pageSize,
         };
         if (this.keyword) {
            params.name = this.keyword;
         }
         if (this.cityList.length) {
            params.cityId = this.cityList[this.cityIndex].id;
         }

         this.api.get("/api/hall/initial/data/open/hall", params, this.$other).then(ret => {
            let shops = [];
            if (isReset) {
               shops = ret.records || [];
            } else {
               shops = this.shops.concat(ret.records);
            }
            shops.forEach(shop => {
               if (Array.isArray(shop.picturesList)) {
                  shop.picture = shop.picturesList[0].picturesList;
               }
            });
            this.shops = shops;
            console.log(this.shops);
            this.pageIndex = ret.pages;
            if (ret.pages > ret.current) {
               this.hasMore = true;
            } else {
               this.hasMore = false;
            }

            uni.hideNavigationBarLoading();
            uni.stopPullDownRefresh();
         });
      },
      getCurrentCityCode(id) {
         if (!id) return;
         let params = {
            locationId: id,
         };
         this.api.get("/api/hall/initial/data/open/location/city", params, this.$other).then(ret => {
            if (ret.id) {
               this.currentCityId = ret.id;
               this.setCurrentCity();
            }
         });
      },
      setCurrentCity() {
         if (this.cityList.length) {
            let cityIndex = 0;
            this.cityList.forEach((city, index) => {
               if (city.id == this.currentCityId) {
                  cityIndex = index;
               }
            });
            if (cityIndex != this.cityIndex) {
               this.cityIndex = cityIndex;
               this.getHallList(true);
            }
         }
      },
      swiperChange() {

      },
      search() {
         console.log("keyword", this.keyword);
         this.getHallList(true);
      },
      cityChange(event) {
         this.cityIndex = event.detail.value;
         this.getHallList(true);
      },
      shopDetail(event) {
         const { id } = event.currentTarget.dataset;
         uni.navigateTo({
            url: '/pages/reservation/detail/index?id=' + id,
         });
      },
      bannerDetail(event) {
         // uni.navigateTo({
         //     url: "/pages/news/detail/index?label=advertisement"
         // })
         const { index } = event.currentTarget.dataset;
         let data = this.bannerData[index];
         console.log("index=====>", data);

         if (data.linkType == 10 && data.link) { // 文章
            uni.navigateTo({
               url: "/pages/news/detail/index?id=" + data.link,
            });
         } else if (data.linkType == 20 && data.link) {
            if (data.link.indexOf("mnp://") > -1) {
               uni.navigateTo({
                  url: data.link.split("mnp:/")[1],
               });
            }
         } else if (data.linkType == 30 && data.link) {
            if (data.link.indexOf("http://") > -1 || data.link.indexOf("https://") > -1) {
               uni.navigateTo({
                  url: "/pages/webview/index?url=" + data.link,
               });
            }
         }
      },
   }
}
</script>

<style lang="scss">
.handle-bar {
   display: flex;
   padding: 16upx 32upx;
   background-color: white;
   &.position-sticky {
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 10;
   }
   .picker {
      height: 60upx;
      display: flex;
      align-items: center;
      font-size: 30upx;
      color: #484f55;
      .yicon {
         margin-left: 8upx;
      }
   }
}
.search-box {
   flex: 1;
   margin-left: 16upx;
   // width: 100%;
   z-index: 12;
   box-sizing: border-box;
   background-color: white;

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
      background: #f5f5f5;
      border-radius: 40upx;
   }
   .search-icon {
      margin-left: 24upx;
      width: 34upx;
      height: 34upx;
      display: inline-block;
   }
}

.banner {
   margin-top: 32upx;
   margin-bottom: 32upx;
   height: 260upx;
   &-item {
      width: 100%;
      height: 100%;
      transform: translate(0%, 0%) translateZ(0px);
      will-change: auto;
      padding: 0 32upx;
      box-sizing: border-box;
      .banner-image-box {
         border-radius: 20upx;
         overflow: hidden;
      }
   }
   image {
      vertical-align: top;
      width: 100%;
      height: 260upx;
   }
}

.shops {
   padding: 0 32upx;
   padding-top: 32upx;
}
.shop-item {
   margin-bottom: 32upx;
   display: flex;
   position: relative;
   .logo {
      width: 320upx;
      height: 180upx;
      border-radius: 8upx;
      overflow: hidden;
      image {
         width: 100%;
         height: 100%;
      }
   }
   .info {
      flex: 1;
      margin-left: 24upx;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
   }
   .name {
      font-size: 30upx;
      color: #222527;
      margin-bottom: 16upx;
   }
   .address {
      font-size: 24upx;
      color: #999999;
   }
   .tag {
      position: absolute;
      top: 0;
      right: 32upx;
      padding: 4upx 16upx;
      background: #ff5b52;
      border-radius: 0px 0px 12upx 12upx;
      font-size: 20upx;
      color: white;
      line-height: 28upx;
      .yicon1 {
         font-size: 18upx;
      }
   }
}
.no-data {
   text-align: center;
}
</style>
