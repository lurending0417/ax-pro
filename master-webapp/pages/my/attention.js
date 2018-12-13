import { observer } from "mobx-react"

import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import tabable from "../../components/nav/tab"
import CourseItem from "../../components/common/CourseItem"
import AttentionStore from "../../data/stores/AttentionStore";
import MaterIntr from "../../components/master/main";
import { API_MY_ATTENTION } from "../../common/api";
import List from "../../components/common/list";
import { fire, on } from "../../utils/notify"


@navable("/my/attention")
@observer
export default class Attention extends React.Component {
    static getInitialProps({ req }) {
        UserStore.recovery(req && req.headers && req.headers.cookie)
        return { a: 0 }
    }

    static navProps() {
        return {
            title: "我的关注"
        }
    }

    constructor(props) {
        super();

        this.state = {
            a: props.a
        }

        // AttentionStore.getAttention()
    }

    componentDidMount() {
        this.unConcern = on("MasterConcern", (newItem, obj) => {
            // 已经卸载
            if (!this._reactInternalInstance) {
                return
            }
            this.onConcern(newItem)
        })
    }

    componentWillUnmount() {
        this.unConcern();
    }

    onConcern = (item) => {
        // item.follow = !item.follow;
        this.refs["list"].remove(item);
    }

    render() {
        return (
            <div className="meet list-without-bottom">
                <List
                    ref="list"
                    api={API_MY_ATTENTION}
                    renderItem={(item, index) => {
                        return <MaterIntr onClick={() => {
                            this.props.navigation.navTo("/master/detail", { data: item })
                        }} navigation={this.props.navigation} concern_able={{ onConcern: this.onConcern }} tags_able user={item} detail={item} />
                    }}
                    // store={AttentionStore}
                    // rowsName="attentionList"
                    className={"list-split"}
                />
            </div>
        )
    }


}