import LinkBtn from "../../common/link";

// 

class Concern extends React.PureComponent {
	constructor(props) {
		super()
		console.log(Object.keys(props))
	}
	render() {
		const detail = this.props.detail || { id: "", appointCost: 1000 };
		return <div className="ma-p-concern">
			<LinkBtn className="gold-border-btn btn-size-normal button" onClick={this.concern}>约见</LinkBtn>
			<span className="fs-gold">￥{detail.appointCost}/小时</span>
		</div>
	}

	concern = (e) => {
		// e.stopPropagation();


		const detail = this.props.detail || { id: "", price: 1000 };
		this.props.navigation.navTo("/meet/meetedit", {
			data: {
				masterId: detail.id,
				appointCost: detail.appointCost,
				avatar: detail.avatar,
				nick: detail.nick,
				address: detail.districtCode
			}
		})
	}
}

export default Concern;