<template>
	<view class="nav-bar">
		<uni-icons @click="backClick" style="position: absolute;left: 20rpx;color: white;" type="left"
			size="30"></uni-icons>

		<view class="text">
			立即荐卡
		</view>
	</view>
	<view class="recWrapper">
		<view class="content">
			<view class="title">
				{{product.name}}
			</view>
			<view class="second-title">
				dwwqddwqdqw
			</view>
			<image :src="product.picPath" mode=""></image>
			<view class="sec">
				<uni-section class="mb-10 section" titleFontSize="40rpx" title="推荐时间" type="line">
				</uni-section>
				<view class="section-content">
					{{product.limitTime}}
				</view>
			</view>
			<view class="text">
				{{product.description}}
			</view>
			<view class="" v-for="i in product.desPicPaths"
				style="display:flex;flex-direction: column;align-items: center;">
				<image style="width: 50vw;height: 50vw;" :src="i" mode=""></image>
			</view>
			<view class="special-title">
				特别提示
			</view>
			<view class="special">
				{{product.special}}
			</view>
		</view>
	</view>
	<button type="default" class="share">我要分享</button>
	<button type="primary" class="apply" @click="goApply">立即申请</button>
</template>

<script setup>
	import {
		getOneImg,
		getOneProduct,
	} from '../../api/index.js'

	import {
		ref,
		onBeforeMount,
		onMounted
	} from 'vue';
	import {
		useRoute
	} from 'vue-router';
	const route = useRoute();
	const product = ref({})

	function backClick() {
		uni.navigateBack()
	}
	async function getOneProductData(productId) {
		try {
			// 获取单个产品数据
			const productRes = await getOneProduct(productId);
			console.log(productRes, 'productRes');
			product.value = productRes.data.product;
			console.log(product.value, 'productproductproductproductproductproduct');

			// // 获取单个图片数据
			// const imageRes = await getOneImg(productId);
			// console.log(imageRes, 'imageRes');

			// if (imageRes) {
			// 	// 关联图片数据
			// 	product.value.picUrl = imageRes.url; // 假设只取一张图片，或根据实际需求调整
			// 	product.value.desPics = imageRes.desPics; // 假设只取一张图片，或根据实际需求调整
			// }
			// uni.showModal({
			// 	title: '特别提示',
			// 	content: `${product.value.special}`,
			// 	showCancel: false, // 不显示取消按钮
			// 	success: (res) => {
			// 		if (res.confirm) {
			// 			console.log('用户点击确定');
			// 		}
			// 	}
			// });
			// console.log('最终的产品数据:', product.value);
			return product; // 返回最终产品数据
		} catch (error) {
			console.error('Error fetching product or image:', error);
		}
	}

	function goApply() {
		uni.navigateTo({
			url: `/pages/applyCard/applyCard?id=${route.query.id}`
		})
	}
	onBeforeMount(() => {
		const productId = route.query.id; // 获取路由中的查询参数 id
		if (productId) {
			getOneProductData(productId); // 将 id 传递给 getOneProductData 函数
		}
	})
	onMounted(() => {

	})
</script>

<style lang="scss" scoped>
	.section {
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		transform: translateX(-30rpx);
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

	.recWrapper {
		padding: 30rpx;

		.content {
			background-color: white;
			border-radius: 30rpx;
			padding: 30rpx;
			padding-bottom: 200rpx;
			display: flex;
			flex-direction: column;
			gap: 30rpx;

			.title {
				font-size: 40rpx;
				font-weight: bold;
			}
		}
	}

	.share {
		position: fixed;
		left: 40rpx;
		bottom: 40rpx;
		width: 40vw;
		height: 100rpx;
		border-radius: 70rpx;
		border: 1px solid blue;
		text-align: center;
		line-height: 100rpx;
		color: blue;

	}

	.apply {
		position: fixed;
		right: 40rpx;
		bottom: 40rpx;
		width: 40vw;
		height: 100rpx;
		border-radius: 70rpx;
		text-align: center;
		line-height: 100rpx;
	}

	.special-title {
		font-weight: bold;
	}

	.uni-modal {
		background-color: blue;
	}
</style>