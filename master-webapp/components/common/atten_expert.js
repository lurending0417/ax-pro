import React, { PureComponent } from "react";
import ribbon from "../../static/images/attendance/ribbon@3x.svg"
import noIcon from "../../static/images/icon/icon-no-name@2x.png";
import headIcon from "../../static/images/attendance/ribbon@3x.png";
import closeIcon from "../../static/images/attendance/close@3x.png";
import fIcon from "../../static/images/attendance/campaign@3x.png";
import sIcon from "../../static/images/attendance/second@3x.png";
import tIcon from "../../static/images/attendance/third@3x.png";
import awIcon from "../../static/images/attendance/award@3x.png";
import CommonAvatar from "./commonAvatar";
import AttendanceStore from "../../data/stores/attendanceStore";
import { observer } from "mobx-react";

@observer
class Atten_Expert extends PureComponent {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    AttendanceStore.getTopsList();
  }

  componentWillReceiveProps(nextProps) {
  }

  scrollToTop() {
    $(".aec_scroll")[0].scroll(0, 0)
  }

  render() {
    const topInfo = AttendanceStore.topInfo;
    const items = Object.keys(topInfo).length > 0 ? AttendanceStore.topInfo.users : [];
    console.log("items", items);
    return <div className="aet_container">
      <div className="aec_header">
        <img src={headIcon} className="aec_img"/>
      </div>
      <img src={closeIcon} className="aec_delete" onClick={this.props.closeCallback}/>
      <div className="aec_content">
        <div className="aec_title">每日好友助力人次进入前一百名，即可获得300元助学金</div>
        <div ref={list => this.list = list} className="aec_scroll">
          {items.map((item, index) => {
            return <Expert_Item key={index} item={item} index={index}/>
          })}
        </div>
      </div>
      <div className="aet_bottom">
        <div className="fs-max fs-white">
          {`您今日好友助力：${topInfo.helpCount}人次`}
        </div>
        <div className="fs-small fs-white">
          {`您今日冲进了前${topInfo.ordinal}名，奖金近在眼前，请再接再厉！`}
        </div>
      </div>
    </div>
  }
}
export default Atten_Expert;


class Expert_Item extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="aec_item">
        <div className="aec_item_count fs-gray fs-small">
          {(() => {
            switch (this.props.index) {
              case 0:
                return <img src={fIcon} className="aec_item_img"/>
              case 1:
                return <img src={sIcon} className="aec_item_img"/>
              case 2:
                return <img src={tIcon} className="aec_item_img"/>
              default:
                return this.props.index;
            }
          })()}
        </div>
        <img src={this.props.item.avatar} className="aec_item_icon"/>
        {/*<CommonAvatar src={noIcon} className="aec_item_icon"></CommonAvatar>*/}
        <div className="aec_item_name fs-small fs-bold">{this.props.item.nick}</div>
        <div className="aec_item_cup">
          <img className="aec_item_cup_img" src={awIcon}/>
          <div className="fs-smaller fs-gold">{this.props.item.helpCount}</div>
        </div>
        <div className="aec_item_price fs-small">￥300</div>
      </div>
    )
  }
}