<template>
	<view class="index">
		<view class="goBack" @click="goBack()">返回</view>
		<view style="margin-top: 25%"></view>
		<uni-row>
			<uni-col :span="20">
				<view>
					<view class="uni-list" style="height: 45px;">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left name">
								选择批次
							</view>
							<view class="uni-list-cell-db">
								<picker @change="bindPickerChangeD" :value="indexD" :range="detectionBatchs">
									<view class="uni-input">{{detectionBatchs[indexD]}}</view>
								</picker>
							</view>
						</view>
					</view>
				</view>
			</uni-col>
			<uni-col :span="4">
				<view>
					<button style="height: 45px;font-size: 17px;" type="primary" @click="add()">新增</button>
				</view>
			</uni-col>
		</uni-row>
		<view style="margin-top: 15%">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left name">
						选择楼栋
					</view>
					<view class="uni-list-cell-db">
						<picker @change="bindPickerChangeB" :value="indexB" :range="buildings">
							<view class="uni-input">{{buildings[indexB]}}</view>
						</picker>
					</view>
				</view>
			</view>
		</view>
		<view class="btnStart">
			<button type="primary" @click="start()">新增</button>
		</view>
		<uni-popup background-color="white" ref="popup" type="bottom" animation>
			<view class="addpop">
				<text class="textA">新增批次</text>
				<input class="inputD" v-model="detectionInfo" clear placeholder="请输入检测批次" />
				<view style="margin-top: 10%"></view>
				<uni-row type="flex" justify="space-around" :gutter="10">
					<uni-col :span="10">
						<view>
							<button @click="closeA()">取消</button>
						</view>
					</uni-col>
					<uni-col :span="10">
						<view>
							<button type="primary" @click="confirmA()">确定</button>
						</view>
					</uni-col>
				</uni-row>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		NDAPI
	} from './api.js'
	export default {
		data() {
			return {
				//D结尾为检测，B结尾为楼栋，A结尾为新增
				building: "选择楼栋",
				detectionBatch: "检测批次",
				detectionInfo: "",
				historyId: "",
				showD: false,
				showB: false,
				indexD: '',
				indexB: '',
				batchs: [],
				builds: [],
				userId: '',
				detectionBatchs: [],
				buildings: [],
			}
		},
		onLoad(e) {
			if (e.phone) {
				console.log(e.phone);
				this.userId = e.phone;
			}
			this.getData();
		},
		methods: {
			/*返回上一页*/
			goBack() {
				uni.navigateBack(1);
			},
			confirmD(e) {
				if (e.indexs[0] == undefined) {
					uni.showToast({
						title: '请选择检测批次',
						icon: 'none'
					});
					return;
				}
				this.indexD = e.indexs[0];
				this.detectionBatch = this.detectionBatchs[this.indexD];
				this.showD = false;
			},
			bindPickerChangeD(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value);
				this.indexD = e.detail.value;
			},
			bindPickerChangeB(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value);
				this.indexB = e.detail.value;
			},
			confirmA() {
				if (this.detectionInfo == "") {
					uni.showToast({
						title: '输入内容不能为空',
						icon: 'none'
					});
					return;
				}
				this.detectionBatchs.push(this.detectionInfo);
				const that = this
				NDAPI.addBatch({
					name: this.detectionInfo
				}).then(res => {
					uni.showToast({
						title: '添加成功',
						icon: 'success'
					});
					that.getData();
				}).catch(err => {
					uni.showToast({
						title: '添加失败',
						icon: 'none'
					});
				});
				this.detectionInfo = "";
				this.closeA()

			},
			add() {
				this.openA();
			},
			openA() {
				this.$refs.popup.open();
			},
			closeA() {
				this.$refs.popup.close();
			},
			showToast(params) {
				this.$refs.uToast.show({
					...params,
				})
			},
			/*跳转页面*/
			start() {
				if (this.indexB == -1 || this.indexD == -1) {
					uni.showToast({
						title: '不能为空',
						icon: 'none'
					});
					return;
				}
				let data = {
					batchId: this.batchs[this.indexD].id,
					buildingId: this.builds[this.indexB].id,
					userId: this.userId
				};
				const that = this
				NDAPI.createTestHistory(data).then(res => {
					console.log(res);
					if(res.data.code == 200){
						that.historyId = res.data.data;
						uni.showToast({
							title: '添加成功',
							icon: 'success'
						});
						uni.navigateBack({
							delta:-1
						})
					} else {
						uni.showToast({
							title: res.data.data,
							icon: 'none'
						});
					}
					
				}).catch(err => {
					uni.showToast({
						title: '添加失败',
						icon: 'none'
					});
				});
				
			},
			getData() {
				NDAPI.getBatchesAndBuildings().then(res => {
					console.log(res);
					if (res.statusCode == 404) {
						uni.showToast({
							title: '信息获取失败，刷新试试',
							icon: 'none'
						});
						return;
					}
					this.batchs = res.data.data.batches;
					this.builds = res.data.data.buildings;
					this.detectionBatchs = [];
					this.buildings = [];
					for (let i = 0; i < this.batchs.length; i++) {
						this.detectionBatchs.push(this.batchs[i].name);
					};
					for (let i = 0; i < this.builds.length; i++) {
						this.buildings.push(this.builds[i].name);
					};
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
	@import "./uni.css";

	.index{
		padding: 0 10px;
	}
	.goBack {
		position: absolute;
		left: 5%;
		top: 2%;
		display: block;
		width: 20%;
		height: 30px;
		line-height: 30px;
	}

	.textA {
		position: absolute;
		left: 2%;
		top: -45px;
	}

	.btnStart {
		position: absolute;
		transform: translateX(10%);
		width: 80%;
		bottom: 10%;
	}

	.inputD {
		margin-top: 15%;
		border-radius: 5px;
		border: rgb(218, 219, 222) solid 1px;
		height: 40px;
		align-self: center;
		display: flex;
		padding-left: 1rem;
	}
	
	.addpop{
		padding: 0 20px 100px 20px;
		
	}
	
	.addpop button {
			font-size: 16px;
			padding: 0.5rem auto;
		}
		
	.name {
		font-weight: bold;
		font-size: 16px;
		border-right: 1px solid #c3c3c3;
	}
</style>
