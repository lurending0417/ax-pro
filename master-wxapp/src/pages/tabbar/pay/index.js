//index.js
//获取应用实例
import {
	connect
} from '../../../libs/wx-redux/connect.js'
import actions from '../../../store/actions/index/index.js'

import utils from '../../../utils/renderUtil'
import { required } from '../../../libs/tools/func'

import { fire } from '../../../libs/tools/notify'


Page(connect({
	data: {
		title: '金额',
		fee: 0.01,
		notify: '',
		webId: ''
	},
	action: dispatch => ({
		notifyResult: (notify, state, ...args) => {
			dispatch({
				type: '',
				payload: {
					notify, state, ...args
				}
			})
		}
	}),
	onLoad: function ({ requestPayment = required() }) {
		let raw = JSON.parse(decodeURIComponent(requestPayment));
		this.raw = raw;

		const { fee = required(), webId, title = "金额", paymentArgs = {}, notify } = raw;


		this.setData({
			webId,
			title,
			fee,
			notify
		})
	},
	onTap: function () {
		wx.navigateBack({
			delta: 1,
			success: () => {
				this.toNotify('succ')
			}
		})
	},
	onCancel: function () {
		wx.navigateBack({
			delta: 1,
			success: () => {
				this.toNotify('fail')
			}
		})
	},
	toNotify: function (state) {
		// this.notifyResult(this.data.notify, state)
		if (this.data.webId) {
			if (!fire('redirect-' + this.data.webId, { title: '喔喔百家', redirect: this.data.notify + (/\?/.test(this.data.notify) ? "&" : "?") + "paystate=" + state })) {
				wx.navigateTo({
					url: '/src/pages/tabbar/index/index'
				})
			}
		}

	}

}))