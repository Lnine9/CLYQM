<template>
	<view>
		<view class="sun-index">
			<view class="sun-logo-box">
				<view class="sun-logo">
          <image src='@/static/manager.png'></image>
          <view class='logotxt'>检测助手</view>
				</view>
			</view>
      <view class="tags">
        <view class='tagslabel'>可登入者：</view>
        <u-tag plain style='width: 3rem' text="管理员"></u-tag>
        <u-tag plain style='width: 6rem;margin-left: 10px' text="数据统计人员"></u-tag>
      </view>
			<view class="sun-login-box">
				<view class="sun-label">
					<image style="width: 28rpx;height:39rpx;" />
					<u-text prefix-icon='account-fill' iconStyle="font-size: 18px" class="label-text" text='账号'></u-text>
				</view>
				<view class="item" :class="'sun-input-box ' + nameFocus">
					<input v-model="phoneNumber" type="text" placeholder="请输入电话" placeholder-class="placeholder-class"/>
				</view>
			</view>
			<view class="sun-login-box">
				<view class="sun-label">
					<image style="width: 29rpx;height:37rpx;" />
          <u-text prefix-icon='lock-fill' iconStyle="font-size: 18px" class="label-text" text='密码'></u-text>
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
  import UImage from "../../uni_modules/uview-ui/components/u-image/u-image";
  import UTag from "../../uni_modules/uview-ui/components/u-tag/u-tag";
  import UText from "../../uni_modules/uview-ui/components/u--text/u--text";
	export default {
    components: {UText, UTag, UImage},
    data() {
			return {
				phoneNumber: '',
				password: '',
			}
		},
		methods: {
				login(){
					const { phoneNumber,password  } = this
					if(!phoneNumber) return uni.showToast({title: '请输入账号',icon:'none',duration: 1500})
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

<style lang='scss'>
  .tags{
    padding: 20rpx 70rpx;
    display: flex;
    align-content: end;

    .tagslabel{
      margin-left: 1rem;
      font-size: 16px;
      color: #30816a;
    }

    .u-tag-wrapper{
      margin-right: 0.8rem;
    }
  }
	.sun-logo-box {
		display: flex;
		justify-content: center;
    flex-direction: column;
		align-items: center;
		height: 300rpx;

    .logotxt{
      text-align: center;
      font-size: 14px;
      letter-spacing: 0.2rem;
      color: #4b4b4b;
      transform: translateX(0.2rem);
      font-weight: bold;
      margin-top: 5px;
    }
    image {
      display: block;
      width: 200rpx;
      height: 200rpx;
    }


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
