import CategoryHeaders from "../../components/master/headers";
import List from "../../components/common/list";
import { API_COURSE_LIST } from "../../common/api";
import CourseListItem from "../../components/course/courseListItem";
import navable from "../../components/common/nav/navable";
import { observer } from "mobx-react";

/**
* 我的课程
*  <>-----}|------------------------------->
* 
*/

// 

@navable("/course/list")
class CourseList extends React.PureComponent {
    static navProps() {
        return {
            title: "我的课程"
        }
    }
    constructor() {
        super()
    }
    render() {

        return <div className="no-scroll list-without-bottom">
            <CategoryHeaders onChange={this.headerChange} />
            <List
                ref="list"
                className="list-split list-split-border"
                renderItem={this.renderItem}
                api={API_COURSE_LIST}
                getQuery={this.getQuery}
                emptyDesc={"暂无学习课程"}
            />
        </div>
    }


    getQuery = () => {
        return {
            studied: true,
            categoryId: this.type || null,
            enabled: true
        }
    }

    headerChange = (index, item) => {
        this.type = item.id;

        this.refs["list"].getListData(0);
    }

    renderItem = (item, index, empty) => {
        if (empty) return null;
        return <CourseListItem data={item} navigation={this.props.navigation} />
    }
}

export default CourseList;

