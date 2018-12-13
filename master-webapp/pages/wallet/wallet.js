import { observer } from "mobx-react"

import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import tabable from "../../components/nav/tab"
import WalletStore from "../../data/stores/WalletStore";
import icon_recharge from "../../static/images/wallet/recharge_icon.png"
import icon_withdraw from "../../static/images/wallet/withdraw_icon.png"
import icon_more from "../../static/images/icon-next.png"


@navable("/wallet/wallet")
@observer
export default class Wallet extends React.Component {
    static getInitialProps({ req }) {
        UserStore.recovery(req && req.headers && req.headers.cookie)
        return { a: 0 }
    }

    static navProps() {
        return {
            title: "钱包",
            hiddenTitleBorder: true
        }
    }

    constructor(props) {
        super();

        this.state = {
            a: props.a
        }

        WalletStore.getWallet()
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="wallet">
                <div className="wallet-top">
                    <div className="wallet-amount-title theme-gold-text-color">余额</div>
                    <div className="wallet-amount theme-gold-text-color">{WalletStore.amount}</div>
                    <div className="wallet-intro">
                        <div className="intro-box" onClick={() => {
                            this.props.navigation.navTo("/wallet/walletDetail")
                        }}>
                            <div className="theme-gold-text-color">收支明细</div>
                        </div>
                    </div>
                </div>
                {/*<div className="wallet-rule">
                    <strong>提现规则：</strong>
                    <div style={{ marginTop: "0.5rem" }}>
                        1.每日可提现一次，提现金额为10-2000元<br/>
                        2.每月前2笔免提现手续费，超出部分每笔5元手续费
                    </div>
                </div>*/}
                <div className="wallet-button-box">
                    <div className="item-box" onClick={() => {
                        this.props.navigation.navTo("/wallet/recharge")
                    }}>
                        <img className="icon" src={icon_recharge}/>
                        <div className="value">充值</div>
                        <img className="more" src={icon_more}/>
                    </div>
                    <div className="line"></div>
                    <div className="item-box" onClick={() => {
                        this.props.navigation.navTo("/wallet/withdraw")
                    }}>
                        <img className="icon" src={icon_withdraw}/>
                        <div className="value">提现</div>
                        <img className="more" src={icon_more}/>
                    </div>
                </div>


                {/*<div className="wallet-footer-box">
                    <button className="wallet-button-off theme-gold-text-color"
                            onClick={() => {
                                this.props.navigation.navTo("/wallet/recharge")
                            }}>充值
                    </button>
                    <button className="wallet-button-on"
                            onClick={() => {
                                this.props.navigation.navTo("/wallet/withdraw")
                            }}>提现
                    </button>
                </div>*/}
            </div>
        )
    }

}