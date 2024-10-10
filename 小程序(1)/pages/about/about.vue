<template>
	<NavigationBarVue title="测试"></NavigationBarVue>
	<view class="about-wrapper">
		<view class="about-top">
			<image class="logo" src="../../static/logo.png" mode=""></image>
			<view class="bottom">
				<view class="name">
					定顺达
				</view>
				<view class="ver">
					v1.0.7
				</view>
			</view>
		</view>
		<view class="agreement" @click="goDetail">
			<view class="text">
				用户协议
			</view>
			<uni-icons type="right" size="30"></uni-icons>

		</view>
		<view class="policy" @click="goPolicy">
			<view class="text">
				隐私政策
			</view>
			<uni-icons type="right" size="30"></uni-icons>

		</view>
		<view class="account">
			XXXXXXXXXXXXX公司-版权所有
		</view>
	</view>
</template>

<script setup>
	import NavigationBarVue from '../../components/NavigationBar.vue';

	function goDetail() {
		uni.navigateTo({
			url: "/pages/about/agreement/agreement"
		})
	}

	function goPolicy() {
		uni.navigateTo({
			url: "/pages/about/policy/policy"
		})
	}
</script>

<style lang="scss" scoped>
	.about-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.about-top {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: linear-gradient(90deg, pink, purple, red, orange);
		padding: 100rpx;
		gap: 40rpx;

		.logo {
			width: 200rpx;
			height: 200rpx;
		}

		.bottom {
			display: flex;

			.name {
				color: white;
			}

			.ver {
				color: white;
			}
		}
	}

	.agreement {
		width: 100%;
		display: flex;
		justify-content: space-between;
		background-color: white;
		padding: 30rpx;
		align-items: center;
		border-bottom: 1px solid lightgray;

		.text {
			margin-left: 40rpx;
		}

	}

	.policy {
		width: 100%;
		display: flex;
		justify-content: space-between;
		background-color: white;
		padding: 30rpx;
		align-items: center;
		border-bottom: 1px solid lightgray;

		.text {
			margin-left: 40rpx;
		}

	}

	.account {
		margin-top: 40rpx;
		font-size: 40rpx;
		opacity: 0.6;
	}
</style>