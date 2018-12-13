import UserStore from "../../data/stores/UserStore";
import message from "../../data/stores/message";
import CommentIcon from "../comment/icons/icon";
import LinkBtn from "../common/link";
import { buySection, favorite, agree, buyCourse } from "../../service/course/one";
import Modal from "../common/modal";
import ShareCom from "../common/shareCom";
import utils from "../../utils/renderUtil"
// 

class GroupFooter extends React.PureComponent {
    constructor() {
        super()
    }



    toShare = () => {
        this.refs["share"].show()
    }

    hideShare = () => {
        this.refs["share"].hide()
    }

    toDot = () => {
        if (this.props.store.toBuyCourse) {
            return $.toast("还未购买呢")
        }
        agree(this.props.store);
    }

    toFav = () => {
        favorite(this.props.store);
    }

    toComment = () => {
        this.props.navigation.navTo("/disabuse/db_ask", {
            type: "COURSE",
            billId: this.props.store.id,
            billType: "COURSE",
            autoSave: true,
            title: "评论：" + this.props.store.title,
            callback: () => {
                this.props.store.refreshComments();
            }
        })
    }

    toVip = () => {
        this.props.navigation.navTo("/remarkTest/purchaseVip")

    }

    toSeries = () => {
        buyCourse(this.props.store)();
    }

    renderBuy() {
        const { favorite } = this.props.store;
        return [
            <CommentIcon onClick={this.toFav} key="fav" icon={favorite ? "fav-dot-gray-icon" : "fav-dot-tint-icon"} desc="收藏" className={favorite ? "fs-small fs-gray rg_dot_txt" : "fs-small rg_share_txt"} />,
            <LinkBtn key="buy" className="button  gold-border-btn btn-size-normal" onClick={this.toSeries}>购买</LinkBtn>,
            <LinkBtn key="course" className="button  gold-btn btn-size-normal" onClick={this.toVip}>会员免费</LinkBtn>
        ]
    }



    renderCommon() {
        //agree ? "fs-small fs-gray rg_dot_txt" :
        const { agree, commentTimes, favorite, shareMoney, toBuyCourse } = this.props.store;
        return [
            <CommentIcon style={{ width: "3.8rem" }} onClick={this.toFav} key="fav" icon={!favorite ? "fav-dot-gray-icon" : "fav-dot-tint-icon"} desc={favorite ? "已收藏" : "收藏"} className={"fs-small rg_share_txt"} />,
            <CommentIcon onClick={this.toComment} key="com" icon={"comment-chat-tint-icon"} desc={"评论"} className={"fs-small rg_share_txt"} />,
            <CommentIcon style={{ width: "3.8rem" }} onClick={this.toDot} key="dot" icon={toBuyCourse ? "comment-dot-enable-icon" : (agree ? "comment-dot-tint-icon" : "comment-dot-gray-icon")} desc={agree ? "已点赞" : "点赞"} className={"fs-small  " + ("rg_share_txt")} />,
            <CommentIcon style={{ width: "3.8rem" }} onClick={this.toShare} key="share" icon={"comment-share-tint-icon"} desc="分享" badge={shareMoney ? utils.renderMoney(shareMoney, false) : ""} className={"fs-small  rg_share_txt"} />
        ]
    }
    render() {
        const store = this.props.store;
        // console.log("sss", store);
        let child = null;
        if (store.toBuyCourse) {
            child = this.renderBuy();
        }
        else child = this.renderCommon();

        return <div style={{ padding: 0 }} className="pays-footer pays-btn"><div style={{ justifyContent: "space-around", padding: 0 }} className="rg_content">
            {
                child
            }
            <Modal opacity={.9} modalStyle={{ opacity: .9 }} ref="share">
                <ShareCom lesson={true} shareMoney={(store.shareMoney || 0)} callback={this.hideShare} />
            </Modal>
        </div></div>
    }
}

export default GroupFooter;