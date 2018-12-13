/**
* 不压缩图片
*  <>-----}|------------------------------->
* 
*/

/**
* 通用头像 直接用div 包含img
*  <>-----}|------------------------------->
* 
*/

import PropTypes from "prop-types"
import ImgPreModal from "./imgPre";
import mixable from "../../utils/mixable";
import TimeMix from "react-timer-mixin"

@mixable(TimeMix)
class CommonImg extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            byHeight: -1,
            mH: 0,
            mW: 0
        }
    }

    componentDidMount() {
        // 首页 渲染  可能不会触发 onload
        if (this.img.complete) {
            this.setTimeout(() => {
                this.onLoad({ target: this.img });
            }, 100)

        }
    }

    genRef = ref => this.img = ref

    render() {
        const { src, pos, className, canPre, preImgs, imgClass, imgStyle, cached, ...other } = this.props;
        const st = {
            width: this.state.byHeight == "-1" ? "100%" : (this.state.byHeight ? "auto" : "100%"),
            height: this.state.byHeight == "-1" ? "100%" : (this.state.byHeight ? "100%" : "auto"),
            borderRadius: "0",
            marginLeft: "-" + this.state.mW,
            marginTop: "-" + this.state.mH
        }

        return <div className={className} {...other}>
            <div className={imgClass} style={Object.assign({ width: "100%", height: "100%", overflow: "hidden" }, imgStyle)}>
                <img ref={this.genRef} onClick={this.preImg} style={st} onLoad={this.onLoad} src={src}></img>
            </div>
            {this.props.children}
        </div>
    }

    preImg = () => {
        const { src, canPre, preImgs } = this.props;
        if (!canPre) {
            return;
        }

        // this.refs.preImg.show()
    }

    onLoad = e => {

        setTimeout(() => {
            this.reRender(this.img)
        }, 50)
    }

    reRender = (e) => {
        if (!e) {
            return;
        }
        let { naturalWidth, naturalHeight, width, height } = e
        if (this.props.cached) {
            width = this.width || width;
            height = this.height || height;
        }

        console.log("w>" + this.width + ">" + width)
        console.log("w>" + this.height + ">" + height)
        console.log($(this.img).offset())

        this.width = this.width || width;
        this.height = this.height || height;

        console.log(naturalWidth + "-" + naturalHeight + "-" + width + "-" + height)
        if (!naturalHeight || !naturalWidth) {
            // 没有图片
            return;
        }

        // 已经加载 完成  再次渲染 有bug
        if (naturalHeight < naturalWidth) {
            let ah = this.props.pos * ((naturalWidth * height / naturalHeight) - height);
            ah = ah > 100 ? "50%" : ah + "px";
            this.setState({
                byHeight: true,
                mH: 0,
                mW: ah//((naturalWidth * height / naturalHeight) - height) * this.props.pos
            })
        }
        else {
            let aw = this.props.pos * ((naturalHeight * width / naturalWidth) - width)
            aw = aw > 100 ? "50%" : aw + "px";
            this.setState({
                byHeight: false,
                mW: 0,
                mH: aw//((naturalHeight * width / naturalWidth) - width) * this.props.pos
            })
        }
    }
}


CommonImg.proptTypes = {
    src: PropTypes.string,
    pos: PropTypes.number,
    cached: PropTypes.bool
}

CommonImg.defaultProps = {
    pos: 0.5
}

export default CommonImg;


