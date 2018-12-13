// 
import VerifyCode from "../../components/common/verifyCode"
import api from "../../api/api";
import { API_LOGIN_SMS } from "../../common/api";
import navable from "../../components/common/nav/navable";
import UserStore from "../../data/stores/UserStore"
import Storage from "../../utils/storage";
import { loginSucc } from "../../service/login";
import LinkBtn from "../../components/common/link";

@navable("/user/login")
class Login extends React.PureComponent {
	constructor() {
		super()
		this.state = {
			phone: ""
		}
	}
	componentDidMount() {
		if (localStorage.getItem("token")) {
			$.toast("已经登录了哟")
			setTimeout(
				() => this.props.navigation.backTo(),
				500
			)
		}
	}
	changeP = e => {
		this.setState({
			phone: e.target.value
		})
	}
	render() {
		return <div>
			<div className="list-block" style={{ backgroundColor: "white", marginTop: 0 }}>
				<div className="item-content">
					<div className="item-inner">
						<div className="item-input">
							<input onChange={this.changeP} ref="phone" type="number" maxLength="11" placeholder={"输入手机号"} />
						</div>
					</div>
				</div>
				<VerifyCode ref="code" phone={this.state.phone} />
			</div>
			<div className="content-block">
				<div className="row">
					<div className="col-100">
						<LinkBtn onClick={this.login} className="button button-big button-fill button-success">登录</LinkBtn>
					</div>
				</div>
			</div>
		</div>
	}

	login = () => {
		const p = this.refs["phone"].value;
		const { code, token } = this.refs["code"].state;

		if (p && code && token) {
			api.request({
				url: API_LOGIN_SMS,
				method: "post",
				params: {
					phone: p,
					code: code,
					token: token,
					client: "WAP"
				}
			}).then(rs => {
				loginSucc(rs);

				process.nextTick(() => {
					this.props.navigation.backTo();
				})
			})
		}
	}
}

export default Login;