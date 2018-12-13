import Introduce from "../master/introduce";
import CommonBtn from "../common/button/commonBtn";
import PropTypes from "prop-types";
import Avactar from "../../components/common/avactar"
import { dateUtil } from "../../utils";
import ViewImgDetail from "../../components/common/viewImgDetail";
import CommonImg from "../common/img";

export default class DB_QUESTIONGROUP extends Introduce {
  constructor(props) {
    super(props);
    this.state = {
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
    if (this.props.isPeed) {
      return (
        <div className="dd_collection">
          <CommonBtn
            isCollection={true}
            collection={detail.favorite}
            callback={this.props.collectionBack}
          />
          <p className="dd_collection_txt fs-small">
            {dateUtil.formatTimeToText(detail.createTime)}
          </p>
        </div>
      );
    }
    return <div className="fs-small fs-gray dd_collection" style={{
      float: "right",
      flex: "1",
      textAlign: "right",
      alignSelf: "stretch",
      paddingTop: ".25rem"
    }}>
      {dateUtil.formatTimeToText(detail.createTime)}
    </div>
  }
  renderBody() {
    return <div key="body" className="ubody ms_item_content fs-small">
      {this.renderBodyText()}
      {this.renderImgs()}
    </div>
  }
  renderImgs() {
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
  // 取消单独名字
  renderName() {
    return null;
  }
  renderAvator() {
    const user = this.props.user;
    return <Avactar user={user ? user : null} />
  }
  renderMain(children) {
    return <div className="umain ms_full" style={{ backgroundColor: "white" }}>
      {children}
      {
        this.state.isShowImgDetail && <ViewImgDetail hideImg={() => { this.setState({ isShowImgDetail: false }) }}
          src={this.state.imgDetailSrc}
        > </ViewImgDetail>
      }
    </div>
  }
}

DB_QUESTIONGROUP.propTypes = {
  isPeed: PropTypes.bool,
  isVip: PropTypes.bool,
  avatar: PropTypes.string,
  user: PropTypes.object
}

DB_QUESTIONGROUP.defaultProps = {
  isPeed: true,
  isVip: false,
  isMaster: false
}
