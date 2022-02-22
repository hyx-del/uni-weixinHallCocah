<template>
    <view class="tab-bar" :style="{'background-color': tabBar.backgroundColor }">
        <view class="tab-bar-border"></view>
        <view class="tab-bar-item" @click="switchTab(key)" v-for="(item,key) in tabBar.list" :key="item.pagePath">
            <image :src="selected == key ? item.selectedIconPath : item.iconPath" mode=""></image>
            <view v-if="tabBar.iconType == 'top'" class="text" :style="{'color': selected === key ? tabBar.selectedColor : tabBar.color}">{{ item.text }}</view>
        </view>
    </view>
</template>

<script>
	export default {
		data() {
			return {
				// tabBar: {
                //     list: [],
                // },
			};
		},
		methods:{
			switchTab(index){
				this.$store.commit("changePage",index);
			}
		},
		computed:{
            tabBar() {
                let tabBar = this.$store.getters.getTabBar;
                if (!tabBar) {
                    return { list: [] };
                }
                tabBar.list.forEach(tab => {
                    tab.iconPath = "/static/images/tabbar/" + tab.icon + ".png";
                    tab.selectedIconPath = "/static/images/tabbar/" + tab.icon + "_select.png";
                })
                return tabBar;
            },
			selected(){
                return this.$store.state.nowPageIndex;
			}
        },
        watch: {
            // tabs(newVal, oldVal) {
            //     let tabBar = newVal;
            //     tabBar.list.forEach(tab => {
            //         tab.iconPath = "/static/images/tabbar/" + tab.icon + ".png";
            //         tab.selectedIconPath = "/static/images/tabbar/" + tab.icon + "_select.png";
            //     })
            //     this.tabBar = tabBar;
            // }
        },

	}
</script>

<style lang="scss" scoped>

.tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 48px;
    height: calc(constant(safe-area-inset-bottom) + 48px);
    height: calc(env(safe-area-inset-bottom) + 48px);
    background: white;
    display: flex;
    z-index: 1000;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .tab-bar-item {
        flex: 1;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    image {
        width: 27px;
        height: 27px;
    }
    .text {
        font-size: 10px;
    }
}

.tab-bar-border {
    background-color: rgba(0, 0, 0, 0.33);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    transform: scaleY(0.5);
}

</style>