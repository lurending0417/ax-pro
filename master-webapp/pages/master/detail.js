/**
* 大师详情
*  <>-----}|------------------------------->
* 
*/
import { observer } from "mobx-react"
import MasterIntroduce from "../../components/master/main_body_round"
import CommHeaders from "../../components/common/headers";
import Link from "../../components/common/link"
import navable from "../../components/common/nav/navable"
import GiftCom from "../../components/common/giftCom";
import AwardBtn from "../../components/gold/awardBtn";
import { API_COURSE_LIST, API_DB_QUESTION } from "../../common/api";
import List from "../../components/common/list";
import DB_QuestionItem from "../../components/disabuse/db_questionItem";
import CourseListItem from "../../components/course/courseListItem";

import MasterStore from "../../data/stores/masterDetail"
import CourseSeries from "../../components/course/courseSeries";
import DB_MasterItem from "../../components/master/db_masterItem";
// const MasterStore = { masterInfo: {}, recovery: () => ({}) };
import ListEmpty from "../../components/common/empty";
import LinkBtn from "../../components/common/link";

@observer
@navable("/master/detail")
class MasterDetail extends React.PureComponent {

  constructor(props) {
    super(props);
    // console.log("props --->", props);
    if (Object.keys(props) !== 0) {
      this.store = new MasterStore(props || {});
      this.store.recovery(props.data);
    }
    else {
      if (process.browser)
        this.store = new MasterStore(location.search)
    }
    this.state = {
      status: 0
    }
  }

  componentDidMount() {
    this.store.refresh();
  }

  static navProps() {
    return {
      title: "大师详情"
    }
  }
  getQuery = () => {
    const info = MasterStore.masterInfo;
    return {
      masterId: info.id
    }
  }

  navigateTo(path, a) {
    this.props.navigation.navTo(path, { a });
  }
  // 文采
  renderDesc = () => {
    if (this.store.desc.length === 0) return this.renderEmpty();
    var html = { __html: this.store.desc };
    return <div className="master_detail_desc" dangerouslySetInnerHTML={html}></div>;
  }

  // 解惑
  renderQuestion = () => {
    const ansers = this.store.answers;
    // console.log("anser", ansers)
    if (ansers.length === 0) return this.renderEmpty();
    var anserscps = ansers.map((item, index) => {
      return <DB_QuestionItem
        detail={item}
        key={`q-${index}`}
        callBack={() => this.navigateTo("/disabuse/db_detail", { questionId: item.id })}
        style={{ padding: "0.5rem", marginBottom: "0.5rem" }}
        navigation={this.props.navigation}
      />
    });
    if (ansers.length > 5) anserscps.push(
      <div
        style={{
          width: "100%",
          height: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
          color: "#6176A0",
          fontWeight: "500"
        }}
        onClick={() => this.navigateTo("/disabuse/db_main", { masterId: this.store.masterInfo.id })}
      >
        查看更多
      </div>
    )
    return anserscps;
  }

  // 课程
  renderCourse = () => {
    const courses = this.store.courses;
    if (courses.length === 0) return this.renderEmpty();
    // console.log("courses", courses);
    var coursescps = courses.map((item, index) => {
      return <CourseListItem
        data={item}
        key={item.id + "-" + index}
        navigation={this.props.navigation}
        style={{ padding: "0rem" }}
      />
    })
    if (courses.length > 5) coursescps.push(
      <div
        style={{
          width: "100%",
          height: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
          color: "#6176A0",
          fontWeight: "500"
        }}
        onClick={() => this.navigateTo("/course/list", { masterId: this.store.masterInfo.id })}
      >
        查看更多
      </div>
    )
    return coursescps;

  }


  onScroll = () => {
    // console.log("Ssssrol");
    this.header.checkScroll();
  }

  renderEmpty = () => {
    return <div style={{ height: "10rem", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div className="icon-empty"></div>
      {/*<p onClick={this.props.emptyAction} className="fs-gray">{this.props.desc || "空空如也"}</p>*/}
    </div>
  }

  renderHeaderItem = (item, index) => {
    switch (index) {
      case 0:
        return (
          <div className="course-page-item">
            <div className="group-course-title">大师风采</div>
            {this.renderDesc()}
          </div>
        )
      case 1:
        return (
          <div className="course-page-item">
            <div className="group-course-title">大师课程</div>
            {this.renderCourse()}
          </div>
        )
    }
    return (
      <div className="course-page-item">
        <div className="group-course-title">大师解惑</div>
        {this.renderQuestion()}
      </div>
    )
  }
  getText = item => item.text

  render() {
    const store = this.store;
    const headers = [{
      text: "风采",
      id: this.store.desc
    }, {
      text: "课程",
      id: this.store.courses
    }, {
      text: "解惑",
      id: this.store.answers
    }];
    return <div className="master-detail" style={{ display: "flex", flexDirection: "column", marginBottom: "2.95rem" }} onScroll={this.onScroll}>
      <MasterIntroduce concern_able tags_able detail={this.store.masterInfo} user={this.store.masterInfo} />
      <CommHeaders
        headers={headers}
        ref={ref => this.header = ref}
        isVertical
        isCached={false}
        getText={this.getText}
        renderChild={this.renderHeaderItem}
        style={{
          borderBottomWidth: 0,
          flex: 1
        }}
        headerStyle={{ zIndex: "1000" }}
        headerIndex
        blockStyle={{ marginBottom: "2.95rem" }}
      />
      {/*{this.renderChild()}*/}
      <div style={{
        backgroundColor: "white",
        position: "fixed",
        bottom: "0rem",
        width: "100%",
        zIndex: 11,
        height: "2.95rem"
      }}>
        <div className="master-detail-footer" >
          <LinkBtn onClick={this.toAsk} className={"button btn-size-normaler btn-round " + (this.store.masterInfo.questionEnabled ? "gold-border-btn" : "gray-border-btn")}>提问</LinkBtn>
          <a onClick={this.showGift} className="button btn-size-normal gold-border-btn border-cycle">赏</a>
          <LinkBtn onClick={this.toMeet} className={"button btn-size-normaler btn-round " + (this.store.masterInfo.appointEnabled ? "gold-btn" : "gold-btn-light")}>约见</LinkBtn>
          <GiftCom ref="gift" toUserId={this.store.masterInfo.id} />
        </div>
      </div>
    </div>
  }


  toAsk = () => {
    if (!this.store.masterInfo.questionEnabled) {
      return $.toast("该大师不提供解惑")
    }
    this.props.navigation.navTo("/disabuse/db_ask", {
      type: "DB_ASK",
      billId: this.store.masterInfo.id,
      amount: this.store.masterInfo.questionCost
    })
  }

  toMeet = () => {
    if (!this.store.masterInfo.appointEnabled) {
      return $.toast("该大师不可约见")
    }
    this.props.navigation.navTo("/meet/meetedit", {
      data: {
        masterId: this.store.masterInfo.id,
        appointCost: this.store.masterInfo.appointCost,
        avatar: this.store.masterInfo.avatar
      }
    })
  }

  showGift = () => {
    this.refs["gift"].show();
  }
}

export default MasterDetail;