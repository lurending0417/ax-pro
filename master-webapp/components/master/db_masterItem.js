import MasterIntroduceMain from "./main";
import CommonBtn from "../../components/common/button/commonBtn";
import DisaBuseLink from "./disabuseLink";
import MasterLabel from "./masterLabel";
import LinkBtn from "../common/link";


export default class DB_MasterItem extends MasterIntroduceMain {
	renderMain(children) {
		return <div className="border-round umain ms_card_item" onClick={this.props.callback}>
			{children}
		</div>
	}
	renderHeaderPlugin() {

		const detail = this.props.detail || { id: "", questionCost: 1000 };
		return <div className="ma-p-concern">
			<LinkBtn style={{ width: "4.5rem" }} className="gold-border-btn btn-size-normal button" onClick={this.props.askCallBack}>提问
				<span className="ma-f-question">￥{detail.questionCost}</span></LinkBtn>
		</div>
		// return <CommonBtn
		// 	isFill={false}
		// 	style={{
		// 		height: "1.6rem",
		// 		width: "4.25rem",
		// 		fontWeight: "500",
		// 		fontSize: "0.75rem",
		// 		position: "absolute",
		// 		right: "0.5rem",
		// 		top: "0.75rem"
		// 	}}
		// 	title={`提问￥${detail ? detail.questionCost : 0}`}
		// 	callback={this.props.askCallBack}
		// />
	}
	renderFooter() {
		const detail = this.props.detail;
		return (
			<div key="footer" className="ms_item_footer">
				<MasterLabel />
				<DisaBuseLink tip={`${detail ? detail.questionTimes : 0}次解惑`} />
			</div>
		)
	}
}