import { observer } from "mobx-react"
import navable from "../../components/common/nav/navable"
import MessageStore from "../../data/stores/message"
import { GATEWAY } from "../../common/constant";
import { wxPay } from "../../utils/wx";
import sysStore from "../../data/stores/sysStore";
import UserStore from "../../data/stores/UserStore";

@navable("/remarkTest/purchaseVip")
@observer
export default class PurchaseVip extends React.Component {

    static navProps() {
        return {
            title: "购买会员"
        }
    }
    constructor(props) {
        super();

        this.state = {
            a: props.a
        }
    }

    componentDidMount() {
        const temp = this.refs["purchaseVipContents"].parentNode.parentNode;
        setTimeout(() => {
            const temp1 = temp.getElementsByClassName("bar-nav")
            temp1[0].setAttribute("class", "nav-define bar color-black bar-nav")
        })
    }

    render() {
        return <div className="disp-vertical" style={{
            overflowY: "auto",
            height: "100%",
            backgroundColor: "#fff",
            position: "relative",
            // padding: "0 .75rem",
            alignItems: "center"
        }} ref="purchaseVipContents">
            <div className="vip_card_wrap"> </div>
            <div className="vip_card_btn" onClick={() => { this.purchaseVip() }}> </div>
        </div>
    }

    purchaseVip() {
        MessageStore.postVip({
            params: {
                originalCost: sysStore.vipOriginalCost,
                totalCost: sysStore.vipActualCost,
                gateway: GATEWAY[1]
            },
            callback(rs) {
                console.log("rs", rs)
                wxPay(rs.result, (error, result) => {
                    error ? $.toast("支付失败") : $.toast("支付成功")
                    if (!error) {
                        UserStore.vip = true;
                    }
                })
            }
        })
    }
}