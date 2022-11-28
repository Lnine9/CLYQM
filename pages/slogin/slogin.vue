<template>
	<view>
		<view class="sun-index">
			<view class="sun-logo-box">
				<view class="sun-logo">
					<image class="sun-icon-img" src="../../static/scan.png" />
				</view>
			</view>
			<view class="sbuilding" v-if="building"><text>{{building + '·' +batch}}</text></view>
			<view class="sun-login-box">
				
				<view class="sun-label">
					<image style="width: 28rpx;height:39rpx;" />
					<text class="label-text">学号</text>
				</view>
				<view class="sun-input-box">
					<input v-model="no" type="text" :style="{color: needbind ?'#3c3c3c': '#a7a7a7'}" :disabled="!needbind" placeholder="请输入学号" placeholder-class="placeholder-class" />
				</view>
			</view>
			<view class="sun-login-box">
				<view class="sun-label">
					<image style="width: 29rpx;height:37rpx;" />
					<text class="label-text">姓名</text>
				</view>
				<view class="sun-input-box">
					<input v-model="name" type="text" :style="{color: needbind ?'#3c3c3c': '#a7a7a7'}" :disabled="!needbind" placeholder="请输入姓名" placeholder-class="placeholder-class" />
				</view>
			</view>
			<view class="sbuilding" style="color: gray;font-size: 16px;font-weight: normal;"><text>{{sbuilding ? `您的楼栋：${sbuilding}`: ''}}</text></view>
			<view class="login-btn-box" v-if="needbind">
				<view class="login-btn" @click="handleSubmit">确认绑定</view>
			</view>
			<view class="login-btn-box" v-if="!needbind && !onlybind">
				<view class="login-btn" @click="scan">确认检测</view>
			</view>
		</view>
		<view class="pop" v-if="success">
			<view class="notiico">
				<icon type="success" size="130"></icon>
				<text class="notimsg" style="font-size: 24px;font-weight: bold;">{{building}}</text>
				<text class="notimsg" style="font-size: 16px;color: #5d5d5d;">{{no}}</text>
				<text class="notimsg" style="font-size: 16px;color: #5d5d5d;">{{name}}</text>
				<text class="notimsg" style="color:#1ce3a8;font-weight: bold;">{{msg}}</text>
			</view>
		</view>
		<view class="pop" v-if="fails">
			<view class="notiico">
				<icon type="warn" size="130"></icon>
				<text class="notimsg" style="font-size: 24px;font-weight: bold;">{{building}}</text>
				<text class="notimsg" style="font-size: 16px;color: #5d5d5d;">{{no}}</text>
				<text class="notimsg" style="font-size: 16px;color: #5d5d5d;">{{name}}</text>
				<text class="notimsg" style="color:#c8214e;font-weight: bold;">{{msg}}</text>
			</view>
		</view>
		<view class="pop" v-if="needlogin">
			<view>
				<view class="sun-logo-box">
					<view class="sun-logo">
						<image class="sun-icon-img" src="../../static/scan.png" />
					</view>
				</view>
				<view class='loginmsg'>
					<view>请先进行微信授权登录</view>
				</view>
				<view class="login-btn-box" style="bottom: 300rpx;">
					<view class="login-btn" @click="wxlogin">授权登录</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import {api} from './api.js'
	export default {
		data() {
			return {
				no: '',
				name: '',
				building: '',
				batch: '',
				success: false,
				fails: false,
				msg: '',
				wxcode: '',
				wxid: undefined,
				needlogin: false,
				needbind: false,
				historyId: '000000',
				onlybind: false,
				sbuilding: '',
			}
		},
		onLoad(params) {
			console.log('初始参数');
			console.log(params);
			if (params.scene) { // 二维码解析进入
				// 获取scene中的数据
				let scene = decodeURIComponent(params.scene);
				console.log(scene);
				this.historyId = scene
				if (!this.historyId) {
					uni.showToast({
						icon: 'error',
						title: '二维码信息错误，请重新扫码',
						duration: 2000
					})
					return
				}
			}
			if(this.historyId == '000000'){
				this.onlybind = true
			}
			console.log(this.$data);
		},
		onShow() {
			console.log('loading cache wxid');
			const that = this
				
			if (!this.onlybind){
				this.getHistory()
			}
			
			uni.getStorage({
			    key: 'swxid',
			    success: function (res) {
			        console.log(res.data);
			        let cachewxid = res.data;
					if (cachewxid) {
						that.wxid = cachewxid
						that.needlogin = false
						that.getInfo()
					} else {
						that.needlogin = true
					}
			    },
				fail: function (err) {
					console.log(err);
					that.needlogin = true
				},
			});
		},
		methods: {
			getHistory() {
				const that = this
				api.getHistory({
					historyId: this.historyId
				}).then(res => {
					if (res.data.code == 200) {
						that.batch = res.data.data.batch
						that.building = res.data.data.building
					} else {
						this.fails = true
						this.msg = '参数错误，请重新扫码'
					}
				}).catch(err => {
					console.log(err);
					this.fails = true
					this.msg = '参数错误，请重新扫码'
				})
			},
			getInfo() {
				const that = this
				uni.showLoading({
					mask:true,
					title: "查询信息中...",
				})
				if (this.wxid){
					api.getStudent({
						wechatId: this.wxid
					}).then(res => {
						console.log(res);
						if (res.data.code == 200) {
							that.no = res.data.data.studentId
							that.name = res.data.data.studentName
							that.sbuilding = res.data.data.building
							that.needbind = false
						} else {
							that.needbind = true
							uni.showToast({
								title: "请绑定信息",
								icon: 'none'
							})
							
						}
					}).catch(err => {
						console.log(err);
						uni.showToast({
							title: "网络错误, 请重新扫码",
							icon: 'none'
						})
						that.fails = true
						that.msg = "网络错误, 请重新扫码"
					})
				}
				uni.hideLoading()
			},
			scan() {
				console.log('scaning');
				console.log(this.historyId);
				uni.showLoading({
					title: '正在确认信息...',
				})
				const that = this
				if (this.historyId) {
					if (!this.wxid){
						this.needlogin = true;
						uni.hideLoading()
						return
					}
					api.scan({
						wechatId: that.wxid,
						historyId: that.historyId,
					}).then(res => {
						console.log(res.data);
						if (res.data.code == 200) {
							that.success = true
							that.msg = res.data.message
						} else {
							if (res.data.message == '用户未绑定！'){
								uni.showToast({
									title: "请绑定信息",
									icon: 'none'
								})
								that.needbind = true
							} else {
								that.fails = true
								that.msg = '确认失败，请重新扫码'
								if (res.data.message){
									that.msg = res.data.message
								}
							}
						}
						
					}).catch(err => {
						console.log(err);
						uni.showToast({
							title: "确认失败，请重新扫码",
							icon: 'none'
						})
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '信息有误，请重新扫码',
						duration: 3000
					})
					that.fails = true
					that.msg = '信息有误，请重新扫码'
				}
				uni.hideLoading()
			},
			bind() {
				console.log('bind');
				const that = this
				api.bind({
					studentName: this.name,
					studentId: this.no,
					wechatId: this.wxid,
					historyId: this.historyId,
				}).then(res => {
					console.log(res);
					if (res.data.code == 200) {
						uni.showToast({
							title: '绑定成功',
							icon: 'success',
							duration: 1000
						})
						that.needbind = false
						// 仅需绑定即可
						console.log(that.onlybind);
						if (that.onlybind) {
							that.success = true
							if (res.data.data){
								that.building = res.data.data.building
							}
							that.msg = '绑定成功'
						}
					} else {
						uni.showToast({
							title: res.data.message,
							duration: 3000,
							icon: 'none',
						})
						that.needbind = true
					}
				}).catch(err => {
					console.log(err);
					uni.showToast({
						title: "网络错误，请稍后重试",
						icon: 'none'
					})
				})
			},
			handleSubmit() {
				if (!this.no) return uni.showToast({
					title: '请输入学号',
					icon: 'none',
					duration: 1500
				})
				if (!this.name) return uni.showToast({
					title: '请输入姓名',
					icon: 'none',
					duration: 1500
				})
				const that = this
				uni.showModal({
					title: '请确认信息',
					content: `学号：${this.no}\n姓名：${this.name}`,
					success(res) {
						if (res.cancel) {
							return
						}
						that.bind()
					}
				})
			},
			wxlogin() {
				let that = this
				//调用微信小程序的登录接口
				uni.login({
					provider: "weixin",
					success(res) {
						console.log(res);
						that.wxcode = res.code 
						api.getWxid({
							code: res.code
						}).then(res => {
							console.log(res);
							if(res.data){
								that.wxid = res.data
								uni.setStorage({
									key: 'swxid',
									data: res.data,
								})
								that.needlogin = false
								uni.showToast({
									icon:'none',
									title: '登录成功',
									duration: 1000
								})
								that.getInfo()
							} else {
								uni.showToast({
									icon:'error',
									title: '登录失败,请重新扫码',
									duration: 1000
								})
							}
						})
					},
					fail(e) {
						console.log('fail', e)
						uni.showToast({
							title: '网络异常',
							duration: 1000
						})
						return
					}
				})
			}
		}
	}
</script>

<style scoped>
	.sun-logo-box {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 750rpx;
		height: 300rpx;
	}

	.sun-logo {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 180rpx;
		height: 180rpx;
		border-radius: 15rpx;
		box-shadow: 5rpx 5rpx 30rpx rgba(167, 200, 190, 0.5);
	}

	.close-icon {
		width: 36rpx;
		height: 34rpx;
	}

	.sun-icon-img {
		width: 100%;
		height: 100%;
	}

	.sun-login-box {
		padding: 20rpx 60rpx;
	}

	.sun-label {
		display: flex;
		align-items: center;
	}

	.label-text {
		margin-left: 16rpx;
		font-weight: 500;
		color: #272e2d;
		font-size: 32rpx;
	}

	.sun-input-box {
		display: flex;
		align-items: center;
		height: 100rpx;
		border-bottom: 1rpx solid #eee;
		padding: 0px 20rpx;
		margin: 0px 15rpx;
		font-size: 30rpx;
	}

	.sun-input-box input {
		flex: 1;
	}

	.placeholder-class {
		font-size: 30rpx;
		color: #C0C0C0;
	}

	.sun-tip {
		display: flex;
		justify-content: space-between;
		padding: 0rpx 68rpx;
	}

	.sun-tip-text {
		color: #30C6B3;
	}

	.login-btn-box {
		position: absolute;
		bottom: 200rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 500rpx;
		padding: 50rpx 68rpx 0rpx;
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

	.pop {
		position: absolute;
		z-index: 10000;
		top: 0;
		width: 100vw;
		height: 100vh;
		background-color: white;
		transition: all .5s linear;
	}

	.notiico {
		position: absolute;
		top: 25%;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 70%;
	}

	.notimsg {
		margin-top: 30rpx;
		font-size: 18px;
	}

	.loginmsg {
		position: absolute;
		font-size: 18px;
		top: 50%;
		left: 50%;
		transform: translateX(-50%);
		color: #3f3f3f;
	}
	uni-modal .uni-modal__bd{      
	    white-space: pre-wrap;      
	}
	
	.sbuilding{
		width: 100%;
		display: flex;
		justify-content: center;
		text-align: center;
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 20px;
		letter-spacing: 0.2rem;
	}
</style>
