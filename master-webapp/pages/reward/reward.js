import navable from "../../components/common/nav/navable"
import RewardItem from "../../components/master/rewardItem";
import { API_DB_QUESTION, API_MASTER_LIST, API_WANTED } from "../../common/api";
import List from "../../components/common/list";
import Headers from "../../components/common/headers"


@navable("/reward/reward")
export default class Reward extends React.PureComponent {

  static navProps() {
    return {
      title: "悬赏问答"
    }
  }
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
    this.renderHeader = this.renderHeader.bind(this);

    this.menus = [
      "全部",
      "待揭榜",
      "已揭榜"
    ]
  }

  navigateTo(path, a) {
    this.props.navigation.navTo(path, { ...a });
  }
  refresh = () => {
    this.refs["list"].getListData(0);
  }
  renderHeader = () => {
    return <div className="ms_head">
      <div href="#" className="ms_head_btn" onClick={() => this.navigateTo("/disabuse/db_ask", { type: "REWARD", callback: this.refresh })}>发布悬赏</div>
    </div>
  }
  renderItem(item, index) {

    return <RewardItem
      key={`rw-${index}`}
      user={item.user}
      detail={item}
      callBack={() => this.navigateTo("/reward/rewardDetail", { wantedId: item.id })}
    />
  }

  getQuery = () => {
    return {
      closed: this.type || null
    }
  }

  headerIndexChange = (index) => {
    switch (index) {
      case 0:
        this.type = null;
        break;
      case 1:
        this.type = false;
        break;
      case 2:
        this.type = true;
        break;
      default:
        this.type = null;
        break;
    }
    this.refs["list"].getListData(0);
  }
  render() {
    return <div className="meet full">
      <Headers isTextGold={false} onChange={this.headerIndexChange} className="bar color-black bar-nav cat-header" headers={this.menus} getText={item => item}></Headers>
      <List
        api={API_WANTED}
        renderItem={this.renderItem}
        renderHeader={this.renderHeader}
        getQuery={this.getQuery}
        className="list-split"
        ref="list"
      />
    </div>
  }
}