<template>
	<view class='index'>
		<view class="container">
			<u-button v-if='isAdmin' color='#00af80' size='large' type='primary' icon='clock-fill' @click="add()">新增检测</u-button>
      <u-button v-if='!isAdmin' color='#46B0EF' size='large' type='primary' icon='order'>数据统计</u-button>
		</view>
		<view style="width: 100%;height: 150rpx;"></view>
		<view class="list">
      <view class='batch-item' v-for="(b, index) in batches" :key='b.id'>
        <view class='batch-title' :style="{backgroundColor: isAdmin ? '#00af80' : '#46B0EF'}">
          <view class='b-name'>
            <u-text color='#ffffff' size='18px' :icon-style='{color: "#ffffff", fontSize: "20px"}' :text='b.batch'></u-text>
            <u-text color='#ffffff' size='16px' :icon-style='{color: "#ffffff", fontSize: "20px"}' prefix-icon='account-fill' :text='`( ${b.doNum} / ${b.total} )`'></u-text>
          </view>
          <view class='b-stc' @click='toStc(b.id, b.batch)'>
            <u-text color='#ffffff' size='16px' :icon-style='{color: "#ffffff", fontSize: "20px"}' text='批次统计' suffix-icon='search'></u-text>
          </view>
          <view class='arrow' @click='expand(index)'>
            <u-icon color='#ffffff' v-if='!index == showPan || showPan == -1' name='arrow-left'></u-icon>
            <u-icon color='#ffffff' v-if='index == showPan' name='arrow-down'></u-icon>
          </view>
        </view>
        <view class='his-list' v-if='index === showPan'>
          <view class="flex_col" v-for="item in b.historys" :key="item.id">
            <uni-card class="card" is-shadow shadow="5px 5px 30px #DDDDDD" :title="item.building"
                      :thumbnail="item.isEnd?avatarEnd:avatar">
              <view class="info">{{item.info}}</view>
              <view class="time">{{item.time}}</view>
              <view class="toQR" @click='toQR(item.id)'>
                <u-text align='right' text='二维码' suffix-icon='arrow-right'></u-text>
              </view>
              <view class="tostc" @click='toStc(b.id, b.batch, item.building)'>
                <u-text align='right' text='楼栋统计' suffix-icon='search'></u-text>
              </view>
            </uni-card>
          </view>
          <view style='text-align: center;height: 50px;line-height: 50px;color: #b2b2b2' v-if='!b.historys || b.historys.length <= 0'>暂无检测历史</view>
        </view>
        <view class='hide-pan' @click='expand(index)'>
          <text style='color: #9a9a9a;font-size: 14px'>{{showPan == index ? '收起' : '展开'}}</text>
          <view class='line' :style='{backgroundColor: showPan == index ? "#00af80" : "#cbcbcb;"}'></view>
        </view>

      </view>
		</view>
	</view>
</template>

<script>
	import {
		DHAPI
	} from './api.js'
  import UButton from "../../uni_modules/uview-ui/components/u-button/u-button";
  import UText from "../../uni_modules/uview-ui/components/u--text/u--text";
  import UCollapse from "../../uni_modules/uview-ui/components/u-collapse/u-collapse";
  import UCollapseItem from "../../uni_modules/uview-ui/components/u-collapse-item/u-collapse-item";
  import URow from "../../uni_modules/uview-ui/components/u-row/u-row";
  import UCol from "../../uni_modules/uview-ui/components/u-col/u-col";
  import UIcon from "../../uni_modules/uview-ui/components/u-icon/u-icon";
	export default {
    components: {UIcon, UCol, URow, UCollapseItem, UCollapse, UText, UButton},
    data() {
			return {
        isAdmin: false,
				timer: null,
				batches: [],
				scrollTop: 0,
				phoneNumber: '',
				avatar: '/static/detectionHistory/QRCode.png',
        avatarEnd: '/static/detectionHistory/QRCode2.png',
        showPan: -1
			}
		},
		onLoad(e) {
			console.log(e);
			if (e.phone) {
				this.phoneNumber = e.phone;
			}
      this.isAdmin = this.phoneNumber === 'admin'
		},
    onPullDownRefresh() {
      this.getBatches()
    },
		onShow() {
			this.getBatches();
			// this.timer = setInterval(() => {
			// 	this.getBatches();
			// }, 1000 * 10);
		},
		onHide() {
			clearInterval(this.timer);
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			/* 列表触摸事件 */
			toQR(historyId) {
				//获取的一条历史信息
				//跳转至二维码界面
				uni.navigateTo({
					url: "/pages/sqr/sqr?historyId=" + historyId
				})
			},
      toStc(batchId, batch, building) {
        //跳转至统计界面
        uni.navigateTo({
          url: `/pages/testBatch/testBatch?building=${building}&batchId=${batchId}&batch=${batch}`
        })
      },
			/*新增检测*/
			add() {
				uni.navigateTo({
					url: '/pages/newDetection/newDetection?phone=' + this.phoneNumber
				});
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
      expand(index) {
        if (this.showPan == index){
          this.showPan = -1
        } else {
          this.showPan = index
          if (!this.batches[index].historys) {
            this.getHistory(this.batches[index].id)
          }
        }
      },
			/* 获取列表数据 */
      async getBatches() {
        try {
          const {data} = await DHAPI.getBatchInfos();
          if (data?.code == 200){
            this.batches = data.data.map(item => ({
              id: item.id,
              createTime: this.turnTime(item.createTime),
              batch: item.name,
              total: item.studentNum,
              doNum: item.completeNum,
            }))
            if (this.batches.length > 0) {
              if (this.showPan < 0){
                this.showPan = 0
              }
              this.getHistory(this.batches[this.showPan].id)

            } else {
              uni.stopPullDownRefresh()
            }
          } else {
            uni.showToast({
              title: '信息获取失败，刷新试试',
              icon: 'none'
            });
          }
        } catch (e) {
          console.error(e)
          uni.showToast({
            title: '网络错误',
            icon: 'none'
          });
        }
      },
			getHistory(batchId) {
        console.log(batchId)
				DHAPI.getDetectionHistory({batchId: batchId}).then(res => {
					if (res.data.code != 200) {
						uni.showToast({
							title: '检测信息获取失败，刷新试试',
							icon: 'none'
						});
						return;
					}
					const curindex = this.batches.findIndex(b => b.id === batchId)
          const temp = this.batches[curindex]
          temp.historys = res.data.data.map(h => {
            const startTime = this.turnTime(h.startTime);
            const endTime = this.turnTime(h.endTime)
            return {
              id: h.id,
              batch: h.batch,
              time: startTime + " - " + endTime,
              info: `( ${h.completeNum}  /  ${h.studentNum} )`,
              isEnd: !!endTime,
              batchId: h.batchId,
              building: h.building,
              total: h.studentNum,
              doNum: h.completeNum,
            }
          })
          this.$set(this.batches, curindex, temp)
          uni.stopPullDownRefresh()
				}).catch(err => {
          console.error(err)
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

  .index{
    padding-bottom: 60px;
  }

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

  .batch-item{
    margin: 0 8px 30px 8px;

  }

  .batch-title{
    padding-left: 1rem;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    background-color: #00af80;
    font-size: 16px;
    height: 60px;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    border-top: #a8a8a8 1px solid;
    border-left: #a8a8a8 1px solid;
    border-right: #a8a8a8 1px solid;

    .b-name{
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .b-stc{
      width: 6rem;
      line-height: 60px;
      height: 100%;
    }
    .arrow {
      display: flex;
      justify-content: center;
      align-content: center;
      width: 2rem;
      height: 100%;
    }
  }

  .hide-pan{
    padding: 15px 20% 15px 20%;
    background-color: white;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    border: 1px solid #a8a8a8;
    border-top: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;

    .line {
      width: 30%;
      height: 5px;
      border-radius: 5px;
      background-color: #cbcbcb;
    }
  }

  .his-list{
    border-left: #a8a8a8 1px solid;
    border-right: #a8a8a8 1px solid;
    padding: 5px;
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

  .tostc{
    position: absolute;
    right: 0;
    bottom: 0;
    width: 6rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-content: center;
    padding-right: 0.5rem;
    box-sizing: border-box;
  }

  .toQR{
    position: absolute;
    right: 0;
    top: 0;
    width: 6rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-content: center;
    padding-right: 1rem;
    padding-top: 0.2rem;
    box-sizing: border-box;
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
  .uni-card__header-content-title{
    font-weight: bold;
    font-size: 16px;
  }

	.info {
		color: #26c098;
		font-size: 30upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}


	.time {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
    color: #afafaf;
	}

	.card {
		width: 100%;
	}

	/* 列表 */
	.list {
		background-color: #fff;
		font-size: 28upx;
		color: #333;
		user-select: none;
		touch-callout: none;

		&>view {
			padding: 0upx 15upx;
			position: relative;

			&:active,
			&.active {
				background-color: #f3f3f3;
			}
		}
	}
</style>
