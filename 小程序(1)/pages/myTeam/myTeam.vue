<template>
	<view class="teamList">
		<view class="myTeam-box">
			<view class="top">
				<uni-section class="mb-10 section" title="团队业绩" type="line"></uni-section>
				<view class="right">
					<view class="cur">
						当前<text class="num">0</text>/人
					</view>
					<view class="new">
						昨日新增<text class="num">0</text>/人
					</view>
				</view>
			</view>
			<view class="content">
				<view class="no">
					<image style="width: 270rpx;height: 270rpx;" src="../../static/noData.png" mode=""></image>
					<view class="" style="color: darkgray;">
						没有找到相关的内容
					</view>
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
	.section {
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
	}

	.teamList {
		padding: 30rpx;

		.myTeam-box {
			background-color: white;
			padding: 30rpx;

			.top {
				display: flex;
				justify-content: space-between;

				.right {
					display: flex;
					align-items: center;
					gap: 30rpx;

					.num {
						color: blue;
					}
				}
			}

			.content {
				display: flex;
				justify-content: center;
			}
		}
	}
</style>