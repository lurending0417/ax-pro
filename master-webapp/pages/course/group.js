import CommHeaders from "../../components/common/headers";
import navable from "../../components/common/nav/navable";
import img from "../../static/images/test-img.png"
import MaterIntr from "../../components/master/main";
import RemarkList from "../../components/common/remarkList";
import RemarkImgList from "../../components/common/remarkImgList";
import dateUtil from "../../utils/dateUtil";
import Avatar from "../../components/common/avactar"
import CommentGroup from "../../pages/common/commentGroup"
import api from "../../api/api";
import { API_COURSE_SERIES_DETAIL } from "../../common/api";
import HomeCourse from "../../components/home/course";
import CourseGroupStore from "../../data/stores/courseGroupStore";
import UserStore from "../../data/stores/UserStore";
import OpenVip from "../../components/course/openvip";

import * as services from "../../service/course/one"
import mixable from "../../utils/mixable";
import CourseSeries from "../../components/course/courseSeries";
import { observer } from "mobx-react";
import GroupFooter from "../../components/course/groupFooter";
import { wxShare } from "../../utils/wx";
import util from "../../utils/renderUtil"
import { query2Object } from "../../utils/func";

/**
 * 系列课程列表
 */

@navable("/course/group")
@mixable(services)
@observer
class GroupCourse extends React.PureComponent {
    constructor(props) {
        super()

        this.store = new CourseGroupStore(props.courseId)

        this.state = {
            sections: [],
            courseId: props.courseId
        }

        this.store.done(() => {
            wxShare({
                title: this.store.title,
                desc: this.store.intro,
                path: "/course/group?courseId=" + this.store.id,
                imgUrl: this.store.banner
            })
        })


    }

    static async getInitialProps(req) {
        // if (req) {
        //     const props = query2Object(req.url)
        //     const store = new CourseGroupStore(props.courseId);
        //     const rs = store.req(props.courseId)
        //     return {
        //         store: rs.result
        //     }
        // }
        // else {
        //     return {}
        // }
        return {};
    }

    static navProps(props) {
        return {
            title: props.title || "课程列表"
        }
    }

    componentDidMount() {
        if (this.state.courseId) {
            // this.getCourse(this.state.courseId);
        }



        this.store.refreshComments = () => {
            const rms = this.remarksList;
            rms.refresh().then(rs => {
                this.store.commentTimes = rs.total
            });
        }
    }

    getCourse = (courseId) => {
        api.request({
            url: API_COURSE_SERIES_DETAIL,
            params: {
                courseId: courseId
            }
        }).then(rs => {
            this.setState({
                sections: rs.result.sections
            })
        })
    }

    render() {
        const store = this.store;
        const headers = [{
            text: "课程介绍",
            id: this.store.intro
        }, {
            text: "课程表",
            id: this.store.sections
        },
        {
            text: "评价",
            badge: "(" + util.renderBigNum(this.store.commentTimes) + ")",
            id: this.store.replies
        }]

        const banner = store.banner || store.sections.reduce((last, now) => last || now.banner, "")

        return <div onScroll={this.onScroll} className="group-course one-course home-course-box disp-vertical">
            <HomeCourse padding={0} rounded={false} src={banner} />
            {this.renderCourseBuy()}
            {this.renderStudyed()}
            <CommHeaders ref={ref => this.header = ref} isVertical
                isCached={false}
                headers={headers}
                getText={this.getText}
                renderChild={this.renderHeaderItem}
            />
            <GroupFooter navigation={this.props.navigation} store={this.store} favortie={this.store.favorite} agree={this.store.agree} commentTimes={this.store.commentTimes} shareMoney={this.store.shareMoney} />
        </div>
    }

    getText = item => item.text

    onScroll = () => {
        this.header.checkScroll();
    }

    renderCourseBuy() {
        if (!UserStore.vip) {
            return <OpenVip onClick={this.openVip} />
        }
        return null;
    }

    openVip = () => {
        this.props.navigation.navTo("/remarkTest/purchaseVip")
        // setTimeout(() => {
        //     UserStore.vip = true;
        // },3000)
    }

    renderStudyed() {

    }

    renderHeaderItem = (item, index) => {
        switch (index) {
            case 0:
                return this.renderIntr();
            case 1:
                return this.renderCourseList();
            case 2:
                // return null;
                return this.renderRemarkList();
        }
    }

    renderIntr() {
        return <div className="group-course-intr">
            <div style={{ marginTop: ".75rem" }} className="group-course-title">{this.store.title}</div>
            <div className="intro-info">
                {this.store.intro}
            </div>
            <div className="group-course-title">主讲介绍</div>
            <MaterIntr bodyTxtStyle={{ display: "block" }} className={"whiteBg"} style={{ padding: 0 }} navigation={this.props.navigation} concern_able={{ isGray: true }} user={this.store.master} detail={this.store.master} />
            {/*<MaterIntr style={{ padding: 0 }} onClick={() => {
                this.props.navigation.navTo("/meet/detail", { data: item })
            }} navigation={this.props.navigation} concern_able user={item} detail={item}/>*/}
            <div className="theme-space" style={{ width: "150%", marginLeft: "-0.75rem" }}></div>
        </div>
    }

    toOne = item => {
        this.props.navigation.navTo("/course/one", {
            courseId: item.id,
            title: item.title
        })
    }

    renderCourseList() {
        return <div>
            <div className="group-course-title">课程表</div>
            <CourseSeries sections={this.store.sections} onItemClick={this.toOne} />
            <div className="theme-space" style={{ width: "150%", marginLeft: "-0.75rem" }}></div>
        </div>
    }

    setRemarks = ref => this.remarksList = ref

    renderRemarkList() {
        return <div>
            <div className="group-course-title">
                <div style={{ flex: 1 }}>评价</div>
                <div style={{ color: "#9B9B9B", fontWeight: "500", fontSize: "0.7rem" }}>全部</div>
            </div>

            <RemarkList showRole={true} autoSave={true} showHeader={false} navigation={this.props.navigation} ref={this.setRemarks} billType={"COURSE"} billId={this.store.id} style={{
                marginTop: "-.75rem",
                width: "150%",
                marginLeft: "-25%",
                padding: "0px 20%"
            }} />
            {/* {
                this.store.comments.map((remarkItem, index) => {
                    return this.renderRemarkItem(remarkItem, index)
                })
            } */}
        </div>
    }

    renderRemarkItem(remarkItem, index) {
        const user = remarkItem.user || {};
        const replies = remarkItem.replies || [];
        const repliesLen = replies.length || remarkItem.comments;
        return (
            <div className="remark_list_wrap" key={remarkItem.user.nick + index} style={{ margin: "0.75rem 0" }}>
                <div className="remark_header_wrap">
                    <Avatar user={user}></Avatar>
                    <div className="space"></div>
                    <div
                        className="time fs-small">{dateUtil.formatTimeToText(remarkItem.createTime)}</div>
                </div>
                <div className="remark_content fs-normal">
                    <div>
                        {remarkItem.content}
                    </div>
                    <RemarkImgList imgList={remarkItem.attaches}> </RemarkImgList>
                </div>
                <div className="remark_footer_wrap">
                    <div className="space"></div>
                    <div className="star_group">
                        <CommentGroup dots={remarkItem.agreeTimes} chats={repliesLen.length}
                            dotEnable={remarkItem.agreeAble}>
                        </CommentGroup>
                    </div>
                    <span className="expand_text fs-small"
                        onClick={() => this.viewComment()}>{this.state.isShowComment ? "收起" : "展开"}</span>
                </div>
                {
                    this.state.isShowComment &&
                    repliesLen.map((replyItem, index) => {
                        const user = replyItem.user || {};
                        let replyUserName = user.nick;
                        if (replyItem.toUser.nick) { // 回复给其他回复的人
                            replyUserName += `回复 ${replyItem.toUser.nick}`
                        }
                        return (
                            <div className="remark_reply_wrap"
                                key={user.nick + index}>
                                <div className="remark_reply_item">
                                    <div className="remark_header_wrap reply_avatar_wrap">
                                        <Avatar imgSrc={user.avatar}
                                            userName={replyUserName}> </Avatar>
                                        <div className="space"></div>
                                        <div
                                            className="time fs-small">{dateUtil.formatTimeToText(replyItem.createTime)}</div>
                                    </div>
                                    <div className="remark_content fs-normal">
                                        <div>
                                            {replyItem.content}
                                        </div>
                                        <RemarkImgList
                                            imgList={replyItem.attaches}> </RemarkImgList>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    viewComment() {
        const isShowComment = !this.state.isShowComment;
        this.setState({ isShowComment })
    }

}

export default GroupCourse;

