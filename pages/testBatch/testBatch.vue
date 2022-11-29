<template>
	<view>
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
									<view class="uni-list-cell-db" style="border: rgb(236,236,236) solid 2px;text-align: center;">
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
									<view class="uni-list-cell-db" style="border: rgb(236,236,236) solid 2px;text-align: center;width: 85px;">
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
					<text class="u-collapse-content">涵盖uniapp各个方面，给开发者方向指导和设计理念，让您茅塞顿开，一马平川</text>
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
		<view class="remind">
			一键提醒该批次未完成同学
		</view>
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
				total: 114,
				//未完成数
				incomplete: 102,
				//要显示的条数
				list: 20,
				//页数
				page: 0,
				//滚动条
				scrollTop: 0,
				builds: [],
				buildings: [],
				situation: ['全部','未完成','已完成'],
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
				stuInfo: [{
					stuId: '12023020216',
					stuName: 'hxl',
					stuBuilding: '3栋',
					stuCollege: '人工智能学院',
					stuMajor: '软件工程',
					stuClazz: '120230202',
					stuStatus: '未完成'
				}, {
					stuId: '12023020216',
					stuName: 'hxl',
					stuBuilding: '3栋',
					stuCollege: '人工智能学院',
					stuMajor: '软件工程',
					stuClazz: '120230202',
					stuStatus: '未完成'
				}, {
					stuId: '12023020216',
					stuName: 'hxl',
					stuBuilding: '3栋',
					stuCollege: '人工智能学院',
					stuMajor: '软件工程',
					stuClazz: '120230202',
					stuStatus: '2022.11.29'
				}, {
					stuId: '12023020216',
					stuName: 'hxl',
					stuBuilding: '3栋',
					stuCollege: '人工智能学院',
					stuMajor: '软件工程',
					stuClazz: '120230202',
					stuStatus: '2022.11.29'
				}, {
					stuId: '12023020216',
					stuName: 'hxl',
					stuBuilding: '3栋',
					stuCollege: '人工智能学院',
					stuMajor: '软件工程',
					stuClazz: '120230202',
					stuStatus: '2022.11.29'
				}, {
					stuId: '12023020216',
					stuName: 'hxl',
					stuBuilding: '3栋',
					stuCollege: '人工智能学院',
					stuMajor: '软件工程',
					stuClazz: '120230202',
					stuStatus: '2022.11.29'
				}, {
					stuId: '12023020216',
					stuName: 'hxl',
					stuBuilding: '3栋',
					stuCollege: '人工智能学院',
					stuMajor: '软件工程',
					stuClazz: '120230202',
					stuStatus: '2022.11.29'
				}, {
					stuId: '12023020216',
					stuName: 'hxl',
					stuBuilding: '3栋',
					stuCollege: '人工智能学院',
					stuMajor: '软件工程',
					stuClazz: '120230202',
					stuStatus: '2022.11.29'
				}, {
					stuId: '12023020216',
					stuName: 'hxl',
					stuBuilding: '3栋',
					stuCollege: '人工智能学院',
					stuMajor: '软件工程',
					stuClazz: '120230202',
					stuStatus: '2022.11.29'
				}, {
					stuId: '12023020216',
					stuName: 'hxl',
					stuBuilding: '3栋',
					stuCollege: '人工智能学院',
					stuMajor: '软件工程',
					stuClazz: '120230202',
					stuStatus: '2022.11.29'
				}, {
					stuId: '12023020216',
					stuName: 'hxl',
					stuBuilding: '3栋',
					stuCollege: '人工智能学院',
					stuMajor: '软件工程',
					stuClazz: '120230202',
					stuStatus: '2022.11.29'
				}, {
					stuId: '12023020216',
					stuName: 'hxl',
					stuBuilding: '3栋',
					stuCollege: '人工智能学院',
					stuMajor: '软件工程',
					stuClazz: '120230202',
					stuStatus: '2022.11.29'
				}, {
					stuId: '12023020216',
					stuName: 'hxl',
					stuBuilding: '3栋',
					stuCollege: '人工智能学院',
					stuMajor: '软件工程',
					stuClazz: '120230202',
					stuStatus: '2022.11.29'
				}, {
					stuId: '12023020216',
					stuName: 'hxl',
					stuBuilding: '3栋',
					stuCollege: '人工智能学院',
					stuMajor: '软件工程',
					stuClazz: '120230202',
					stuStatus: '2022.11.29'
				}, ]
			}
		},
		onReachBottom() {
			this.status = 'loading';
			this.page = ++this.page;
			setTimeout(() => {
				this.list += 20;
				if (this.list > this.total) {
					this.list = this.total;
					this.status = 'nomore';
				} else this.status = 'loading';
			}, 2000)
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onShow() {
			this.getBuildings();
			this.getNumber();
			this.getData();
		},
		onLoad(e) {
			console.log(e);
			if (e.batchId) {
				this.batchId = e.batchId;
				this.batchName = e.batch;
				this.buildingId = e.buildingId;
			}
		},
		methods: {
			bindPickerChangeB(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value);
				this.indexB = e.detail.value;
				this.buildingId = this.buildings[this.indexB].id;
				this.stuInfo=[];
				this.getData();
			},
			bindPickerChangeS(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value);
				this.indexS = e.detail.value;
				this.stuInfo = [];
				if(this.indexS == 1 || this.indexS == 0) {
					this.stuStatus = 0
					this.getData();
				}
				if(this.indexS == 2 || this.indexS == 0) {
					this.stuStatus = 1
					this.getData();
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
				this.baseList[1].count = this.incomplete;
				this.baseList[2].count = this.total - this.incomplete;
			},
			getBuildings() {
				TBAPI.getBatchesAndBuildings().then(res => {
					console.log(res);
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
					console.log(this.builds);
				}).catch(err => {
					uni.showToast({
						title: '信息获取失败，刷新试试',
						icon: 'none'
					});
				});
			},
			getData() {
				console.log(this.batchId);
				let info = {
					batchId: this.batchId,
					buildingId: this.buildingId,
					studentId: this.studentId,
					studentName: this.studentName,
					status: this.stuStatus,
					currentPage: this.page + 1,
					pageSize: 20
				}
				console.log(info);
				// TBAPI.getTestListByBatch(info).then(res => {
				// 	console.log(res);
				// 	if (res.statusCode == 404) {
				// 		uni.showToast({
				// 			title: '信息获取失败，刷新试试',
				// 			icon: 'none'
				// 		});
				// 		return;
				// 	}
				// }).catch(err => {
				// 	uni.showToast({
				// 		title: '信息获取失败，刷新试试',
				// 		icon: 'none'
				// 	});
				// });
				for (let i = 0; i < 100; i++) {
					this.stuInfo.push({
						stuId: '12023020216',
						stuName: 'hxl',
						stuBuilding: '3栋',
						stuCollege: '人工智能学院',
						stuMajor: '软件工程',
						stuClazz: '120230202',
						stuStatus: '未完成'
					})
				}
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
		position: fixed;
		top: 0;
		z-index: 100;
		background-color: rgb(255, 255, 255);
	}

	.content {
		margin-top: 220px;
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
