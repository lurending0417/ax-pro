import navable from "../../components/common/nav/navable"
import CommentIntroduce from "../../components/master/comment";
import CommentSeries from "../../components/master/commentSeries";
import UserIntroduce from "../../components/master/introduce"
import MasterIntroduceMain from "../../components/master/main";
import DB_MasterItem from "../../components/master/db_masterItem"
import List from "../../components/common/list";
import { API_MASTER_LIST } from "../../common/api";
import Headers from "../../components/common/headers"
import Store from "../../data/stores";
import CategoryHeaders from "../../components/master/headers";

const CategoryStore = Store.category;

@navable("/disabuse/db_masters")
export default class DB_Masters extends React.Component {

  static navProps() {
    return {
      title: "大师列表"
    }
  }

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);

    this.menus = [
      "全部",
      "太极",
      "书法",
      "国画"
    ]
  }
  navigateTo(path, a) {
    this.props.navigation.navTo(path, { ...a });
  }
  payDisabuse(item) {

  }
  renderItem(item, index) {
    console.log("item", item);
    return <DB_MasterItem
      stars={5}
      detail={item}
      key={`master-${index}`}
      askCallBack={() => this.navigateTo("/disabuse/db_ask", { type: "DB_ASK", amount: item.questionCost, billId: item.id })}
      callback={() => this.toDetail(item)}
    />
  }
  getQuery = () => {
    return {
      categoryId: this.type || null
    }
  }

  headerIndexChange = (index) => {
    this.type = CategoryStore.rows[index].id;

    this.refs["list"].getListData(0);
  }
  toDetail = (item) => {
    return () => {
      this.props.navigation.navTo("/master/detail", {
        data: item
      })
    }
  }
  render() {
    return <div className="meet full">
      <CategoryHeaders onChange={this.headerIndexChange} />
      <List
        api={API_MASTER_LIST}
        renderItem={this.renderItem}
        className={"list-split"}
        getQuery={this.getQuery}
        ref="list"
      />
    </div>
  }
}