<template>
	<view class="login-wrapper">
		<view class="title">
			你好!
		</view>
		<view class="title">
			欢迎登录XXX
		</view>
		<view class="form" v-if="usepsd==false">
			<view class="tel">
				<view class="left">
					<view class="text">
						手机号
					</view>
					<input class="tel-input" type="text" placeholder="请输入手机号" v-model="telNum" />
				</view>
			</view>
			<view class="code">
				<view class="left">
					<view class="text">
						验证码
					</view>
					<input class="code-input" type="text" placeholder="请输入验证码" v-model="code" />
				</view>
				<view class="" @click="getCodeClick" v-if="!isWaiting">
					获取验证码
				</view>
				<view class="" v-if="isWaiting">
					{{seconds}}后再试
				</view>
			</view>
		</view>
		<view class="form" v-if="usepsd==true">
			<view class="tel">
				<view class="left">
					<view class="text">
						手机号
					</view>
					<input v-model="telNum" class="tel-input" type="text" placeholder="请输入手机号" />
				</view>
			</view>
			<view class="code">
				<view class="left">
					<view class="text">
						密码
					</view>
					<input v-model="pwdForm.pwd" class="code-input" type="text" placeholder="请输入密码" />
				</view>

			</view>
		</view>
		<view class="agree">
			<label>
				<checkbox :value="icCheck" /><text></text>
			</label>
			<view class="text">
				已阅读
			</view>
			<view class="black">
				《用户协议》
			</view>
			<view class="text">
				和
			</view>
			<view class="black">
				《隐私政策》

			</view>
		</view>
		<button class="logbtn" type="default" @click="login">登录</button>
		<!-- <button class="logbtn" type="default" @click="loginByPsd">密码登录</button> -->
		<button class="logbtn" type="default" @click="goRegister">去注册</button>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		loginByPwd,
		getCode,
		verifyCode
	} from '../../api';
	const isCheck = ref(false)
	const isWaiting = ref(false)
	const seconds = ref(10)
	const telNum = ref(null)
	const code = ref(null)

	function goRegister() {
		uni.navigateTo({
			url: '/pages/register/register'
		})
	}

	const usepsd = ref(false)
	const pwdForm = ref({
		tel: null,
		pwd: ''
	})

	function loginByPsd() {
		usepsd.value = !usepsd.value
	}

	async function login() {
		if (isCheck == false) {
			uni.showToast({
				title: '请勾选协议',
				duration: 2000
			});
			return
		}
		const obj = {
			telNum: telNum.value,
			code: code.value
		}
		const res = await verifyCode(obj)

		console.log(res, 'resssssssss');
	}
	async function getCodeClick() {
		if (isWaiting.value) return; // 如果正在等待，直接返回

		// 设置为等待状态
		isWaiting.value = true;

		// 调用获取验证码的函数
		const res = await getCode(telNum.value);

		console.log(res, 'ressssssssss');

		// 启动定时器
		const timer = setInterval(() => {
			seconds.value -= 1;

			if (seconds.value <= 0) {
				clearInterval(timer); // 清除定时器
				isWaiting.value = false; // 允许再次点击
				seconds.value = 10; // 重置秒数
			}
		}, 1000); // 每秒减1
	}
</script>

<style lang="scss" scoped>
	.login-wrapper {
		padding: 30rpx;
	}

	.title {
		font-size: 60rpx;
	}

	.tel {
		display: flex;
		border-bottom: 1px solid gray;
		width: 90vw;
		margin-top: 80rpx;
		gap: 30rpx;
		align-items: center;

		.left {
			display: flex;
			gap: 20rpx;
		}

		.text {
			font-size: 40rpx;
		}

	}



	.code {
		display: flex;
		border-bottom: 1px solid gray;
		width: 90vw;
		margin-top: 80rpx;
		gap: 30rpx;
		align-items: center;
		justify-content: space-between;

		.left {
			display: flex;
			gap: 20rpx;
			align-items: center;
		}

		.text {
			font-size: 40rpx;
		}

	}

	.agree {
		display: flex;
		align-items: center;
		margin-top: 70rpx;

		.text {
			color: gray;

		}

		.black {
			color: black;
			font-weight: bold;
		}
	}

	.logbtn {
		background-color: grey;
		color: white;
		margin-top: 30rpx;
		border-radius: 50rpx;
	}
</style>