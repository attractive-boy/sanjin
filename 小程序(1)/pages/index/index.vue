<template>
	<view class="nav-bar">
		<view class="left">
			<uni-icons color="white" type="location" size="30"></uni-icons>
			<view class="location-text">
				成都市
			</view>
		</view>
		<view class="title">
			首页
		</view>
	</view>
	<view class="wrapper">
		<view class="swiper">
			<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration">
				<swiper-item>
					<image class="lunboImg" src="../../static/lunbo1.png" mode=""></image>
				</swiper-item>
				<swiper-item>
					<image class="lunboImg" src="../../static/lunbo2.png" mode=""></image>
				</swiper-item>

			</swiper>
		</view>
		<view class="middle">
			<view class="recommend">
				<view class="title">
					<text class="text">今日推荐</text>
				</view>
				<view class="name">
					<view class="left">
						农业银行
					</view>
					<view class="right">
						核卡
					</view>
				</view>
				<view class="time">
					荐卡时间：2024年4月-6月
				</view>
				<image class="card" src="../../static/card.png" mode=""></image>
				<view class="bottom">
					<view class="left">
						<image class="icon" src="../../static/money-funds.png" mode=""></image>
						<view class="count">
							30
						</view>
						<view class="text">
							元最高奖励
						</view>
					</view>
					<view class="right">
						立即荐卡
					</view>

				</view>
			</view>
			<view class="notice">
				<view class="title">
					<view class="text">
						最新公告
					</view>
				</view>
				<view class="notice-list">
					<view class="item">
						<view class="content">
							恭喜您XXXXXX
						</view>
						<view class="time">
							2024-04-02
						</view>
					</view>
					<view class="item">
						<view class="content">
							风险投诉最新XXX
						</view>
						<view class="time">
							2024-04-02
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="tabs">
			<view class="item">
				<view class="text">
					信用卡
				</view>
				<view class="down">

				</view>
			</view>
			<view class="item">
				<view class="text">
					综金
				</view>
				<view class="down">

				</view>
			</view>
		</view>
		<view class="list-box">
			<view class="side-bar">
				<view class="item" v-for="(item,index) in sideBar" :key="index" @click="selectSide(index)"
					:class="{ 'active': item.selected }">
					<view class="text">
						{{item.title}}
					</view>
				</view>
			</view>
			<view class="content">
				<view class="item" v-for="(item,index) in products" :key="index">
					<view class="recommend">
						<view class="title">
							<text class="text">今日推荐</text>
						</view>
						<view class="name">
							<view class="left">
								{{item.name}}
							</view>
							<view class="right">
								核卡
							</view>
						</view>
						<view class="time">
							荐卡时间：{{item.limitTime}}
						</view>
						<image class="card" :src="item.picPath" mode=""></image>
						<view class="bottom">
							<view class="left">
								<image class="icon" src="../../static/money-funds.png" mode=""></image>
								<view class="count">
									{{item.reward}}
								</view>
								<view class="text">
									元最高奖励
								</view>
							</view>
							<view class="right" @click="goImmediate(item.id)">
								立即荐卡
							</view>

						</view>
					</view>
					<view class="line">

					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		jwtDecode
	} from "jwt-decode"
	import {
		ref,
		onBeforeMount
	} from 'vue';
	import {
		getProducts,
		getImages,
		addViewRecord
	} from '../../api/index.js'
	const indicatorDots = ref(true)
	const autoplay = ref(true)
	const interval = ref(2000)
	const duration = ref(500)
	const products = ref([])
	const userId = ref(null)
	const sideBar = ref([{
			title: '全部',
			description: '这是全部的内容',
			selected: false
		},
		{
			title: '首刷',
			description: '这是首刷的内容',
			selected: false
		},
		{
			title: '激活',
			description: '这是激活的内容',
			selected: false
		},
		{
			title: '核卡',
			description: '这是核卡的内容',
			selected: false
		},
		{
			title: '分级',
			description: '这是分级的内容',
			selected: false
		}
	])
	const selectedItem = ref()

	function selectSide(index) {
		sideBar.value.forEach((item) => {
			item.selected = false
		})
		sideBar.value[index].selected = true
	}

	function changeIndicatorDots(e) {
		indicatorDots.value = !indicatorDots.value
	}

	function changeAutoplay(e) {
		autoplay.value = !autoplay.value
	}

	function intervalChange(e) {
		interval.value = e.target
	}

	function durationChange(e) {
		duration.value = e.target
	}

	function goImmediate(index) {
		addViewRecord(userId.value, index)
		uni.navigateTo({
			url: `/pages/immediateRecommend/immediateRecommend?id=${index}`
		})
	}
	async function getProductsData() {
		try {
			// 获取产品数据
			const productRes = await getProducts();
			console.log(productRes, 'productRes');
			products.value = productRes.data;
			// console.log(products.value, 'products');

			// // 获取图片数据
			// const imageRes = await getImages();
			// const resData = imageRes;


			// products.value.forEach((product) => {
			// 	const matchedImage = resData.find((image) => image.id === product.id);
			// 	if (matchedImage) {
			// 		// 假设图片的URL是基于产品名和文件名的路径
			// 		product.picUrl = matchedImage.url;
			// 	}
			// });

			// console.log(imageRes, 'imageRes');
			// console.log(products.value, 'products');
		} catch (error) {
			console.error('Error fetching products or images:', error);
		}
	}



	onBeforeMount(() => {
		getProductsData()
		const token = uni.getStorageSync('token'); // 从本地存储获取token
		if (token) {
			try {
				const decoded = jwtDecode(token); // 解码token
				console.log('解码后的token:', decoded); // 处理解码后的数据
				userId.value = decoded.id
				// 可以在这里处理 decoded 中的数据
				// 例如，保存用户信息、权限等
			} catch (error) {
				console.error('解码token时出错:', error);
			}
		} else {
			console.log('没有找到token');
		}
	})
</script>

<style lang="scss" scoped>
	.wrapper {
		padding: 40rpx;
		display: flex;
		flex-direction: column;
		gap: 30rpx;
	}

	.nav-bar {
		width: 100vw;
		height: 80rpx;
		margin-top: 50rpx;
		position: fixed;
		top: 0;
		background-color: lightblue;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;

		.left {
			position: absolute;
			left: 0;
			display: flex;
			align-items: center;
		}

		.location-text {
			color: white;
		}

		.title {
			color: white;
		}
	}

	.lunboImg {
		width: 100%;
		height: 100%;
	}

	.middle {
		display: flex;
		gap: 20rpx;
	}

	.recommend {
		display: flex;
		flex-direction: column;
		width: 480rpx;
		border-radius: 40rpx;
		background-color: white;
		padding: 20rpx;
		gap: 10rpx;

		.title {
			width: 170rpx;
			height: 50rpx;
			background-color: lightcoral;
			display: flex;
			align-items: center;
			justify-content: center;

			.text {
				color: white;
			}
		}

		.name {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left {
				font-size: 50rpx;
				color: black;
				font-weight: bold;
			}

			.right {
				color: blue;
				font-size: 40rpx;
			}
		}

		.time {
			font-size: 20rpx;
			opacity: 0.6;
		}

		.card {
			width: 200rpx;
			height: 150rpx;
		}

		.bottom {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left {
				display: flex;
				align-items: center;

				.count {
					color: blue;
				}

				.icon {
					width: 50rpx;
					height: 50rpx;
					fill: blue;
				}
			}

			.right {
				background-color: blue;
				color: white;
				border-radius: 30rpx;
				padding-left: 20rpx;
				padding-right: 20rpx;
				font-size: 20rpx;
				padding-top: 10rpx;
				padding-bottom: 10rpx;
			}
		}
	}

	.notice {
		flex-grow: 1;
		background-color: white;
		padding: 20rpx;
		border-radius: 40rpx;

		.notice-list {
			display: flex;
			flex-direction: column;
			gap: 20rpx;
		}

		.title {
			background-color: lightcoral;
			width: 160rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 20rpx;
		}

		.content {
			margin-bottom: 10rpx;
		}

		.time {
			opacity: 0.6;
		}
	}

	.tabs {
		display: flex;
		gap: 30rpx;

		.item {
			display: flex;
			flex-direction: column;
		}

		.text {
			font-size: 40rpx;
			font-weight: bold;
		}

		.down {
			width: 70%;
			border-bottom: 2rpx solid blue;
			margin-top: 10rpx;
			margin-left: 20rpx;
		}
	}

	.list-box {
		display: flex;

		.side-bar {
			.item {
				width: 160rpx;
				height: 160rpx;
				border-top-left-radius: 30rpx;
				border-bottom-left-radius: 30rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.item.active {
				background-color: white;
				/* 选中状态的背景颜色 */
			}
		}

		.content {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			border-radius: 30rpx;

			.item {
				background-color: white;
				border-top-right-radius: 30rpx;
				border-top-left-radius: 30rpx;
				width: 100%;

				.line {
					border-bottom: 1px solid darkgray;
					width: 70%;
					margin-left: 80rpx;
				}
			}
		}
	}
</style>