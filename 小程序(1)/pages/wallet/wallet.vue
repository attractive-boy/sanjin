<template>
	<NavigationBarVue title="钱包提现"></NavigationBarVue>
	<view class=""
		style="width: 100vw;height: 100vh;background-color: white;display: flex;flex-direction: column;align-items: center;gap: 50rpx;padding-top: 100rpx;">
		<image src="../../static/mymoney (1).png" mode="" style="width: 300rpx;height: 300rpx;"></image>
		<view class="" style="font-size: 50rpx;">
			我的钱包
		</view>
		<view class="" style="font-size: 90rpx;font-weight: bold;">
			￥{{money}}
		</view>
		<button type="primary" @click="handleClick">我要提现</button>
	</view>
	<uni-popup ref="inputDialog" type="dialog">
		<uni-popup-dialog ref="inputClose" mode="input" title="输入内容" value="" placeholder="请输入金额"
			@confirm="dialogInputConfirm"></uni-popup-dialog>
	</uni-popup>
</template>

<script setup>
	import NavigationBarVue from '../../components/NavigationBar.vue';
	import {
		ref,
		onBeforeMount,
		onMounted
	} from 'vue';
	import {
		jwtDecode
	} from "jwt-decode"
	import {
		applyCash,
		getUserAccount
	} from '../../api';
	import {
		onShow
	} from '@dcloudio/uni-app'; // 导入 onShow
	const money = ref(0)
	const inputDialog = ref(null)
	const type = ref('center')

	function handleClick() {
		console.log(inputDialog, 'inputDialog');
		inputDialog.value.open(type)
	}
	async function dialogInputConfirm(value) {
		const token = uni.getStorageSync('token'); // 从本地存储获取token
		const decoded = jwtDecode(token); // 解码token
		console.log(decoded, 'decoded');
		console.log(decoded.id, 'decoded.id');
		console.log(value, 'value');
		const obj = {
			userId: decoded.id,
			count: value
		}
		const res = await applyCash(obj)
		// uni.showToast({
		// 	title: res.message
		// })
		console.log(res, 'res');
	}
	async function getUserData() {
		const token = uni.getStorageSync('token'); // 从本地存储获取token
		if (token) {
			try {
				const decoded = jwtDecode(token); // 解码token
				const res = await getUserAccount(decoded.id)
				money.value = res.data.account

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
</script>

<style lang="scss" scoped>

</style>