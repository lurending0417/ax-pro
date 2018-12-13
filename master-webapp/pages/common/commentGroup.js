/**
 * 用户评论点赞组件
 */
import PropTypes from "prop-types"
import { observer } from "mobx-react"
import MessageStore from "../../data/stores/message"
import { API_SNS_COMMENT_REPLY } from "../../common/api";

@observer
export default class CommentGroup extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			dotEnable: props.dotEnable,
			dots: props.dots
		}
	}

	navigateTo(path, a) {
		this.props.navigation.navTo(path, { ...a });
	}

	render() {
		return (
			<div className="cm_content">
				<div className="cm_detail">
					<div className={this.props.chatEnable ? "comment-chat-tint-icon" : "comment-chat-gray-icon"}
						onClick={(e) => { this.reply(e) }} />
					<div className="cm_tip fs-normal">{this.props.chats}</div>
				</div>
				<div className="cm_detail cm_between" onClick={this.postAgree}>
					<div className={!this.props.canAgree ? "comment-dot-enable-icon" : (!this.state.dotEnable ? "comment-dot-gray-icon" : "comment-dot-tint-icon")} />
					<div className="cm_tip fs-normal">{this.state.dots}</div>
				</div>
				{
					this.props.hasShare && <div className="cm_detail cm_between">
						<div className="comment-share-tint-icon" />
					</div>
				}
			</div>
		)
	}

	postAgree = (e) => {
		if (this.state.dotEnable) {
			return
		}
		e.stopPropagation();
		e.nativeEvent.preventDefault();

		const params = {
			billType: this.props.billType == "COMMENT_REPLY" ? "COMMENT" : this.props.billType,
			billId: this.props.billId
		}
		MessageStore.postAgree({
			params, callback: (rs) => {
				console.log("rs", rs)
				this.setState({
					dots: ++this.state.dots,
					dotEnable: true
				});
			}
		})
	}

	reply = (e) => {
		if (!this.props.chatEnable) {
			return
		}
		e.stopPropagation();
		this.navigateTo("/disabuse/db_ask", {
			autoSave: this.props.autoSave,
			isReply: true,
			commentApi: API_SNS_COMMENT_REPLY,
			billId: this.props.billId,
			billType: this.props.billType == "COURSE" ? "COMMENT" : this.props.billType,
			type: this.props.billType,
			toReplyId: this.props.toReplyId,
			callback: this.props.callback
		})
	}
}
CommentGroup.propTypes = {
	chats: PropTypes.number,
	dots: PropTypes.number,
	chatEnable: PropTypes.bool,
	dotEnable: PropTypes.bool,
	billType: PropTypes.string,
	billId: PropTypes.string,
	toReplyId: PropTypes.string
}
CommentGroup.defaultProps = {
	chats: 0,
	dots: 0,
	chatEnable: true,
	dotEnable: false
}