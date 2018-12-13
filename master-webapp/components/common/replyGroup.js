/**
 * 回复、分享组件（用于悬赏、解惑下方悬浮Bottom）
 *
 */
import PropTypes from "prop-types";
import Message from "../../data/stores/message";
import Modal from "./modal";
import ShareCom from "./shareCom";
import LinkBtn from "./link";
import CommentIcon from "./../comment/icons/icon";
import utils from "../../utils/renderUtil"



export default class ReplyGroup extends React.PureComponent {
  static defaultProps = {
    isDot: true, // 
    enableDot: true
  }

  constructor(props) {
    super(props);
    if (props.isDot) {
      this.state = {
        agree: props.detail.agree
      }
    }
  }

  // 点赞功能
  doDot = () => {
    const detail = this.props.detail;
    var params = {
      billType: detail.billType || "QUESTION",
      billId: detail.id
    };
    // if (this.state.agree) {
    //   $.toast("已经点过赞了");
    //   return;
    // }
    Message.postAgree({
      params,
      method: this.state.agree ? "delete" : "post",
      callback: () => {
        // $.toast("点赞成功");
        this.setState({
          agree: !this.state.agree
        });
      }
    });
  }

  toReply = () => {

    // if (this.props.replyCallBack) return this.props.replyCallBack();
    this.props.navigation.navTo("/disabuse/db_ask", {
      type: this.props.detail.billType || "QUESTION_COMMENT",
      billId: this.props.detail.id,
      billType: this.props.detail.billType || "QUESTION_COMMENT",
      autoSave: this.props.autoSave,
      title: this.props.nextTitle || "",
      callback: this.props.replyCallBack
    })

  }

  share = () => {
    if (this.props.shareCallBack)
      return this.props.shareCallBack()

    this.refs["share"].show();
  }

  render() {
    const { isDot, enableDot, shareMoney, lesson, shareCallBack } = this.props;
    const cb = isDot ? this.doDot : this.share
    return (
      <div className="rg_content">
        <Modal opacity={.9} ref={"share"}>
          <ShareCom callback={this.hideShare} amount={shareMoney} lesson={lesson} />
        </Modal>
        <LinkBtn className="rg_reply fs-small fs-gray" onClick={this.toReply}>
          {this.props.title}
        </LinkBtn>
        <div className="rg_share" >
          <CommentIcon
            onClick={cb}
            style={{ width: "3.8rem" }}
            className="fs-small rg_share_txt"
            desc={this.props.isDot ? (this.state.agree ? "已点赞" : "点赞") : "分享"}
            icon={isDot ? (!enableDot ? "comment-dot-enable-icon" : (this.state.agree ? "comment-dot-tint-icon" : "comment-dot-gray-icon")) : "comment-share-tint-icon"} />
          {
            (0, () => {
              if (isDot == 2) {
                return <CommentIcon
                  className="fs-small rg_share_txt"
                  badge={shareMoney ? utils.renderMoney(shareMoney) : ""}
                  style={{ position: "relative", marginLeft: ".75rem", width: "3.8rem" }}
                  onClick={this.share} icon="comment-share-tint-icon"
                  desc={"分享"} >
                </CommentIcon>
              }
            })()
          }
        </div>
      </div>
    )
  }

  hideShare = () => {
    this.refs["share"].hide()
  }

  renderBtns() {
    if (this.props.isDot === true) {
      return "d"
    }
  }
}

const DotTypes = [/*点赞*/true, /*分享*/false, /*both*/2];

ReplyGroup.propTypes = {
  title: PropTypes.string,
  replyCallBack: PropTypes.func,
  shareCallBack: PropTypes.func,
  isDot: PropTypes.oneOf(DotTypes)
};