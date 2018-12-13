import Immutable from 'immutable'
import { GetHomeData } from "../../common/actionType"

export default (state=Immutable.fromJS({
	banners: {},
  courses: [],
  masters: [],
}),{type,payload})=>{
	switch(type){
		case "HomeChange":{
			return state.merge(payload)
		}
    case GetHomeData: {
      console.log("home", payload)
      return state.merge(payload.result)
    }
	}

	return state;
}