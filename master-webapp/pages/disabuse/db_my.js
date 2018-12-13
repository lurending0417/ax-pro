import navable from "../../components/common/nav/navable";

import DB_QuestionItem from "../../components/disabuse/db_questionItem";
import { API_DB_QUESTION, API_DB_QUESTION_MY } from "../../common/api";
import List from "../../components/common/list";


@navable("/disabuse/db_my")

export default class DB_MY extends React.PureComponent {
    constructor(props) {
        super(props);

    }

    static navProps() {
        return {
            title: "我的解惑"
        }
    }

    navigateTo(path, a) {
        this.props.navigation.navTo(path, { a });
    }

    renderItem = (item, index) => {
        return <DB_QuestionItem detail={item} key={`q-${index}`}
                                callBack={() => this.navigateTo("/disabuse/db_detail", { questionId: item.id })}/>
    }

    componentDidMount() {

    }

    render() {
        return <div style={{ overflow: "hidden" }} className="meet full dd_container list-without-bottom">
            <List
                ref="list"
                api={API_DB_QUESTION_MY}
                renderItem={this.renderItem}
                className={"list-split"}
            />
        </div>
    }
}