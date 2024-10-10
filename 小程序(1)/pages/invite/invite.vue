<template>
	<view class="invite-wrapper">
		<image class="img" style="" src="../../static/invite.png" mode=""></image>
		<view class="bottom">
			<view class="text">
				长按上面的图片，保存或转发给好友
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

<style lang="scss">
	.invite-wrapper {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
		align-items: center;
		padding-top: 190rpx;

		.img {
			width: 400rpx;
			height: 700rpx;

			transform: scale(1.4);
		}

		.bottom {
			background-color: gray;
			height: 90rpx;
			width: 100vw;
			position: fixed;
			bottom: 0;
			display: flex;
			justify-content: center;
			align-items: center;

			.text {
				color: white;
				font-size: 35rpx;
				font-weight: bold;
			}
		}
	}
</style>