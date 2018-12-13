import navable from "../../components/common/nav/navable"

import { API_WANTED_MY } from "../../common/api";
import List from "../../components/common/list";
import RewardItem from "../../components/master/rewardItem";


@navable("/reward/reward_my")
export default class Reward_My extends React.PureComponent {
  static navProps() {
    return {
      title: "我的悬赏"
    }
  }
navigateTo(path, a) {
    this.props.navigation.navTo(path,{...a});
  }  renderItem = (item, index) => {
    return <RewardItem
      key={`rw-${index}`}
      user={item.user}
      detail={item}
      callBack={() => this.props.navigation.navTo("/reward/rewardDetail", { wantedId: item.id })}
    />
  }

    render() {
        return <div className="meet full dd_container list-without-bottom">
            <List
                api={API_WANTED_MY}
                renderItem={this.renderItem}
                className={"list-split"}
            />
        </div>
    }
}