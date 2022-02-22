<template>
    <view class="page">
        <!-- <home v-if="nowPageIndex == 0"></home>
        <news v-if="nowPageIndex == 1"></news>
        <reservation v-if="nowPageIndex == 2"></reservation>
        <shop v-if="nowPageIndex == 3"></shop>
        <user v-if="nowPageIndex == 4"></user> -->

        <home :class="{ show: nowPageIndex == 0, hide: nowPageIndex != 0 }"></home>
        <news  :class="{ show: nowPageIndex == 1, hide: nowPageIndex != 1 }"></news>
        <reservation  :class="{ show: nowPageIndex == 2, hide: nowPageIndex != 2 }"></reservation>
        <shop  :class="{ show: nowPageIndex == 3, hide: nowPageIndex != 3 }"></shop>
        <user  :class="{ show: nowPageIndex == 4, hide: nowPageIndex != 4 }"></user>

        <tab-bar></tab-bar>
    </view>
</template>
<script>
import tabBar from "../components/tabbar";
import home from "./index";
import news from "../news/index";
import reservation from '../reservation/index';
import shop from '../shop/index';
import user from '../user/home/index';
import { mapState } from 'vuex';

export default {
    components: {
        tabBar,
        home,
        news,
        reservation,
        shop,
        user,
    },
    data() {
        return {
            
        }
    },
    computed: mapState(['nowPageIndex']),
    methods: {

    }
}
</script>
<style>
.show {
    display: block;
}
.hide {
    display: none;
}
</style>