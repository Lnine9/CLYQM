import {yqRequest} from '@/Config/YQRequest.js'

export class DHAPI {
	/**
	 * 获取所有检测历史
	 */
	static getDetectionHistory(data) {
	  return yqRequest.get('/history/getTestHistoriesByBatch', data)
	}
	/**
	 * 获取所有批次
	 */
	static getBatchInfos() {
		return yqRequest.get('/batch/getBatchInfos')
	}
	
}
