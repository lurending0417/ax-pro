/**
 * 组件 -  用于解惑模块 提问 和 偷看
 * 包含（评分 、提问按钮、偷看按钮、提问偷看次数）
 */
import CommonBtn from '../common/button/commonBtn';
import Store from "../../data/stores";

const UserStore = Store.UserStore;

export default class DB_PayGroup extends React.PureComponent {

  // 评分
  renderStars() {
    const detail = this.props.detail;
    return (
      <div className="dp_star_content">
        {(() => {
          var content = [];
          for (var i = 0; i < 5; i++) {
            if (i < detail ? detail.score : 5) {
              content.push(
                <div className="star-tint-icon dp_star" key={`star-${i}`}/>
              );
            }else {
              content.push(
                <div className="star-grey-icon dp_star" key={`stars-${i}`}/>
              );
            }
          }
          return content;
        })()}
        <div className="dp_star_txt fs-small">{detail ? detail.score : 5.0}</div>
      </div>
    )
  }

  // 按钮
  renderPayBtn() {
    const detail = this.props.detail;
    if (!detail) return null;
    return (
      <div className="dp_btn_content">
        {(() => {
          if (detail.master.id === UserStore.userId) {
            var btns = [];
            if (detail.status === "DONE") {
              return null;
            }
            btns.push(
              <div className="dp_btn_item" key={"ans"}>
                <CommonBtn
                  title={"回答"}
                  style={{
                    height: "1.6rem",
                    width: "5.5rem",
                    fontWeight: "500",
                    fontSize: "0.75rem",
                  }}
                  callback={this.props.anserBack}
                  isFill={false}
                />
              </div>
            );
            btns.push(
              <div className="dp_btn_item_right" key={"give"}>
                <CommonBtn
                  title={"赠送追问次数"}
                  style={{
                    height: "1.6rem",
                    width: "5.5rem",
                    fontWeight: "500",
                    fontSize: "0.75rem",
                  }}
                  isFill={false}
                  callback={this.props.giveBack}
                />
              </div>
            );
            return btns;
          } else if (detail.user && (detail.user.id) === UserStore.id) {
            if (detail.status === "DONE") {
              return null;
            }
            return <CommonBtn
              title={`追问（剩余${detail.remainPursuitTimes}次）`}
              style={{
                height: "1.6rem",
                width: "6.75rem",
                fontWeight: "500",
                fontSize: "0.75rem",
              }}
              isFill={false}
              callback={this.props.askAgainCallBack}
            />
          } else {
            if (!detail.toListen) {
              return <div className="dp_btn_item_right">
                <CommonBtn
                  title={`我也要问￥${detail.master.questionCost}`}
                  style={{
                    height: "1.6rem",
                    width: "5.5rem",
                    fontWeight: "500",
                    fontSize: "0.75rem",
                  }}
                  isFill={false}
                  callback={this.props.askCallBack}
                />
              </div>
            }
            var btnss = [];
            btnss.push(
              <div className="dp_btn_item" key={"lins"}>
                <CommonBtn
                  title={`偷看￥${detail.listenCost}`}
                  style={{
                    height: "1.6rem",
                    width: "5.5rem",
                    fontWeight: "500",
                    fontSize: "0.75rem",
                  }}
                  callback={this.props.listenBack}
                  isFill={false}
                />
                <div className="dp_btn_item_txt fs-small">
                  {` 偷看：${detail.listenTimes}次`}
                </div>
              </div>
            );
            btnss.push(
              <div className="dp_btn_item_right" key={"ss"}>
                <CommonBtn
                  title={`提问￥${detail.master.questionCost}`}
                  style={{
                    height: "1.6rem",
                    width: "5.5rem",
                    fontWeight: "500",
                    fontSize: "0.75rem",
                  }}
                  isFill={false}
                  callback={this.props.askCallBack}
                />
                <div className="dp_btn_item_txt fs-small">
                  {`追问：${detail.pursuitTimes}次`}
                </div>
              </div>
            );
            return btnss;
          }
        })()}
      </div>
    );

  }
  render() {
    const detail = this.props.detail;
    return (
      <div className="dp_content">
        {detail.status === "DONE" && detail.store ?  this.renderStars() : null }
        {this.renderPayBtn()}
      </div>
    );
  }
}


