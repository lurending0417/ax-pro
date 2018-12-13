//app.js
// require('./setting.js')
import './setting.js'
import './src/libs/process'
import './src/utils/dateUtil' //时间格式化
import { provider } from './src/libs/wx-redux/connect.js'
import store from './src/store/index.js'
import { user } from './src/common/api'


App({
	onLaunch: function () {

		setTimeout(() => {
			store.dispatch({
				type: 'FakeToken'
			})
		}, 1000)

		// 登录
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId// shim for using process in browser
				store.dispatch({
					type: 'CallApi',
					payload: {
						api: user.wxOpenid,
						body: {
							wxcode: res.code
						},
						success: (res) => {
							console.log(res)
						}
					}
				})
			}
		})
		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							// 可以将 res 发送给后台解码出 unionId
							this.globalData.userInfo = res.userInfo

							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					})
				}
			}
		})
	},
	userInfoReadyCallback: function (res) {
		store.dispatch({
			type: 'wxUser',
			payload: {
				result: res.userInfo
			}
		})
	},
	globalData: {
		userInfo: null,
		store: provider(store)
	}
})