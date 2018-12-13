import HomeCourse from "../home/course";
import CollectAvators from "./collects";
import utils from "../../utils/renderUtil"
import LinkBtn from "../common/link";
// 

class CourseListItem extends React.PureComponent {
    constructor() {
        super()
    }
    render() {
        const { data } = this.props
        const priceLabel = (data.count ? data.count + "讲/" : "") + (data.targetType == "COURSE" && data.coursePrice ? "￥" + data.coursePrice : (data.targetType == "SECTION" && data.sectionPrice ? "￥" + data.coursePrice : "免费"));

        return <div className="course-list-item disp-vertical home-course-box" style={this.props.style}>
            <HomeCourse time={data.duration ? utils.renderTimeSeconds(data.duration * 1000, false).replace("分钟", "：").replace(/秒/, "") : ""} onClick={this.toOne} tag={!data.coursePrice ? "FREE" : data.discountType} src={data.banner} />
            <div style={{ alignItems: "flex-start", lineHeight: "1.6rem" }} className="disp-hor-bet mt">
                <span className="fs-big fs-line2 fs-bold theme-bold" style={{ marginRight: ".75rem" }}>{data.title + ""}</span>
                <LinkBtn className="button btn-size-normal gray-btn button-round no-border" style={{ width: "4rem", minWidth: "4rem" }}>
                    <span className="fs-gold theme-bold">{priceLabel}</span>
                </LinkBtn>
            </div>
            <p className="fs-small fs-bold fs-line2 mt">{data.intro}</p>
            <CollectAvators style={{ paddingLeft: "0" }} className="mt" hideBtn store={data} />
        </div>
    }

    toOne = () => {
        const { data, navigation } = this.props;
        if (!data.enabled) {
            return $.toast("该课程已下架")
        }
        if (data.targetType == "COURSE")
            navigation.navTo("/course/group", {
                courseId: data.id,
                title: data.title,
                detail: data
            })
        else {
            navigation.navTo("/course/one", {
                courseId: data.id,
                title: data.title,
                detail: data
            })
        }
    }
}

export default CourseListItem;