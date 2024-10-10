const baseUrl = 'http://localhost:3000'
import qs from 'qs';
// 封装请求函数
function request(options) {
	// 请求拦截器：在请求发起前进行处理
	const token = uni.getStorageSync('token'); // 从本地存储中获取 token
	if (token) {
		if (!options.header) options.header = {};
		options.header['Authorization'] = `Bearer ${token}`; // 自动添加 token 到请求头
	}

	return new Promise((resolve, reject) => {
		uni.request({
			...options, // 解构 options 参数
			success: (res) => {
				// 响应拦截器：处理响应数据
				if (res.statusCode === 200) {
					// 请求成功
					resolve(res.data);
				} else {
					// 统一处理错误，比如 token 过期
					if (res.statusCode === 401) {
						uni.showToast({
							title: '登录失效，请重新登录',
							icon: 'none'
						});
						// 可以跳转到登录页面
						uni.redirectTo({
							url: '/pages/login/login'
						});
					} else {
						// 其他错误
						uni.showToast({
							title: res.data.message || '请求失败',
							icon: 'none'
						});
					}
					reject(res);
				}
			},
			fail: (err) => {
				// 请求失败处理
				uni.showToast({
					title: '网络请求失败',
					icon: 'none'
				});
				reject(err);
			}
		});
	});
}

export function submitRegister(registerForm) {
	uni.request({
		url: `${baseUrl}/addUser`, // 请求的 URL
		method: 'POST', // 请求方法
		data: registerForm,
		success: (res) => {
			console.log('请求成功:', res.data); // 处理成功的响应
		},
		fail: (err) => {
			console.log('请求失败:', err); // 处理失败的响应
		}
	});
}

export function loginByPwd(form) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseUrl}/loginByPwd`, // 请求的 URL
			method: 'POST', // 请求方法
			data: form,
			success: (res) => {
				console.log('请求成功:', res.data); // 处理成功的响应
				const token = res.data.token;
				uni.setStorageSync('token', token);
				console.log(token, 'token');
				if (res.statusCode == 200) {
					uni.showToast({
						title: res.data.message
					})
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
				resolve(res); // 返回响应数据
			},
			fail: (err) => {
				console.log('请求失败:', err); // 处理失败的响应
				reject(err); // 返回错误信息
			}
		});
	});
}


export function getProducts() {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseUrl}/getAllProducts`, // 请求的 URL
			method: 'GET', // 请求方法
			success: (res) => {
				console.log('请求成功:', res.data); // 处理成功的响应
				resolve(res); // 使用 resolve 返回成功的结果
			},
			fail: (err) => {
				console.log('请求失败:', err); // 处理失败的响应
				reject(err); // 使用 reject 返回错误信息
			}
		});
	});
}

export function getOneProduct(id) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseUrl}/getOneProduct?productId=${id}`, // 请求的 URL
			method: 'GET', // 请求方法
			success: (res) => {
				console.log('请求成功:', res.data); // 处理成功的响应
				resolve(res); // 使用 resolve 返回成功的结果
			},
			fail: (err) => {
				console.log('请求失败:', err); // 处理失败的响应
				reject(err); // 使用 reject 返回错误信息
			}
		});
	});
}


export function getImages() {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseUrl}/getAllProductImages`, // 请求的 URL
			method: 'GET', // 请求方法
			success: (res) => {
				if (res && res.data && res.data.images) {
					// 转换 Base64 图片数据为 Data URL
					const imagesWithUrls = res.data.images.map(image => ({
						fileName: image.fileName,
						url: image.base64Image,
						id: image.id
					}));
					console.log('获取的图片:', imagesWithUrls);
					resolve(imagesWithUrls); // 返回图片数据
				} else {
					console.error('未找到图片数据');
					reject(new Error('未找到图片数据')); // 如果没有图片数据，返回错误
				}
			},
			fail: (err) => {
				console.log('获取图片失败:', err); // 处理失败的响应
				reject(err); // 返回错误信息
			}
		});
	});
}

export function getOneImg(id) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseUrl}/getOneImage`, // 请求的 URL
			method: 'GET', // 请求方法
			data: {
				id
			}, // 通过查询参数传递整个对象
			success: (res) => {
				if (res && res.data && res.data.base64Image) {
					// 转换 Base64 图片数据为 Data URL
					const imageData = {
						url: res.data.base64Image,
						desPics: res.data.desPicsBase64Images
					};
					console.log('获取的图片:', imageData);
					resolve(imageData); // 返回单个图片数据对象
				} else {
					console.error('未找到图片数据');
					reject(new Error('未找到图片数据')); // 如果没有图片数据，返回错误
				}
			},
			fail: (err) => {
				console.log('获取图片失败:', err); // 处理失败的响应
				reject(err); // 返回错误信息
			}
		});
	});
}


export function addViewRecord(userId, productId) {
	uni.request({
		url: `${baseUrl}/addViewRecord`, // 请求的 URL
		method: 'POST', // 请求方法
		data: {
			userId: userId,
			productId: productId
		},
		success: (res) => {
			console.log('请求成功:', res.data); // 处理成功的响应
		},
		fail: (err) => {
			console.log('请求失败:', err); // 处理失败的响应
		}
	});
}


export function addOrder(obj) {
	uni.request({
		url: `${baseUrl}/addOrder`, // 请求的 URL
		method: 'POST', // 请求方法
		data: {
			userId: obj.userId,
			productId: obj.productId
		},
		success: (res) => {
			console.log('请求成功:', res.data); // 处理成功的响应
		},
		fail: (err) => {
			console.log('请求失败:', err); // 处理失败的响应
		}
	});
}

export function validateIdentity(obj) {
	const requestData = qs.stringify({
		cardNo: obj.idNum,
		realName: obj.name
	});
	console.log('请求数据:', requestData); // 打印请求数据
	return new Promise((resolve, reject) => {
		uni.request({
			url: `https://zidv2.market.alicloudapi.com/idcheck/Post`, // 请求的 URL
			method: 'POST', // 请求方法
			header: {
				'Authorization': 'APPCODE ad81c7ce31b44f5781f6b3d84b8449a8', // 设置 Authorization 头
				'Content-Type': 'application/x-www-form-urlencoded' // 设置内容类型
			},
			data: {
				cardNo: obj.idNum,
				realName: obj.name
			},
			success: (res) => {
				console.log(res, '验证身份res');
				// if (re.statusCode == 200) {
				// 	uni.showToast({
				// 		title: '身份验证成功',
				// 		icon: 'success',
				// 		duration: 2000
				// 	});
				// }
				resolve(res); // 返回成功的数据
			},
			fail: (err) => {
				// uni.showToast({
				// 	title: '身份验证失败',
				// 	icon: 'none',
				// 	duration: 2000
				// });
				console.log('请求失败:', err); // 处理失败的响应
				reject(err); // 返回错误信息
			}
		});
	});
}

export function getCode(tel) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseUrl}/sendCode`, // 请求的 URL
			method: 'POST', // 请求方法
			data: {
				phone_number: tel
			},
			success: (res) => {
				console.log('请求成功:', res.data); // 处理成功的响应
				uni.showToast({
					title: '验证码发送成功',
					icon: 'success',
					duration: 2000
				});
				resolve(res.data); // 成功时返回数据
			},
			fail: (err) => {
				console.log('请求失败:', err); // 处理失败的响应
				uni.showToast({
					title: '验证码发送失败',
					icon: 'none',
					duration: 2000
				});
				reject(err); // 失败时返回错误
			}
		});
	});
}

export function verifyCode(obj) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseUrl}/verifyCode`, // 请求的 URL
			method: 'POST', // 请求方法
			data: {
				phone_number: obj.telNum,
				input_code: obj.code
			},
			success: (res) => {
				console.log('请求成功:', res.data); // 处理成功的响应
				uni.showToast({
					title: '登录成功',
					icon: 'success',
					duration: 2000
				});
				uni.setStorageSync('token', res.data.token)
				uni.switchTab({
					url: '/pages/index/index'
				})
				resolve(res.data); // 成功时返回数据
			},
			fail: (err) => {
				console.log('请求失败:', err); // 处理失败的响应
				uni.showToast({
					title: '登录失败失败',
					icon: 'none',
					duration: 2000
				});
				reject(err); // 失败时返回错误
			}
		});
	});
}

export function getUserAccount(id) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseUrl}/get-account?userId=${id}`, // 请求的 URL
			method: 'GET', // 请求方法
			success: (res) => {
				console.log('请求成功:', res.data); // 处理成功的响应
				resolve(res); // 使用 resolve 返回成功的结果
			},
			fail: (err) => {
				console.log('请求失败:', err); // 处理失败的响应
				reject(err); // 使用 reject 返回错误信息
			}
		});
	});
}

export function applyCash(obj) {
	uni.request({
		url: `${baseUrl}/add-cash-apply`, // 请求的 URL
		method: 'POST', // 请求方法
		data: {
			userId: obj.userId,
			count: obj.count
		},
		success: (res) => {
			uni.showToast({
				title: res.data.message
			})
			console.log('请求成功:', res.data); // 处理成功的响应
		},
		fail: (err) => {
			console.log('请求失败:', err); // 处理失败的响应
		}
	});
}