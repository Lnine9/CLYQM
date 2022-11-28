import {yqRequest} from '@/Config/YQRequest.js'

export class DHAPI {
	/**
	 * 获取所有检测历史
	 */
	static getDetectionHistory() {
	  return yqRequest.get('/history/getTestHistories')
	}
	
}
