import callApi from "../../../store/actions/api"
import { ApiGetHomeData } from "../../../common/api"
import { GetHomeData } from "../../../common/actionType"
export default dispatch => {
	return {
		changeName: userInfo => {
			dispatch({
				type: 'ChangeName',
				payload: {
					result: userInfo
				}
			})
		},
		homeChange: obj => {
			return;
			dispatch({
				type: 'HomeChange',
				payload: obj
			})
		},
		selItem: obj => {
			dispatch({
				type: 'SelCert',
				payload: obj
			})
		},
    getHomeData: () => {
      dispatch(callApi({
        api: ApiGetHomeData,
        success: GetHomeData,
      }))
    }
	}
}