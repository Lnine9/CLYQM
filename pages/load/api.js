import {yqRequest} from '../../Config/YQRequest'

export class api{
	static login(data){
		return yqRequest.post('/user/login',data)
	}
 
}