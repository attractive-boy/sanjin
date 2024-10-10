<template>
	<view class="self-wrapper">
		<view class="table">
			<view class="table-item">
				<view class="name">
					头像
				</view>
				<view class="right">
					<image class="head" :src="tableData.url" mode=""></image>
					<uni-icons type="right" size="30"></uni-icons>
				</view>
			</view>
			<view class="table-item">
				<view class="name">
					姓名
				</view>
				<view class="right">
					<view class="">
						{{tableData.name}}
					</view>
					<uni-icons type="right" size="30"></uni-icons>
				</view>
			</view>
			<view class="table-item">
				<view class="name">
					手机号
				</view>
				<view class="right">
					<view class="">
						{{tableData.tel}}
					</view>
					<uni-icons type="right" size="30"></uni-icons>
				</view>
			</view>
			<view class="table-item">
				<view class="name">
					收款卡号
				</view>
				<view class="right">
					<view class="">
						{{tableData.cardNum}}
					</view>
					<uni-icons type="right" size="30"></uni-icons>
				</view>
			</view>
		</view>
		<button class="logout" type="primary" @click="logOut">安全退出</button>
		<view class="delete">
			<view class="text">
				注销账号
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	const searchVal = ref('')
	const tableData = ref({
		url: '../../static/head.png',
		name: 'sanjin',
		tel: 15922223333,
		cardNum: 12214412124412
	})
	const pageSize = ref(10)
	const pageCurrent = ref(1)
	const total = ref(0)
	const loading = ref(false)

	function logOut() {
		uni.removeStorageSync('userData')
		uni.navigateTo({
			url: '/pages/login/login'
		})
	}
</script>

<style lang="scss" scoped>
	.table {
		display: flex;
		flex-direction: column;
		width: 100%;

		.table-item {
			display: flex;
			justify-content: space-between;
			background-color: white;
			padding: 30rpx;
			align-items: center;

			.right {
				display: flex;
				align-items: center;
			}

			.head {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}
		}
	}

	.logout {
		width: 70vw;
		margin-top: 50rpx;
		margin-bottom: 50rpx;
	}

	.delete {
		opacity: 0.7;
		display: flex;
		justify-content: center;
	}
</style>