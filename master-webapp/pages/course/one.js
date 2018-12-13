import CommHeaders from "../../components/common/headers";
import navable from "../../components/common/nav/navable";
import CollectAvators from "../../components/course/collects";
import Link from "../../components/common/link"
import UserStore from "../../data/stores/UserStore"
import OpenVip from "../../components/course/openvip";
import mixable from "../../utils/mixable";

import List from "../../components/common/list"
import RemarkList from "../../components/common/remarkList"
import * as services from "../../service/course/one"
import CourseItem from "../../components/course/courseItem";
import CourseIntr from "../../components/course/courseIntr";
import CourseShareTop from "../../components/course/courseShareTop";
import { wxShare } from "../../utils/wx";

import CourseStore from "../../data/stores/courseStore"
import { observer } from "mobx-react";
import VideoBuy from "../../components/course/videoBuy";
import sysStore from "../../data/stores/sysStore";
import VidoeAndMp3 from "../../components/common/video";
import { API_COURSE_MEDIA, API_COURSE_SHARE } from "../../common/api";
import CourseSeries from "../../components/course/courseSeries";
import ReplyGroup from "../../components/common/replyGroup";
import api from "../../api/api";

import videoBg from "../../static/images/course/video.png"
import WxIcon from "../../components/share/wxIcon";

import util from "../../utils/renderUtil"


/**
 * 单集课程
 *  <>-----}|------------------------------->
 *
 */

// 

const FromShare = "share"


@navable("/course/one")
@mixable(services)
@observer
class OneCourse extends React.Component {

    constructor(props) {
        super()
        this.state = {
            isAudio: false,
            studied: false,
            courseId: props.courseId
        }

        // 直接 server渲染
        if (props.navRootProps && props.navRootProps.store) {
            this.store = new CourseStore(props.courseId, props.shareId, null, props.navRootProps.store);
        }
        else {
            this.store = new CourseStore(props.courseId, props.shareId);
        }
    }

    componentDidMount() {
        this.store.done(() => {
            //  设置分享
            if (this.store.playAble) {
                api.request({
                    url: API_COURSE_SHARE,
                    params: {
                        sectionId: this.store.id
                    },
                    method: "post"
                }).then(rs => {
                    wxShare({
                        title: this.store.title,
                        desc: this.store.intro.substr(0, 50),
                        path: "/pub/shareCourse?courseId=" + this.store.id + "&shareId=" + rs.result,
                        imgUrl: this.store.banner
                    })
                })
            }
            else {
                wxShare({
                    title: this.store.title,
                    desc: this.store.intro.substr(0, 50),
                    path: "/course/one?courseId=" + this.store.id,
                    imgUrl: this.store.banner
                })
            }


        })
    }

    static navProps(props) {
        return {
            title: props.title || "美凯讲话"
        }
    }

    static defaultProps = {}

    onScroll = () => {
        this.header && this.header.checkScroll();
    }

    openVip = () => {
        this.props.navigation.navTo("/remarkTest/purchaseVip")
        // setTimeout(() => {
        //     UserStore.vip = true;
        // },3000)
    }

    getHeaderText = (item) => item.text

    render() {

        let st = {};
        if (!this.store.playAble) {
            st = { paddingBottom: "5rem" }
        }
        return <div className={"one-course group-course disp-vertical"} style={st} onScroll={this.onScroll}>
            {this.renderShare()}
            {this.renderVideo()}
            {this.renderCourseBuy()}
            {this.renderStudyed()}
            {this.renderShareWx()}
            {this.renderContent()}
            {this.renderBuyFooter()}
        </div>
    }

    renderContent() {
        // 分享 未关注  则不出现
        if (this.props.fromWay == FromShare && !UserStore.subscribe) {
            return null;
        }
        const headers = [{
            text: "内容概要",
            id: this.store.intro
        }, {
            text: "选集",
            id: this.store.sections
        },
        {
            text: "评价",
            badge: "(" + util.renderBigNum(this.store.commentTimes) + ")",
            id: this.store.replies
        }]
        return [
            this.renderOpenVip(),
            <CommHeaders
                key="header"
                style={{ borderBottomWidth: 0, flex: 1 }}
                ref={ref => this.header = ref}
                isVertical
                isCached={false}
                headers={headers}
                getText={this.getHeaderText}
                renderChild={this.renderHeaderItem} />
        ]
    }

    renderShare() {
        if (this.props.fromWay == FromShare) {
            return <CourseShareTop store={this.store.shareReward} />
        }
    }
    renderShareWx() {
        if (this.props.fromWay == FromShare) {
            return <WxIcon />
        }
    }

    getVideoQuery() {
        const key = "query" + this.store.id
        if (this[key]) {
            return this[key]
        }

        return this[key] = { sectionId: this.store.id }
    }

    renderVideo() {
        return <div className="media">
            <VidoeAndMp3 bg={this.store.playAble ? "" : videoBg} onProgress={this.onProgress} canPlay={this.store.playAble} poster={this.store.banner} api={API_COURSE_MEDIA} query={this.getVideoQuery()} />
        </div>
    }

    onProgress = (ts) => {
        this.store.uploadProgress(ts)

        // 第一次 上传 加入
        if (!this.state.studied) {
            // api.request({
            //     url: "",
            //     showLoading: false,
            //     params: {

            //     }
            // })
        }
    }

    renderCourseBuy() {
        return <VideoBuy openVip={this.openVip} buySection={this.buySection} store={this.store} />
    }

    renderOpenVip() {
        if (!UserStore.vip)
            return <OpenVip key="openvip" onClick={this.openVip} />
        return null;
    }

    replyCallBack = item => {
        const me = this;
        me.remarks.refs.list.getListData(0).then(rs => {
            this.store.commentTimes = rs.total;
        })
    }

    renderBuyFooter() {
        let content = null;
        let st = {}
        // console.log("sss", this.store)
        if (this.store.playAble) {
            st = { padding: 0 }
            content = <ReplyGroup
                title="有什么想说的呢"
                detail={{
                    id: this.store.id,
                    agree: this.store.agree,
                    // billType: "SECTION",
                    billType: "COURSE"
                }}
                replyCallBack={this.replyCallBack}
                navigation={this.props.navigation}
                nextTitle={"评论:" + this.store.title}
                shareMoney={this.store.sectionPrice * .25}
                lesson
                isDot={2}
                autoSave={true}
                enableDot={this.store.playAble}
            />;
        }
        else {
            content = [<Link key="buy" onClick={this.buyCourse(this.store)} className="button btn-size-normaler gold-border-btn">
                <span>购买系列课程</span>
                <span>￥{this.store.coursePrice}</span>
            </Link>,
            <Link key="vip" onClick={this.openVip} className="button btn-size-normaler gold-btn">
                <span>购买会员</span>
                <span>￥{sysStore.vipActualCost}</span>
            </Link>]
        }
        return <div style={st} className="pays-footer pays-btn">
            {content}
        </div>
    }

    replied = () => {

    }

    renderStudyed() {
        return <CollectAvators students={this.store.students} favorite={this.store.favorite} store={this.store} />
    }



    renderHeaderItem = (item, index) => {
        switch (index) {
            case 0:
                return this.renderIntr();
            case 1:
                return this.renderSeries();
        }
        return this.renderRemarkList();
    }

    renderIntr() {
        return <div className="course-page-item">
            <div className="group-course-title">内容简介</div>
            <CourseIntr store={this.store} />
        </div>
    }

    renderSeries() {
        return <div className="course-page-item">
            <div className="group-course-title">选集</div>
            <CourseSeries sections={this.store.sections} onItemClick={this.sectionClick} />
        </div>
    }

    sectionClick = (item) => {
        if (!item.video) {
            $.toast("等待更新哟")
            return;
        }
        this.store.id = item.id;

        // 滚动顶部
        $.scrollTop();
    }

    setRemarks = ref => {
        this.remarks = ref;
    }

    renderRemarkList() {
        return <div className="course-page-item">
            <div className="disp-hor-bet group-course-title">
                <div style={{ flex: 1 }}>评价</div>
                <span style={{ color: "#9B9B9B", fontWeight: "500", fontSize: "0.7rem" }}>全部</span>
            </div>
            <RemarkList ref={this.setRemarks} navigation={this.props.navigation} showHeader={false} showRole={true} autoSave={true} billType={"COURSE"} billId={this.store.id} style={{
                marginTop: "-0.75rem",
                width: "120%",
                marginLeft: "-10%",
                paddingLeft: ".75rem",
                paddingRight: ".75rem"
            }} />
        </div>
    }
}

export default OneCourse;

