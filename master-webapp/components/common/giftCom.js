import { observer } from "mobx-react"
import PropTypes from "prop-types"
import MessageStore from "../../data/stores/message"
import { GATEWAY } from "../../common/constant";
import { wxPay } from "../../utils/wx";
import api from "../../api/api";

import CustomPrice from "./customPrice"
import Modal from "./modal";

const moneys = [0.01, 2, 5, 10, 50, "自定义"]

@observer
export default class GiftCom extends React.Component {
	constructor(props) {
		super();
		this.state = {
			giftValue: moneys,
			chooseIndex: 0,
            money: moneys[0],
			maskStyle: {},
			startAnimate: props.startAnimate || "",
			gateway: GATEWAY[1]
		}
	}

	static getDerivedStateFromProps(nextProps) {
		if ("startAnimate" in nextProps) {
			return {
				startAnimate: nextProps["startAnimate"]
			}
		}
		return null;
	}

	componentDidMount() {
		const htmlFontSize = parseInt(window.getComputedStyle(document.documentElement)["font-size"]);
		const giftContentHeight = 214;
		const headerHeight = 44;
		const height = (window.screen.availHeight - giftContentHeight) - headerHeight;
		// GiftCom高度为214px(10.7rem)
		this.setState({
			maskStyle: {
				width: (window.screen.availWidth + 100) / htmlFontSize + "rem",
				height: window.screen.availHeight / htmlFontSize + "rem",
				top: - (window.screen.availHeight / htmlFontSize) + "rem"
			}
		})
	}

	render() {
		const { startAnimate } = this.state;
		return <div className={["gift_content_wrap", this.props.className, startAnimate === "up" && "gift_content_animate_up_cls",
			startAnimate === "down" && "gift_content_animate_down_cls"].filter(Boolean).join(" ")}>
			{/*定位元素*/}
			{
				// 收缩按钮
				this.renderPositionItem(<div className="after_gift_icon" onClick={this.hide}> </div>)
			}
			{
				// 上层蒙版
				this.renderPositionItem(<div className="gift_mask" onClick={this.hide}
					style={this.state.maskStyle}
				> </div>)
			}
			{/*打赏内容*/}
			<div className="gift_title fs-normal">
				选择打赏金额
			</div>
			<ul>
				{
					this.state.giftValue.map((item, index) => {
						return (
							<li key={index + "giftItem"}
								className={["fs-normal", this.state.chooseIndex === index ? "choose_gift_item" : ""].join(" ")}
								onClick={() => {
									this.setState({ chooseIndex: index, money: index == 5 ? 0 : moneys[index] })
									if (index == 5) {
										this.refs["customPrice"].show()
									}
								}}
							>
								{`${item}${index == 5 ? "" : "元"}`}
							</li>
						)
					})
				}
			</ul>
			<div className="sure_btn_wrap">
				<button className="sure_btn_cls" onClick={this.getGiftValue}>确认打赏{this.state.money || ""}</button>
			</div>
			<Modal pos="center" ref="customPrice" animateShow="fadeIn" animateHide={"fadeOut"}>
				<CustomPrice closeBack={() => {
					this.refs["customPrice"].hide()
				}} callback={v => {
					this.setState({
						money: v
					})
					this.refs["customPrice"].hide()
				}} />
			</Modal>
		</div>
	}

	renderPositionItem(positionItem) {
		if (this.state.startAnimate === "up") {
			return positionItem
		}
	}

	hide = () => {
		this.props.changeStartAnimate && this.props.changeStartAnimate("down")
		this.setState({
			startAnimate: "down"
		})


	}

	show = () => {
		this.setState({
			startAnimate: "up"
		})
	}

	submit = (cb) => {
		// api.request({
		// 	method:"post",
		// 	url:"",
		// 	params:{

		// 	},
		// })
		cb();
	}
	getGiftValue = () => {
		if (!this.state.money) {
			return $.toast("请选择金额")
		}

		const params = {
			gateway: this.state.gateway,
			toUserId: this.props.toUserId,
			amount: this.state.money
		}

		// 支付
		MessageStore.postReward({
			params, callback(res) {
				console.log("res", res)
				wxPay(res.result, err => {
					if (!err) {
						$.toast(`成功打赏${params.amount}元`);
					}
					else {
						$.toast("支付失败")
					}
				})
			}
		})


	}

}

GiftCom.propTypes = {
	toUserId: PropTypes.string.isRequired
}