import navable from "../../components/common/nav/navable"
import CommonBtn from "../../components/common/button/commonBtn";
import RemarkList from "../../components/common/remarkList";
import ReplyGroup from "../../components/common/replyGroup";
import { observer } from "mobx-react";
import Store from "../../data/stores";
import * as Wx from "../../utils/wx"
import { wxShare } from "../../utils/wx";
import { waitAuth } from "../../utils/wx";
import ShareCom from "../../components/common/shareCom";
import Modal from "../../components/common/modal";
import mixable from "../../utils/mixable"
import IdBaseComp from "../../components/common/idComponent";
import RemarkRefresh from "../../components/common/remarkRefresh";
import ViewImgDetail from "../../components/common/viewImgDetail"
import RewardTimer from "../../components/reward/timer"



const RewardStore = Store.RewardStore;
const CollectionStore = Store.CollectionStore;


@observer
@navable("/reward/rewardDetail")
@mixable(RemarkRefresh, IdBaseComp)
export default class RewardDetail extends React.PureComponent {

  static navProps() {
    return {
      title: "悬赏问答"
    }
  }
  constructor(props) {
    super(props)

    this.doReply = this.doReply.bind(this);
    this.doCellction = this.doCellction.bind(this);
    this.renderQuestion = this.renderQuestion.bind(this);

    this.state = {
      showAll: false,
      leftTime: "00:00:00",
      hideInifte: false,
      isShowImgDetail: false,
      imgDetailSrc: ""
    }
  }
  watchImgDetail = (src) => {
    this.setState({
      isShowImgDetail: true,
      imgDetailSrc: src
    });
  }
  componentWillUnmount() {
    clearTimeout(this.getLeftTime());
  }
  componentDidMount() {
    const wantedId = this.props.wantedId;
    waitAuth().then(() => {
      RewardStore.getRewardDetail({
        wantedId: wantedId
      }, (rs) => {
        // 开始计时
        if (!rs.closed) {
          console.log(">--------", rs.closeTime)
          this.setState({
            closeTime: rs.closeTime
          })
          // this.closeTime = rs.closeTime;
          // this.getLeftTime(rs.closeTime);
        }
      });
    });
  }
  componentShouldUpdate() {
    // 分享
    const detail = RewardStore.rewardDetail;
    Wx.wxShare({
      title: "喔喔百家",
      desc: detail.content ? detail.content : "",
      path: `/reward/rewardDetail?wantedId=${wantedId}`
    });
  }
  getLeftTime = () => {
    if (!this.closeTime) {
      return 0;
    }
    const now = new Date(Date.now()).getTime();
    const leftTime = this.closeTime - now;
    if (leftTime <= 0) {
      this.setState({
        leftTime: "00:00:00"
      })
      return null;
    }
    var leftHours = this.addNumber(Math.floor(leftTime / 1000 / 60 / 60 % 24));
    var leftMinutes = this.addNumber(Math.floor(leftTime / 1000 / 60 % 60));
    var leftSeconds = this.addNumber(Math.floor(leftTime / 1000 % 60));
    this.setState({
      leftTime: `${leftHours}:${leftMinutes}:${leftSeconds}`
    })
    if (leftTime > 0) {
      setTimeout(() => this.getLeftTime()
        , 1000);
    } else {
      clearTimeout(this.getLeftTime());
    }
  }

  addNumber = (num) => {
    var nnum = (num > 9) ? num : ("0" + num);
    return nnum;
  }

  navigateTo(path, a) {
    this.props.navigation.navTo(path, { ...a });
  }
  // 评论或者回答
  doReply = () => {
    // const detail = RewardStore.rewardDetail;
    // this.navigateTo("/disabuse/db_ask", { type: !detail.closed ? "WANTED" : "WANTED_COMMENT", billId: detail.id });
  }
  // 收藏or取消收藏悬赏
  doCellction() {
    const detail = RewardStore.rewardDetail;
    if (detail.favorite) {
      CollectionStore.delCollection({
        billType: "WANTED",
        billId: detail.id
      }, () => {
        detail.favorite = false;
      })
    } else {
      CollectionStore.doCollection({
        billType: "WANTED",
        billId: detail.id
      }, () => {
        detail.favorite = true;
      })
    }

  }
  doRefresh = (rs) => {
    if (rs) {
      // 值刷新对应的item
      return;
    }
    const wantedId = this.props.wantedId;
    RewardStore.getRewardDetail({
      wantedId: wantedId
    });
  }
  // 分享 TODO --
  doShare = () => {
    this.modal.show();
  }

  // 加载更多
  getMore() {
    const detail = RewardStore.rewardDetail;


    if (!this.state.showAll) {
      // 未展开
      if (detail.comments && detail.comments.length < detail.commentTimes) {
        // 刷新评论
        return RewardStore.getMore({
          billType: "COMMENT",
          billId: detail.id
        }).then(rs => {
          return rs;
        }).catch(err => {
          $.toast("网络错误")
          return new Promise.reject(err);
        })
      } else {
        // 没有更多了
        if (this.state.hideInifte) {
          return;
        }
        $.toast("没有更多评论了");
        this.setState({
          hideInifte: true
        });
        return null;
      }
    } else {
      // 展开
      if (detail.replies && detail.replies.length < detail.replyTimes) {
        // 刷新回答
        return RewardStore.getMore({
          billType: "WANTED_REPLY",
          billId: detail.id
        }).then(rs => {
          return rs;
        }).catch(err => {
          $.toast("请求网络失败");
          return new Promise.reject(err);
        })
      } else if (detail.comments && detail.comments.length < detail.commentTimes) {
        // 刷新评论
        return RewardStore.getMore({
          billType: "COMMENT",
          billId: detail.id
        }).then(rs => {
          return rs;
        }).catch(err => {
          $.toast("请求网络失败");
          return new Promise.reject(err);
        })
      } else {
        // 没有更多了
        $.toast("没有更多评论了");
        this.setState({
          hideInifte: true
        });
        return null;
      }
    }
  }
  renderQuestion() {
    const detail = RewardStore.rewardDetail;
    if (Object.keys(detail).length === 0) return null;
    return (
      <div className="rd_header">
        <div className="rd_header_top">
          {/* {(() => {
            if (detail.closed) {
              if (detail.replies.length === 0) {
                return <span className="fs-small fs-gray">悬赏无人回答</span>
              }
              return <span className="fs-small fs-gray"><span className="fs-gold">{`赏金已被${detail.replies[0].user ? detail.replies[0].user.nick : "热心的小喔"}领取`}</span></span>
            }
            return <span className="fs-small fs-gray">距离悬赏结束还剩：<span className="fs-gold">{this.state.leftTime}</span></span>
          })()} */}
          <RewardTimer detail={detail} closeTime={this.state.closeTime} />

          <CommonBtn isCollection={true} callback={() => this.doCellction()} collection={detail.favorite} />
        </div>
        <div className="rd_body">
          <div className="fs-big rd_title">问题：</div>
          <div className="fs-big rd_title">
            {detail ? detail.content : ""}
          </div>
          {(() => {
            if (!detail || !detail.attaches || !detail.attaches.length) return null;
            return <div className={detail.attaches.length === 4 ? "rd_imgs_4" : "rd_imgs"}>
              {detail.attaches.map((item, index) => {
                return <img src={item.path} className="rd_img" key={`img-${index}`} onClick={() => this.watchImgDetail(item.path)} />
              })}
            </div>
          })()}
        </div>
        <div className="rd_footer">
          <div className="fs-big fs-gold rd_title">{`赏金￥${detail ? detail.bounty : 0}`}</div>
          <div className="fs-small fs-gray">{`提供者：${detail && detail.user ? detail.user.nick : "热心的小喔"}`}</div>
        </div>
      </div>
    )
  }
  render() {
    const detail = RewardStore.rewardDetail;
    if (JSON.stringify(detail) == "{}") return null;

    var replies;
    if (detail.replies) {
      if (detail.replies.length > 1 && !this.state.showAll) {
        replies = [detail.replies[0]];
      } else {
        replies = detail.replies;
      }
    } else {
      replies = null;
    }
    return (
      <div className="dd_container" style={{ overflowY: "hidden" }}>
        <div className="infinite-scroll" style={{ flex: "1", overflowY: "auto" }} id={this.getId()}>
          <div className="rd_content page-content">
            {this.renderQuestion()}
            <RemarkList
              contents={replies}
              isComment={false}
              style={{ width: "100%" }}
              billType={"WANTED_REPLY"}
              navigation={this.props.navigation}
              callback={this.doRefresh}
              closed={detail.closed}
              showRole
            />
            {(() => {
              if (detail && detail.replies.length > 1) {
                return <CommonBtn
                  isFill={false}
                  style={{
                    width: "10rem",
                    height: "2.25rem",
                    marginTop: "0.5rem",
                    marginBottom: "1rem"
                  }}
                  title={this.state.showAll ? `收起所有${detail.replies ? detail.replies.length : 0}回答` : `查看所有${detail.replies ? detail.replies.length : 0}回答`}
                  callback={() => this.setState({ showAll: !this.state.showAll })}
                />
              }
              return null;
            })()}
            <RemarkList
              contents={detail ? detail.comments : null}
              style={{ width: "100%" }}
              billType={"COMMENT_REPLY"}
              navigation={this.props.navigation}
              callback={() => this.doRefresh()}
              showRole
            />
          </div>
          {
            (0, () => {
              var showStatus = (this.state.showAll && (detail.replyTimes > 10 || detail.commentTimes > 10));
              var hiddenStatus = (!this.state.showAll && (detail.commentTimes > 10));
              if (showStatus || hiddenStatus) {
                return <div className="infinite-scroll-preloader" style={this.state.hideInifte ? { display: "none" } : {}}>
                  <div className="preloader"></div>
                </div>
              }
              return null;
            })()
          }
        </div>
        {
          this.state.isShowImgDetail && <ViewImgDetail hideImg={() => { this.setState({ isShowImgDetail: false }) }}
            src={this.state.imgDetailSrc}
          > </ViewImgDetail>
        }
        {(() => {
          if (detail) {
            var title;
            if (detail.closed) {
              title = detail.comments.length > 0 ? `${detail.comments.length}评论` : "暂无评论";
            } else {
              title = detail.replies.length > 0 ? `${detail.replies.length}回答` : "暂无回答";
            }
            return <ReplyGroup
              title={title}
              replyCallBack={() => this.doReply()}
              shareCallBack={() => this.doShare()}
              isDot={false}
              detail={{
                billType: !detail.closed ? "WANTED" : "WANTED_COMMENT",
                id: detail.id,
              }}
              navigation={this.props.navigation}
            />
          }
          return null;
        })()}
        <Modal
          ref={modal => this.modal = modal}
          animateHide="none" animateShow="none"
          pos="center"
          opacity={0.9}
          zIndex={1001}
          modalStyle={{ opacity: 0.9 }}
        >
          <ShareCom callback={() => this.modal.hide()} />
        </Modal>
      </div>
    )
  }
}