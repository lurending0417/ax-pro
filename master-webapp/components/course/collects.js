/**
* 收藏 头像
*  <>-----}|------------------------------->
* 
*/
import Link from "../common/link"
import api from "../../api/api";
import { API_POST_FAV } from "../../common/api";
import CommonAvatar from "../common/commonAvatar";
import { favorite } from "../../service/course/one";
// 

class CollectAvators extends React.PureComponent {
    constructor() {
        super()

    }

    static defaultProps = {
        avatars: ["https://img.zcool.cn/community/01d65d563877d832f87512f672b15a.jpg@1280w_1l_2o_100sh.webp",
            "http://dpic.tiankong.com/bx/am/QJ6799330262.jpg?x-oss-process=style/670w",
            "https://cdn.duitang.com/uploads/item/201510/16/20151016090939_hN4Wm.jpeg"],
        num: 100,
        favorite: false,
        courseId: "asdf",
        collected: Math.random() > 0.5,
        hideBtn: false
    }
    render() {
        const { students = [], favorite, studentCount, id = "" } = this.props.store;
        if (!students.length) {
            // students = this.props.avatars;
        }
        // console.log(students.length)
        return <div style={this.props.style} className="course-fav disp-hor-start">
            {
                students.filter(Boolean).slice(0, 4).map((item, index) => {
                    return <CommonAvatar key={id + "-" + index} className="avator-small" src={item} />
                    // return <img key={id + "-" + index} className="avator-small" src={item}></img>
                })
            }
            <span className="fs-small" style={{ flex: 1, display: "block", marginLeft: "10px" }}>{studentCount ? `等${studentCount}人已学习` : ""}</span>
            {
                (0, () => {
                    if (!this.props.hideBtn) {
                        return <Link onClick={this.collect} className="button button-round btn-size gray-btn border-color">{favorite ? "已收藏" : "收藏"}</Link>
                    }
                })()
            }

        </div>
    }

    collect = () => {
        favorite(this.props.store)
        // api.request({
        //     url: API_POST_FAV,
        //     params: {
        //         // billType: "SECTION",
        //         billId: this.props.store.id,
        //         billType: "COURSE"
        //         // billId: this.props.store.courseId
        //     },
        //     method: this.props.store.favorite ? "delete" : "post"
        // }).then(() => {
        //     // $.toast(this.props.store.favorite ? "收藏成功" : "取消成功")
        //     this.props.store.favorite = !this.props.store.favorite;
        // })
    }
}

export default CollectAvators;
