<template>
	<view class="container page-bg">
		<cu-custom bgColor="bg-white">
            <block slot="content">商城</block>
        </cu-custom>
	</view>
</template>

<script>
    import {  mapState } from 'vuex';
	export default {
		data() {
			return {
				title: 'Hello'
			}
        },
        computed: mapState(['ossPath']),
		onLoad() {
            console.log("ossPath===>", this.ossPath);
        },
		methods: {

		}
	}
</script>

<style>

</style>
