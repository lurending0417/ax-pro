import api from '~/api'
import {baseUtil} from '~/util'

export default {
	namespaced: true,
	state: {
		masterList: [],
		categoryList: [],
		ms_total: 0,
		ct_total: 0
	},
	getters: {
		getMasterList: state => state.masterList,
		getCategoryList: state => state.categoryList,
		getMastersTotal: state => state.ms_total,
		getCatogoryTotal: state => state.ct_total
	},
	mutations: {
		resetCategoryList(state, categoryList) {
			state.categoryList = categoryList
		},
		resetMasterList(state, masterList) {
			state.masterList = masterList
		},
		resetMastersTotal(state, total) {
			state.ms_total = total
		},
		resetCategoryTotal(state, total) {
			state.ct_total = total
		}
	},
	actions: {
		apiGetMasterList({commit}, params = {}) {
			api.request({
				url: api.url.user.master.list,
				params,
				success: (json) => {
					commit('resetMasterList', json.rows)
					commit('resetMastersTotal', json.total)
				}
			});
		},
		apiGetCategoryList({commit}, params = {}) {
			api.request({
				url: api.url.user.category.list,
				params: params,
				success: (json) => {
					commit('resetCategoryList', json.rows)
					commit('resetCategoryTotal', json.total)
				}
			})
		},
		apiGetMasterFc({commit}, {params, callback}) {
			api.request({
				url: api.url.user.master.get,
				params,
				success: json => {
					callback(json)
				}
			})
		}
	}
}
