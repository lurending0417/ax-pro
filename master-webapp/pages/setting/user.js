import navable from "../../components/common/nav/navable"
import Store from "../../data/stores"
import { observer } from "mobx-react";
import ImgPicker from "../../components/common/imgPicker"

import * as Wx from "../../utils/wx"
import api from "../../api/api";
import { API_AVATOR, API_NICK } from "../../common/api";

const nickName = "nick"
const UserStore = Store.UserStore;

@navable("/setting/user")
@observer
export default class UserSetting extends React.Component {
	static async getInitialProps() {
		// 刷新一次用户信息npm
		await UserStore.refresh();
		return {}
	}

	static navProps() {
		return {
			title: "个人设置"
			// float:true,
			// headerCls:"transparent"
		}
	}

	constructor() {
		super();

		this.state = {
			msgs: [],
			showRecord: 1
		}


		// setTimeout(() => {
		// 	console.log("cjanged")
		// 	//https://f1.9999ax.com/user/avatar/201810/d8d37675e047444a988444f6a9aa16e7
		// 	//https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7
		// 	UserStore.avatar = "https://f1.9999ax.com/user/avatar/201810/d8d37675e047444a988444f6a9aa16e7"
		// }, 4000)




		this.fields = [{
			header: "昵称",
			icon: "icon-me",
			dataIndex: nickName,
			handler: () => this.props.navigation.navTo("/common/editText", {
				title: "设置昵称",
				desc: "设置11位(数字或字母)内的昵称",
				reg: /[0-9a-zA-Z\u4E00-\u9FA5]{1,11}/,
				placeholder: "输入昵称",
				field: nickName,
				value: Store.UserStore[nickName],
				api: API_NICK,
				onSaved: v => Store.UserStore.copyFrom({ nick: v })
			})
		}, {
			header: "手机号",
			icon: "icon-phone",
			dataIndex: "phone",
			handler: () => this.props.navigation.navTo("userPhone")
		}, {
			header: "微信号",
			dataIndex: "weixinOpenId",
			icon: "icon-message",
			render: v => {
				return v && "已绑定" || "未绑定"
			}
		}]
	}

	componentDidMount() {
		this.pushMsg("Hello")

		// wx auth
		Wx.setUp(null, (msg) => {
			this.pushMsg(msg)
		});
	}

	pushMsg = msg => {
		this.setState({
			msgs: [...this.state.msgs].concat(msg)
		})
		if (msg === "ready succ") {
			this.setState({
				showRecord: 1
			})
		}
	}
	render() {
		console.log(UserStore)
		const renderV = (field) => {
			return field.render ? field.render(UserStore[field.dataIndex]) : UserStore[field.dataIndex]
		}
		return <div className="user-setting common-list">
			<div className="list-block">
				<ul>
					<li >
						<div className="item-link item-content" >
							<div className="item-inner user-setting-head">
								<div className="item-title">头像</div>
								<ImgPicker ref="picker" onChoose={this.picSel} className="avator-normal" src={UserStore.avatar} />
							</div>
						</div>

					</li>
					{
						this.fields.map(item => {
							return <li key={item.dataIndex}>
								<a className="item-link item-content" onClick={item.handler || null}>
									<div className="item-inner">
										<div className="item-title">{item.header}</div>
										<div className="item-after fs-gray">{renderV(item)}</div>
									</div>
								</a>
							</li>
						})
					}
					{
						// this.state.msgs.map((item,i)=>{
						// 	return <li key={"li"+i}>{item.toString()}</li>
						// })
					}
					{
						// (0,()=>{
						// 	if(this.state.showRecord){
						// 		const lab=this.state.showRecord==1?"start":this.state.showRecord==2?"stop":"play"
						// 		return [
						// 			<a key="b" onClick={this.record}>{lab} record</a>,
						// 			this.state.showRecord==3?(<div><a key="b2" onClick={this.upload}>save</a></div>):null
						// 		]
						// 	}
						// })()
					}
				</ul>
			</div>
		</div>
	}

	picSel = (sid) => {
		this.pushMsg("pic loaded--" + sid)

		this.refs["picker"].save(this.pushMsg).then((ssid) => {
			this.pushMsg("pic uploaded--" + ssid)
			api.request({
				url: API_AVATOR,
				method: "POST",
				params: {
					mediaId: ssid
				}
			}).then((rs) => {
				// $.toast("保存成功>" + rs.result.slice(0, 10))

				requestAnimationFrame(() => {
					UserStore.avatar = rs.result;
				})

			})
		})
	}

	upload = () => {
		this.pushMsg("upload voice succ")
		wx.uploadVoice({
			ocalId: this.medId.toString(), // 需要上传的音频的本地ID，由stopRecord接口获得
			isShowProgressTips: 1, // 默认为1，显示进度提示
			success: function (res) {
				this.pushMsg("upload voice succ")
				var serverId = res.serverId; // 返回音频的服务器端ID
			}
		})
	}

	record = () => {
		if (this.state.showRecord == 1) {
			this.setState({
				showRecord: 2
			})

			wx.startRecord({
				success: () => {
					this.pushMsg("start");
				}
			});
		}
		if (this.state.showRecord == 2) {
			wx.stopRecord({
				success: ({ localId }) => {
					this.medId = localId;
					this.pushMsg("stop");
				}

			})

			this.setState({
				showRecord: 3
			})
		}

		if (this.state.showRecord == 3) {
			wx.playVoice({
				localId: this.medId
			})

			this.setState({
				showRecord: 1
			})
		}
	}
}