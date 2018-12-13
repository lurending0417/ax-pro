import { observer } from "mobx-react"

import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import tabable from "../../components/nav/tab"
import WalletStore from "../../data/stores/WalletStore";
import List from "../../components/common/list";
import { API_MY_WALLET_DETAIL } from "../../common/api";
import dateUtil from "../../utils/dateUtil";


@navable("/wallet/walletDetail")
@observer
export default class WalletDetail extends React.Component {

    static navProps() {
        return {
            title: "收支明细"
        }
    }

    constructor(props) {
        super();

        this.state = {
            a: props.a
        }

        // WalletStore.getWalletDetail()
    }

    componentDidMount() {
    }

    walletDetailItem(wallet, index, empty) {
        if (empty) return null;
        return <div className="invite-item-box" key={index} style={index === 0 ? { padding: "0.75rem" } : {}}>
            <div className={index !== 0 ? "invite-item top-line" : "invite-item"}>
                <div className="item-name" style={{ margin: 0 }}>
                    <div style={{ fontWeight: "bold" }}>{wallet.billType}</div>
                    <div style={{
                        color: "#9B9B9B",
                        marginTop: "0.2rem"
                    }}>{dateUtil.pattern(new Date(wallet.createTime), "yyyy/MM/dd")}</div>
                </div>
                <div className="item-times" style={{ fontWeight: "bold", textAlign: "right" }}>
                    <div
                        className="theme-gold-text-color">{wallet.amount >= 0 ? ("+" + wallet.amount) : wallet.amount}</div>
                    <div style={{ marginTop: "0.2rem" }}>余额：¥{wallet.balance}</div>
                </div>
            </div>
        </div>
    }

    render() {
        // if (!WalletStore.walletDetail || WalletStore.walletDetail.length <= 0)
        //     return <div></div>

        return (
            <div className="invite list-without-bottom">
                <div className="invite-list-box">
                    {/*<ul className="invite-list">*/}
                    <List
                        api={API_MY_WALLET_DETAIL}
                        renderItem={(item, index) => {
                            return this.walletDetailItem(item, index)
                        }}
                        store={WalletStore}
                        rowsName="walletDetail"
                        className={"invite-list"} />
                    {/*{
							WalletStore.walletDetail.map((wallet, index) => {
								return (
									<li className="invite-item-box" key={index}>
										<div className={index !== 0 ? "invite-item top-line" : "invite-item"}>
											<img className="item-img" src={wallet.img}/>
											<div className="item-name">
												<div className="theme-gold-text-color">+ ¥ {wallet.amount}</div>
												<div style={{ fontWeight: "500" }}>{wallet.billType}</div>
											</div>
											<div className="item-times">
												<div style={{ color: "#9B9B9B" }}>{wallet.createYmd}</div>
												<div className="theme-gold-text-color">¥ {wallet.balance}</div>
											</div>
										</div>
									</li>
								)
							})
						}*/}
                    {/*</ul>*/}
                </div>
            </div>
        )
    }

}