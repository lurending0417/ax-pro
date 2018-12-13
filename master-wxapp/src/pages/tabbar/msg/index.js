//index.js
//获取应用实例
import {
	connect
} from '../../../libs/wx-redux/connect.js'

import { message } from '../../../common/api'
import { message as msgAction } from '../../../common/actionType'

const list = [{
	name: '评论',
	tag: 'COMMENT',
	icon: '/assets/imgs/icon/reply@2x.png',
	href: '/message/remark',
}, {
	name: '点赞',
	tag: 'AGREE',
	icon: '/assets/imgs/icon/dot@2x.png',
	href: '/message/star',
}, {
	name: '悬赏',
	icon: '/assets/imgs/icon/moneyreward@2x.png',
	tag: 'WANTED',
	href: '/message/reward',
}]


Page(connect({
	data: (state) => {
		let msg = state.msg;
		return {
			list: list,
			count: {
				['COMMENT']: msg.getIn(['count', 'COMMENT']),
				['AGREE']: 2,// msg.getIn(['count', 'AGREE']),
				['WANTED']: msg.getIn(['count', 'WANTED'])
			}
		}
	},
	action: dispatch => ({
		refresh: () => {
			dispatch({
				type: 'CallApi',
				payload: {
					api: message.count,
					success: msgAction.Count
				}
			})
		}
	}),
	//事件处理函数
	itemClick(e) {
		let item = (e.currentTarget.dataset.item)
		setTimeout(() => {
			wx.navigateTo({
				url: '/src/pages/tabbar/webpage/index?redirect=' + item.href
			})
		}, 0)
	},
	onReady() {
		this.refresh();
	}
}))