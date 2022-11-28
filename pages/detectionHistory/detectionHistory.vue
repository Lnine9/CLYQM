<template>
	<view>
		<view class="container">
			<view>{{phoneNumber}}</view>
			<image src="/static/detectionHistory/add.png" class="img" @click="add()"></image>
		</view>
		<view style="width: 100%;height: 150rpx;"></view>
		<view class="list">
			<view class="flex_col" @longpress="onLongPress" :class="{'active':pickerUserIndex==index}"
				@tap="listTap(index)" v-for="(item,index) in deteList" :key="index" :data-index="index">
				<view class="flex_grow">
					<view class="flex_col">
						<view class="flex_grow">{{item.title}}</view>
						<view class="enter">进入</view>
					</view>
					<view class="info">{{item.info}}</view>
					<view class="time">{{item.time}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		DHAPI
	} from './api.js'
	export default {
		data() {
			return {
				deteList: [],
				scrollTop: 0,
				phoneNumber: '',
				history: []
			}
		},
		onLoad(e) {
			console.log(e);
			if (e.phone) {
				this.phoneNumber = e.phone;
			}
		},
		onShow() {
			this.getListData();
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			/* 列表触摸事件 */
			listTap(index) {
				//获取的一条历史信息
				console.log(this.deteList[index].id);
				//跳转至二维码界面
				uni.navigateTo({
					url: "/pages/sqr/sqr?historyId=" + this.deteList[index].id
				})
			},
			/*新增检测*/
			add() {
				uni.navigateTo({
					url: '/pages/newDetection/newDetection?phone=' + this.phoneNumber
				});
			},
			turnTime(time) {
				var date = new Date(parseInt(time));
				return date.getFullYear() + "." + this.formatNumber(date.getMonth() + 1) + "." + this.formatNumber(date.getDate()) + "  " 
				+ this.formatNumber(date.getHours()) + ":" + this.formatNumber(date.getMinutes());
			},
			formatNumber(number) {
				if(number < 10) {
					return "0" + number;
				}else{
					return "" + number;
				}
			},
			/* 获取列表数据 */
			getListData() {
				DHAPI.getDetectionHistory().then(res => {
					console.log(res);
					if (res.statusCode == 404) {
						uni.showToast({
							title: '检测信息获取失败，刷新试试',
							icon: 'none'
						});
						return;
					}
					this.history = res.data.data;
					let list = [];
					for (let i = 0; i < this.history.length; i++) {
						let startTime = this.turnTime(this.history[i].startTime);
						let endTime = this.history[i].endTime? this.turnTime(this.history[i].endTime):""
						list.push({
							"id": this.history[i].id,
							"title": this.history[i].batch,
							"time": startTime + "-" + endTime,
							"info": `${this.history[i].building} (${this.history[i].completeNum} / ${this.history[i].studentNum})`
						})
					}
					this.deteList = list;
				}).catch(err => {
					uni.showToast({
						title: '检测信息获取失败，刷新试试',
						icon: 'none'
					});

				});
			},
		}
	}
</script>

<style scoped lang="scss">
	.container {
		position: fixed;
		z-index: 100;
		background-color: white;
		width: 100%;
		display: flex;
		/*设置显示样式**/
		align-items: center;
		/**子view垂直居中*/
		vertical-align: center;
		/**垂直居中*/
		justify-content: center;
		/**内容居中*/
		flex-direction: column;
		/**子view排列方式row--水平 column--垂直*/
		text-align: center;
		border-bottom: #CCC solid 1px;
	}

	.img {
		width: 100rpx;
		height: 100rpx;
	}

	/* 列式弹性盒子 */
	.flex_col {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
		align-content: center;
	}

	/* 弹性盒子弹性容器 */
	.flex_col .flex_grow {
		width: 0;
		-webkit-box-flex: 1;
		-ms-flex-positive: 1;
		flex-grow: 1;
	}

	.flex_row .flex_grow {
		-webkit-box-flex: 1;
		-ms-flex-positive: 1;
		flex-grow: 1;
	}

	/* 弹性盒子允许换行 */
	.flex_col.flex_wrap {
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
	}

	/* 列表 */
	.list {
		background-color: #fff;
		font-size: 28upx;
		color: #333;
		user-select: none;
		touch-callout: none;

		&>view {
			padding: 24upx 30upx;
			position: relative;

			&:active,
			&.active {
				background-color: #f3f3f3;
			}

			image {
				height: 80upx;
				width: 80upx;
				border-radius: 4px;
				margin-right: 20upx;
			}

			&>view {
				line-height: 40upx;

				.enter {
					color: #999;
					font-size: 24upx;
				}

				.time {
					color: #999;
					font-size: 24upx;
				}

				.enter {
					width: 150upx;
					position: absolute;
					bottom: 10%;
					right: 0;
				}

				.info {
					color: red;
					font-size: 30upx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.time {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}

		&>view:not(:first-child) {
			margin-top: 1px;

			&::after {
				content: '';
				display: block;
				height: 0;
				border-top: #CCC solid 1px;
				width: 85%;
				position: absolute;
				top: -1px;
				transform: scaleY(0.5);
				/* 1px像素 */
			}
		}
	}
</style>
