import UserIntroduce from "./introduce";
import Avactar from "../common/avactar";
import DisaBuseLink from "./disabuseLink";
import dateUtil from "../../utils/dateUtil";

class RewardItem extends UserIntroduce {
  renderMain(children) {
    return <div style={this.props.style} className="border-round ms_item umain" onClick={this.props.callBack}>
      {children}
    </div>
  }

  renderAvator() {
    const user = this.props.user;
    return <Avactar user={user ? user : null} />
  }
  renderName() {
    return null;
  }
  getLeftTime = (timeStamp) => {
    if (!timeStamp) {
      return "即将";
    }
    const now = Date.now();
    const leftTime = timeStamp - now;
    var leftHours = leftTime / (60 * 60 * 1000);

    if (leftHours > 0) {
      const l1 = parseInt(leftHours)
      return l1 > 1 ? `${l1}小时后` : "1小时内";
    } else {
      return "即将"
    }
  }
  addNumber = (num) => {
    var nnum = (num > 9) ? num : ("0" + num);
    return nnum;
  }
  renderHeaderPlugin() {
    const detail = this.props.detail;
    return <div className="ri_plug">
      <p className="fs-normal ri_money fs-gold">
        {detail ? `奖金￥${detail.bounty}` : "奖金￥0"}
      </p>
      <p className="fs-small fs-gray ri_tip">{detail ? (detail.closed ? "赏金已发放" : `赏金将在${this.getLeftTime(detail.closeTime)}发放`) : ""}</p>
    </div>
  }
  renderBodyHeader() {
    const detail = this.props.detail;
    return (
      <div className="ri_body_head">
        <div className="ri_body_left">
          <div className="ri_body_head_title fs-big fs-bold">
            问题：
          </div>
          <div className="ri_body_head_question fs-big fs-bold">
            {detail ? detail.content : ""}
          </div>
        </div>
        {(() => {
          if (detail.attaches && detail.attaches.length > 0) {
            return <img className="ri_body_head_pic" src={detail.attaches[0].path} />
          }
          return null;
        })()}
      </div>
    );
  }
  renderBodyText() {
    const detail = this.props.detail || { answer: "" };

    return <div className="ri_body_left ri-answer">
      <p className="fs-gray fs-small ri_body_title">揭榜答案：</p>
      <div className="fs-gray fs-small ri_body_txt">
        {detail.answer}
      </div>
    </div>
  }
  renderBody() {
    const detail = this.props.detail;
    return <div key="body" className="ubody ms_item_content fs-small">
      {this.renderBodyHeader()}
      {detail.answer && detail.answer.length > 0 ? this.renderBodyText() : null}
    </div>
  }

  renderFooter() {
    const detail = this.props.detail;
    return (
      <div key="footer" className="ufooter ri_footer">
        <DisaBuseLink tip={detail ? `查看全部${detail.replyTimes}个回答` : "立即去回答"} />
      </div>
    );
  }
}

export default RewardItem;

