import { observer } from "mobx-react"

import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import tabable from "../../components/nav/tab"
import InviteStore from "../../data/stores/InviteStore";


@navable("/invite/inviteDetail")
@observer
export default class InviteDetail extends React.Component {
    static getInitialProps({ req }) {
        UserStore.recovery(req && req.headers && req.headers.cookie)
        return { a: 0 }
    }

    static navProps() {
        return {
            title: "收益明细"
        }
    }

    constructor(props) {
        super();

        this.state = {
            a: props.a
        }

        InviteStore.getInviteDetail()
    }

    componentDidMount() {
    }

    render() {
        if (!InviteStore.inviteDetail)
            return <div></div>

        return (
            <div className="invite list-without-bottom">
                <div className="invite-list-box">
                    <ul className="invite-list">
                        {
                            InviteStore.inviteDetail.map((invite, index) => {
                                return (
                                    <li className="invite-item-box" key={index}>
                                        <div className={index !== 0 ? "invite-item top-line" : "invite-item"}>
                                            <img className="item-img" src={invite.img}/>
                                            <div className="item-name">
                                                <div style={{ fontSize: "0.8rem" }}>{invite.name}</div>
                                                <div style={{ fontWeight: "500", color: "#4A4A4A" }}>{invite.type}</div>
                                            </div>
                                            <div className="item-times">
                                                <div style={{ color: "#9B9B9B" }}>{invite.times}</div>
                                                <div className="theme-gold-text-color"
                                                     style={{ fontWeight: "bold", textAlign: "right" }}>
                                                    + ¥{invite.amount}</div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }

}