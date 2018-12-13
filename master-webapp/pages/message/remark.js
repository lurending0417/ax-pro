import { observer } from "mobx-react"
import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import Avatar from "../../components/common/avatarWrap"
import RemarkImgList from "../../components/common/remarkImgList"
import MessageStore from "../../data/stores/message"
import List from "../../components/common/list"

import { API_MESSAGE_DETAIL_GET } from "../../common/api"
import dateUtil from "../../utils/dateUtil";


@navable("/message/remark")
@observer
export default class RemarkMsg extends React.Component {
    static getInitialProps({ req }) {
        UserStore.recovery(req && req.headers && req.headers.cookie)
        return { a: 0 }
    }

    static navProps() {
        return {
            title: "评论信息"
        }
    }

    constructor(props) {
        super();
        this.state = {
            a: props.a,
            imgList: [{ path: "../../static/images/test-img.png" }, { path: "../../static/images/test-img1.png" }],
            rows: [
                {
                    billId: "string",
                    billType: "QUESTION",
                    createTime: 0,
                    extra: {},
                    message: "string",
                    messageAttaches: [
                        {
                            path: "string"
                        }
                    ],
                    quotedMessage: "string",
                    quotedMessageAttaches: [
                        {
                            path: "string"
                        }
                    ],
                    user: {
                        avatar: "string",
                        id: "string",
                        master: false,
                        nick: "string",
                        vip: false
                    }
                }
            ],
            msgCommentList: [{
                user: {
                    avatar: "",
                    nick: "",
                    id: ""
                },
                createTime: "2天前",
                content: `看到有人推荐了栗子宜的视频
				窃以为不太适合，动作起伏过大，已经流于外形，
				不是说这个前辈的功夫不好，当然好也不至于好过南
				老`,
                attaches: [],
                billType: "解惑", // 解惑，悬赏回答，评论
                own: {
                    content: `南老的态度负责得太多，尽管年纪大了
					转关时体现腰胯有些费力了，但是南老还是刻意做出
					来，这样反而让初学者看的更加清晰`,
                    attaches: []
                }
            }, {
                user: {
                    avatar: "",
                    nick: "",
                    id: ""
                },
                createTime: "2天前",
                content: `看到有人推荐了栗子宜的视频
				窃以为不太适合，动作起伏过大，已经流于外形，
				不是说这个前辈的功夫不好，当然好也不至于好过南
				老`,
                attaches: [],
                billType: "悬赏回答", // 解惑，悬赏回答，评论
                own: {
                    content: `南老的态度负责得太多，尽管年纪大了
					转关时体现腰胯有些费力了，但是南老还是刻意做出
					来，这样反而让初学者看的更加清晰`,
                    attaches: []
                }
            }, {
                user: {
                    avatar: "",
                    nick: "",
                    id: ""
                },
                createTime: "2天前",
                content: `看到有人推荐了栗子宜的视频
				窃以为不太适合，动作起伏过大，已经流于外形，
				不是说这个前辈的功夫不好，当然好也不至于好过南
				老`,
                attaches: [],
                billType: "评论", // 解惑，悬赏回答，评论
                own: {
                    content: `南老的态度负责得太多，尽管年纪大了
					转关时体现腰胯有些费力了，但是南老还是刻意做出
					来，这样反而让初学者看的更加清晰`,
                    attaches: []
                }
            }]
        }
    }

    getQuery() {
        return {
            type: "COMMENT"
        }
    }

    renderEmpty() {
        return (
            <div className="fs-normal" style={{ textAlign: "center" }}> 暂无评论消息 </div>
        )
    }

    render() {
        var index = 0;
        return (
            <div className="list-without-bottom message" style={{ overflowY: "auto", height: "100%", backgroundColor: "#fff" }}>
                <List
                    className="list-split"
                    api={API_MESSAGE_DETAIL_GET}
                    getKey={item => item.jumpId}
                    renderItem={this.renderItem.bind(this)}
                    // store={MessageStore}
                    getQuery={this.getQuery.bind(this)}
                    emptyDesc={"暂无评论消息"}
                // renderEmpty={this.renderEmpty.bind(this)}
                // rowsName="msgCommentList"
                    getKey={(item) => item.srcId + index++ }
                />
            </div>
        )
    }

    getBillTypeName(srcType) {
        switch (srcType) {
            case "COMMENT_REPLY":
                return "评论"
            case "WANTED_REPLY":
                return "悬赏回答"
            case "QUESTION_REPLY":
                return "解惑问题"
        }
        return ""
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
            case "COURSE":
                return {
                    route: "/course/one",
                    idName: "courseId"
                }
        }
        return {}
    }

    renderItem(item, index) {
        const user = item.user || {};
        const route = this.getRouteObj(item.jumpType);
        const billTypeName = this.getBillTypeName(item.srcType);
        const createTime = dateUtil.formatTimeToText(item.createTime);
        console.log("sss", item.srcType);
        return (
            <div
              className="remark_list_wrap" key={"msgCommentList" + index}>
                <div className="remark_header_wrap">
                    <Avatar imgSrc={user.avatar} userName={user.nick}> </Avatar>
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
                <div className="remark_content fs-normal">
                    <div onClick={() => {
                        this.navTo(route.route, item.jumpId, route.idName)
                    }}>
                        {item.message}
                    </div>
                    <RemarkImgList imgList={item.messageAttaches}> </RemarkImgList>
                </div>
                <div className="remark_reply_wrap" style={{ backgroundColor: "#fff", marginTop: "0.45rem" }}>
                    <div className="remark_reply_item" style={{ paddingBottom: ".5rem", paddingTop: ".5rem" }}>
                        <div className="remark_content fs-normal">
                            <div onClick={() => {
                                this.navTo(route.route, item.jumpId, route.idName)
                            }}>
                                <span style={{ color: "#6176A0" }}>我的{billTypeName}：</span>
                                {item.quotedMessage}
                            </div>
                            <RemarkImgList imgList={item.quotedMessageAttaches}> </RemarkImgList>
                        </div>
                    </div>
                </div>
                <div className="reply_btn_wrap">
                    {/*回复:srcType*/}
                    <button className="replay_btn_cls" onClick={() => {
                        this.navTo("/disabuse/db_ask", item.srcId, { billId: item.srcId, billType: item.srcType, type: item.srcType, toReplyId: item.toReplyId ? item.toReplyId : "" })
                    }}>回复
                    </button>
                </div>
            </div>
        )
    }

    navTo(route, billId, propsName) {
        if (!route) return;
        let obj = {};
        if (propsName.billId) {
            obj = propsName
        } else {
            obj[propsName] = billId
        }
        this.props.navigation.navTo(route, obj)
    }
}