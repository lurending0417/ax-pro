import api from '~/api'
import {baseUtil} from '~/util'

export default {
	namespaced: true,
	state: {
	},
	getters: {
	},
	mutations: {
	},
	actions: {
		apiWithdrawAudit(store, {params, callback}) {
			api.request({
				url: api.url.account.audit,
				params,
				success: (json) => {
					callback(json.result)
				}
			});
		}
	}
}
