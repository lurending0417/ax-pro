/**
* 签到日历
*  <>-----}|------------------------------->
* 
*/

import CommHeaders from "../common/headers"
import Calender from "./calender"
import { SignedCalenderStore } from "../../data/stores/calender"
import bgSrc from "../../static/images/signed/bg.png"
import CommonAvatar from "../common/commonAvatar"
import { observer } from "mobx-react";
import LinkBtn from "../../components/common/link"
import CloseModal from "./unsignModal"
import attendanceStore from "../../data/stores/attendanceStore";
import AnimateDiv from "../common/animtedDiv";
// 

@observer
class SignedCalender extends React.Component {
    constructor() {
        super()

        this.now = new Date();
        this.calStore = new SignedCalenderStore();

        this.state = {
            height: "24.15rem"
        }

    }

    componentDidMount() {
        attendanceStore.refresh().then(() => {
            this.calStore.isSigned = attendanceStore.isSigned
            this.calStore.toLottery = this.calStore.isSigned && 1;
        });

        // 计算高度

        requestAnimationFrame(() => {
            const rect = this.refs.container.getBoundingClientRect();
            const screenH = document.body.clientHeight;
            const h = rect.top + rect.height
            if (h < screenH) {
                // 如果太高 
                if (screenH > 756) {
                    // return this.setState({
                    //     pos: "bottom",
                    //     height: "21rem"
                    // })
                }
                this.setState({
                    height: screenH - rect.top
                })
            }
        })

    }

    renderBg() {
        const willRotate = this.calStore.toLottery || (this.calStore.isSigned && this.calStore.isVisited)
        return <div className="signed-calender-bg" style={willRotate ? { transform: "rotate(90deg)" } : {}}>
            <img src={bgSrc}></img>
        </div>
    }
    renderHeader() {
        return <CommHeaders data={this.calStore.data} isCached={false} index={1} renderChild={this.renderChild} headers={["活动规则", "累计签到", "助力朋友"]} />
    }

    renderChild = (item, index) => {
        switch (index) {
            case 0: return this.renderRule();
            case 1: return this.renderCal();
            case 2: return this.renderFrends()
        }
    }
    renderRule() {
        const rules = [
            "喔喔奖学金：连续观看课程99天（每日观看2分钟），即可获得299元奖学金",
            "朋友助力：每邀请1名朋友关注喔喔百家，并观看2分钟课程，即可减少1天。最多可减少29天",
            "补课：当忘记观看时，可通过补课，完成连续观看任务",
            "抽奖：每日完成观看课程2分钟，当日即可进行一次免费抽奖",
            "助力达人榜：每日系统会对当天好友助力前100名的达人，奖励299元"
        ]
        return <div className="signed-calender-rules">
            {
                rules.map((item, index) => {
                    return <p key={"rule" + index}>{`${index + 1}、${item}。`}</p>
                })
            }
        </div>
    }

    renderFrends() {
        const frends = {
            total: 15,
            items: [
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7",
                "https://f1.9999ax.com/user/avatar/201810/def2339f401d472b93c7c29e2bfcb2b7"
            ]
        };

        const width = "2.2rem";
        if (process.browser && document && document.body) {
            // const w = document.body.clientWidth;
            // width = (w - 30) * .2
        }


        return <div style={{ overflowY: "auto" }} className="signed-calender-frends">
            <h3>{attendanceStore.helpCount ? `已有${attendanceStore.helpCount}位朋友助力` : "暂无朋友助力，快去邀请吧！"}</h3>
            <div className="signed-calender-frends-imgs">
                {
                    attendanceStore.helpers.map((item, i) => {
                        return <div className="disp-center" style={{
                            width: "20%",
                            padding: ".15rem",
                            marginBottom: ".5rem"
                        }} key={"img" + i}>
                            <CommonAvatar className="test-avatar-0" style={{ width: width, height: width }} src={item} />
                        </div>
                    })
                }
            </div>

        </div>
    }
    renderCal() {
        return <Calender renderTd={this.renderTd} store={this.calStore} />
    }

    rotateLottery = () => {
        // console.log("toRotate")
        // if (attendanceStore.isSigned) {
        //     return this.props.navigation.navTo("/lottery/lottery")
        // }

        // this.calStore.toLottery = 1;
    }

    toLottery = () => {
        // $.toast("toLottery")
        if (!attendanceStore.isSigned) {
            // return;
            return $.toast("需要签到哟~")
        }
        this.props.navigation.navTo("/lottery/lottery")
    }

    toUnSucc = (item) => {
        return () => {
            var me = this;
            me.calStore.missIndex = item.d - 1;
            me.modal.show()
        }
    }

    toSucc = (item) => {

    }

    toSign = () => {
        this.props.navigation.navTo("/course/list")
    }
    renderTd = (item, rowIndex) => {
        if (rowIndex) {
            let badge = null;
            if (item.t < this.now) {
                if (item.isSigned) {
                    badge = <span className="calender-ok imgBg" />
                }
                else {
                    badge = item.isSigned !== 0 ? null : [<span key="badge" className="calender-miss imgBg" />, item.isSigned === 0 ? <span key="badge2" onClick={this.toUnSucc(item)} className="badge">去补课</span> : null]
                }
            }

            return <span>
                {item.d}
                {badge && <div className="full disp-center">{badge}</div>}
            </span>
        }
        return <span>{item}</span>
    }

    genClose = ref => this.modal = ref
    render() {
        let style = { height: this.state.height };
        if (this.state.pos == "bottom") {
            style = {
                position: "absolute",
                bottom: 0,
                left: 0
            }
        }
        return <div style={style} ref="container" className="signed-calender">
            {this.renderBg()}
            {!this.calStore.toLottery && <LinkBtn onClick={this.rotateLottery} className={"signed-tip fadeOut "}>观看课程2分钟即为签到，并可抽奖~</LinkBtn>}
            <LinkBtn className="signed-hide-btn signed-left" onClick={this.toSign}></LinkBtn>
            <LinkBtn className="signed-hide-btn signed-right" onClick={this.toLottery}></LinkBtn>
            <div className="signed-calender-body">
                {this.renderHeader()}
            </div>
            <CloseModal missIndex={this.calStore.missIndex} store={this.calStore} ref={this.genClose} />

        </div>
    }
}

export default SignedCalender;