//index.js
//获取应用实例
import {
	connect
} from '../../../libs/wx-redux/connect.js'
import actions from '../../../store/actions/index/index.js'
import process from 'process'
const app = getApp()

const testData = {
	label: '吃饭了'
}

Page(connect({
	data: (state) => {
		let user = state.user.toJS();
		let home = state.home.toJS();
		return {
			motto: 'Hello World',
			userInfo: user.userInfo,
			hasUserInfo: user.hasUserInfo,
			canIUse: wx.canIUse('button.open-type.getUserInfo'),
			showConfirm: false,
			items: home.items,
			historys: home.historys,
			currentTxt: home.currentTxt,
			isStart: home.isStart,
			currentIndex: home.currentIndex,
			list: [{
				name: '荣誉名称',
				id: 'c1',
				pub: '发布者',
				time: '2018-12',
			}, {
				name: '荣誉名称',
				pub: '发布者',
				id: 'c2',
				time: '2018-12',
			}, {
				name: '荣誉名称',
				pub: '发布者',
				id: 'c3',
				time: '2018-12',
			}, {
				name: '荣誉名称',
				pub: '发布者',
				id: 'c4',
				time: '2018-12',
			}, {
				name: '荣誉名称',
				pub: '发布者',
				id: 'c6',
				time: '2018-12',
			}]
		}
	},
	action: actions,
	//事件处理函数
	toMessage() {
		wx.navigateTo({
			url: '/src/pages/tabbar/msg/index'
		})
	},
	onTap(){
		wx.navigateTo({
			url: '/src/pages/cert/upload/index'
		})
	},
	bindViewTap: function () {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	itemClick({ target }) {
		this.selItem(target.dataset.item)
		setTimeout(() => {
			console.log('navto')
			wx.navigateTo({
				url: '../../cert/detail/index'
			})
		}, 0)
	},
	showDialog: function () {
		this.dialog.show();
	},
	writeAny: function () {
		let txt = this.data.currentTxt;
		if (!txt) {
			return;
		}
		let items = this.data.items;
		if (this._currentIndex != -1) {
			items[this._currentIndex] = txt;
			this._currentIndex = -1;
		} else {
			items = items.filter(a => !!a);
			items.push(txt)
		}

		this.homeChange({
			items: items,
			currentTxt: '',
		})
		wx.setStorageSync("items", items);
	},
	inputChange: function (e) {
		this.homeChange({
			currentTxt: e.detail.value
		})
	},
	startRandom: function () {
		let len = this.data.items.length;
		if (!len) return;
		if (this.data.isStart) {
			let hs = wx.getStorageSync("historys") || []
			hs.push(this.data.items[this.data.currentIndex]);

			if (hs.length > 7) {
				// hs=hs.slice(-7,hs.length);
				hs = [];
			}

			wx.setStorageSync('historys', hs)

			return this.homeChange({
				isStart: false,
				historys: hs,
			})
		}

		this.homeChange({
			isStart: true,
		})


		let _ts = setInterval(() => {
			if (!this.data.isStart) {
				clearInterval(_ts)
			}

			let index = Math.floor(Math.random() * len);

			this.homeChange({
				currentIndex: index
			})
		}, 100)

	},
	edit: function (e) {
		let {
			index,
			text
		} = e.detail;
		this._currentIndex = index;
		this.homeChange({
			currentTxt: text
		})

		this.showDialog();
	},
	del: function (e) {
		let {
			index,
			text
		} = e.detail;

		let items = this.data.items;
		items.splice(index, 1);

		this.homeChange({
			items: items
		})
	},
	onLoad: function () {
		// tab
		//     tab();
		let i = 0;
		setTimeout(() => {
			//       testData.label = "吃饭" + (i++)
			//       this.setData({store:testData})
			this.changeName({
				age: 'hello' + parseInt(Math.random() * 1000)
			});
		}, 5000)
		let items = wx.getStorageSync("items") || [];
		this._currentIndex = -1;
		this.homeChange({
			items: items,
			historys: wx.getStorageSync("historys") || []
		})
		if (app.globalData.userInfo) {
			this.changeName(app.globalData.userInfo)
		} else if (this.data.canIUse) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				this.changeName(res.userInfo)
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo
					this.changeName(res.userInfo)
				}
			})
		}
	},
	onReady: function () {
		this.dialog = this.selectComponent('#input')
	},
	getUserInfo: function (e) {
		console.log(e)
		app.globalData.userInfo = e.detail.userInfo
		this.changeName(e.detail.userInfo)
	}
}))