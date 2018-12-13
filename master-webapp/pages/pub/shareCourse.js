/**
* 分享 课程
*  <>-----}|------------------------------->
* 
*/

// imgs

import { query2Object } from "../../utils/func"
import api from "../../api/api";
import navable from "../../components/common/nav/navable";

import Paint from "../../static/images/share/paint@2x.png"
import { wxShare } from "../../utils/wx";
import CourseShareStore from "../../data/stores/courseShareStore";
import { observer } from "mobx-react";
import { toJS } from "mobx"


// 

@navable("/pub/shareCourse")
@observer
class ShareCourse extends React.PureComponent {
    static async getInitialProps(req) {
        if (req) {
            const props = query2Object(req.url)
            const store = new CourseShareStore(props.shareId);
            const rs = store.req(props.shareId)
            return {
                store: rs.result
            }
        }
        else {
            return {}
        }
    }
    constructor(props) {
        super()
        this.state = {
            show: 0
        }

        // 直接 server渲染
        if (props.navRootProps && props.navRootProps.store) {
            this.store = new CourseShareStore(props.shareId, props.navRootProps.store);
            this._refreshed = true;
        }
        else {
            this.store = new CourseShareStore(props.shareId);
        }



        this.store.done(() => {
            wxShare({
                title: this.store.title,
                desc: this.props.desc,
                path: "/pub/shareCourse?shareId=" + this.store.id + "&title=" + encodeURIComponent(this.store.title) + "&desc=" + encodeURIComponent(this.props.desc),
                imgUrl: this.store.avatar
            })
        })
    }
    componentDidMount() {
        requestAnimationFrame(() => {
            this.setState({
                show: 1
            })
        })

        wxShare({
            title: this.props.title,
            desc: this.props.desc,
            path: "/pub/shareCourse?shareId=" + this.props.shareId + "&title=" + encodeURIComponent(this.props.title) + "&desc=" + encodeURIComponent(this.props.desc),
            imgUrl: ""
        })

    }
    render() {
        return <div className="course-share imgBg disp-vertical">
            <img className="avator-normal" src={this.store.avatar}></img>
            <h3 className="title">{this.store.nick}邀请你一起上课</h3>
            <div className="paint disp-vertical-center animated bounceInDown">
                <img src={Paint}></img>
                <div className="full disp-center">
                    <p className="fs-line2 fs-bold theme-bold">{this.store.sectionTitle}</p>
                </div>
            </div>
            <div onClick={this.toCourse} className="course-share-btn disp-vertical-center">
                <div style={{
                    opacity: this.state.show
                }} className="btn-bg imgBg rotate animated infinite"></div>
                <div className="btn-text imgBg animated fadeIn"></div>
            </div>
            <p className="desc animated delay-1s bounceInUp">限量{this.store.quota}个名额，速速领取</p>
        </div>
    }

    toCourse = () => {
        // 抢
        this.store.draw().then(rs => {
            this.props.navigation.navTo("/course/one", {
                courseId: this.props.courseId,
                shareId: this.store.id,
                fromWay: "share"
            })
        })

    }
}

export default ShareCourse;

