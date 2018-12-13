import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import bgIcon from "../../static/images/attendance/entrance@3x.png";
import AttendanceStore from "../../data/stores/attendanceStore";
import numUtil from "../../utils/numberUtil"
import { observer } from "mobx-react";


@observer
class Atten_Plan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mt: 0
    }
  }
  goAttendancepage = () => {
    if (!this.props.hasTitle) return null;
    this.props.navigation.navTo("/attendance/attendance", "/attendance/attendance");
  }

  componentDidMount() {
    if (document.body.clientHeight > 756) {
      this.setState({
        mt: "5rem"
      })
    }
  }

  render() {
    const per = numUtil.toKeepTwoPlacesOfDecimalAndRound((AttendanceStore.helpCount + AttendanceStore.checkCount) * 100 / 90);
    console.log("per", per);
    const mtStyle = {
    }

    if (this.props.hasTitle) {
      mtStyle.marginBottom = "0rem"
    }
    else {
      if (this.state.mt) {
        mtStyle.marginTop = this.state.mt
      }
    }
    return (
      <div className={this.props.hasTitle ? "plan_container" : ""}>
        {
          this.props.hasTitle && <div className="atten-top-bg">
            <img src={bgIcon}></img>
          </div>
        }
        <div onClick={this.goAttendancepage} className="plan plan_bottom_radius" style={mtStyle}>

          {this.props.hasTitle && <div className="plan_row">
            <span className="plan_title fs-max">
              喔喔奖学金
            </span>
            <span className="plan_detail fs-small">
              查看详情
            </span>
          </div>
          }
          <div className="plan_money_ct fs-max" style={this.props.hasTitle ? null : { marginTop: "-0.5rem" }}>
            {"剩余签到 "}&nbsp;
            <div className="plan_money">{" " + (90 - AttendanceStore.checkCount - AttendanceStore.helpCount) + " "}</div>
            &nbsp;{"天"}
          </div>
          <div className="plan_mid">
            <div className="plan_mid_item">
              <div className="plan_mid_title">
                {AttendanceStore.checkCount}
              </div>
              <div className="plan_mid_detail">
                自己签到
              </div>
            </div>
            <div className="plan_mid_item">
              <div className="plan_mid_title">
                {AttendanceStore.helpCount}
              </div>
              <div className="plan_mid_detail">
                朋友助力
              </div>
            </div>
            <div className="plan_mid_item">
              <div className="plan_mid_title">
                {`${per}%`}
              </div>
              <div className="plan_mid_detail">
                总进度
              </div>
            </div>
          </div>
          <div className="plan_process">
            <div className="plan_process_yellow" style={{ width: `${(AttendanceStore.helpCount + AttendanceStore.checkCount) * 100 / 90}%` }}>
              <div className="plan_process_gold" style={{ width: `${(AttendanceStore.checkCount) * 100 / (AttendanceStore.helpCount + AttendanceStore.checkCount)}%` }}></div>
            </div>
          </div>

          {(() => {
            if (this.props.hasTitle) {
              return (
                <div className="plan_row">
                  <div className="fs-small">
                    {AttendanceStore.isSigned ? "今日学习已经完成" : "今日学习未完成，快去吧"}
                  </div>
                </div>
              )
            } else {
              return (
                <div
                  className="plan_row"
                  style={{
                    height: "1rem",
                    marginTop: "0.5rem"
                  }}
                >
                  <div
                    style={{ position: "relative" }}
                    onClick={this.props.expertCallback}
                  >
                    <div className="plan_bottom">
                      助力达人榜
                    </div>
                    <div className="plan_badge">￥300</div>
                  </div>
                </div>
              );
            }
          })()}
        </div>
      </div>
    );
  }
}

Atten_Plan.defaultProps = {
  hasTitle: false
}

Atten_Plan.propTypes = {
  hasTitle: PropTypes.bool
}

export default Atten_Plan;