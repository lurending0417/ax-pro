import lessonIcon from "../../static/images/share/share_lesson@3x.png";
import otherIcon from "../../static/images/share/share_other@3x.png";


class ShareCom extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ position: "absolute", top: "0", left: "0", right: "0", bottom: "0", zIndex: "1002" }} onClick={this.props.callback}>
        <div style={{ position: "relative" }}>
          <img src={this.props.lesson && this.props.shareMoney ? lessonIcon : otherIcon} style={{ width: "100%" }} ></img>
          {
            (() => {
              if (!this.props.lesson) return null;
              return <div
                style={{
                  height: "2rem",
                  width: "100%",
                  bottom: "15%",
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: "1.2rem",
                  color: "#CF9F41",
                  fontWeight: "600"
                }}
              >
                {this.props.shareMoney ? `￥${this.props.shareMoney}` : ""}
              </div>
            })()
          }
        </div>

      </div>
    )
  }
}
ShareCom.defaultProps = {
  lesson: false, // 课程分享
  amount: 0 // 课程分享收益
}

export default ShareCom;

