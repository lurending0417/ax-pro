/**
 * header button-tabs
 *  <>-----}|------------------------------->
 *
 */
import PropTypes from "prop-types"
import AnimDiv from "./animtedDiv"
import ReactDom from "react-dom"
import { reaction } from "mobx";
import { isIos } from "../../utils/platform";


const top = "2.2rem";
class CommHeaders extends React.PureComponent {
    constructor(props) {
        super()
        this.state = {
            _cached: {},
            index: props.index || 0,
            animted: false,
            fixed: false
        }

        this._Top = props.top || top;
    }

    componentDidMount() {
        if (process.browser) {
            this._Top = this.props.top || top;
            this._top = (+(this._Top).slice(0, -3)) * (+$("html").css("font-size").slice(0, -2))
        }
    }

    static propTypes = {
        // headers: PropTypes.array.isRequired,
        renderChild: PropTypes.func,
        onChange: PropTypes.func,
        isVertical: PropTypes.bool,
        isCached: PropTypes.bool
    }

    static defaultProps = {
        isCached: true,
        isVertical: false,
        isTextGold: true
    }

    getText = (item) => {
        return this.props.getText && this.props.getText(item) || item
    }

    headerChange = (item, index) => {
        // console.log("from Click")
        return this.activeTab(item, index, "FromClick");
    }

    activeTab = (item, index, direction = "FromClick") => {
        return () => {
            if (this.state.index != index) {
                this.setState({
                    index: index,
                    fixed: direction == "FromClick" && index ? true : this.state.fixed
                })

                if (this.props.onChange) {
                    process.nextTick(() => {
                        this.props.onChange(index, item)
                    })
                }
            }


            // console.log("click >" + direction)

            if (this.props.isVertical && direction == "FromClick") {
                // console.log("click scroll")
                requestAnimationFrame(() => {
                    const el = this.refs["cont-" + index];
                    const dl = el//ReactDom.findDOMNode(el);
                    // dl.scrollIntoView();

                    // 不检测滚动
                    this.notCheckScroll = true;
                    $(dl).scrollTo({
                        toT: dl,
                        rand: 20,
                        callback: () => {
                            // console.log("f")
                            this.notCheckScroll = false;
                        }
                    })
                })

            }


        }
    }

    renderChild = (item, iindex) => {
        const { renderChild } = this.props;
        const { _cached, index } = this.state;
        if (!renderChild) return null;

        if (_cached[iindex] && this.props.isCached)
            return _cached[iindex]
        if (iindex == index || !this.props.isCached) {
            const cmp = renderChild(item, iindex);
            _cached[iindex] = cmp;
            return cmp;
        }

        return null;
    }

    renderHeader(props = {}) {
        const { headers, data, headerStyle, blockStyle, renderChild, onChange, getText, className, isCached, isVertical, isTextGold, headerIndex, ...others } = this.props
        return <div className={headerIndex ? "buttons-tab buttons-index" : "buttons-tab"} {...props}>
            {
                headers.map((item, iindex) => {
                    return <a key={"header" + iindex} onClick={this.headerChange(item, iindex)}
                        className={"tab-link button" + (this.state.index == iindex ? (" active") : "")}>
                        <span className={isTextGold ? "gold" : ""}>
                            {this.getText(item)}
                            {(0, () => {
                                if (item.badge) {
                                    return <label style={{ marginLeft: "5px" }} className=" fs-smaller">{item.badge}</label>
                                }
                                return null;
                            })()}
                        </span>
                        <span></span>
                    </a>
                })
            }
        </div>
    }

    render() {
        // return null;
        const { headers, renderChild, headerStyle, headerIndex, blockStyle, onChange, getText, className, isCached, isVertical, isTextGold, ...others } = this.props
        const { index } = this.state;
        return <div ref="headers"
            className={["p-headers", this.props.isVertical ? " vertical" : "", className].filter(Boolean).join(" ")} {...others}>
            {this.renderHeader()}
            {
                (0, () => {
                    if (this.state.fixed && this.props.isVertical) {
                        return this.renderHeader({
                            style: {
                                position: "fixed",
                                top: this._Top,
                                left: 0,
                                paddingTop: ".45rem",
                                width: "100 %"
                            }
                        })
                    }
                    return null;
                })()
            }
            {
                (0, () => {
                    if (this.props.renderChild) {
                        return <div className={this.props.blockHidden ? "" : "content-block"} style={this.props.blockStyle}>
                            <div style={{ display: "block" }} onScroll={this.checkScroll}>
                                {
                                    headers.map((item, iindex) => {
                                        return this.renderTab(item, iindex, index)
                                    })
                                }
                            </div>
                        </div>
                    }
                })()
            }

        </div>
    }

    renderTab = (item, iindex, index) => {
        if (this.props.isVertical) {
            return <div style={{ display: "block" }} ref={"cont-" + iindex} key={"tab-i" + iindex}
                className={(index == iindex ? "active" : "")}>
                {this.renderChild(item, iindex)}
            </div>
        }

        return <AnimDiv ref={"cont-" + iindex} key={"tab-i" + iindex} animted={index == iindex}
            className={"tab " + (index == iindex ? "active" : "")}>
            {this.renderChild(item, iindex)}
        </AnimDiv>
    }

    judgeCenter(d) {
        const el = this.refs["cont-" + (d)]
        if (!el) {
            return false;
        }
        const dl = ReactDom.findDOMNode(el);
        const rect = dl.getBoundingClientRect()
        const ch = document.body.clientHeight;
        // console.log(rect)
        // // 中心点
        if (rect.top > 0 && rect.top < (ch / 2)) {
            // console.log(3)
            this.activeTab(this.props.headers[d], d, "FromScroll")();
            return true;
        }
        //
        // // 可视范围
        // let viewH = 0;
        // if (rect.y < 0) {
        //     viewH = rect.height + rect.y
        //     if (viewH > (ch / 2)) {
        //         this.activeTab(this.props.headers[d], d)();
        //         return true;
        //     }
        // }
        // if (rect.top > 0 && rect.top < 100) {
        //     this.activeTab(this.props.headers[d], d)();
        //     return true;
        // }

        let viewH = 0;
        if (rect.top < 0) {
            viewH = rect.height + rect.top
            if (viewH > (ch / 2)) {
                // this.setState({ index: d })
                // console.log(4)
                this.activeTab(this.props.headers[d], d, "FromScroll")();
                return true;
            }
        }
        return false;
    }

    checkScroll = () => {
        // console.log("from scroll>" + this.notCheckScroll)
        // return;
        if (this.notCheckScroll) {
            return;
        }
        // 获取当前 index 的上下 index
        if (this.state.index == 0) {
            // 检测固定
            const dl = ReactDom.findDOMNode(this.refs.headers);
            const rect = dl.getBoundingClientRect();
            // console.log(rect.top);
            // console.log(this._top);
            if (rect.top <= this._top) {
                // console.log(1)
                if (!this.state.fixed)
                    this.setState({
                        fixed: true
                    })
            }
            else if (this.state.fixed) {
                // console.log(2)
                this.setState({
                    fixed: false
                })
            }
        }
        if (!this.props.isSingle) {
            if (!this.judgeCenter(this.state.index))
                if (!this.judgeCenter(this.state.index - 1)) {
                    this.judgeCenter(this.state.index + 1)
                }
        }

    }
}

export default CommHeaders;