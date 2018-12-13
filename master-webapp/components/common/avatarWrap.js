import PropTypes from "prop-types"
import CommonAvatar from "./commonAvatar"

export default class AvatarWrap extends React.Component {
    render() {
        return (
            <div className="avatar_wrap">
                <div className="img_wrap">
                    <CommonAvatar src={this.props.imgSrc} alt={this.props.userName} className="img" />
                    {/* <img src={this.props.imgSrc} alt={this.props.userName} className="img" /> */}
                </div>
                <div className="user_name fs-normal">
                    {(() => {
                      if (this.props.userName instanceof Array) {
                        return <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                          {this.props.userName[0]}<div className="fs-gray">回复</div>{this.props.userName[1]}
                        </div>
                      } else {
                        return this.props.userName
                      }
                    })()}
                    {
                        (0, () => {
                            if (this.props.showRole) {
                                return [<br key="1" />, <span key="2" className={"fs-small " + (this.props.vip ? "fs-gold" : "fs-gray")}>{this.props.vip ? "会员" : "普通用户"}</span>]
                            }
                            return null;
                        })()
                    }
                </div>
            </div>
        )
    }
}
AvatarWrap.propTypes = {
    imgSrc: PropTypes.string,
    userName: PropTypes.any,
}
AvatarWrap.defaultProps = {
    imgSrc: "../../static/images/icon/icon-no-name@2x.png",
    userName: "热心的小喔"
}