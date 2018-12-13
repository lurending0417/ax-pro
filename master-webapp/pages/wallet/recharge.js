import { observer } from "mobx-react"
import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import tabable from "../../components/nav/tab"
import recharge_img from "../../static/images/wallet/recharge_top_icon.png"
import WalletStore from "../../data/stores/WalletStore";
import { wxPay } from "../../utils/wx";


@navable("/wallet/recharge")
@observer
export default class Recharge extends React.Component {
    // static getInitialProps({ req }) {
    //     UserStore.recovery(req && req.headers && req.headers.cookie)
    //     return { a: 0 }
    // }

    static navProps() {
        return {
            title: "充值",
            hiddenTitleBorder: false
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            // a: props.a,
            num: 20,
            amount: 0
        }
    }

    componentDidMount() {
    }

    render() {

        return (
            <div className="recharge">
                <div className="recharge-box">
                    {/*<div className="recharge-top">*/}
                    {/*<img src={recharge_img}/>*/}
                    {/*</div>*/}
                    <div className="recharge-top-box">
                        <div className="recharge-top">
                            <div>请输入充值金额</div>
                            <img src={recharge_img}/>
                        </div>
                        <div className="recharge-amount-box">
                            <div style={{ fontWeight: "bold" }}>¥</div>
                            <input className="recharge-amount" type="number" onChange={(e) => {
                                this.setState({
                                    amount: e.target.value
                                })
                            }}/>
                        </div>
                    </div>

                    <div className="bottom-button-box">
                        <div className="bottom-button" onClick={() => {
                            if (!this.state.amount || this.state.amount === 0) {
                                $.toast("请输入正确金额")
                                return
                            }

                            WalletStore.recharge({
                                gateway: "WEIXIN_MP",
                                amount: this.state.amount
                            }, (result) => {
                                console.log("result", result)
                                wxPay(result.result, (error, result) => {
                                    if (error === null) {
                                        $.toast("支付成功")
                                        WalletStore.getWallet()
                                    } else {
                                        $.toast("支付失败")
                                    }
                                })
                            })
                        }}>确认充值
                        </div>
                    </div>

                </div>
            </div>
        )
    }

}