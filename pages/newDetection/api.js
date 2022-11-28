import {yqRequest} from '@/Config/YQRequest.js'

export class NDAPI {
	/**
	 * 获取所有批次和楼栋
	 */
	static getBatchesAndBuildings() {
	  return yqRequest.get('/batch/getAllBatches');
	}
	
	/**
	 * 新增检测批次
	 */
	static addBatch(data) {
	  return yqRequest.post('/batch/createBatch', data);
	}
	
	/**
	 * 新增检测历史
	 */
	static createTestHistory(data) {
	  return yqRequest.post('/history/createTestHistory', data);
	}
}
