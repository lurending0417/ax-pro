import { observer } from "mobx-react"

import navable from "../../components/common/nav/navable"
import UserStore from "../../data/stores/UserStore"
import tabable from "../../components/nav/tab"
import CourseItem from "../../components/common/CourseItem"
import InviteStore from "../../data/stores/InviteStore";


@navable("/my/invite")
@observer
export default class Invite extends React.Component {
    static getInitialProps({ req }) {
        UserStore.recovery(req && req.headers && req.headers.cookie)
        return { a: 0 }
    }

    static navProps() {
        return {
            title: "我的邀请",
            hiddenTitleBorder: true
        }
    }

    constructor(props) {
        super();

        this.state = {
            a: props.a
        }

        InviteStore.getInvite()
    }

    componentDidMount() {
    }

    render() {
        // if (!InviteStore.invite)
        //     return <div></div>

        return (
            <div className="invite">
                <div className="invite-top">
                    <div className="invite-amount-title theme-gold-text-color">累计分销收益</div>
                    <div className="invite-amount theme-gold-text-color">{InviteStore.invite}</div>
                    <div className="invite-intro">
                        <div className="intro-box" onClick={() => {
                            this.props.navigation.navTo("/invite/inviteDetail")
                        }}>
                            <div className="theme-gold-text-color">收益明细</div>
                        </div>
                    </div>
                </div>
                {/*<div className="invite-number">邀请人员列表（{InviteStore.invite.invited.length}人）</div>
				<div className="invite-list-box">
					<ul className="invite-list">
						{
							InviteStore.invite.invited.map((invite, index) => {
								return (
									<li className="invite-item-box" key={index}>
										<div className={index !== 0 ? "invite-item top-line" : "invite-item"}>
											<img className="item-img" src={invite.img}/>
											<div className="item-name">{invite.name}</div>
											<div className="item-times">{invite.times}</div>
										</div>
									</li>
								)
							})
						}
					</ul>
				</div>*/}
                <div className="invite-rule">
                    <strong>邀请规则：</strong>
                    <div style={{ marginTop: "0.5rem" }}>
                        1.您所购买的课程可分享出去，邀请10名好友免费观看。<br/>
                        2.你的好友购买了会员或者课程后，将按照付费的25%发放到您的钱包。
                    </div>
                </div>
            </div>
        )
    }

}