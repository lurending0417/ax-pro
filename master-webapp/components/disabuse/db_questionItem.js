import CommentGroup from "../../pages/common/commentGroup";
import Avactar from "../../components/common/avactar";
import ViewImgDetail from "../../components/common/viewImgDetail";
import CommonImg from "../common/img";

export default class DB_QuestionItem extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	static defaultProps = {
		canAgree: true
	}

	renderImgs() {
		const detail = this.props.detail;
		if (!detail.attaches || !detail.attaches.length) return null;
		return <div className="rd_imgs">
			{(() => {
				return detail.attaches.map((item, index) => {
					if (index < 3) {
						return <CommonImg src={item.path} className="rd_img" key={`img-${index}`} />
						// return <img src={item.path} className="rd_img" key={`img-${index}`} />
					}
				})
			})()}
		</div>
	}
	render() {
		const detail = this.props.detail;
		return (
			<div className="ms_question_item border-round" style={this.props.style ? this.props.style : { padding: "0.5rem 0.5rem 0" }} onClick={this.props.callBack}>
				<div className="ms_question_header">
					{detail.master ? <Avactar user={detail.master} /> : null}
				</div>
				<div className="ms_item_content fs-small">
					{detail ? detail.content : ""}
				</div>
				{this.renderImgs()}
				<div className="ms_question_footer">
					<div className="ms_item_footer_left">
						<div className="ms_item_footer_tip fs-small">{`偷看:${detail ? detail.listenTimes : 0}次`}</div>
						<div className="ms_item_footer_tip fs-small">{`追问:${detail ? detail.pursuitTimes : 0}次`}</div>
					</div>
					<CommentGroup
						className="ms_item_footer_right"
						dots={detail.agreeTimes}
						chats={detail.commentTimes}
						dotEnable={true}
						chatEnable={false}
						canAgree={this.props.canAgree}
						navigation={this.props.navigation}
					/>
				</div>
			</div>
		);
	}
}