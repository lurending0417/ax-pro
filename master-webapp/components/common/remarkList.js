import { observer } from "mobx-react"
import CommentGroup from "../../pages/common/commentGroup"
// 头像与用户名显示
import AvatarWrap from "./avatarWrap"
import Avatar from "./avactar"
// 评论里的图片列表显示
import RemarkImgList from "./remarkImgList"
import List from "../../components/common/list";
import PropTypes from "prop-types"
import { dateUtil, renderUtils } from "../../utils"

import MessageStore from "../../data/stores/message"
import { API_SNS_COMMENT_GET, API_SNS_COMMENT_REPLY } from "../../common/api"
import ImgPreModal from "./imgPre";

/**
 * 评论列表
 *  <>-----}|------------------------------->
 *
 */
@observer
export default class RemarkList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sum: {
                page: {},
                total: {}
            },
            currentImgs: []
        }
    }
    navigateTo(path, a) {
        this.props.navigation.navTo(path, { ...a });
    }
    render() {
        const { style, className, contents, rowsName } = this.props;
        const st = Object.assign({ minHeight: "7.5rem" }, style)
        // const header = this.props.showHeader ? (<div className={this.refs["list"] && this.refs["list"].state.store.total > 0 ? "remark_header_bg" : ""}>
        const header = this.props.showHeader ? (<div style={{ marginTop: ".5rem", marginBottom: ".75rem" }} className={"remark_header_bg"} />) : null
        // 请求数据的评论
        if (this.props.billId)
            return <div style={st} className={className}>
                <ImgPreModal renderDel={() => null} items={this.state.currentImgs} ref={"imgPre"} />
                {header}
                <List
                    ref={"list"}
                    api={API_SNS_COMMENT_GET}
                    renderItem={this.renderRemarkItem.bind(this)}
                    initedRows={this.props.comments || contents || []}
                    initedTotal={this.props.commentTimes || (contents && contents.length) || 0}
                    getQuery={this.getQuery}
                    // renderEmpty={this.renderEmpty.bind(this)}
                    emptyDesc={"暂无任何评论"}
                    enableRefresh={false}
                // rowsName={rowsName || "remarkList"}
                />
            </div >
        // 传入数据 - 没数据的情况
        if (!contents) return null;
        // 传入数据 - 有数据的情况
        return <div style={st} className={className}>
            <ImgPreModal renderDel={() => null} items={this.state.currentImgs} ref={"imgPre"} />
            {header}
            {
                contents.map((item, index) => {
                    return this.renderRemarkItem(item, index, false);
                })
            }
        </div >



    }

    getQuery = () => {
        return {
            billType: this.props.billType,
            billId: this.props.billId
        }
    }

    refresh = () => {
        return this.refs["list"].getListData(0);
    }

    renderEmpty() {
        return (
            <div className="empty-list-cls" style={{ marginTop: "2.5rem" }}>
                暂无任何评论
            </div>
        )
    }

    callback = (item) => {

        return (rs) => {
            this.props.callback && this.props.callback(rs);
            // if (this.props.autoSave) 
            if (rs) {
                // this.refresh();
                // 只刷对饮的评论
                item.replies = rs.rows;
                item.open = true;
                this.refs["list"] && this.refs["list"].refreshItem(item, (oldItem, newItem) => {
                    return { ...item }
                })
            }
        }
    }

    renderRemarkItem = (remarkItem, index, empty) => {
        if (empty) return null;
        const user = remarkItem.user || {};

        const replies = remarkItem.replies || remarkItem.comments;
        const repliesLen = replies.length;
        const agree = "agreeAble" in remarkItem ? remarkItem.agreeAble : remarkItem.agree
        // console.log("sss", remarkItem);
        return (
            <div className="remark_list_wrap" key={"nick-" + remarkItem.id}>
                {(() => {
                    if (this.props.billType === "WANTED_REPLY" && index === 0) {
                        return <div className="remark_best">
                            {this.props.closed ? "揭榜答案：" : "目前最佳答案："}
                        </div>
                    }
                    return null;
                })()}
                <div className="remark_header_wrap">
                    <Avatar user={remarkItem.user}> </Avatar>
                    <div className="space"> </div>
                    <div
                        className="time fs-small">{dateUtil.formatTimeToText(remarkItem.createTime)}</div>
                </div>
                <div className="remark_content fs-normal">
                    <div>
                        {remarkItem.content}
                    </div>
                    <RemarkImgList imgList={remarkItem.attaches} onPreImg={this.showImg(remarkItem)}> </RemarkImgList>
                </div>
                <div className="remark_footer_wrap">
                    <div className="space"></div>
                    <div className="star_group">
                        <CommentGroup autoSave={this.props.autoSave} toReplyId={""} dots={remarkItem.agreeTimes} chats={repliesLen} navigation={this.props.navigation}
                            callback={this.callback(remarkItem)} canAgree={this.props.canAgree} dotEnable={agree} billId={remarkItem.id} billType={this.props.billType}>
                        </CommentGroup>
                    </div>
                    <span className="expand_text fs-small"
                        onClick={() => this.viewComment(remarkItem)}>{remarkItem.hasOwnProperty("open") && remarkItem.open ? "收起" : "展开"}</span>
                </div>
                {
                    remarkItem.hasOwnProperty("open") && remarkItem.open &&
                    replies.map((replyItem, index) => {
                        const user = replyItem.user || {};
                        let replyUserName = user.nick;
                        if (replyItem.toUser) { // 回复给其他回复的人
                            replyUserName = [replyUserName, replyItem.toUser.nick]
                        }
                        return (
                            <div className="remark_reply_wrap"
                                style={index ? {} : {
                                    borderRadius: ".45rem .45rem 0 0",
                                    borderTop: "0.05rem solid #cdcdcd"
                                }}
                                key={user.nick + index}>
                                <div className="remark-split" style={index ? { visibility: "visible" } : { visibility: "hidden" }} />
                                <div className="remark_reply_item" onClick={() => this.reply(remarkItem, replyItem)}>
                                    <div className="remark_header_wrap reply_avatar_wrap">
                                        <AvatarWrap imgSrc={user.avatar}
                                            userName={replyUserName}> </AvatarWrap>
                                        <div className="space"> </div>
                                        <div className="time fs-small">{dateUtil.formatTimeToText(replyItem.createTime)}</div>
                                    </div>
                                    <div className="remark_content fs-normal">
                                        <div>
                                            {replyItem.content}
                                        </div>
                                        <RemarkImgList
                                            imgList={replyItem.attaches} onPreImg={this.showImg(replyItem)}> </RemarkImgList>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        )
    }

    showImg = (item) => {
        return (src) => {
            const aims = item.attaches.filter(Boolean).map(item => item.path)
            this.setState({
                currentImgs: aims
            })

            const index = aims.indexOf(src)

            this.refs.imgPre.show(index);
        }

    }

    viewComment(item) {
        if (item.hasOwnProperty("open")) {
            item.open = !item.open;
        } else {
            item.open = true;
        }
        this.forceUpdate();
    }
    reply = (item, toItem) => {
        this.navigateTo("/disabuse/db_ask", {
            commentApi: API_SNS_COMMENT_REPLY,
            billId: item.id,
            isReply: true,
            autoSave: this.props.autoSave,
            toReplyId: toItem.id,
            billType: this.props.billType == "COURSE" ? "COMMENT" : this.props.billType,
            type: this.props.billType,
            callback: this.callback(item)
        })
    }
}
const billType = ["QUESTION", "QUESTION_LISTEN", "QUESTION_REPLAY", "COURSE",
    "APPOINT_OUT", "APPOINT_IN", "WANTED", "REWARD_OUT", "REWARD_IN",
    "RECHARGE", "WITHDRAW", "COMMENT", "COMMENT_REPLY", "WANTED_REPLY"];

RemarkList.propTypes = {
    billType: PropTypes.oneOf(billType),
    // billId: PropTypes.string,
    start: PropTypes.number,
    limit: PropTypes.number,
    toReplyUrl: PropTypes.string,
    isComment: PropTypes.bool // 判断改模块是评论 还是 问题的回复(没有精彩评论的图标)
}
RemarkList.defaultProps = {
    start: 0,
    limit: 10,
    canAgree: true,
    showHeader: true,
    isComment: true
} 