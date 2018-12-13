/**
 * 评论的内容
 *  <>-----}|------------------------------->
 *
 */

import Introduce from "./introduce"
import Avactar from "../common/avactar"
import speakIcon from "../../static/images/icon/speak-icon.gif";
import voiceIcon from "../../static/images/icon/icon-voice-static@2x.png";
import { dateUtil } from "../../utils";
import ViewImgDetail from "../../components/common/viewImgDetail";
import CommonImg from "../common/img";

export default class QuestionComment extends Introduce {
  constructor(props) {
    super(props);
    this.state = {
      icon: voiceIcon,
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
  renderHeaderPlugin() {
    const detail = this.props.detail;
    return <div className="fs-small fs-gray" style={{
      float: "right",
      flex: "1",
      textAlign: "right",
      alignSelf: "stretch",
      paddingTop: ".25rem"
    }}>{dateUtil.formatTimeToText(detail.createTime)}</div>
  }


  renderBody() {
    const detail = this.props.detail;
    return <div key="body" className="ubody ms_item_content fs-small">
      {this.renderBodyText()}
      {detail.voicePath ? this.renderVoice() : null}
      {this.renderImgs()}
    </div>
  }
  renderImgs = () => {
    const detail = this.props.detail;
    if (!detail.attaches || !detail.attaches.length) return null;
    return <div className={detail.attaches.length === 4 ? "rd_imgs_4" : "rd_imgs"}>
      {(() => {
        return detail.attaches.map((item, index) => {
          if (index < 9) {
            return <CommonImg src={item.path} className="rd_img" key={`img-${index}`} onClick={() => this.watchImgDetail(item.path)} />
            // return <img src={item.path} className="rd_img" key={`img-${index}`} onClick={() => this.watchImgDetail(item.path)} />
          }
        })
      })()}
    </div>
  }
  renderHeader() {
    const detail = this.props.detail;
    return <div key="head" className="uheader ms_item_header">
      <Avactar user={detail.user ? detail.user : null} />
      {this.renderHeaderPlugin()}
    </div>
  }
  playMedia = () => {
    const detail = this.props.detail;
    if (this.media.paused) {
      this.media.play();
      this.setState({
        icon: speakIcon
      })

      setTimeout(() => {
        this.setState({
          icon: voiceIcon
        })
      }, detail.voiceDuration * 1000);
    } else {
      this.media.pause();
      this.setState({
        icon: voiceIcon
      })
    }
  }
  renderVoice() {
    const detail = this.props.detail;
    return <div className={detail.content.length > 0 ? "dd_top" : null} style={{margin: ".25rem 0"}}>
      <div className="dd_btn" style={{ width: `${3 + (detail.voiceDuration * 3.5 / 60)}rem` }} onClick={this.playMedia}>
        <audio autoLoad ref={media => this.media = media} src={detail.voicePath}></audio>
        <img className="dd_voice_icon" src={this.state.icon} />
        <p className="dd_voice_txt fs-small">{`${detail.voiceDuration}s`}</p>
      </div>
      {detail.voiceRecognition ? <p className="dd_voice_tip fs-small">{`译: ${detail.voiceRecognition}`}</p> : null}
    </div>


  }
  renderMain(children) {
    return <div className="ri_main">
      <div className="border-round ms_card_item" style={{ padding: "0 0.5rem .25rem", margin: "0 0 .5rem", width: "100%" }} onClick={this.props.callBack}>
        {children}
        {
          this.state.isShowImgDetail && <ViewImgDetail hideImg={() => { this.setState({ isShowImgDetail: false }) }}
            src={this.state.imgDetailSrc}
          > </ViewImgDetail>
        }
      </div>
    </div>
  }

}
