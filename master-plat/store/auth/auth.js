import api from '~/api'
import {baseUtil} from '~/util'

export default {
	namespaced: true,
	state: {
		crumb: {}
	},
	getters: {
		getCrumb: state => state.crumb
	},
	mutations: {
		resetCrumb(state, crumb) {
			state.crumb = crumb
		}
	},
	actions: {
		sendCode(store, {phone, callback}) {
			api.request({
				url: api.url.sms.sms.rand.send,
				params: {
					phone,
					sign: baseUtil.sms.sign(phone)
				},
				success: (json) => {
					callback(json.result)
				}
			});
		}
	}
}
