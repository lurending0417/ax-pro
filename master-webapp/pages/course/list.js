import CategoryHeaders from "../../components/master/headers";
import List from "../../components/common/list";
import { API_COURSE_LIST } from "../../common/api";
import CourseListItem from "../../components/course/courseListItem";
import navable from "../../components/common/nav/navable";
import { observer } from "mobx-react";

/**
* 课程列表
*  <>-----}|------------------------------->
* 
*/

// 

@navable("/course/list")
class CourseList extends React.PureComponent {
    static navProps() {
        return {
            title: "课程列表"
        }
    }
    constructor() {
        super()
    }
    getMasterQuery = () => {
      return {
        masterId: this.props.a.masterId,
      }
    }
    renderHeader = () => {
      return <Atten_Plan hasTitle navigation={this.props.navigation}/>
    }
    render() {
        if (this.props.a) {
          return <div className="no-scroll">
            <List
              ref="list"
              className="list-split list-split-border"
              renderItem={this.renderItem}
              api={API_COURSE_LIST}
              getQuery={this.getMasterQuery}
            />
          </div>
        }
        return <div className="no-scroll">
          <CategoryHeaders onChange={this.headerChange} />
          <List
            ref="list"
            className="list-split list-split-border"
            renderItem={this.renderItem}
            api={API_COURSE_LIST}
            getQuery={this.getQuery}
          />
        </div>
    }


    getQuery = () => {
        return {
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
        return <CourseListItem data={item} navigation={this.props.navigation}/>
    }
}

export default CourseList;

