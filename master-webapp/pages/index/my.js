import Router, { withRouter } from "next/router"
import { observer } from "mobx-react"
import Link from "../../components/common/link"

import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import tabable from "../../components/nav/tab"
import icon_wallet from "../../static/images/index/my-icon-wallet.png"
import icon_invite from "../../static/images/index/my-icon-invite.png"
import icon_1 from "../../static/images/index/my-icon-1.png"
import icon_2 from "../../static/images/index/my-icon-2.png"
import icon_3 from "../../static/images/index/my-icon-3.png"
import icon_4 from "../../static/images/index/my-icon-4.png"
import icon_5 from "../../static/images/index/my-icon-5.png"
import icon_6 from "../../static/images/index/my-icon-6.png"
import icon_next from "../../static/images/icon-next.png"
import CommonAvatar from "../../components/common/commonAvatar";


@navable("/index/my", "my")
@observer
@tabable(4)
export default class My extends React.Component {
    static getInitialProps({ req }) {
        UserStore.recovery(req && req.headers && req.headers.cookie)
        return { a: 0 }
    }

    // static navProps() {
    //     return {
    //         title: "我的",
    //         showBack: false
    //     }
    // }

    constructor(props) {
        super();

        this.state = {
            a: props.a
        }
    }

    componentDidMount() {
        // setTimeout(()=>{
        // 	this.setState({
        // 		a:2
        // 	})
        // },2000)
        UserStore.refresh();
    }

    renderRedPoint() {
        return <div
            style={{
                position: "fixed",
                height: "0.4rem",
                width: "0.4rem",
                backgroundColor: "#E4112B",
                borderRadius: "0.2rem",
                marginLeft: "1.15rem",
                marginTop: "-0.6rem",
                border: "0.05rem solid #FFFFFF"
            }}
        ></div>
    }

    render() {
        return <div className="my" style={{ overflowY: "auto" }}>

            <div className="my-user-info">
                <CommonAvatar cached src={UserStore.avatar} className="user-icon">
                    {
                        (() => {
                            if (UserStore.master)
                                return <div className="master-confirm-icon ma_master_confirm" />
                            else if (UserStore.vip)
                                return <div className="user-vip-icon ma_master_confirm" />
                            return <div></div>
                        })()
                    }
                    {/*{UserStore.vip && <div className="user-vip-icon ma_master_confirm" />}*/}
                </CommonAvatar>
                {/* <img className="user-icon"
                    src={UserStore.avatar || null} /> */}
                <div>
                    <div className="my-name">{UserStore.nick}</div>
                    {
                        UserStore.master ?
                            <div className="ma_stars">
                                {(() => {
                                    var content = [];
                                    for (var i = 0; i < parseInt(UserStore.score || 5); i++) {
                                        content.push(<div className="ma_star master-star-icon" key={`start-${i}`} />);
                                    }
                                    return content;
                                })()}
                            </div> :
                            <Link className="my-member theme-gold-text-color" onClick={() => {
                                if (!UserStore.vip)
                                    this.props.navigation.navTo("/remarkTest/purchaseVip", { a: "my" });
                            }}>{UserStore.vip ? "会员" : "开通超值会员"}</Link>
                    }
                </div>
                <Link href="/setting/user" className="my-setting">
                    <span style={{ color: "#666" }}>设置</span>
                    <i className="icon icon-next"></i>
                    {/* <img className="icon-next" src={icon_next}/> */}
                </Link>
            </div>

            <div className="theme-space"></div>

            <div className="my-wallet-invite-box row other">
                <div className="my-wallet-box col-50 text-center">
                    <Link style={{ padding: "1rem" }} onClick={() => {
                        const path = "/wallet/wallet"
                        this.props.navigation.navTo(path, { a: "wallet" });
                    }}>
                        <img src={icon_wallet} width='40' />
                        <div className="my-wallet-text">钱包</div>
                    </Link>
                </div>
                <div className="my-invite-box col-50 text-center">
                    <Link style={{ padding: "1rem" }} onClick={() => {
                        const path = "/my/invite"
                        this.props.navigation.navTo(path, { a: "invite" })
                    }}>
                        <img src={icon_invite} width='40' />
                        <div className="my-invite-text">邀请</div>
                    </Link>
                </div>
            </div>

            <div className="theme-space"></div>


            <div className="list-block list">
                <ul>
                    <li className="item-content item-link itemHeight">
                        <div className="item-media">
                            <img src={icon_1} />
                        </div>
                        <div className="item-inner" onClick={() => {
                            const path = "/index/learn"
                            this.props.navigation.navTo(path, { a: "db_my" })
                        }}>
                            <div className="item-title">我的课程</div>
                        </div>
                    </li>
                    <li className="item-content item-link itemHeight">
                        <div className="item-media">
                            <img src={icon_2} />
                        </div>
                        <Link className="item-inner" onClick={() => {
                            const path = "/disabuse/db_my"
                            this.props.navigation.navTo(path, { a: "db_my" })
                        }}>
                            <div className="item-title">我的解惑</div>
                        </Link>
                    </li>
                    <li className="item-content item-link itemHeight">
                        <div className="item-media">
                            <img src={icon_3} />
                        </div>
                        <Link className="item-inner" onClick={() => {
                            const path = "/reward/reward_my"
                            this.props.navigation.navTo(path, { a: "reward_my" })
                        }}>
                            <div className="item-title">我的悬赏</div>
                        </Link>
                    </li>
                    <li className="item-content item-link itemHeight">
                        <div className="item-media">
                            <img src={icon_4} />
                        </div>
                        <div className="item-inner">
                            <div className="item-title">
                                <Link href="/meet/list">我的约见</Link>
                            </div>
                        </div>
                    </li>
                    <li className="item-content item-link itemHeight" onClick={() => {
                        const path = "/my/attention"
                        this.props.navigation.navTo(path, { a: "attention" })
                    }}>
                        <div className="item-media">
                            <img src={icon_5} />
                        </div>
                        <div className="item-inner">
                            <div className="item-title">我的关注</div>
                        </div>
                    </li>
                    <li className="item-content item-link itemHeight" onClick={() => {
                        const path = "/my/collection"
                        this.props.navigation.navTo(path, { a: "collection" })
                    }}>
                        <div className="item-media">
                            <img src={icon_6} />
                        </div>
                        <div className="item-inner">
                            <div className="item-title">我的收藏</div>
                        </div>
                    </li>
                    {/*<li className="item-content item-link itemHeight">
                        <div className="item-media">
                            <img src={icon_4}/>
                        </div>
                        <div className="item-inner">
                            <div className="item-title">
                                <Link href="/user/login">登录</Link>
                            </div>
                        </div>
                    </li>
                    <li className="item-content item-link itemHeight">
                        <div className="item-media">
                            <img src={icon_4}/>
                        </div>
                        <div className="item-inner">
                            <div className="item-title">
                                <Link href="/common/list">来 组建 放这里</Link>
                            </div>
                        </div>
                    </li>*/}
                </ul>
            </div>
            <div className="theme-space"></div>
        </div>
    }

}
