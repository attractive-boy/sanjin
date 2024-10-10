<template>
	<view class="nav-bar">
		<uni-icons @click="backClick" style="position: absolute;left: 20rpx;color: white;" type="left"
			size="30"></uni-icons>

		<view class="text">
			{{title}}
		</view>
	</view>
</template>

<script setup>
	import {
		defineProps
	} from 'vue';

	// 定义 props
	const props = defineProps({
		title: {
			type: String,
			default: '默认标题' // 默认值
		}
	});

	function backClick() {
		uni.navigateBack()
	}
</script>

<style lang="scss">
	.nav-bar {
		width: 100vw;
		height: 80rpx;
		margin-top: 50rpx;
		position: fixed;
		color: white;
		top: 0;
		background-color: blue;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		font-size: 40rpx;
	}
</style>