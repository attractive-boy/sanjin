<template>
	<view class="nav-bar">
		<uni-icons @click="backClick" style="position: absolute;left: 20rpx;color: white;" type="left"
			size="30"></uni-icons>

		<view class="text">
			业绩数据
		</view>
	</view>
	<view class="gradesData-wrapper">
		<view class="day">
			2024年09月17日（今日）
		</view>
		<view class="my">
			<uni-section class="mb-10 section" title="我的业绩" type="line"></uni-section>
		</view>
		<view class="team">
			<uni-section class="mb-10 section" title="团队业绩" type="line"></uni-section>
		</view>
	</view>
</template>

<script setup>
	function backClick() {
		uni.navigateBack()
	}
</script>

<style lang="scss" scoped>
	.section {
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
	}

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

	.gradesData-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30rpx;
		gap: 20rpx;
	}

	.day {
		width: 90vw;
		background-color: white;
		border-radius: 30rpx;
		padding: 30rpx;
		color: blue;
		font-size: 40rpx;
		font-weight: bold;
	}

	.my {
		width: 90vw;
		background-color: white;
		border-radius: 30rpx;
		padding: 30rpx;
	}

	.team {
		width: 90vw;
		background-color: white;
		border-radius: 30rpx;
		padding: 30rpx;
	}
</style>