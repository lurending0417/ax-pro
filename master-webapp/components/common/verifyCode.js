/**
* 验证码
*  <>-----}|------------------------------->
* 
*/
// 
import TimeText from "./timeText"
import api from "../../api/api"
import { API_SMS } from "../../common/api";
import { smsSign } from "../../utils/func";
import Validator from "../../utils/validator"
import LinkBtn from "./link";

class VerifyCode extends React.PureComponent {
	constructor() {
		super()
		this.state = {
			isSend: false,
			nextSend: null,
			code: "",
			token: "",
			label: "发送验证码"
		}
	}
	render() {
		return <div className="item-content">
			<div className="item-inner">
				<div className="item-input">
					<input onChange={this.onChange} ref="code" type="number" maxLength="6" placeholder={"输入验证码"} />
				</div>
				<div className="item-after">
					<LinkBtn onClick={this.send} className="button button-round gold-border-btn">
						{
							(0, () => {
								if (this.state.isSend) {
									return <TimeText onFinished={this.reSend} aimTime={this.state.nextSend} />
								}
								return "发送验证码"
							})()
						}
					</LinkBtn>
				</div>
			</div>
		</div>
	}

	onChange = e => {
		this.setState({
			code: e.target.value
		})

		this.props.onChange && this.props.onChange(e)
	}

	reSend = () => {
		this.setState({
			isSend: false,
			nextSend: null
		})
	}

	send = () => {
		if (!this.props.phone) {
			return $.toast("请输入手机号")
		}
		if (!Validator.is({ type: "mobile", input: this.props.phone })) {
			return $.toast("请输入正确的手机号")
		}
		if (!this.state.isSend) {
			api.request({
				url: API_SMS,
				method: "post",
				params: {
					phone: this.props.phone,
					sign: smsSign(this.props.phone)
				},
				error: (rs) => {
					$.toast(rs && rs.message || "发送失败")
					this.setState({
						isSend: false,
						nextSend: null
					})
				}
			}).then(rs => {
				this.setState({
					token: rs.result
				})
			})

			this.setState({
				isSend: true,
				nextSend: Date.now() + 60 * 1000
			})

			this.props.onSend && this.props.onSend();
		}
	}
}

export default VerifyCode;