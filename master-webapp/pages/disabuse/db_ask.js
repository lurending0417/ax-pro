import navable from "../../components/common/nav/navable"
import Master_Avatar from "../common/master_Avatar";
import "../../static/style/index.scss";
import SpeakGroup from "../common/speakGroup";
import * as Wx from "../../utils/wx"
import { isWx, wxPay } from "../../utils/wx"
import { preImgFromFile } from "../../utils/func"
import { isIos } from "../../utils/platform"
import PropTypes from "prop-types";
import CommonBtn from "../../components/common/button/commonBtn";
import Modal from "../../components/common/modal";
import CustomPrice from "../../components/common/customPrice";
import Store from "../../data/stores"
import api from "../../api/api";
import { API_SNS_COMMENT_POST } from "../../common/api";
import ImgPreModal from "../../components/common/imgPre";
import noNameIcon from "../../static/images/icon/icon-no-name@2x.png";
import CommonAvatar from "../../components/common/commonAvatar"


const CommentStore = Store.CommentStore;
const RewardStore = Store.RewardStore;
const UserStore = Store.UserStore;
const QuestionStore = Store.QuestionStore;

@navable("/disabuse/db_ask")
export default class DB_Ask extends React.Component {

  static navProps(props) {
    const type = props.type;
    var title;
    if (!props.title)
      switch (type) {
        case "REWARD":
          title = "悬赏提问";
          break;
        case "WANTED":
          title = "悬赏回答";
          break;
        case "WANTED_COMMENT":
          title = "悬赏评论";
          break;
        case "WANTED_REPLY":
        case "MASTER":
          title = "回复";
          break;
        case "DB_ASK":
          title = "向大师提问";
          break;
        case "DB_ASK_AGAIN":
          title = "追问";
          break;
        case "QUESTION_COMMENT":
        case "QUESTION_REPLY":
          title = "解惑评论";
          break;
        case "COMMENT_REPLY":
        case "COMMENT":
          title = "评论回复";
          break;
        default:
          title = "123";
          break;
      }

    return {
      title: props.title || title
    };
  }

  static defaultProps = {
    type: "MASTER"
  }

  static propTypes = {
    // type: PropTypes.oneOf([/**大师回答*/"MASTER",/**发布悬赏*/"REWARD",/*提问*/"DB_ASK",/*悬赏回答*/"WANTED",/*悬赏回答*/"WANTED_REPLY",/*悬赏评论*/"WANTED_COMMENT",/*评论回复*/"COMMENT_REPLY"]),
    billId: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.clickToPulish = this.clickToPulish.bind(this);
    this.doReward = this.doReward.bind(this);
    this.chooseFile = this.chooseFile.bind(this);
    this.save = this.save.bind(this);

    this.imgIds = [];
    this.state = {
      giftValue: [0.01, 2, 5, 10, 50, "自定义"],
      imgArr: [],
      imgRawArr: [],
      showRecord: 1,
      status: "SPEAK_GOING",
      cost: 0.01,
      content: "",
      chooseIndex: 0,
      anon: false,
      mediaIds: ""
    }

  }

  navigateTo(path, a) {
    this.props.navigation.navTo(path, { a });
  }

  componentDidMount() {

    Wx.setUp(null, (msg) => {
      if (msg === "ready succ") {
        this.setState({
          showRecord: 1,
          status: "SPEAK_GOING"
        })
      }
    })
  }

  preImg(file) {
    const url = preImgFromFile(file);
    // var imgs = this.state.imgArr.push(url);
    console.log("url", url);
    this.save(url);
    var imgs = this.state.imgArr;
    imgs.push(url);
    this.setState({
      imgArr: imgs
    }, () => {
      console.log("iiii", this.state.imgArr);
    });
  }

  imgChoose = (e) => {
    const file = e.target.files && e.target.files[0]
    this.preImg(file);
  }

  chooseFile = () => {
    wx.chooseImage({
      count: 3 - this.state.imgArr.length, // 默认9
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: async (res) => {
        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        if (!(localIds instanceof Array)) {
          localIds = [localIds]
        }
        // 对比重复
        let repIndex = 0;
        this.state.imgRawArr.forEach(item => {
          if (repIndex = localIds.findIndex(i => i == item) > -1) {
            localIds.splice(repIndex, 1);
          }
        })
        if (isIos()) {
          const datas = await Wx.wxGetLocalImgDatas(localIds)
          this.setState({
            imgArr: [...this.state.imgArr, ...datas],
            imgRawArr: [...this.state.imgRawArr, ...localIds]
          })
        }
        else {
          this.setState({
            imgArr: [...this.state.imgArr, ...localIds],
            imgRawArr: [...this.state.imgArr, ...localIds]
          }, () => {
            // this.save(localIds);
          });
        }
      }
    });
  }
  save(rawId) {
    // if(!rawId ||!isWx()){
    //   return Promise.resolve(null);
    // }
    // debug("upload begin-"+rawId.toString())
    return new Promise((s) => {
      // 直接上传给微信
      try {
        wx.uploadImage({
          localId: rawId.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            $.toast("succ")
            var serverId = res.serverId; // 返回图片的服务器端ID
            this.imgIds.push(serverId);
            // 传给服务器
            s(serverId);
          },
          fail: (err) => {
            $.toast("fail")
            console.log(JSON.stringify(err).substr(0, 100))
          }
        });
      }
      catch (e) {
        $.toast("catch")
        console.log(e)
      }

    })

  }
  doUploadImgs = async (callback) => {
    console.log("准备上传")
    const mids = await Wx.wxUploadImgs(this.state.imgRawArr)
    console.log("上传succ-" + mids.length)

    // console.log(JSON.stringify(mids))
    callback(mids);
  }
  doReward = () => {
    // 先上传 微信 图片
    this.doUploadImgs((mids) => {
      RewardStore.postReward({
        content: this.state.content || "哈哈哈哈哈",
        mediaIds: mids.join(","),
        gateway: "WEIXIN_MP",
        bounty: this.state.cost,
        anon: this.state.anon
      }, (rs) => {
        console.log("rs", rs);
        wxPay(rs, () => {
          $.toast("支付成功")
          setTimeout(() => {
            this.props.callback && this.props.callback();
            this.props.navigation.backTo();
          }, 1000);
        });
      })
    })
  }

  deleteImg = (index) => {
    const { imgArr, imgRawArr } = this.state;
    imgArr.splice(index, 1)
    imgRawArr.splice(index, 1)

    this.setState({
      imgArr: [...imgArr],
      imgRawArr: [...imgRawArr]
    })
  }

  // 返回上一页
  //发布
  clickToPulish() {
    this.doUploadImgs((mids) => {
      const { type, billId, onSave, autoSave, amount, toReplyId, callback, detailId } = this.props;
      console.log("type", type);
      console.log("mids", mids);
      var params = {
        content: this.state.content,
        anon: this.state.anon,
        mediaIds: mids.length > 0 ? mids.join(",") : ""
      }
      if (onSave) {
        return onSave(params), this.props.navigation.backTo();
      }
      if (autoSave && this.props.billType) {
        api.request({
          url: this.props.commentApi || API_SNS_COMMENT_POST,
          method: "post",
          params: {
            ...params,
            toReplyId: toReplyId,
            billId: billId,
            billType: this.props.billType
          }
        }).then(rs => {
          $.toast(this.props.isReply ? "回复成功" : "发表评论成功")

          setTimeout(() => {
            this.props.navigation.backTo()
            requestAnimationFrame(() => {
              callback && callback(rs);
            })
          }, 500)
        })
        return;
      }
      console.log("my==========");
      if (type === "WANTED") {
        console.log("params ----> ", billId);
        // 悬赏 回答
        RewardStore.rewardReply({
          wantedId: billId,
          ...params
        }, () => {
          $.toast("回答成功");
          RewardStore.getRewardDetail({
            wantedId: billId
          }, (rs) => {
            this.props.navigation.backTo();
          });
        });
      } else if (type === "DB_ASK") {
        // 向大师提问
        QuestionStore.askQuestion({
          masterId: billId,
          gateway: "WEIXIN_MP",
          amount: amount,
          ...params
        }, (rs) => {
          wxPay(rs, () => {
            $.toast("提问成功,请在我的解惑中查看");
            setTimeout(() => {
              this.props.navigation.backTo();
            }, 2000);
          });
        })
      } else if (type === "MASTER" || type === "DB_ASK_AGAIN") {
        if (type === "MASTER") {
          // 大师回答
          this.refs.record.upload().then(rs => {
            QuestionStore.questionReply({
              questionId: billId,
              voiceId: rs,
              ...params
            }, () => {
              $.toast("回答成功");
              QuestionStore.getQuestionDetial({
                questionId: billId
              }).then(() => {
                this.props.navigation.backTo()
              });
            })
          })

          return null;
        }
        // 追问
        QuestionStore.questionReply({
          questionId: billId,
          ...params
        }, () => {
          $.toast("回答成功");
          QuestionStore.getQuestionDetial({
            questionId: billId
          }).then(() => {
            this.props.navigation.backTo()
          });
        })

      } else if (type === "WANTED_REPLY" || type === "COMMENT_REPLY" || type === "COMMENT") {
        // 评论回复 解惑回复
        var billType;
        switch (type) {
          case "WANTED_REPLY":
            billType = "WANTED_REPLY";
            break;
          case "COMMENT_REPLY":
          case "COMMENT":
            // billType = "COMMENT_REPLY";
            billType = "COMMENT";
            break;
          default:
            billType = "";
            break;
        }

        CommentStore.commentReply({
          billId: billId,
          billType: billType,
          toReplyId: toReplyId,
          ...params
        }, (rs) => {
          $.toast("回复成功")
          this.props.navigation.backTo();
          setTimeout(() => {
            callback && callback(rs);
          }, 500)


        })
      } else if (type === "WANTED_COMMENT" || type === "QUESTION_COMMENT") {
        // 悬赏解惑的评论
        var bType;
        switch (type) {
          case "WANTED_COMMENT":
            bType = "WANTED";
            break;
          case "QUESTION_COMMENT":
          case "QUESTION_REPLY":
            bType = "QUESTION";
            break;
          default:
            bType = "";
            break;
        }
        CommentStore.postComment({
          billId: billId,
          billType: bType,
          ...params
        }, () => {
          $.toast("评论成功")
          if (type === "WANTED_COMMENT") {
            RewardStore.getRewardDetail({
              wantedId: billId
            }, (rs) => {
              this.props.navigation.backTo();
            });
          } else if (type === "QUESTION_COMMENT") {
            QuestionStore.getQuestionDetial({
              questionId: billId
            }).then(() => {
              this.props.navigation.backTo()
            });
          }
        })
      }
    })
  }

  preImgs = (index) => {
    return () => {
      this.refs["picModal"].show();
      requestAnimationFrame(() => {
        this.refs["picModal"].setIndex(index);
      })
    }
  }

  renderImg() {
    return (
      <div className="ds_pic_content">
        {(() => {
          var content = [];
          this.state.imgArr.map((item, index) => {
            content.push(
              <img
                onClick={this.preImgs(index)}
                className="ds_pic_img" src={item}
                key={`add-${index}`}
              />

            )
          })
          if (this.state.imgArr.length < 3) {
            content.push(
              <div className="comment-add-img-icon" key={"add"} onClick={this.chooseFile}>
                {/*{*/}
                {/*(0,()=>{*/}
                {/*return <div name='img' onChange={this.imgChoose} accept="image/*"  className="opac0 transparent ds_pic_img" />*/}
                {/*})()*/}
                {/*}*/}
              </div>
            )
          }
          content.push(
            <ImgPreModal key="imgpre" ref="picModal" onDel={this.deleteImg} items={this.state.imgArr} getSrc={item => item} />
          )
          return content;
        })()}
      </div>
    );
  }

  selectPrice(index) {
    this.setState({
      chooseIndex: index
    });
    if (index < 5) {
      this.setState({
        cost: this.state.giftValue[index]
      })
    } else {
      this.modal.show();
    }
  }

  // 判断时候为大师回复(大师带Header)
  renderHeader() {
    return null;
    const type = this.props.type;
    if (type !== "MASTER") return null;
    return <div className="ds_mastar">
      <Master_Avatar className="ds_mastar" />
    </div>
  }
  renderBottom() {
    const { type, amount } = this.props;
    if (type !== "REWARD") {
      return <div className="ds_bottom">
        <CommonBtn
          className={"fs-big theme-bold letter-space-2"}
          title={amount ? `确认发布(￥${amount})` : "确认发布"}
          isFill
          style={{
            color: "white",
            height: "2.25rem",
            width: "9.25rem"
          }}
          callback={() => this.clickToPulish()}
        />
      </div>
    }
    return <div className="ds_reward_bottom">
      <span className="gift_title fs-normal">
        {"选择悬赏金额:"}
        {this.state.cost > 0 ? <span className="fs-gold">{this.state.cost}</span> : null}
      </span>
      <ul>
        {
          this.state.giftValue.map((item, index) => {
            return (
              <li key={index + "giftItem"}
                className={["fs-normal", this.state.chooseIndex === index ? "choose_gift_item" : ""].join(" ")}
                onClick={() => this.selectPrice(index)}
              >
                {item === "自定义" ? "自定义" : `${item}元`}
              </li>
            )
          })
        }
      </ul>
      <div className="sure_btn_wrap">
        <button className="sure_btn_cls" onClick={this.doReward}>确认发布</button>
      </div>
    </div>
  }
  render() {
    const type = this.props.type;
    const mh = { position: "relative" }
    if (type == "REWARD") {
      mh.minHeight = "26.5rem"
    }
    return (
      <div className="full" style={{ position: "fixed", paddingTop: "2.2rem" }}>
        <div className="ds_content" style={mh}>
          {this.renderHeader()}
          <div className="ds-top">
            <div className="ds_in border-round">
              <textarea type="text" className="ds_input fs-normal" maxLength={200} onChange={e => this.setState({ content: e.target.value })} />
              {this.renderImg()}
              <div className="ds_limit_txt fs-small">{`${this.state.content.length}/200`}</div>
            </div>
          </div>

          <div className="h-line" />
          {(() => {
            if (type === "MASTER") {
              return <SpeakGroup ref="record" />;
            }
            return (
              <div className="ds_item">
                <div className="ds_item_user">
                  <CommonAvatar className="ds_item_user_icon" src={!this.state.anon && UserStore.avatar ? UserStore.avatar : noNameIcon}></CommonAvatar>
                  {/* <div className="ds_item_user_icon">
                    {
                      (0, () => {
                        if (!this.state.anon && UserStore.avatar)
                          return <CommonAvatar src={UserStore.avatar}></CommonAvatar>
                        return <img className="w100" src={noNameIcon}></img>;
                      })()
                    }
                  </div> */}
                  <div className="ds_item_user_name fs-big">{this.state.anon ? "热心的小喔" : UserStore.nick}</div>
                </div>
                <div className="ds_item_user" onClick={() => this.setState({ anon: !this.state.anon })}>
                  <div className="ds_item_user_tip fs-small">匿名</div>
                  <label className="label-switch">
                    <input type="checkbox" />
                    <div className="checkbox"></div>
                  </label>
                </div>
              </div>
            )
          })()}
          {this.renderBottom()}
          <Modal
            ref={modal => this.modal = modal}
            animateHide="none" animateShow="none"
            pos="center"
          >
            <CustomPrice
              closeBack={
                () => this.modal.hide()
              }
              callback={
                (price) => {
                  this.setState({
                    cost: price
                  });
                  this.modal.hide();
                }
              }
            />
          </Modal>
        </div>
      </div>

    );
  }
}

