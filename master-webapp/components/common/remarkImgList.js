import { observer } from "mobx-react"
import PropTypes from "prop-types"
import ViewImgDetail from "./viewImgDetail"
import CommonImg from "./img";
import ImgPreModal from "./imgPre";

/**
 * 评论里的图片列表显示(最多三张)
 *  <>-----}|------------------------------->
 *
 */

@observer
export default class RemarkImgList extends React.Component {

    constructor(props) {
        super();
        this.state = {
            isShowImgDetail: false,
            imgDetailSrc: ""
        }
    }

    render() {
        const { imgList } = this.props;
        return (
            <div ref="remarkList">
                <div className={imgList && imgList.length > 0 ? "img_list_wrap" : ""}>
                    {
                        imgList && imgList.map((item, index) => {
                            return (
                                <CommonImg className="img" src={item.path} alt="" key={"img" + index} onClick={() => { this.watchImgDetail(item.path) }} />
                                // <img src={item.path} alt="" key={"img" + index} onClick={() => { this.watchImgDetail(item.path) }} />
                            )
                        })
                    }
                </div>
                {
                    this.state.isShowImgDetail && <ViewImgDetail hideImg={() => { this.setState({ isShowImgDetail: false }) }}
                        src={this.state.imgDetailSrc}
                    > </ViewImgDetail>
                }
            </div>
        )
    }

    watchImgDetail(src) {
        this.props.onPreImg && this.props.onPreImg(src);
        // this.setState({
        //     isShowImgDetail: true,
        //     imgDetailSrc: src
        // });
    }



}

// [{path: ''}, {path: ''}]

RemarkImgList.propTypes = {
    // imgList: PropTypes.array
}