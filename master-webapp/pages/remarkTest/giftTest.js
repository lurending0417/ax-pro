import {observer} from "mobx-react"
import navable from "../../components/common/nav/navable"
import GiftCom from "../../components/common/giftCom"
import UserStore from "../../data/stores/UserStore"


@navable("/remarkTest/giftTest")
@observer
export default class GiftTest extends React.Component{

    static navProps(){
        return {
            title:"打赏示例"
        }
    }
    constructor(props){
        super();

        this.state={
            a:props.a,
            startAnimate: ""
        }
    }
    render(){
        return <div style={{overflowY:"auto",height:"100%", backgroundColor: "#fff"}}>
            打赏……
            <div className="gift-icon gift-position" onClick={()=> {this.bindAnimate()}}> </div>
            {/*GiftCom高度为214px(10.7rem),当这部分隐藏时，有15px（0.75rem）漏在外面，计算得出bottom应该为：-（10.7-0.75）=9.95rem*/}
            <GiftCom startAnimate={this.state.startAnimate} changeStartAnimate={this.changeStartAnimate.bind(this)}
                     toUserId="8888"
            > </GiftCom>
        </div>
    }

    bindAnimate() {
        if (!this.state.startAnimate) { // === ''
            this.setState({startAnimate: "up"})
        } else if (this.state.startAnimate === "up") {
            this.setState({startAnimate: "down"})
        } else if (this.state.startAnimate === "down") {
            this.setState({startAnimate: "up"})
        }
    }

    changeStartAnimate() {
        this.setState({startAnimate: "down"})
    }
}