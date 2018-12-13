/**
* 修改手机号
*  <>-----}|------------------------------->
* 
*/
import VerifyCode from "../../components/common/verifyCode"
import Store from "../../data/stores"
import { API_PHONE } from "../../common/api";
import api from "../../api/api"
import LinkBtn from "../../components/common/link";

const UserStore = Store.UserStore;


export default class UserPhone extends React.PureComponent {
	static navProps() {
		return {
			title: "修改手机号"
		}
	}

	constructor() {
		super()
		this.state = {
			phone: "",
			btn: false
		}
	}

	render() {
		return <div>
			<div className="list-block" style={{ backgroundColor: "white", marginTop: 0 }}>
				<div className="item-content">
					<div className="item-inner">
						<div className="item-input">
							<input onChange={this.onChange} ref="phone" type="number" maxLength="11" placeholder={"输入手机号"} />
						</div>
					</div>
				</div>
				<VerifyCode onSend={this.showBtn} phone={this.state.phone} ref="code" />
			</div>
			<div className="content-block">
				<div className="row">
					<div className="col-100">
						{
							(0, () => {
								if (this.state.btn) {
									return <LinkBtn onClick={this.submit} className="button button-big gold-btn">保存</LinkBtn>
								}
							})()
						}

					</div>
				</div>
			</div>
		</div>
	}

	showBtn = () => {
		this.setState({
			btn: true
		})
	}

	onChange = e => {
		this.setState({
			phone: e.target.value
		})
	}

	submit = () => {
		const p = this.refs["phone"].value;
		const { code, token } = this.refs["code"].state;

		if (p && code && token) {
			api.request({
				url: API_PHONE,
				method: "post",
				params: {
					phone: p,
					code: code,
					token: token
				},
				error: (err) => {
					console.error(err);
					this.props.navigation.backTo();
				}
			}).then(() => {
				UserStore.copyFrom({ phone: p })

				process.nextTick(() => {
					this.props.navigation.backTo();
				})
			})
		}
		else {
			$.toast("输入验证码")
		}
	}
}