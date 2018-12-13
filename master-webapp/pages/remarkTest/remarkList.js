import {observer} from "mobx-react"
import navable from "../../components/common/nav/navable"
import RemarkList from "../../components/common/remarkList"
import UserStore from "../../data/stores/UserStore"


@navable("/remarkTest/remarkList")
@observer
export default class RemarkListWrap extends React.Component{
    static getInitialProps({req}){
        UserStore.recovery(req&&req.headers&&req.headers.cookie)
        return {a:0}
    }

    static navProps(){
        return {
            title:"评论与回复评论"
        }
    }
    constructor(props){
        super();

        this.state={
            a:props.a
        }
    }
    componentDidMount(){
    }
    render(){
        return <div style={{overflowY:"auto",paddingBottom:"100px", backgroundColor: "#fff"}}>
            <RemarkList billId="9999" billType="QUESTION"> </RemarkList>
        </div>
    }
}