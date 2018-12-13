import navable from "../../components/common/nav/navable"
import CommentGroup from "../common/commentGroup";
import Master_Avatar from "../common/master_Avatar";
import QuestionStore from "../../data/stores/disabuse/questionStore";
import { observer } from "mobx-react"
import DB_QuestionItem from "../../components/disabuse/db_questionItem";
import { API_DB_QUESTION } from "../../common/api";
import List from "../../components/common/list";
import Headers from "../../components/common/headers"
import Store from "../../data/stores";
import CategoryHeaders from "../../components/master/headers";

const CategoryStore = Store.category;

@observer
@navable("/disabuse/db_main")
export default class DB_Main extends React.Component {
  static navProps(props) {
    return {
      title: props.a ? "解惑列表" : "大师解惑"
    }
  }

  constructor(props) {
    super(props);

    this.goMasterAskPage = this.goMasterAskPage.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.navigateTo = this.navigateTo.bind(this);


    this.menus = [
      "全部",
      "太极",
      "书法",
      "国画"
    ]
    this.type = null;

  }
  goMasterAskPage = () => {
    this.props.navigation.navTo("/disabuse/db_masters", "/disabuse/db_masters");
  }
  navigateTo(path, a) {
    this.props.navigation.navTo(path, { a });
  }

  // 评论
  toChat = (e, item) => {
    e.stopPropagation();

    $.toast("pppp");
  }
  // 点赞
  renderItem = (item, index) => {
    return <DB_QuestionItem
      detail={item}
      key={`q-${index}`}
      canAgree={false}
      callBack={() => this.navigateTo("/disabuse/db_detail", { questionId: item.id })}
    />
  }
  renderHeader() {

    return <div className="ms_head">
      <div href="#" className="ms_head_btn" onClick={this.goMasterAskPage}>向大师提问</div>
    </div>
  }
  getQuery = () => {
    return {
      categoryId: this.type || null
    }
  }
  getMasterQuery = () => {
    return {
      masterId: this.props.a
    }
  }

  headerIndexChange = (index) => {
    this.type = CategoryStore.rows[index].id;

    this.refs["list"].getListData(0);
  }
  render() {
    if (this.props.a) {
      return <div className="meet full">
        <List
          api={API_DB_QUESTION}
          renderItem={this.renderItem}
          className={"list-split"}
          getQuery={this.getMasterQuery}
          ref="list"
        />
      </div>
    }
    return <div className="meet full">
      <CategoryHeaders onChange={this.headerIndexChange} />
      <List
        api={API_DB_QUESTION}
        renderItem={this.renderItem}
        renderHeader={this.renderHeader}
        className={"list-split"}
        getQuery={this.getQuery}
        ref="list"
      />
    </div>
  }
}