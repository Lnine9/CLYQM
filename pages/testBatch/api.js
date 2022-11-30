import {yqRequest} from '@/Config/YQRequest.js'

export class TBAPI {
	/**
	 * 获取所有批次和楼栋
	 */
	static getBatchesAndBuildings() {
	  return yqRequest.get('/batch/getAllBatches');
	}
	
	/**
	 * 获取指定批次的检测信息
	 */
	static getTestListByBatch(data) {
	  return yqRequest.get('/info/getTestListByBatch', data);
	}

}
