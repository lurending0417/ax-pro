/**
 *   用户头像(包含普通用户、大师) 插件
 *   1. 可判断是否只包含头像
 *   2. 头像包含（认证、VIP）标识
 *   3. 可包含用户名称
 */
import noNameIcon from "../../static/images/icon/icon-no-name@2x.png";
import CommonAvatar from "./commonAvatar";

export default class Avactar extends React.PureComponent {
    renderRight() {
        const user = this.props.user;

        if (this.props.avactarOnly) return null;
        if (user.master) {
            return (
                <div className="ma_right">
                    <div className="ma_title fs-big">{user.nick}</div>
                    <div className="ma_stars">
                        {(() => {
                            var content = [];
                            for (var i = 0; i < parseInt(user.score || 5); i++) {
                                content.push(<div className="ma_star master-star-icon" key={`start-${i}`} />);
                            }
                            return content;
                        })()}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="ma_right">
                    <div className="ma_title fs-big">{user.nick}</div>
                    <div className={user.vip ? "fs-small fs-gold" : "fs-small fs-gray"}>
                        {user.vip ? "会员" : "普通用户"}
                    </div>
                </div>
            );
        }
    }

    render() {
        const user = this.props.user;
        if (!user) return (
            <div className="ma_content">
                <CommonAvatar src={noNameIcon} className="ma_avatar" />
                {/* <div className="ma_avatar">
              <img src={noNameIcon} className="ma_avatar"/>
            </div> */}
                <div className="ma_right">
                    <div className="ma_title fs-big">热心的小喔</div>
                </div>
            </div>
        )

        return (
            <div className="ma_content">
                <CommonAvatar src={user.avatar} className="ma_avatar">
                    {(() => {
                        if (user.master) {
                            return <div
                                className={"master-confirm-icon ma_vip"} />;
                        } else if (user.vip) {
                            return <div
                                className={"user-vip-icon ma_vip"} />;
                        }

                        return null;
                    })()}
                </CommonAvatar>
                {/*<div className="ma_avatar">

                    <img src={user.avatar} className="ma_avatar" />

                (() => {
                    if (user.vip) {
                        return <div
                            className={user.master ? "master-confirm-icon ma_vip" : "user-vip-icon ma_vip"} />;
                    }
                    return null;
                })()
                </div>*/}
                {this.renderRight()}
            </div>
        )
    }
}

Avactar.defaultProps = {
    avactarOnly: false
}