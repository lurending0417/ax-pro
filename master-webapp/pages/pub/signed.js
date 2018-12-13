/**
* 签到
*  <>-----}|------------------------------->
* 
*/

import Calender from "../../components/signed/signedCalender"
import navable from "../../components/common/nav/navable";

// 
@navable("/pub/signed")
class SignedPage extends React.PureComponent {
    constructor() {
        super()
    }
    static navProps() {
        return {
            title: "签到"
        }
    }
    render() {
        return <div>
            <img src={"/static/images/1.svg"} style={{ width: 100, height: 100 }} />
            <Calender navigation={this.props.navigation} />
        </div>
    }
}

export default SignedPage;