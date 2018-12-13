import LinkBtn from "../../common/link";

// 

class QuestionBtn extends React.PureComponent {
	constructor(props) {
		super()
		console.log(Object.keys(props))
	}
	render() {
		const detail = this.props.detail || { id: "", questionCost: 1000 };
		return <div className="ma-p-concern">
			<LinkBtn style={{ width: "4.5rem" }} className="gold-border-btn btn-size-normaler button" onClick={this.concern}>提问
				<span className="ma-f-question">￥{detail.questionCost}</span></LinkBtn>
		</div>
	}

	concern = (e) => {
		e.stopPropagation();

		return this.props.askCallBack && this.props.askCallBack();
		// const detail = this.props.detail || { id: "", price: 1000 };
		// this.props.navigation.navTo("/meet/meetedit", {
		// 	data: {
		// 		masterId: detail.id,
		// 		appointCost: detail.appointCost,
		// 		avatar: detail.avatar,
		// 		nick: detail.nick
		// 	}
		// })
	}
}

export default QuestionBtn;