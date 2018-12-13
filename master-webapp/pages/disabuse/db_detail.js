import navable from "../../components/common/nav/navable"
import DB_PayGroup from "../../components/disabuse/db_payGroup";
import DB_QUESTIONGROUP from "../../components/disabuse/db_questionGroup";
import { observer } from "mobx-react";
import RemarkList from "../../components/common/remarkList";
import Store from "../../data/stores";
import { wxPay } from "../../utils/wx";
import QuestionComment from "../../components/master/questionComment";
import ReplyGroup from "../../components/common/replyGroup";
import Message from "../../data/stores/message";
import Modal from "../../components/common/modal";
import { fire, on } from "../../utils/notify";
import starCom from "../../components/common/starCom"
import mixable from "../../utils/mixable"
import IdBaseComp from "../../components/common/idComponent";
import RemarkRefresh from "../../components/common/remarkRefresh";


const CollectionStore = Store.CollectionStore;
const QuestionStore = Store.QuestionStore;


@observer
@navable("/disabuse/db_detail")
@mixable(RemarkRefresh, IdBaseComp)
export default class DB_Detail extends React.PureComponent {

    static navProps(props) {
        return {
            title: "解惑详情",
            leftBtn: () => {
                return <div className="button button-link button-nav pull-left back"
                    onClick={() => {
                        fire("NAV_BACK");
                    }}>
                    <i className="icon icon-back"></i>
                </div>
            }
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            giftValue: [1, 2, 3, 4, 5, 6],
            chooseIndex: 0,
            hideInifte: false
        }
    }

    componentDidMount() {
        const questionId = this.props.questionId || this.props.a.questionId;
        // console.log("questionId", questionId)
        QuestionStore.getQuestionDetial({
            questionId: questionId
        });
        on("NAV_BACK", () => {

            var detail = QuestionStore.questionDetial;
            // console.log("sss", this.state.canback);
            if (detail && detail.toEvaluate) {
                this.openStarModal();
            } else {
                this.props.navigation.backTo();
            }

        })
    }

    // 更多评论
    async getMore() {
        const detail = QuestionStore.questionDetial;
        if (detail.comments.length < detail.commentTimes) {
            return QuestionStore.getMoreComments({
                start: detail.comments.length,
                billType: "QUESTION",
                billId: detail.id
            }).then(rs => {
                return rs
            }).catch(reject => {
                $.toast("请求网络失败");
                return Promise.reject(reject)
            })
        } else {
            if (this.state.hideInifte) {
                return;
            }
            $.toast("没有更多评论了");
            this.setState({
                hideInifte: true
            });
            return new Promise((s) => { setTimeout(s, 3000) });
        }
    }

    // 评分
    openStarModal() {
        var detail = QuestionStore.questionDetial;
        starCom("QUESTION", detail.id);
    }
    navigateTo(path, a) {
        this.props.navigation.navTo(path, { ...a });
    }

    // 收藏 取消收藏
    doCollection() {
        var detail = QuestionStore.questionDetial;
        if (detail.favorite) {
            CollectionStore.delCollection({
                billType: "QUESTION",
                billId: detail.id
            }, () => {
                detail.favorite = false;
            })
        } else {
            CollectionStore.doCollection({
                billType: "QUESTION",
                billId: detail.id
            }, () => {
                detail.favorite = true;
            })
        }
    }

    // 点赞
    toDot = () => {
        const detail = QuestionStore.questionDetial;
        var params = {
            billType: "QUESTION",
            billId: detail.id
        }
        Message.postAgree({
            params,
            callback: () => {
                $.toast("点赞成功");
                QuestionStore.questionDot();
            }
        });
    }
    // 偷听
    toListen = (itemId, cost) => {
        QuestionStore.goListen({
            questionId: itemId,
            amount: cost,
            gateway: "WEIXIN_MP"
        }, (rs) => {
            wxPay(rs, () => {
                $.toast("支付成功");
                this.doRefresh();
            })
        })
    }
    // 大师回答
    toAnser = (item) => {
        this.navigateTo("/disabuse/db_ask", { billId: item.id, type: "MASTER" });
    }

    // 大师赠送解惑次数
    toGiveAskTime = (detail) => {
        this.modal.show();
    }


    // 向大师提问
    toAsk = (deteil) => {
        this.navigateTo("/disabuse/db_ask", {
            type: "DB_ASK",
            amount: deteil.master.questionCost,
            billId: deteil.master.id
        })
    }

    // 向大师追问
    toAskAgain = (detail) => {
        this.navigateTo("/disabuse/db_ask", { type: "DB_ASK_AGAIN", billId: detail.id })
    }

    // 评论
    doReply() {
        // const detail = QuestionStore.questionDetial;
        // this.navigateTo("/disabuse/db_ask", { type: "QUESTION_COMMENT", billId: detail.id });
    }

    doRefresh = (rs) => {
        if (rs) {
            // 值刷新对应的item
            return;
        }
        const questionId = this.props.a.questionId;
        QuestionStore.getQuestionDetial({
            questionId: questionId
        });
    }

    //
    toGive = (index) => {
        this.modal.hide();
        const questionId = this.props.a.questionId;
        QuestionStore.giveQuestionTimes({
            questionId: questionId,
            amount: this.state.giftValue[this.state.chooseIndex]
        }, () => {
            $.toast("赠送成功");
        })
    }
    //selectPrice
    selectPrice = (index) => {
        this.setState({
            chooseIndex: index
        })
    }
    renderModal = () => {
        return <Modal
            ref={modal => this.modal = modal}
            animateHide="none" animateShow="none"
            pos="center"
        >
            <div className="ds_reward_bottom" style={{ backgroundColor: "white", bottom: "0rem" }}>
                <span className="gift_title fs-normal">
                    {"选择赠送次数:"}
                    {this.state.cost > 0 ? <span className="fs-gold">{this.state.cost}</span> : null}
                </span>
                <ul>
                    {
                        this.state.giftValue.map((item, index) => {
                            return (
                                <li key={index + "giftItem"}
                                    className={["fs-normal", this.state.chooseIndex === index ? "choose_gift_item" : ""].join(" ")}
                                    onClick={() => this.selectPrice(index)}
                                >
                                    {`${item}次`}
                                </li>
                            )
                        })
                    }
                </ul>
                <div className="sure_btn_wrap">
                    <button className="sure_btn_cls" onClick={this.toGive}>确认赠送</button>
                </div>
            </div>
        </Modal>
    }
    render() {
        var detail = QuestionStore.questionDetial;
        if (Object.keys(detail).length === 0) return null;
        // console.log("dddd", detail);
        return (
            <div className="dd_container" style={{ overflowY: "hidden" }}>
                <div className="infinite-scroll" style={{ flex: "1", overflowY: "auto" }} id={this.getId()}>
                    <div className={"dd_content page-content"}>
                        <DB_QUESTIONGROUP
                            user={detail.user}
                            detail={detail}
                            isPeed={!detail.toListen}
                            favorite={detail.favorite}
                            collectionBack={() => this.doCollection()}
                            navigation={this.props.navigation}
                        />
                        {(() => {
                            if (!detail.replies) return null;
                            return detail.replies.map((item, index) => {
                                return <QuestionComment detail={item} key={`ques-${index}`} />
                            })
                        })()}
                        <DB_PayGroup
                            detail={detail}
                            listenBack={() => this.toListen(detail.id, detail.listenCost)}
                            askCallBack={() => this.toAsk(detail)}
                            anserBack={() => this.toAnser(detail)}
                            giveBack={() => this.toGiveAskTime(detail)}
                            askAgainCallBack={() => this.toAskAgain(detail)}
                        />
                        <RemarkList
                            showHeader={true}
                            style={{ width: "100%" }}
                            contents={detail ? detail.comments : null}
                            billType={"COMMENT_REPLY"}
                            navigation={this.props.navigation}
                            callback={this.doRefresh}
                            className={"list-container"}
                            canAgree={true}
                            showRole
                        />



                    </div>
                    {(() => {
                        if (detail.commentTimes > 10) {
                            return <div className="infinite-scroll-preloader" style={this.state.hideInifte ? { display: "none" } : {}}>
                                <div className="preloader"></div>
                            </div>
                        }
                        return null;
                    })()}
                </div>

                {
                    (() => {
                        if (detail && detail.listenCost === 0) {
                            var title;
                            title = detail.comments.length > 0 ? `${detail.comments.length}评论` : "暂无评论";
                            return <ReplyGroup
                                title={title}
                                detail={detail}
                                navigation={this.props.navigation}
                                replyCallBack={() => this.doReply()}
                                isDot={true}
                            />
                        }
                        return null;
                    })()
                }
                {this.renderModal()}
            </div >
        );
    }
}