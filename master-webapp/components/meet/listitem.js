import Master from "../master/main"
import renderUtil from "../../utils/renderUtil"
import GiftCom from "../common/giftCom";
import Link from "../../components/common/link"
import moment from "moment"
import starCom from "../common/starCom";

// 

class MeetListItem extends Master {
	onClick = () => {
		const { navigation, raw, ...others } = this.props
		navigation.navTo("/meet/meetedit", {
			readOnly: true,
			data: {
				id: raw.id,
				avatar: raw.master.avatar,
				appointCost: raw.master.appointCost,
				address: raw.master.districtCode,
				startTime: raw.startTime,
				hours: raw.hours,
				userPhone: raw.user.phone,
				userName: raw.user.nick,
				gateway: "WEIXIN_MP",
				masterId: raw.master.id,
				totalCost: raw.master.appointCost * raw.hours
			},
			raw: raw
		})
	}

	// 跳转到
	toDetail(item) {
		const { navigation } = this.props
		return () => {
			navigation.navTo("/master/detail", {
				data: item
			})
		}
	}

	renderMain(children) {
		return <div onClick={() => this.toDetail(this.props.detail)} className={"umain ms_item" + (this.props.className && (" " + this.props.className) || "")}>
			{children}
		</div>
	}

	renderBody() {
		const detail = this.props.detail || {};
		return <div key="body" className="ubody ms_item_content fs-normal">
			<span>
				<label>约见时间：</label>
				<label>{renderUtil.renderTime(this.props.raw.startTime)}</label>
			</span>
			<p style={{ marginTop: ".25rem" }}>约见地址：{renderUtil.renderDistrictCode(detail.districtCode)}</p>
		</div>
	}

	renderFooter() {
		return <div key="footer" className="ufooter">
			<div className="mfooter">
				<Link onClick={this.remark} className="button gold-border-btn btn-size-normal">评价</Link>
				<Link onClick={this.gift} className="button gold-btn btn-size-normal">打赏</Link>
			</div>

		</div>
	}

	gift = () => {
		this.props.onGift(this.props.detail)
	}

	remark = () => {
		starCom("APPOINT", this.props.raw.id);

		// this.props.navigation.navTo("/disabuse/db_ask", {
		// 	title: "评价大师"
		// })
	}
}

export default MeetListItem;