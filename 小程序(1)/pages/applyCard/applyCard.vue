<template>
	<view class="nav-bar">
		<uni-icons @click="backClick" style="position: absolute;left: 20rpx;color: white;" type="left"
			size="30"></uni-icons>

		<view class="text">
			信用卡申请
		</view>
	</view>
	<view class="applyCard-wrapper">
		<view class="content">
			<image :src="product.picPath" class="img" mode=""></image>
			<view class="form-content">
				<view class="name">
					<view class="text">
						真实姓名
					</view>
					<input class="input" placeholder="请输入姓名" type="text" v-model="orderForm.name" />
				</view>
				<view class="name">
					<view class="text">
						身份证号
					</view>
					<input class="input" placeholder="请输入身份证号" type="text" v-model="orderForm.idNum" />
				</view>
				<view class="name">
					<view class="text">
						手机号
					</view>
					<input class="input" placeholder="请输入手机号" type="text" v-model="orderForm.tel" />
				</view>
			</view>
			<button type="primary" style="border-radius: 80rpx;" @click="nextStep">下一步</button>
		</view>

	</view>
</template>

<script setup>
	import {
		getOneProduct,
		addOrder,
		validateIdentity
	} from '../../api/index.js'
	import {
		ref,
		onBeforeMount,
		onMounted
	} from 'vue';
	import {
		jwtDecode
	} from "jwt-decode"
	import {
		useRoute
	} from 'vue-router';
	const route = useRoute();
	const url = ref(null)
	const product = ref({})
	const orderForm = ref({
		name: '',
		idNum: null,
		tel: null
	})

	function backClick() {
		uni.navigateBack()
	}

	function validateName(name) {
		// 正则表达式，匹配中文字符或英文字母，长度在2到20个字符之间
		const nameRegex = /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/;

		if (!nameRegex.test(name)) {
			uni.showToast({
				title: '姓名不合格，请输入2到20个字的中文或英文字母',
				icon: 'none',
				duration: 2000 // 提示显示时间，单位毫秒
			});
			return false; // 返回 false 表示姓名不合格
		}

		return true; // 返回 true 表示姓名合格
	}

	function validateIdNumber(idNumber) {
		// 正则表达式，匹配18位身份证号
		const idNumberRegex = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[Xx\d]$/;

		if (!idNumberRegex.test(idNumber)) {
			uni.showToast({
				title: '身份证号不合格，请输入有效的身份证号码',
				icon: 'none',
				duration: 2000 // 提示显示时间，单位毫秒
			});
			return false; // 返回 false 表示身份证号不合格
		}

		return true; // 返回 true 表示身份证号合格
	}

	function validatePhoneNumber(phone) {
		// 正则表达式，匹配中国大陆的手机号
		const phoneRegex = /^1[3-9]\d{9}$/;

		if (!phoneRegex.test(phone)) {
			uni.showToast({
				title: '手机号不合格，请检查后重新输入',
				icon: 'none', // 显示无图标的提示
				duration: 2000 // 提示显示时间，单位毫秒
			});
			return false; // 返回 false 表示手机号不合格
		}

		return true; // 返回 true 表示手机号合格
	}
	async function nextStep() {
		if (!validateName(orderForm.value.name)) {
			return; // 如果姓名不合格，停止提交
		}
		if (!validateIdNumber(orderForm.value.idNum)) {
			return; // 如果身份证号不合格，停止提交
		}
		if (!validatePhoneNumber(orderForm.value.tel)) {
			return; // 如果手机号不合格，停止提交
		}
		const validateRes = await validateIdentity(orderForm.value)
		// if (validateRes.data && validateRes.data.error_code == 0) {
		// 	console.log('是0是0是0是0是0');
		// 	uni.showToast({
		// 		title: validateRes.data.reason,
		// 		duration: 2000
		// 	});
		// 	return
		// }
		console.log(validateRes, 'validateRes');
		const token = uni.getStorageSync('token'); // 从本地存储获取token
		const decoded = jwtDecode(token);
		console.log(decoded, 'decoded');
		const obj = {
			userId: decoded.id,
			productId: route.query.id
		}
		const res = await addOrder(obj)
		uni.switchTab({
			url: '/pages/index/index'
		})
		console.log(res, 'resssssssss');
	}
	async function getOneProductData(productId) {
		try {
			// 获取单个产品数据
			const productId = route.query.id; // 获取路由中的查询参数 id
			const productRes = await getOneProduct(productId);
			console.log(productRes, 'productRes');
			product.value = productRes.data.product;
			console.log(product.value, 'productproductproductproductproductproduct');
			return product; // 返回最终产品数据
		} catch (error) {
			console.error('Error fetching product or image:', error);
		}
	}
	// function decodeToken() {
	// 	const token = uni.getStorageSync('token'); // 从本地存储获取token

	// 	if (token) {
	// 		try {
	// 			const decoded = jwtDecode(token); // 解码token
	// 			console.log('解码后的token:', decoded); // 处理解码后的数据
	// 			userName.value = decoded.name
	// 			// 可以在这里处理 decoded 中的数据
	// 			// 例如，保存用户信息、权限等
	// 		} catch (error) {
	// 			console.error('解码token时出错:', error);
	// 		}
	// 	} else {
	// 		console.log('没有找到token');
	// 	}
	// }
	onBeforeMount(() => {
		getOneProductData()
		// decodeToken()
	})
</script>

<style lang="scss" scoped>
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

	.applyCard-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-left: 10rpx;
		padding-right: 10rpx;

		.content {
			background-color: white;
			padding-left: 20rpx;
			padding-right: 20rpx;
		}
	}

	.img {}

	.form-content {
		display: flex;
		flex-direction: column;
		gap: 60rpx;
		margin-bottom: 40rpx;

		.name {
			display: flex;
			flex-direction: column;
			gap: 20rpx;
		}
	}

	.input {
		background-color: darkgray;
		border-radius: 100rpx;
		height: 60rpx;
		padding-left: 30rpx;
	}
</style>