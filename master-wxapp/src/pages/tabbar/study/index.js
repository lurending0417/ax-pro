//index.js
//获取应用实例
import {
	connect
} from '../../../libs/wx-redux/connect.js'
import { study, user } from '../../../common/api'
import { user as userAction } from '../../../common/actionType'
import actions from '../../../store/actions/index/index.js'
import scrollAble from '../../../components/common/refreshAndMore/index'
import { object2Query } from '../../../libs/tools/func'

import utils from '../../../utils/renderUtil'
const app = getApp()

const testData = {
	label: '吃饭了'
}
const list = [{
	name: '待学习',
}, {
	name: '已学习',
}]



Page(scrollAble(connect({
	data: (state) => {
		let user = state.user.toJS();
		return {
			headers: list,
			api: study.courseList,
			studied: false,
			signed: user.signed,
			limit: 5,
		}
	},
	action: dispatch => ({
		refreshSignInfo: () => {
			dispatch({
				type: 'CallApi',
				payload: {
					api: user.signedInfo,
					success: userAction.signedInfo
				}
			})
		}
	}),
	onTap: function (e) {
		// 只是第一个的点击事件
		if (!this.data.rows.length) {
			return;
		}
		let item = this.data.rows[0];
		let passed = {
			courseId: item.id,
			title: item.title,
		};
		if (item.targetType == "COURSE") {
			passed.redirect = '/course/group'
		}
		else {
			passed.redirect = '/course/one'
		}
		wx.navigateTo({
			url: '/src/pages/tabbar/webpage/index?' + object2Query(passed)
		})
	},
	// list 查询
	getQuery: function () {
		return {
			studied: this.data.studied
		}
	},
	//事件处理函数
	onHeaderChange: function ({ detail }) {
		let index = detail.dataset.index;
		this.setData({
			studied: !!index
		}, () => {
			this.getList(0);
		})
	},
	onReady: function () {
		this.getList(0);

		this.refreshSignInfo();
	}
})))