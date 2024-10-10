<template>
	<view class="nav-var">
		订单
	</view>
	<view class="top-box">
		<view class="order-tabs">
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
		<view class="search-box">
			<uni-search-bar class="search-bar" @confirm="search" :focus="true" v-model="searchValue" @blur="blur"
				@focus="focus" @input="input" @cancel="cancel" @clear="clear">
			</uni-search-bar>
			<button class="search-btn" type="primary">搜索</button>
		</view>
		<view class="tabs-container">
			<!-- 标签容器 -->
			<view class="order-tabs">
				<view style="" v-for="(tab, index) in tabs" :key="index" @click="selectTab(index)"
					:class="{ 'tab-item': true, 'active': currentIndex === index }">
					{{ tab.title }}
				</view>
				<!-- 小横条 -->
				<view class="indicator" :style="{ transform: `translateX(${currentIndex * (1200 / tabs.length)}%)` }">
				</view>
			</view>

		</view>
		<view class="card-list">
			<view class="single">
				<view class="top">
					<view class="left">
						<view class="name">
							熊鑫
						</view>
						<view class="num">
							15344442222
						</view>
					</view>
					<view class="right">
						浏览记录>>
					</view>
				</view>
				<view class="content">
					<view class="left">
						<image class="img" src="../../static/card.png" mode=""></image>
						<view class="name">
							农业银行
						</view>
					</view>
					<view class="right">
						<view class="item">
							<view class="key">
								订单编号:
							</view>
							<view class="value">
								6555
							</view>
						</view>
						<view class="item">
							<view class="key">
								最高奖励:
							</view>
							<view class="value">
								30元
							</view>
						</view>
						<view class="item">
							<view class="key">
								订单凭证:
							</view>
							<view class="value" style="color: skyblue;">
								上传图片
							</view>
						</view>
						<view class="item">
							<view class="key">
								订单状态:
							</view>
							<view class="value">
								浏览记录
							</view>
						</view>
						<view class="item">
							<view class="key">
								订单编号:
							</view>
							<view class="value">
								6555
							</view>
						</view>
						<view class="item">
							<view class="key">
								进件时间:
							</view>
							<view class="value" style="text-wrap: wrap;width: 150rpx;">
								2024-09-09 16：13：24
							</view>
						</view>

					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	const currentIndex = ref(0)
	const tabs = ref([{
			title: '全部',
			description: '这是标签 1 的内容'
		},
		{
			title: '已登记',
			description: '这是标签 2 的内容'
		},
		{
			title: '已核卡',
			description: '这是标签 3 的内容'
		},
		{
			title: '已完成',
			description: '这是标签 3 的内容'
		},
		{
			title: '未通过',
			description: '这是标签 3 的内容'
		},
		{
			title: '已失效',
			description: '这是标签 3 的内容'
		},
		{
			title: '非新客户',
			description: '这是标签 3 的内容'
		}
	])

	function selectTab(index) {
		currentIndex.value = index;
	}
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

	.top-box {
		display: flex;
		flex-direction: column;
		padding-left: 20rpx;
		padding-right: 20rpx;

		.order-tabs {
			display: flex;

			.item {
				display: flex;
				flex-direction: column;
				border-radius: 30rpx;
				background-color: white;
				width: 200rpx;
				height: 150rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				.down {
					margin-top: 20rpx;
					width: 80rpx;
					border-bottom: 9rpx solid blue;
					margin-left: 10rpx;
				}
			}
		}

		.search-box {
			background-color: white;
			border-radius: 30rpx;
			display: flex;
			align-items: center;

			.search-bar {
				flex-grow: 1;
			}

			.search-btn {
				height: 70rpx;
				display: flex;
				align-items: center;
				border-radius: 40rpx;
				padding-left: 40rpx;
				padding-right: 40rpx;
			}
		}
	}


	.tabs-container {
		width: 100vw;
	}

	.order-tabs {
		display: flex;
		position: relative;
		background-color: #f0f0f0;
		border-bottom: 1px solid #ddd;
		gap: 10rpx;
	}

	.tab-item {
		width: 90rpx;
		text-align: center;
		display: flex;
		align-items: center;
		font-size: 22rpx;
		cursor: pointer;
		color: #333;
		position: relative;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}

	.tab-item.active {
		color: #007aff;
		/* 选中状态的文字颜色 */
		font-weight: bold;
	}

	.indicator {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 2px;
		background-color: #007aff;
		/* 横条颜色 */
		width: 8%;
		/* 根据需要设置横条的宽度 */
		transition: transform 0.3s ease;
	}

	.content {
		padding: 20px;
	}

	.content-title {
		font-size: 24px;
		margin-bottom: 10px;
	}

	.content-description {
		font-size: 16px;
	}

	.order-list {
		display: flex;
		flex-direction: column;
		margin-top: 30rpx;

		.item {
			background-color: white;
			border-radius: 30rpx;
		}
	}

	.card-list {
		.single {
			margin-top: 20rpx;
			background-color: white;
			border-radius: 30rpx;
			padding: 20rpx;

			.top {
				display: flex;
				justify-content: space-between;

				.left {
					display: flex;
					align-items: center;
					gap: 20rpx;
				}

				.name {
					font-size: 40rpx;
				}

				.num {
					font-size: 40rpx;
				}
			}

			.content {
				display: flex;
				gap: 40rpx;

				.left {
					.name {
						border: #007aff 1px solid;
						border-radius: 10rpx;
						text-align: center;
						color: #007aff;
						font-size: 40rpx;
						padding-top: 10rpx;
						padding-bottom: 10rpx;
					}
				}

				.right {
					display: flex;
					flex-direction: column;
					gap: 10rpx;

					.item {
						display: flex;
						gap: 10rpx;
						align-items: center;

						.value {
							font-size: 24rpx;
						}
					}
				}

				.img {
					width: 200rpx;
					height: 200rpx;
				}
			}
		}
	}
</style>