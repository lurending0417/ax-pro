import Mock,{Random} from "mockjs"
import _map from "lodash/map"

export const obj=(res)=>{
	return {
		status:200,
		result:res
	}
}


export const arr=(rows)=>{
	return {
		status:200,
		rows:rows,
		total:100
	}
}

export const makArr=(num,template)=>{
	return Mock.mock({
		["rows"]:_map(new Array(num),()=>{
			return template();
		}),
		total:Random.integer(15,30)
	})
}