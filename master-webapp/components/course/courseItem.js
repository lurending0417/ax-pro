import navStore from "../common/nav/navStore";
import CourseStore from "../../data/stores/courseStore";
import utils from "../../utils/renderUtil"

/**
* 选课 列表
*  <>-----}|------------------------------->
* 
*/

// 

class CourseItem extends React.PureComponent {
    constructor() {
        super()
    }
    render() {
        const { data, index } = this.props;
        const { label, cla, tag } = utils.renderCourseState(data);
        return <div onClick={this.click} className={"course-item-box course-item-bottom-border"}>
            <div className="item-title">
                <label className="fs-bold theme-bold">{index + 1}</label>
                <span className={cla ? "icon " + cla : ""}>{label}</span>
                <span className="pull-right fs-gray">{tag}</span>
            </div>
            <div className="course-info disp-hor-start" style={{ paddingLeft: 0 }}>
                <div style={{ position: "relative", overflow: "hidden" }} className="course-img">
                    <img className="full" src={data.thumb} />
                    <span style={{ fontSize: ".6rem", bottom: ".25rem", right: ".25rem" }} className="home-course-time btn-cycle">{utils.renderTimeSeconds(data.duration * 1000, false)}</span>
                </div>
                <div className="course-item-right">
                    <div className="course-item-top fs-line2">{data.title}</div>
                    <div className="course-item-bottom fs-line2">简介：{data.intro}</div>
                </div>
            </div>
        </div>
    }

    click = () => {
        // 如果是课成列表 跳到 但杰克
        // 如果单节  刷新
        if (this.props.onClick) {
            return this.props.onClick(this.props.data, this.props.index);
        }
        if (navStore.currentRoute == "/course/one") {
            CourseStore.courseId = "12312";
            CourseStore.refresh();
        }
        else {
            navStore.navTo("/course/one", {
                courseId: "123123"
            })
        }
    }


}

export default CourseItem;