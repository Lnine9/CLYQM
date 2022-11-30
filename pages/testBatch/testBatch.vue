<template>
	<view>
		<u-sticky>
		<view class="topInfo">
			<view class="title">{{batchName}}</view>
			<u-row gutter="20" customStyle="margin-bottom: 5%;margin-top: 5%">
				<u-col span="6">
					<u-row>
						<u-col span="3">
							<text>楼栋</text>
						</u-col>
						<u-col span="9">
							<view class="uni-list">
								<view class="uni-list-cell">
									<view class="uni-list-cell-db"
										style="border: rgb(236,236,236) solid 2px;text-align: center;">
										<picker @change="bindPickerChangeB" :value="indexB" :range="builds">
											<view class="uni-input">{{builds[indexB]}}</view>
										</picker>
									</view>
								</view>
							</view>
						</u-col>
					</u-row>
				</u-col>
				<u-col span="6">
					<u-row>
						<u-col span="5">
							<text>完成情况</text>
						</u-col>
						<u-col span="7">
							<view class="uni-list">
								<view class="uni-list-cell">
									<view class="uni-list-cell-db"
										style="border: rgb(236,236,236) solid 2px;text-align: center;width: 85px;">
										<picker @change="bindPickerChangeS" :value="indexS" :range="situation">
											<view class="uni-input">{{situation[indexS]}}</view>
										</picker>
									</view>
								</view>
							</view>
						</u-col>
					</u-row>
				</u-col>
			</u-row>
			<u-collapse @change="change" @close="close" @open="open">
				<u-collapse-item title="更多筛选" name="more select">
					<text class="u-collapse-content"></text>
				</u-collapse-item>
			</u-collapse>
			<view>
				<u-grid :border="false" @click="">
					<u-grid-item v-for="(baseListItem,baseListIndex) in baseList" :key="baseListIndex">
						<text>{{baseListItem.name}}</text>
						<text class="grid-text">{{baseListItem.count}}</text>
					</u-grid-item>
				</u-grid>
				<u-toast ref="uToast" />
			</view>
			<u-divider customStyle="margin-bottom:0px"></u-divider>
		</view>
		</u-sticky>
	<!-- 	<view class="remind">
			一键提醒该批次未完成同学
		</view> -->
		<view class="content">
			<view v-for="index in list" :key="index">
				<uni-card is-shadow shadow="5px 5px 30px #DDDDDD">
					<view>
						<view :class="stuInfo[index].stuStatus=='未完成' ? 'sideR' : 'sideY'"></view>
						<view class="card">
							<u-row>
								<u-col span="9">
									<u-row>
										<u-col span="4">{{stuInfo[index].stuId}}</u-col>
										<u-col span="4">{{stuInfo[index].stuBuilding}}</u-col>
										<u-col span="4">{{stuInfo[index].stuMajor}}</u-col>
									</u-row>
									<u-row>
										<u-col span="4">{{stuInfo[index].stuName}}</u-col>
										<u-col span="4">{{stuInfo[index].stuCollege}}</u-col>
										<u-col span="4">{{stuInfo[index].stuClazz}}</u-col>
									</u-row>
								</u-col>
								<u-col span="3">
									<u-row>
										<u-col span="6">{{stuInfo[index].stuStatus}}</u-col>
										<u-col span="6"></u-col>
									</u-row>
								</u-col>
							</u-row>
						</view>
					</view>
				</uni-card>
			</view>
		</view>
		<u-loadmore :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText"
			:nomore-text="nomoreText" />
		<u-back-top :scroll-top="scrollTop"></u-back-top>
		<view v-if="list==total">
			<view class="lastBlock">重庆理工大学</view>
		</view>
	</view>
</template>

<script>
	import {
		TBAPI
	} from './api.js'
	export default {
		data() {
			return {
				batchId: '34a58a797355924',
				buildingId: '',
				batchName: '检测批次',
				studentId: '',
				studentName: '',
				stuStatus: '',
				status: 'loadmore',
				loadingText: '努力加载中',
				loadmoreText: '轻轻上拉',
				nomoreText: '实在没有了',
				titleB: '选择楼栋',
				titleS: '全部',
				indexB: 0,
				indexS: 0,
				showB: false,
				showS: false,
				//总人数
				total: 0,
				//未完成数
				incomplete: 0,
				//完成数
				complete: 0,
				//要显示的条数
				list: 0,
				//每页条数
				pageSize: 20,
				//页数
				page: 0,
				//滚动条
				scrollTop: 0,
				building: '',
				builds: [],
				buildings: [],
				situation: ['全部', '未完成', '已完成'],
				baseList: [{
						name: '总人数',
						count: 0
					},
					{
						name: '已完成',
						count: 0
					},
					{
						name: '未完成',
						count: 0
					},
				],
				stuInfo: []
			}
		},
		onReachBottom() {
			this.status = 'loading';
			this.page = ++this.page;
			console.log(this.total);
			this.getData();
			setTimeout(() => {
				if (this.list < this.total) {
					this.status = 'loading';
				} else {
					this.list = this.total;
					this.status = 'nomore';
				} 
			}, 2000)
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onShow() {
			this.getBuildings();
		},
		onLoad(e) {
			console.log(e);
			if (e.batchId) {
				this.batchId = e.batchId;
				this.batchName = e.batch;
				this.building = e.building;
			}
		},
		onPullDownRefresh() {
			this.getData();
		},
		methods: {
			bindPickerChangeB(e) {
				this.indexB = e.detail.value;
				this.buildingId = this.buildings[this.indexB].id;
				this.page = 0;
				this.list = 0;
				this.stuInfo = [];
				this.getData();
			},
			bindPickerChangeS(e) {
				this.indexS = e.detail.value;
				this.page = 0;
				this.list = 0;
				this.stuInfo = [];
				if (this.indexS == 0) {
					 this.stuStatus = '';
					 this.getData();
				}
				if (this.indexS == 1) {
					this.stuStatus = 0
					this.getData();
				}
				if (this.indexS == 2) {
					this.stuStatus = 1
					this.getData();
				}

			},
			getIndexB() {
				for (let i = 0; i < this.builds.length; i++) {
					if(this.builds[i] == this.building) {
						this.indexB = i;
						this.buildingId = this.buildings[this.indexB].id;
						console.log("aaaa");
						console.log(this.buildingId);
						return;
					}
				}
			},
			turnTime(time) {
				if (!time) {
					return ""
				}
				var date = new Date(parseInt(time));
				return date.getFullYear() + "." + this.formatNumber(date.getMonth() + 1) + "." + this.formatNumber(date
						.getDate()) + "  " +
					this.formatNumber(date.getHours()) + ":" + this.formatNumber(date.getMinutes());
			},
			formatNumber(number) {
				if (number < 10) {
					return "0" + number;
				} else {
					return "" + number;
				}
			},
			open(e) {
				// console.log('open', e)
			},
			close(e) {
				// console.log('close', e)
			},
			change(e) {
				// console.log('change', e)
			},
			getNumber() {
				this.baseList[0].count = this.total;
				this.baseList[1].count = this.complete;
				this.baseList[2].count = this.incomplete;
			},
			getBuildings() {
				TBAPI.getBatchesAndBuildings().then(res => {
					if (res.statusCode == 404) {
						uni.showToast({
							title: '信息获取失败，刷新试试',
							icon: 'none'
						});
						return;
					}
					this.buildings = res.data.data.buildings;
					this.builds = [];
					for (let i = 0; i < this.buildings.length; i++) {
						this.builds.push(this.buildings[i].name);
					};
					this.getIndexB();
					this.getData();
				}).catch(err => {
					uni.showToast({
						title: '信息获取失败，刷新试试',
						icon: 'none'
					});
				});
			},
			getData() {
				let info = {
					batchId: this.batchId,
					buildingId: this.buildingId,
					studentId: this.studentId,
					studentName: this.studentName,
					status: this.stuStatus,
					currentPage: this.page + 1,
					pageSize: this.pageSize
				}
				console.log(info);
				TBAPI.getTestListByBatch(info).then(res => {
					console.log(res);
					if (res.statusCode == 404) {
						uni.showToast({
							title: '信息获取失败，刷新试试',
							icon: 'none'
						});
						return;
					}
					let temp = res.data.data.studentTestInfo;
					console.log(temp);
					for (let i = 0; i < temp.length; i++) {
						this.stuInfo.push({
							stuId: temp[i].studentId,
							stuName: temp[i].studentName,
							stuBuilding: temp[i].buildingName,
							stuCollege: temp[i].faculty,
							stuMajor: temp[i].major,
							stuClazz: temp[i].squad,
							stuStatus: temp[i].status == 0 ? '未完成' : this.turnTime(temp[i].confirmTime)
						})
					}
					this.total =  res.data.data.allNum;
					this.incomplete = res.data.data.unCompleteNum;
					this.complete = res.data.data.completeNum;
					if(temp.length < this.pageSize) {
						this.list = this.total;
					}else{
						this.list = this.list + this.pageSize;  
					}
					this.getNumber();
				}).catch(err => {
					uni.showToast({
						title: '信息获取失败，刷新试试',
						icon: 'none'
					});
				});
			}
		}
	}
</script>

<style>
	.title {
		font-weight: bolder;
		text-align: center;
		width: 100%;
	}

	.sideR {
		background-color: rgb(236, 49, 130);
		position: absolute;
		width: 10px;
		height: 100%;
		top: 0;
		left: 0;
	}

	.sideY {
		background-color: rgb(209, 225, 127);
		position: absolute;
		width: 10px;
		height: 100%;
		top: 0;
		left: 0;
	}

	.card {
		font-size: 10px;
		/* background-color: rgb(242,242,242); */
	}

	.remind {
		position: fixed;
		border: rgb(242, 242, 242) solid 1px;
		background-color: rgb(1, 157, 216);
		color: white;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		font-size: 10px;
		word-break: break-all;
		text-align: center;
		display: flex;
		align-items: center;
		bottom: 3%;
		right: 3%;
		z-index: 100;
	}

	.topInfo {
		top: 0;
		width: 100%;
		background-color: rgb(255, 255, 255);
	}

	.content {
		/* margin-top: 220px; */
	}

	.lastBlock {
		width: 100%;
		height: 100px;
		line-height: 100px;
		color: gray;
		text-align: center;
		font-size: 10px;
	}
</style>
