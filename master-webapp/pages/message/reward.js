import { observer } from "mobx-react"
import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import MessageStore from "../../data/stores/message"
import List from "../../components/common/list"

import { API_MESSAGE_DETAIL_GET } from "../../common/api"
import dateUtil from "../../utils/dateUtil";


@navable("/message/reward")
@observer
export default class RewardMsg extends React.Component {
    static getInitialProps({ req }) {
        UserStore.recovery(req && req.headers && req.headers.cookie)
        return { a: 0 }
    }

    static navProps() {
        return {
            title: "悬赏消息"
        }
    }

    constructor(props) {
        super();
        this.state = {
            a: props.a,
            msgWantedList: [{
                winner: {
                    nick: "一叶知秋"
                },
                content: "太极宗师有哪些？书画大师有哪些？太极宗师有哪些？书画大师有哪些？",
                reward: "49.99"
            }, {
                winner: {
                    nick: "一叶知秋"
                },
                content: "太极宗师有哪些？书画大师有哪些？太极宗师有哪些？书画大师有哪些？",
                reward: "49.99"
            }, {
                winner: {
                    nick: "一叶知秋"
                },
                content: "太极宗师有哪些？书画大师有哪些？太极宗师有哪些？书画大师有哪些？",
                reward: "49.99"
            }]
        }
        // MessageStore.getMessageByType({
        // 	type: "WANTED",
        // 	start: 0,
        // 	limit: 10
        // })
    }

    renderEmpty() {
        return (
            <div className="fs-normal" style={{ textAlign: "center" }}> 暂无悬赏消息 </div>
        )
    }

    getQuery() {
        return {
            type: "WANTED"
        }
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
                    emptyDesc='暂无悬赏消息'
                // renderEmpty={this.renderEmpty.bind(this)}
                // rowsName="msgWantedList"\
                    getKey={(item) => item.creatTime + index++}
                />
            </div>
        )
    }

    renderItem(item, index, empty) {
        if (empty) return null;
        const createTime = dateUtil.formatTimeToText(item.createTime);
        const extra = item.extra || {};
        return (
            <div
              className="border-round reward-content-wrap" key={"msgWantedList" + index} onClick={() => {
                this.navTo(item.jumpId)
            }}>
                <div className="reward-title-wrap">
                    <span className="reward-msg-icon"> </span>
                    <span className="reward-title fs-normal">揭榜</span>
                    <span className="reward-time fs-normal">奖金￥{extra.bounty}</span>
                </div>
                <div className="fs-small grey-sm-cls">
                    您回答的悬赏已揭榜，{extra.winnerName}&nbsp;&nbsp;获得了悬赏奖金
                </div>
                <div className="fs-max reward-content">
                    问题：<br />
                    {item.quotedMessage}
                </div>
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
        )
    }

    navTo(wantedId) {
        this.props.navigation.navTo("/reward/rewardDetail", { wantedId })
    }
}