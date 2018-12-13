/**
* show hide 空白hide
*  <>-----}|------------------------------->
* 
*/



// pos top left right bottom
import PropTypes from "prop-types"
import AnimatedDiv from "./animtedDiv"
import mixable from "../../utils/mixable"
import timeMix from "react-timer-mixin"

import ReactDom from "react-dom"

let _modalIndex = 3000;

@mixable(timeMix)
class Modal extends React.PureComponent {
    constructor(props) {
        super()
        this.state = {
            visible: (("visible" in props) ? props["visible"] : false) ? 1 : 0,
            rawV: props["visible"],
            zIndex: props.zIndex || _modalIndex
        }
    }

    static getDerivedStateFromProps(nextProps, preState) {
        if ("visible" in nextProps) {
            let v = 0;
            if (nextProps["visible"] != preState.rawV) {
                if (nextProps["visible"]) {
                    v = 1
                }
                else {
                    v = 2;
                }
                return {
                    visible: v
                }
            }

        }
        return null;
    }

    static defaultProps = {
        animateShow: "fadeIn",
        animateHide: "fadeOut",
        pos: "bottom",
        opacity: .8,
        showModal: true
    }

    render() {
        let style = {
            display: this.state.visible ? "flex" : "none",
            alignItems: "stretch",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: this.state.zIndex
        }
        const modalStyle = Object.assign({ flex: 1 }, this.props.modalStyle);

        this.state.rawV = this.props.visible;

        const { pos, animateShow, animateHide, showModal, isInner } = this.props;
        switch (pos) {
            case "bottom": {
                style.flexDirection = "column"
                style.justifyContent = "flex-end"
            }
                break;
            case "center": {
                style.flexDirection = "column"
                style.justifyContent = "center"
            }
                break;
        }
        if (showModal) {
            modalStyle.backgroundColor = "black"
            modalStyle.opacity = this.props.opacity || .3
        }

        style = Object.assign({}, style, this.props.style)

        const content = <AnimatedDiv style={style} animateWay={this.state.visible == 2 ? animateHide : animateShow} animated={this.state.visible}>
            <div onTouchMove={this.onTouchMove} onClick={this.hide} style={modalStyle}></div>
            {this.props.children}
        </AnimatedDiv>
        if (isInner || !process.browser || !document || !document.querySelector("#modal"))
            return content
        return ReactDom.createPortal(content, document.querySelector("#modal"))
    }

    onTouchMove = e => {
        e.stopPropagation();
        e.nativeEvent.preventDefault();
    }

    show = () => {
        this.ts = Date.now();
        this.setState({
            visible: 1,
            zIndex: this.props.zIndex ? this.props.zIndex : _modalIndex++
        })
    }

    hide = () => {
        if (this.state.visible != 1) {
            return;
        }
        if (this.ts && Date.now() - this.ts < 1000) {
            // 避免误触
            return;
        }

        this.setState({
            visible: 2
        })

        this.props.onHide && this.props.onHide();


        this.setTimeout(() => {
            this.setState({
                visible: 0
            })
        }, 1000);

    }
}

Modal.propTypes = {
    animateShow:/**显示动画 animate.css*/PropTypes.string,
    animateHide:/**隐藏动画 animate.css*/PropTypes.string,
    pos: PropTypes.string,
    showModal: PropTypes.bool,
    visible: PropTypes.bool
}
export default Modal;