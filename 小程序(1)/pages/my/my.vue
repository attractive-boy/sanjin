<template>
	<view class="nav-var" @click="goLogin">
		我的
	</view>
	<view class="wrapper">
		<view class="self-box">
			<image @click="goSelf" class="head" src="../../static/head.png" mode=""></image>
			<view class="right">
				<view class="item">
					<view class="name">
						昵称:
					</view>
					<view class="name-value">
						{{userName}}
					</view>
				</view>
				<view class="item">
					<view class="key">
						工号:
					</view>
					<view class="value">
						11513
					</view>
				</view>
				<view class="item">
					<view class="key">
						成长值:
					</view>
					<view class="value">
						6天
					</view>
				</view>
			</view>
		</view>
		<view class="income-box">
			<uni-section class="mb-10 section" title="我的收入" type="line"></uni-section>
			<view class="income-count">
				<view class="left">
					<view class="num">
						0.00元
					</view>
					<view class="text">
						已提现
					</view>
				</view>
				<view class="middle">
					|
				</view>
				<view class="right">
					<view class="num">
						{{account}}元
					</view>
					<view class="text">
						未提现
					</view>
				</view>
			</view>
			<button class="income-btn" type="primary" @click="goIneed">我要提现</button>
		</view>
		<view class="data-box">
			<uni-section class="mb-10 section" title="业绩数据" type="line"
				style="display: flex;justify-content: space-between;align-items: center;">
				<uni-icons type="right" size="20" @click="goGradesData"></uni-icons>

			</uni-section>
			<view class="content">
				<view class="person">
					<view class="title">
						个人
					</view>
					<view class="line">

					</view>
					<view class="order">
						<view class="">
							今日订单
						</view>
						<view class="count">
							0
						</view>
					</view>
					<view class="income">
						<view class="">
							今日收入
						</view>
						<view class="count">
							0
						</view>
					</view>
				</view>
				<view class="team">
					<view class="title">
						团队
					</view>
					<view class="line">

					</view>
					<view class="order">
						<view class="">
							今日订单
						</view>
						<view class="count">
							0
						</view>
					</view>
					<view class="income">
						<view class="">
							今日收入
						</view>
						<view class="count">
							0
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="my-service">
			<uni-section class="mb-10 section" title="我的服务" type="line"></uni-section>
			<view class="content">
				<view class="my-team">
					<image class="team" src="../../static/team.png" mode=""></image>
					<view class="" @click="goMyTeam">
						我的团队
					</view>
				</view>
				<view class="invite" @click="goInvite">
					<uni-icons type="plusempty" size="30"></uni-icons>

					<view class="">
						邀请加入
					</view>
				</view>
			</view>
		</view>
		<view class="team-service">
			<view class="" style="width: 100%;">
				<uni-section class="mb-10 section" title="团队服务" type="line"></uni-section>
			</view>
			<view class="content">
				<view class="service-item" @click="goProduct">
					产品管理
				</view>
				<view class="service-item">
					个人信息
				</view>
				<view class="service-item">
					服务中心
				</view>
				<view @click="goAbout" class="service-item">
					关于我们
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onBeforeMount,
		onMounted
	} from 'vue';
	import {
		jwtDecode
	} from "jwt-decode"
	import {
		onShow
	} from '@dcloudio/uni-app'; // 导入 onShow
	import {
		getUserAccount
	} from '../../api';
	const userName = ref('')
	const account = ref(0)

	function goSelf() {
		uni.navigateTo({
			url: '/pages/self/self'
		})
	}

	function goAbout() {
		uni.navigateTo({
			url: '/pages/about/about'
		})
	}

	function goProduct() {
		uni.navigateTo({
			url: '/pages/product/product'
		})
	}

	function goMyTeam() {
		console.log(11);
		uni.navigateTo({
			url: '/pages/myTeam/myTeam'
		})
	}

	function goInvite() {
		uni.navigateTo({
			url: '/pages/invite/invite'
		})
	}

	function goLogin() {
		uni.navigateTo({
			url: '/pages/login/login'
		})
	}

	function goGradesData() {
		uni.navigateTo({
			url: '/pages/gradesData/gradesData'
		})
	}

	function goIneed() {
		uni.navigateTo({
			url: '/pages/needCashh/needCashh'
		})
	}

	function decodeToken() {
		const token = uni.getStorageSync('token'); // 从本地存储获取token

		if (token) {
			try {
				const decoded = jwtDecode(token); // 解码token
				console.log('解码后的token:', decoded); // 处理解码后的数据
				userName.value = decoded.name
				// 可以在这里处理 decoded 中的数据
				// 例如，保存用户信息、权限等
			} catch (error) {
				console.error('解码token时出错:', error);
			}
		} else {
			console.log('没有找到token');
		}
	}
	async function getUserData() {
		const token = uni.getStorageSync('token'); // 从本地存储获取token
		if (token) {
			try {
				const decoded = jwtDecode(token); // 解码token
				const res = await getUserAccount(decoded.id)
				account.value = res.data.account

			} catch (error) {
				console.error('解码token时出错:', error);
			}
		} else {
			console.log('没有找到token');
		}
	}
	onShow(() => {
		getUserData()
	})
	onBeforeMount(() => {
		decodeToken()
	})
</script>

<style lang="scss" scoped>
	.nav-var {
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

	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		padding: 20rpx;

		.self-box {
			border-radius: 30rpx;
			background-color: white;
			display: flex;
			padding: 20rpx;
			gap: 30rpx;
			align-items: center;

			.head {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
			}

			.right {
				display: flex;
				flex-direction: column;
				gap: 20rpx;

				.item {
					display: flex;
					gap: 20rpx;

					.name {
						color: darkgrey;
					}

					.name-value {
						color: darkgray;
					}
				}
			}
		}

		.income-box {
			background-color: white;
			border-radius: 30rpx;
			padding-bottom: 30rpx;

			.income-count {
				display: flex;
				gap: 60rpx;
				background-color: white;
				justify-content: center;

				.num {
					font-size: 60rpx;
					font-weight: bold;
				}
			}

			.left {
				display: flex;
				flex-direction: column;
				align-items: center;
			}

			.right {
				display: flex;
				flex-direction: column;
				align-items: center;
			}

			.income-btn {
				width: 400rpx;
				margin-top: 60rpx;
				border-radius: 80rpx;
			}
		}

	}

	.data-box {
		display: flex;
		flex-direction: column;
		background-color: white;
		border-radius: 30rpx;
		padding-bottom: 30rpx;

		.content {
			display: flex;
			justify-content: center;
			gap: 30rpx;
		}

		.person {
			background-color: greenyellow;
			width: 300rpx;
			border-radius: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 20rpx;
			padding-top: 30rpx;
			padding-bottom: 30rpx;

			.title {
				color: green;
				font-size: 40rpx;
				font-weight: bold;
			}

			.line {
				border-bottom: 1px solid black;
				width: 200rpx;
			}

			.order {
				display: flex;
				width: 70%;
				justify-content: space-between;
				align-items: center;

				.count {
					font-size: 40rpx;
					font-weight: bold;
					color: green;
				}
			}

			.income {
				display: flex;
				width: 70%;
				justify-content: space-between;

				.count {
					font-size: 40rpx;
					font-weight: bold;
					color: green;
				}
			}
		}

		.team {
			background-color: mediumpurple;
			width: 300rpx;
			border-radius: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 20rpx;
			padding-top: 30rpx;
			padding-bottom: 30rpx;

			.title {
				color: green;
				font-size: 40rpx;
				font-weight: bold;
			}

			.line {
				border-bottom: 1px solid black;
				width: 200rpx;
			}

			.order {
				display: flex;
				width: 70%;
				justify-content: space-between;
				align-items: center;

				.count {
					font-size: 40rpx;
					font-weight: bold;
					color: green;
				}
			}

			.income {
				display: flex;
				width: 70%;
				justify-content: space-between;

				.count {
					font-size: 40rpx;
					font-weight: bold;
					color: green;
				}
			}
		}
	}

	.section {
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
	}

	.my-service {
		background-color: white;
		border-radius: 30rpx;
		display: flex;
		flex-direction: column;
		padding-bottom: 30rpx;

		.content {
			display: flex;
			gap: 20rpx;
			justify-content: center;

			.my-team {
				display: flex;
				align-items: center;
				background-color: lightcoral;
				border-radius: 30rpx;
				width: 300rpx;
				justify-content: center;
				height: 120rpx;

				.team {
					width: 90rpx;
					height: 90rpx;
				}
			}

			.invite {
				display: flex;
				align-items: center;
				background-color: mediumpurple;
				border-radius: 30rpx;
				width: 300rpx;
				justify-content: center;
				height: 120rpx;

				.team {
					width: 90rpx;
					height: 90rpx;
				}
			}
		}
	}

	.team-service {
		display: flex;
		flex-direction: column;
		background-color: white;
		align-items: center;
		padding-bottom: 30rpx;
		border-radius: 30rpx;

		.content {
			display: flex;
			gap: 40rpx;
			width: 600rpx;
			flex-wrap: wrap;
			justify-content: center;

			.service-item {
				border: 1px solid blue;
				padding-left: 60rpx;
				padding-right: 60rpx;
				border-radius: 50rpx;
				padding-bottom: 10rpx;
				padding-top: 10rpx;
				color: blue;

			}
		}
	}
</style>