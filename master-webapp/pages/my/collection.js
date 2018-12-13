import { observer } from "mobx-react"

import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import tabable from "../../components/nav/tab"
import CourseItem from "../../components/common/CourseItem"
import RewardItem from "../../components/master/rewardItem"
import CollectionStore from "../../data/stores/CollectionStore";
import Master_Avatar from "../common/master_Avatar";
import CommentGroup from "../common/commentGroup";
import List from "../../components/common/list";
import MaterIntr from "../../components/master/main"
import { API_MASTER_LIST_REAL, API_MY_COLLECTION, API_WANTED } from "../../common/api";
import DB_QuestionItem from "../../components/disabuse/db_questionItem";
import Headers from "../../components/common/headers"
import utils from "../../utils/renderUtil";
import CategoryHeaders from "../../components/master/headers";
import CourseListItem from "../../components/course/courseListItem";
import ListEmpty from "../../components/common/empty";
import { on } from "../../utils/notify"



@navable("/my/collection")
@observer
export default class Collection extends React.Component {
    static getInitialProps({ req }) {
        UserStore.recovery(req && req.headers && req.headers.cookie)
        return { a: 0 }
    }

    static navProps() {
        return {
            title: "我的收藏"
        }
    }

    constructor(props) {
        super();

        this.state = {
            a: props.a,
            billType: "COURSE"
        }

    }

    componentDidMount() {
        this.unConcern = on("MasterCollect", (newItem, obj) => {
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

    navigateTo(path, a) {
        this.props.navigation.navTo(path, { a });
    }


    // 获取收藏
    getCollection(billType) {
        // this.setState({ billType })
        // CollectionStore.getCollection({ billType })
    }


    renderItem(item, index) {
        return <div className="ms_item">
            <div className="ms_item_header">
                <Master_Avatar />
            </div>
            <div className="ms_item_content fs-small">
                问：“太极拳”讲究形劲意气，四两拨千斤，强身健体，延年益寿；“健身”是锻炼身体各个部位肌肉，控制体脂含量，打造匀称身材。 那太极和健身，哪个效果更好了？
            </div>
            <div className="ms_item_footer">
                <div className="ms_item_footer_left">
                    <div className="ms_item_footer_tip fs-small">偷看：20次</div>
                    <div className="ms_item_footer_tip fs-small">追问：5次</div>
                </div>
                <CommentGroup className="ms_item_footer_right" />
            </div>
        </div>
    }

    renderRewardItem(item, index) {
        return <RewardItem
            key={`rw-${index}`}
            user={item.user}
            detail={item}
            callBack={() => this.props.navigation.navTo("/reward/rewardDetail", { wantedId: item.id })}
        />
    }

    renderQuestionItem(item, index) {
        return <DB_QuestionItem detail={item} key={`q-${index}`}
            callBack={() => this.navigateTo("/disabuse/db_detail", { questionId: item.id })} />
    }

    renderEmpty = () => {
        return (
            <ListEmpty desc={this.getEmptyDesc()}></ListEmpty>
        )
    }

    getQuery = () => {
        return {
            billType: this.state.billType
        }

    }

    renderItem = (item, index, empty) => {
        if (empty) return null;
        switch (this.state.billType) {
            case "WANTED":
                return this.renderRewardItem(item, index)
            case "QUESTION":
                return this.renderQuestionItem(item, index)
            default:
                return <CourseListItem
                    data={item}
                    navigation={this.props.navigation}
                    style={{ padding: "0rem 0rem" }}
                />
        }
    }

    onHeaderChange = (index) => {
        switch (index) {
            case 0:
                this.setState({ billType: "COURSE" })
                break;
            case 1:
                this.setState({ billType: "QUESTION" })
                break;
            case 2:
                this.setState({ billType: "WANTED" })
                break;
        }

        requestAnimationFrame(() => {
            this.refs.list.getListData(0);
        })
    }

    getEmptyDesc = () => {
        switch (this.state.billType) {
            case "WANTED":
                return "暂无收藏悬赏"
            case "QUESTION":
                return "暂无收藏解惑"
            case 2:
                return "暂无收藏课程"
        }
    }

    render() {
        const api = "";
        let index = 0;

        return (
            <div style={{ overflow: "hidden" }} className="collection list-without-bottom">
                <Headers
                    className="bar color-black bar-nav cat-header"
                    isTextGold={false}
                    headers={["课程", "解惑", "悬赏"]}
                    onChange={this.onHeaderChange}
                />
                <div className="collection-list list-block list-split group-course">
                    <List
                        ref={"list"}
                        api={API_MY_COLLECTION}
                        renderItem={this.renderItem}
                        renderEmpty={this.renderEmpty}
                        getKey={(item) => item.id + "-" + (index++)}
                        getQuery={this.getQuery} />


                </div>

            </div>
        )
    }

}