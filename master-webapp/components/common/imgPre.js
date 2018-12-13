
import { fire, on } from "../../utils/notify"
import Modal from "./modal";
import Header from "./nav/header"
import ReactDom from "react-dom"
import mixable from "../../utils/mixable";
import ReactTimer from "react-timer-mixin"

const _id = 0;

@mixable(ReactTimer)
export default class ImgPreModal extends React.PureComponent {
    constructor(props) {
        super(props);


        this.state = {
            inited: 0,
            index: props.index || 0,
            items: props.items,
            refresh: this.init
        }

        this.unDel = on("del-pic", () => {
            console.log("fired")
            this.state.items.splice(this.state.index, 1)
            this.setState({
                items: [...this.state.items]
            })
            this.props.onDel(this.state.index);
        })
    }

    static defaultProps = {
        hideDel: false,
        items: []
    }

    componentWillUnmount() {
        this.unDel();
    }

    init = () => {
        if (this.state.inited) {
            return;
        }
        if (this.state.inited === false) {
            $.reinitSwiper(ReactDom.findDOMNode(this.refs["modal"]))
        }
        this.state.inited = true;
        if (!this._swiper)
            this._swiper = $.swiper($(this.refs["swiper"]), {
                onSlideChangeEnd: s => {
                    this.setIndex(s.activeIndex)
                }
            });
    }

    setIndex = (index) => {
        if (this._swiper && this._swiper.activeIndex != index) {
            this._swiper.slideTo(index)
        }
        this.setState({
            index: index
        })
    }


    static getDerivedStateFromProps(nextProps, preState) {
        if (preState.items != nextProps.items) {
            requestAnimationFrame(preState.refresh)
            return {
                inited: false,
                items: nextProps.items
            }
        }

        return null;
    }

    renderScroll() {
        return <div ref="swiper" className="pm-scroll swiper-container" data-space-between='10' data-loop="true">
            <div className="swiper-wrapper">
                {
                    this.state.items.map((item, index) => {
                        const src = this.props.getSrc && this.props.getSrc(item) || item
                        return <div key={"swiper-" + index} className="swiper-slide">
                            <img style={{ maxWidth: "100%" }} src={src}></img>
                        </div>
                    })
                }
            </div>
        </div>
    }

    renderDel = () => {

        if (this.props.renderDel) {
            return this.props.renderDel();
        }
        return <div onClick={this.delClick} className="delete-icon pm_nav_right"></div>
    }

    renderHide = () => {
        return <a className="button button-link button-nav pull-left" onClick={this.hide}>
            <i className="icon icon-back"></i>
        </a>
    }

    render() {
        return <Modal animateShow="fadeIn" animateHide="fadeOut" ref="modal" pos="center">
            <Header title={`${this.state.index + 1}/${this.state.items.length}`} rightBtn={this.renderDel} leftBtn={this.renderHide} />
            {this.renderScroll()}
        </Modal>
    }

    delClick = () => {
        this.props.onDel && this.props.onDel(this.state.index)
    }

    show = (index) => {
        this.refs["modal"].show()

        requestAnimationFrame(this.init)
        if (typeof index == "number") {
            this.setTimeout(() => {
                this.setIndex(index)
            }, 100)
        }
    }
    hide = () => this.refs["modal"].hide()
}