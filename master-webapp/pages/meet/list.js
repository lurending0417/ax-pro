/**
* 约见某人
*  <>-----}|------------------------------->
* 
*/
import navable from "../../components/common/nav/navable"

import List from "../../components/common/list"
import { API_GET_MEETS } from "../../common/api"
import Link from "../../components/common/link"
import MasterListItem from "../../components/meet/listitem"
import GiftCom from "../../components/common/giftCom";


@navable("/meet/list")
export default class MeetList extends React.PureComponent {
	static navProps() {
		return {
			title: "我的约见"
			/*rightBtn: () => {
				return <Link className="button button-round pull-right" href="/meet/meetedit">约见</Link>
			}*/
		}
	}

	constructor() {
		super();
		this.state = {
			masterId: ""
		}
	}


	render() {
		return <div className="meet full list-without-bottom">
			<List
				api={API_GET_MEETS}
				renderItem={this.renderItem}
				className={"list-split"}
			/>
			<GiftCom toUserId={this.state.masterId} className="gift-plugin" ref="gift" />
		</div>
	}

	renderItem = (item, index, empty) => {
		return <MasterListItem onGift={this.gift} navigation={this.props.navigation} raw={item} detail={item.master} user={item.master} />
	}

	gift = (item) => {
		console.log(item)
		if (item && item.id)
			this.setState({
				masterId: item.id
			})
		this.refs["gift"].show()
	}

	toMeet = (item) => {
		return () => {
			this.props.navigation.navTo("/meet/meetedit", {
				readOnly: true, data: {
					id: item.id,
					avatar: item.master.avatar,
					appointCost: item.master.appointCost,
					address: item.master.districtCode,
					startTime: item.startTime,
					hours: item.hours,
					userPhone: item.user.phone,
					userName: item.user.nick,
					gateway: "WEIXIN_MP",
					masterId: item.master.id,
					totalCost: item.master.appointCost * item.hours
				}, raw: item
			})
		}

	}
}