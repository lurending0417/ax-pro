/**
* 具体某人 约见详情
*  <>-----}|------------------------------->
* 
*/
import navable from "../../components/common/nav/navable"

import MasterIntr from "../../components/master/main_body_round"
import RemarkList from "../../components/common/remarkList"

@navable("/meet/detail")
export default class MeetOneDetail extends React.PureComponent {
    static navProps = (props) => {
        const data = props.data || {};
        return {
            title: `约见${data.nick || ""}大师`
        }
    }
    render() {
        const remarkItem = { ...this.props.data, user: this.props.data }
        return <div className="meet-detail">
            <MasterIntr navigation={this.props.navigation} detail={this.props.data} meet_able tags_able address_able />
            <RemarkList billType={"QUESTION"} billId={this.props.data.id} style={{ marginTop: "1.75rem" }} />
        </div>
    }
}