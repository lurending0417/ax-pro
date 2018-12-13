import { observer } from "mobx-react"
import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import tabable from "../../components/nav/tab"
import WalletStore from "../../data/stores/WalletStore";
import { wxPay } from "../../utils/wx";


@navable("/wallet/withdraw")
@observer
export default class Withdraw extends React.Component {
    static getInitialProps({ req }) {
        UserStore.recovery(req && req.headers && req.headers.cookie)
        return { a: 0 }
    }

    static navProps() {
        return {
            title: "提现",
            hiddenTitleBorder: true
        }
    }

    constructor(props) {
        super();

        this.state = {
            a: props.a,
            num: 20,
            withdrawAmount: 0
        }
    }

    componentDidMount() {
    }

    render() {

        return (
            <div className="withdraw">
                <div className="withdraw-top theme-gold-text-color">
                    余额：¥{WalletStore.amount}
                </div>
                <div className="theme-space"></div>
                <div className="withdraw-middle">
                    <div className="middle-title">请输入提现金额</div>
                    <div className="withdraw-amount-box">
                        <div style={{ fontWeight: "bold" }}>¥</div>
                        <input className="withdraw-amount" type="number"
                               value={this.state.withdrawAmount}
                               onChange={(e) => {
                                   this.setState({
                                       withdrawAmount: e.target.value
                                   })
                               }}/>
                    </div>
                    <div className="withdraw-all theme-gold-text-color" onClick={() => {
                        this.setState({
                            withdrawAmount: WalletStore.amount
                        })
                    }}>全部提现
                    </div>
                </div>
                <div className="theme-space"></div>
                <div className="withdraw-bottom">
                    <div>
                        <strong>提现规则</strong>
                        <div style={{ marginTop: "0.5rem" }}>
                            1.每日可提现一次，提现金额为10-2000元<br/>
                            2.每月前2笔免提现手续费，超出部分每笔5元手续费
                        </div>
                    </div>

                    <div className="bottom-button" onClick={() => {
                        if (!this.state.withdrawAmount || this.state.withdrawAmount === 0) {
                            $.toast("请输入正确金额")
                            return
                        }

                        WalletStore.withdraw({
                            amount: this.state.withdrawAmount
                        }, (result) => {
                            console.log("result", result)
                            wxPay(result.result, (error, result) => {
                                error ? $.toast("支付失败") : $.toast("支付成功")
                            })
                        })
                    }}>
                        确认提现
                    </div>
                </div>
            </div>
        )
    }

}