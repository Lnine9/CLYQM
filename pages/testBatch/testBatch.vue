<template>
	<view>
		<view class="topInfo">
			<view class="title">{{batchName}}</view>
			<u-row gutter="20" customStyle="margin-bottom: 5%;margin-top: 5%">
				<u-col span="6">
					<u-row>
						<u-col span="4">
							<text>楼栋</text>
						</u-col>
						<u-col span="8">
							<view>
								<u-action-sheet :closeOnClickOverlay="true" :closeOnClickAction="true"
									:actions="buildings" @select="selectClickB" @close="showB = false" :title="title"
									:show="showB" round="10">
								</u-action-sheet>
								<u-button @click="showB = true">{{titleB}}</u-button>
							</view>
						</u-col>
					</u-row>
				</u-col>
				<u-col span="6">
					<u-row>
						<u-col span="4">
							<text>完成情况</text>
						</u-col>
						<u-col span="8">
							<view>
								<u-action-sheet :closeOnClickOverlay="true" :closeOnClickAction="true"
									:actions="situation" @select="selectClickS" @close="showS = false" :title="title"
									:show="showS" round="10">
								</u-action-sheet>
								<u-button @click="showS = true">{{titleS}}</u-button>
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
	export default {
		data() {
			return {
				batchId: '',
				buildingId: '',
				batchName: '检测批次',
				status: 'loadmore',
				loadingText: '努力加载中',
				loadmoreText: '轻轻上拉',
				nomoreText: '实在没有了',
				titleB: '选择楼栋',
				titleS: '选择情况',
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
				buildings: [{
					name: '两江1栋'
				}, {
					name: '两江2栋'
				}, {
					name: '两江3栋'
				}, {
					name: '两江4栋'
				}, {
					name: '两江5栋'
				}, {
					name: '两江6栋'
				}, {
					name: '两江21栋'
				}],
				situation: [{
					name: '全部'
				}, {
					name: '未完成'
				}, {
					name: '已完成'
				}],
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
				if(this.list > this.total) {
					this.list = this.total;
					this.status = 'nomore';
				}
				else this.status = 'loading';
			}, 2000)
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onShow() {
			this.getNumber();
			this.getData();
		},
		methods: {
			selectClickB(index) {
				this.titleB = index.name;
			},
			selectClickS(index) {
				this.titleS = index.name;
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
			getData() {
				for (var i = 0; i < 100; i++) {
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
	.title{
		font-weight:bolder;
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
