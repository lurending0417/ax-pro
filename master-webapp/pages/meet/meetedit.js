/**
* 约见发起表单
*  <>-----}|------------------------------->
*
*/

import navable from "../../components/common/nav/navable"

import { API_MEET_UPLOAD } from "../../common/api"
import api from "../../api/api"
// import BaseComponent from "../../components/common/BaseComponent";
import mixable from "../../utils/mixable"
import TimeMix from "react-timer-mixin"
import CityPicker from "../../components/common/cityPicker"
import TimePicker from "../../components/common/timePicker"
import MaxText from "../../components/common/textMax"
import HourPicker from "../../components/meet/hourPicker"
import CheckForm from "../../utils/formCheck"
import Moment from "moment"
import UserStore from "../../data/stores/UserStore";
import { wxPay } from "../../utils/wx"
import GiftCom from "../../components/common/giftCom";
import starCom from "../../components/common/starCom";
import { BillTypes } from "../../common/constant";
import utils from "../../utils/renderUtil"
import LinkBtn from "../../components/common/link";


@navable("/meet/meetedit")
@mixable(TimeMix)
export default class MeetEdit extends React.PureComponent {

	static navProps = () => {
		return {
			title: "约见大师"
		}
	}

	constructor(props) {
		super();
		const ps = props.data || {};
		this.state = {
			price: ps.appointCost || 1000,
			newV: {
				address: ps.address || 510100,
				startTime: Moment(ps.startTime || Date.now()).add(2, "d").format("YYYY-MM-DD HH:30"),
				hours: ps.hours || 2,
				userPhone: ps.userPhone || UserStore.phone,
				userName: ps.userName || UserStore.name,
				gateway: "WEIXIN_MP",
				masterId: ps.masterId,
				totalCost: ps.totalCost || 2 * (ps.appointCost || 1000)//price
			}
		}

		this.fields = [
			{
				name: "所在地址",
				key: "address",
				required: 1,
				render: () => {
					return <div className="item-after">
						<input readOnly={true} type={"text"} defaultValue={utils.renderDistrictCode(this.props.data.address) || ""} className="fs-gray" aria-readonly={true} />
					</div>
					return <CityPicker readOnly={this.props.readOnly} onChange={this.onChange("address")} defaultValue="四川 成都" navigation={this.props.navigation} id="meet-address" className="item-after" />
				}
			},
			{
				name: "约见时间",
				key: "startTime",
				required: 1,
				render: () => {
					return <TimePicker readOnly={this.props.readOnly} onChange={this.onChange("startTime")} defaultValue={this.state.newV.startTime} />
				}
			}, {
				name: "约见时长",
				key: "hours",
				required: 1,
				render: () => {
					return <HourPicker readOnly={this.props.readOnly} onChange={this.onChange("hours")} className="fs-gray" defaultValue={this.state.newV.hours} />
				}
			}, {
				name: "约见者姓名",
				key: "userName",
				required: 1,
				maxLength: 6
			}, {
				name: "联系电话",
				key: "userPhone",
				required: 1,
				maxLength: 11,
				type: "number"
			}, {
				name: "备注",
				key: "content",
				required: 1,
				maxLength: 200
			}
		]
	}

	onChange = (field) => {
		return e => {
			const newV = this.state.newV;
			newV[field] = e.target.value;
			if (field === "hours") {
				newV.totalCost = this.state.price * +e.target.value
			}
			this.setState({
				newV: { ...newV }
			})
		}
	}

	renderHeader() {
		return <div className="user-setting-bg-icon"></div>
	}

	getItemClass() {
		return this.props.readOnly ? "item-content" : "item-link item-content"
	}

	renderForm() {
		return <div className="list-block" style={{ marginTop: 0 }}>
			<ul>
				<li className="item-inner">
					<div key="head" style={{ width: "100%" }} className="uheader ms_item_header">
						<div className="ma_avatar">
							{
								(0, () => {
									if (this.props.data.avatar) {
										return <img className="full" src={this.props.data.avatar}></img>
									}
								})()
							}
							<div className="master-confirm-icon ma_master_confirm" />
						</div>
						<div className="ma_right">
							<div className="ma_title fs-big">{this.props.data.nick || "大师"}</div>
							<div className="ma_stars">
								{(() => {
									var content = [];
									for (var i = 0; i < 5; i++) {
										content.push(<div key={"star-" + i} className="ma_star master-star-icon" />);
									}
									return content;
								})()}
							</div>
						</div>
						<span className="fs-small fs-gold" style={{
							flex: 1,
							textAlign: "right",
							marginTop: "-1.5rem"
						}}>￥{this.state.price}元/时</span>
					</div>
				</li>
				{
					this.fields.slice(0, -1).map((item, index) => {
						return <li key={item.key}>
							<a className={this.getItemClass()} onClick={item.handler || null}>
								<div className="item-inner">
									<div className="item-title label">{item.name}</div>
									{
										(0, () => {
											if (item.render) return item.render();
											return <div className="item-after">
												<input readOnly={this.props.readOnly} onChange={this.onChange(item.key)} type={item.type || "text"} defaultValue={this.state.newV[item.key]} maxLength={item.maxLength} className="fs-gray" aria-readonly={index === 0 ? true : false} />
											</div>
										})()
									}

								</div>
							</a>
						</li>
					})
				}
				<li>
					<div className="item-inner">
						<div style={{ marginLeft: ".75rem" }} className="item-title label">备注：</div>
					</div>

					<div>
						<MaxText readOnly={this.props.readOnly} onChange={this.onChange("content")} max={200} defaultValue="" />
					</div>
				</li>
				{
					(0, () => {
						if (this.props.readOnly) {
							return <li className={this.getItemClass()}>
								<div className="item-inner">
									<div className="item-title label">大师电话：</div>
									<div className="item-after">
										<input readOnly={this.props.readOnly} defaultValue={this.state.newV["masterPhone"]} className="fs-gray" />
									</div>
								</div>
							</li>
						}
					})()
				}
			</ul>
		</div>
	}

	renderFooter() {
		return <div className="me-footer">
			{
				(0, () => {
					if (this.props.readOnly) {
						return [
							<LinkBtn key="reply" onClick={this.submitReply} className="button btn-size-normaler gold-border-btn">{"评价"}</LinkBtn>,
							<LinkBtn key="gift" onClick={this.submitGift} className="button btn-size-normaler gold-btn">{"打赏"}</LinkBtn>,
							<GiftCom toUserId={this.props.data.masterId} key="giftcomp" ref="giftcomp" />
						]
					}
					return <LinkBtn onClick={this.submit} className="button btn-size-half gold-btn">{"确认预约 "}<span>（￥{this.state.newV.totalCost}）</span></LinkBtn>
				})()
			}
		</div>
	}
	render() {
		return <div className="meetedit white">
			{this.renderForm()}
			{this.renderFooter()}
		</div>
	}

	submit = async () => {
		// check
		const err = await CheckForm.checkFields(this.state.newV, this.fields, ["name", "key", "type", "render"]);
		if (err !== true) {
			return $.toast(err)
		}
		const ps = { ...this.state.newV };
		ps.startTime = new Date(ps.startTime).getTime();

		api.request({
			url: API_MEET_UPLOAD,
			method: "post",
			params: ps
		}).then((rs) => {
			$.toast("保存成功 准备支付", 2000)

			this.setTimeout(() => {
				// this.props.navigation.backTo();
				wxPay(rs.result, err => {
					if (err) {
						$.toast("支付失败")
					}
					else {
						this.props.navigation.backTo();
					}
				});
			}, 2000)

		})
	}

	submitReply = () => {

		starCom(BillTypes.APPOINT, this.props.data.id);

		// this.props.navigation.navTo("/disabuse/db_ask", {
		// 	a: {
		// 		type: "APPOINT",
		// 		billId: this.props.data.id
		// 	},
		// 	billType: "APPOINT",
		// 	autoSave: true
		// })
	}

	submitGift = () => {
		this.refs["giftcomp"].show()
	}
}



