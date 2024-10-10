<template>
	<view class="product-list">
		<view class="product-item" v-for="(item,index) in 9">
			<view class="top">
				<view class="left">
					<image class="small-card" src="../../static/card.png" mode=""></image>
					<view class="name">
						平安京东激活
					</view>
					<view class="box">
						<view class="text">
							自动结算
						</view>
					</view>
				</view>

				<view class="right">
					<view class="text">
						详细说明
					</view>
					<image style="width: 30rpx;height: 30rpx;" src="../../static/trangle.png" mode=""></image>

				</view>
			</view>
			<view class="line">

			</view>
			<view class="middle">
				<view class="left">
					<view class="my">
						<view style="display: flex;align-items: center;">
							<view class="text">
								我的结算价
							</view>
							<image style="width: 30rpx;height: 30rpx;" src="../../static/me.png" mode=""></image>
						</view>
					</view>
					<view class="price">
						￥220
					</view>
				</view>
				<view class="right">
					<view class="my">
						<view style="display: flex;align-items: center;">
							<view class="text">
								团队结算价
							</view>
							<image style="width: 30rpx;height: 30rpx;" src="../../static/us.png" mode=""></image>
						</view>
					</view>
					<view class="price">
						￥220
					</view>
				</view>
			</view>
			<view class="bottom">
				<view class="">
					推广码
				</view>
				<view class="">
					11
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.product-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		align-items: center;
		padding: 30rpx;

		.product-item {
			background-color: white;
			width: 90vw;
			border-radius: 30rpx;
			position: relative;
			padding-bottom: 120rpx;

			.line {
				width: 600rpx;
				margin-left: 30rpx;
				border-bottom: 1px solid darkgray;
				margin-bottom: 20rpx;
			}

			.top {
				display: flex;
				justify-content: space-between;
				padding: 20rpx;


				.left {
					display: flex;
					align-items: center;
					gap: 5rpx;

					.small-card {
						width: 50rpx;
						height: 50rpx;
					}

					.name {
						font-size: 40rpx;
						font-weight: bold;
					}

					.box {
						border: 1px solid blue;
						color: blue;

						.text {
							font-weight: bold;
						}
					}
				}

				.right {
					display: flex;
					align-items: center;
				}
			}

			.middle {
				display: flex;
				justify-content: space-around;

				.left {
					width: 30vw;
					background-color: blue;
					border-radius: 30rpx;
					padding: 30rpx;

					.my {
						color: white;
					}

					.price {
						color: white;
					}
				}

				.right {
					width: 30vw;
					background-color: red;
					border-radius: 30rpx;
					padding: 30rpx;

					.my {
						color: white;
					}

					.price {
						color: white;
					}
				}


			}

			.bottom {
				position: absolute;
				right: 20rpx;
				display: flex;
				margin-top: 30rpx;
				border-radius: 30rpx;
				border: 1px solid blue;
				color: blue;
				padding-left: 30rpx;
				padding-right: 30rpx;
				padding-top: 10rpx;
				padding-bottom: 10rpx;
			}
		}
	}
</style>