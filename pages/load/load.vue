<template>
	<view>
		<view class="sun-index">
			<view class="sun-logo-box">
				<view class="sun-logo">
					<text>核酸助手</text>
				</view>
			</view>
			<view class="sun-login-box">
				<view class="sun-label">
					<image style="width: 28rpx;height:39rpx;" />
					<text class="label-text">电话</text>
				</view>
				<view class="item" :class="'sun-input-box ' + nameFocus">
					<input v-model="phoneNumber" type="text" placeholder="请输入电话" placeholder-class="placeholder-class"/>
				</view>
			</view>
			<view class="sun-login-box">
				<view class="sun-label">
					<image style="width: 29rpx;height:37rpx;" />
					<text class="label-text">密码</text>
				</view>
				<view class="sun-input-box">
					<input v-model="password" type="password" placeholder="请输入密码" placeholder-class="placeholder-class"/>
				</view>
			</view>
			<view class="login-btn-box">
				<view class="login-btn" @click="login">确认</view>
			</view>
			
		</view>
	</view>


</template>


<script>
	import {api} from './api.js'
	export default {
		data() {
			return {
				phoneNumber: '',
				password: '',
			}
		},
		methods: {
				login(){
					const { phoneNumber,password  } = this
					if(!phoneNumber) return uni.showToast({title: '请输入电话',icon:'none',duration: 1500})
					if(!password) return uni.showToast({title: '请输入密码',icon:'none',duration: 1500})
					const data = {
						userId:phoneNumber,
						password,
					}
					try{
						api.login(data).then(res => {
							const { code } = res.data;
							if(code === 200){
								uni.navigateTo({
									url:`/pages/detectionHistory/detectionHistory?phone=${phoneNumber}`
								})
							}else{
								uni.showToast({title: '密码不对，请重新输入',icon:'none',duration: 1500})
							}
						})
					}catch(e){
						//TODO handle the exception
						console.log(e)
						uni.showToast({title: '网络错误，请稍后重试',icon:'none',duration: 1500})
					}
					
				}
		}
	}
</script>

<style>
	.sun-logo-box {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 750rpx;
		height: 300rpx;
	}
	.login-btn {
		height: 82rpx;
		border-radius: 41rpx;
		background-color: #12C8B9;
		box-shadow: -1px 12px 11px 0px rgba(16, 170, 157, 0.4);
		text-align: center;
		line-height: 82rpx;
		font-size: 36rpx;
		font-weight: 500;
		color: #fff;
	}
	.login-btn-box {
		position: absolute;
		bottom: 200rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 500rpx;
		padding: 50rpx 68rpx 0rpx;
	}
	
	.placeholder-class {
		font-size: 30rpx;
		color: #C0C0C0;
	}
	
	.label-text {
		margin-left: 16rpx;
		font-weight: 500;
		color: #272e2d;
		font-size: 30rpx;
	}
	
	.sun-label {
		display: flex;
		align-items: center;
	}
	.sun-login-box {
		padding: 20rpx 60rpx;
	}
	.sun-input-box {
		display: flex;
		align-items: center;
		height: 100rpx;
		border-bottom: 1rpx solid #eee;
		padding: 0px 20rpx;
		margin: 0px 15rpx;
	}

	.sun-input-box input {
		flex: 1;
	}
</style>
