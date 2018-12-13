import { observer } from "mobx-react"
import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import Avatar from "../../components/common/avatarWrap"
import MessageStore from "../../data/stores/message"
import List from "../../components/common/list"
import RemarkImgList from "../../components/common/remarkImgList"
import CommonAvatar from "../../components/common/commonAvatar";

import { API_MESSAGE_DETAIL_GET } from "../../common/api"
import dateUtil from "../../utils/dateUtil";

@navable("/message/star")
@observer
export default class StarMsg extends React.Component {
    static getInitialProps({ req }) {
        UserStore.recovery(req && req.headers && req.headers.cookie)
        return { a: 0 }
    }

    static navProps() {
        return {
            title: "点赞消息"
        }
    }

    constructor(props) {
        super();
        this.state = {
            a: props.a,
            msgAgreeList: [{
                user: {
                    avatar: "",
                    nick: "",
                    id: ""
                },
                billType: "评论", // 评论，悬赏回答，大师解惑
                createTime: "3天前",
                own: {
                    billType: "我的评论", // 我的评论，解惑问题
                    content: "闫芳，河北省第五届武术协会副主席，石家庄第十届政协委员，因网上流传的一段拍摄于2012年6月24日视频为人所知",
                    attaches: []
                }
            }, {
                user: {
                    avatar: "",
                    nick: "",
                    id: ""
                },
                billType: "悬赏回答", // 评论，悬赏回答，大师解惑
                createTime: "3天前",
                own: {
                    billType: "我的评论", // 我的评论，解惑问题
                    content: "闫芳，河北省第五届武术协会副主席，石家庄第十届政协委员，因网上流传的一段拍摄于2012年6月24日视频为人所知，被称为“最强太极推手”，掌风能击倒人。",
                    attaches: []
                }
            }, {
                user: {
                    avatar: "",
                    nick: "",
                    id: ""
                },
                billType: "大师解惑", // 评论，悬赏回答，大师解惑
                createTime: "3天前",
                own: {
                    billType: "解惑问题", // 我的评论，解惑问题
                    content: "最强太极推手，掌风能击倒人吗？",
                    attaches: []
                }
            }]
        }
        // MessageStore.getMessageByType({
        //     type: "AGREE",
        //     start: 0,
        //     limit: 10
        // })
    }

    getQuery() {
        return {
            type: "AGREE"
        }
    }

    renderEmpty() {
        return (
            <div className="fs-normal" style={{ textAlign: "center" }}> 暂无点赞消息 </div>
        )
    }

    render() {
        var index = 0;
        return (
            <div className="list-without-bottom" style={{ overflowY: "auto", height: "100%", backgroundColor: "#fff" }}>
                <List
                    className="list-split"
                    api={API_MESSAGE_DETAIL_GET}
                    renderItem={this.renderItem.bind(this)}
                    // store={MessageStore}
                    getQuery={this.getQuery.bind(this)}
                    // renderEmpty={this.renderEmpty.bind(this)}
                    emptyDesc={"暂无点赞消息"}
                // rowsName="msgAgreeList"
                    getKey={(item) => item.creatTime + index++}
                />
            </div>
        )
    }

    getBillTypeName(billType) {
        switch (billType) {
            case "COMMENT":
            case "COMMENT_REPLY": return {
                agree: "评论",
                quote: "我的评论",
                route: "",
                idName: ""
            }
            case "WANTED":
            case "WANTED_REPLY": return {
                agree: "悬赏回答",
                quote: "我的评论",
                route: "/reward/rewardDetail",
                idName: "wantedId"
            }
            case "QUESTION":
            case "QUESTION_REPLY": return {
                agree: "大师解惑",
                quote: "解惑问题",
                route: "/disabuse/db_detail",
                idName: "questionId"
            }
            case "COURSE":
            case "COURSE_REPLY": return {
                agree: "大师课程",
                quote: "我的课程",
                route: "/disabuse/db_detail",
                idName: "questionId"
            }
        }

        return {}
    }


    getRouteObj(jumpType) {
        switch (jumpType) {
            case "QUESTION":
                return {
                    route: "/disabuse/db_detail",
                    idName: "questionId"
                }
            case "WANTED":
                return {
                    route: "/reward/rewardDetail",
                    idName: "wantedId"
                }
        }
        return {}
    }

    renderItem(item, index) {
        const user = item.user || {};
        const route = this.getRouteObj(item.jumpType);
        const nameObj = this.getBillTypeName(item.jumpType);
        const createTime = dateUtil.formatTimeToText(item.createTime);
        return (
            <div
              className="remark_list_wrap" key={"msgStarList" + index} onClick={() => {
                this.navTo(route.route, item.jumpId, route.idName)
            }}>
                <div className="remark_header_wrap">
                    <CommonAvatar cached src={user.avatar} className="user-icon">
                        {
                            (() => {
                                if (user.master)
                                    return <div className="master-confirm-icon ma_master_confirm" />
                                else if (user.vip)
                                    return <div className="user-vip-icon ma_master_confirm" />
                                return <div></div>
                            })()
                        }
                    </CommonAvatar>
                    {/*<Avatar imgSrc={user.avatar} userName={user.nick}> </Avatar>*/}
                    <div style={{ marginLeft: "0.5rem" }}>
                        <div style={{ fontSize: "0.8rem" }}>{user.nick}</div>
                        <div style={{ fontSize: "0.7rem", color: "#9B9B9B" }}>{user.master ? "大师" : (user.vip ? "会员" : "普通用户")}</div>
                    </div>
                    <div className="space"></div>
                    <div className="time fs-small">{createTime}</div>
                    {
                      // 新消息红点
                      item.unread && <div
                        style={{
                          position: "absolute",
                          height: "0.4rem",
                          width: "0.4rem",
                          backgroundColor: "#E4112B",
                          borderRadius: "0.2rem",
                          right: "1rem",
                          top: "0.2rem",
                          border: "0.05rem solid #FFFFFF"
                        }}
                      />
                    }
                </div>
                <div style={{ paddingLeft: ".5rem" }} className="remark_content fs-normal">
                    赞了你的{nameObj.agree}
                </div>
                <div className="remark_reply_wrap" style={{ backgroundColor: "#fff", marginTop: "0.45rem" }}>
                    <div className="remark_reply_item" style={{ paddingBottom: ".25rem" }}>
                        <div className="remark_content fs-normal">
                            <span style={{ color: "#6176A0" }}>{nameObj.quote}：</span>
                            {item.quotedMessage}
                        </div>
                        <RemarkImgList imgList={item.quotedMessageAttaches}> </RemarkImgList>
                    </div>
                </div>
            </div>
        )
    }

    navTo(route, billId, propsName) {
        const obj = {};
        obj[propsName] = billId
        this.navigateTo(route, obj)
    }
}