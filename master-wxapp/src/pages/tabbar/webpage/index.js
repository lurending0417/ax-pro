//index.js
//获取应用实例
import { WebUrl } from '../../../common/constant'
import { join, query2Object, object2Query } from '../../../libs/tools/func'
import { on } from '../../../libs/tools/notify'
import store from '../../../store/index'

Page({
	data: {
		token: '',
		url: WebUrl,
		title: '',//	转发标题	当前小程序名称	
		path: '',//	转发路径	当前页面 path ，必须是以 / 开头的完整路径	
		imageUrl: '',//	自定
	},
	onLoad: function (option) {
		let webId = Date.now()
		this.data.webId = webId
		this.unOn = on('redirect-' + webId, ({ redirect, title }) => {
			if (redirect) {
				this.setData({
					url: join(WebUrl, redirect),
					title
				})
			}
		})
		let props = option
		if (props.redirect) {
			let r = decodeURIComponent(props.redirect);
			delete props.redirect;
			// hide header tab
			props.hh = 1;
			props.ht = 1;
			let token = store.getState().user.get('token');
			let u = this.data.url = join(WebUrl, r + '?acToken=' + token + '&webId=' + webId + (Object.keys(props).length ? "&" + object2Query(props) : ""))
			this.setData({
				url: u
			})
      console.log("uuuu", u)
		}

	},
	onUnload: function () {
		this.unOn();
	},
	// 接受网页端发送的分享数据
	onShareMsg: function ({ data }) {
		const { title, imageUrl, path, type } = data
		if (type == 'share') {
			this.data.title = title;
			this.data.imageUrl = imageUrl;
			this.data.path = "/src/pages/webpage/index?redirect=" + path
		}

	},
	// 点了转发之后
	onShareAppMessage: function ({ from, target, webViewUrl }) {
		return {
			title: this.data.title,
			path: this.data.path,
			imageUrl: this.data.imageUrl,
		}
	}
});
