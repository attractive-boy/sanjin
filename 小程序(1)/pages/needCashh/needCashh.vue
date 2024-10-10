<template>
	<NavigationBarVue title="我要提现"></NavigationBarVue>
	<view class="cash-wrapper">
		<view class="wallet" @click="goWallet">
			<view class="" style="display: flex;align-items: center;gap: 40rpx;">
				<image class="img" src="../../static/mymoney (1).png" mode=""></image>
				<view class="">
					钱包
				</view>
			</view>
			<uni-icons type="right"></uni-icons>
		</view>
		<view class="card" @click="goCard">
			<view class="" style="display: flex;align-items: center;gap: 40rpx;">
				<image class="img" src="../../static/bank.png" mode=""></image>
				<view class="">
					银行卡
				</view>
			</view>
			<uni-icons type="right"></uni-icons>
		</view>
	</view>
</template>


<script setup>
	import NavigationBarVue from '../../components/NavigationBar.vue';

	function goWallet() {
		uni.navigateTo({
			url: "/pages/wallet/wallet"
		})
	}

	function goCard() {
		uni.navigateTo({
			url: "/pages/bankCard/bankCard"
		})
	}
</script>

<style lang="scss" scoped>
	.cash-wrapper {
		padding: 30rpx;
		display: flex;
		gap: 30rpx;
		flex-direction: column;

		.wallet {
			background-color: white;
			border-radius: 30rpx;
			padding: 30rpx;
			display: flex;
			align-items: center;
			gap: 40rpx;
			justify-content: space-between;

			.img {
				width: 90rpx;
				height: 90rpx;
			}
		}

		.card {
			background-color: white;
			border-radius: 30rpx;
			padding: 30rpx;
			display: flex;
			align-items: center;
			gap: 40rpx;
			justify-content: space-between;

			.img {
				width: 90rpx;
				height: 90rpx;
			}
		}
	}
</style>