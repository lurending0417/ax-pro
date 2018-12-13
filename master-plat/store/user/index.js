import api from '~/api'
import {baseUtil} from '~/util'

export default {
	namespaced: true,
	state: {
		userList: [],
		total: 0
	},
	getters: {
		getUserList: state => state.userList,
		getTotal: state => state.total
	},
	mutations: {
		resetUserList(state, userList) {
			state.userList = userList
		},
		resetTotal(state, total) {
			state.total = total
		}
	},
	actions: {
		apiGetUserList({commit}, params = {}) {
			api.request({
				url: api.url.user.user.list,
				params,
				success: (json) => {
					commit('resetUserList', json.rows)
					commit('resetTotal', json.total)
				}
			});
		},
		apiGetUserWalletUsage({commit}, {params, callback}) {
			api.request({
				url: api.url.account.usage,
				params,
				success: (json) => {
					callback(json)
				}
			});
		}
	}
}
