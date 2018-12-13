//index.js
//获取应用实例
import {
	connect
} from '../../../libs/wx-redux/connect.js'

import { user } from '../../../common/api'
import { user as userAction } from '../../../common/actionType'
import utils from '../../../utils/renderUtil'

const list = [{
	name: '我的课程',
	href: '/index/learn',
	icon: '/assets/imgs/my/my-icon-1.png',
}, {
	name: '我的解惑',
	href: '/disabuse/db_my',
	icon: '/assets/imgs/my/my-icon-2.png',
}, {
	name: '我的悬赏',
	href: '/reward/reward_my',
	icon: '/assets/imgs/my/my-icon-3.png',
}, {
	name: '我的约见',
	href: '/meet/list',
	icon: '/assets/imgs/my/my-icon-4.png',
}, {
	name: '我的关注',
	icon: '/assets/imgs/my/my-icon-5.png',
	href: '/my/attention',
}, {
	name: '我的收藏',
	icon: '/assets/imgs/my/my-icon-6.png',
	href: '/my/collection',
}]


Page(connect({
	data: (state) => {
		let user = state.user;
		let s = user.getIn(['userInfo', 'score']) || 0;
		let ss = [];
		for (var i = 0; i < s; i++) {
			ss.push(1);
		}
		return {
			list: list,
			userInfo: {
				nickName: user.getIn(['userInfo', 'nick']),
				avatar: user.getIn(['userInfo', 'avatar']) || '/assets/imgs/avatars/default.png',
				master: user.getIn(['userInfo', 'master']),
				vip: true,// user.getIn(['userInfo', 'vip']),
				scores: ss,
			}
		}
	},
	action: dispatch => ({
		refresh: () => {
			dispatch({
				type: 'CallApi',
				payload: {
					api: user.profile,
					success: userAction.loginSucc
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
	toWallet() {
		wx.navigateTo({
			url: '/src/pages/tabbar/webpage/index?redirect=/wallet/wallet'
		})
	},
	toInvite() {
		wx.navigateTo({
			url: '/src/pages/tabbar/webpage/index?redirect=/my/invite'
		})
	},
	openVip() {
		wx.navigateTo({
			url: '/src/pages/tabbar/webpage/index?redirect=/remarkTest/purchaseVip'
		})
	},
	toSetting() {
		wx.navigateTo({
			url: '/src/pages/tabbar/webpage/index?redirect=/setting/user'
		})
	},
	onReady() {
		this.refresh();
	}
}))