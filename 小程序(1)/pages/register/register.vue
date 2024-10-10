<template>
	<view class="login-wrapper">
		<view class="title">你好!</view>
		<view class="title">欢迎注册XXX</view>
		<view class="tel">
			<view class="left">
				<view class="text">姓名</view>
				<input v-model="registerForm.name" class="tel-input" type="text" placeholder="请输入姓名" />
			</view>
		</view>
		<view class="tel">
			<view class="left">
				<view class="text">身份证</view>
				<input v-model="registerForm.idNum" class="tel-input" type="text" placeholder="请输入身份证" />
			</view>
		</view>
		<view class="tel">
			<view class="left">
				<view class="text">手机号</view>
				<input v-model="registerForm.tel" class="tel-input" type="text" placeholder="请输入手机号" />
			</view>
		</view>
		<view class="code">
			<view class="left">
				<view class="text">验证码</view>
				<input v-model="registerForm.code" class="code-input" type="text" placeholder="请输入验证码" />
			</view>
			<view class="">获取验证码</view>
		</view>
		<view class="agree">
			<label>
				<checkbox v-model="icCheck" /><text></text>
			</label>
			<view class="text">已阅读</view>
			<view class="black">《用户协议》</view>
			<view class="text">和</view>
			<view class="black">《隐私政策》</view>
		</view>
		<button class="logbtn" type="default" @click="submit">注册</button>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		submitRegister
	} from '../../api/index.js'
	const icCheck = ref(false);

	const registerForm = ref({
		name: '',
		role: 'user',
		idNum: '',
		tel: null,
	});

	function submit() {
		submitRegister(registerForm.value)


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