import Store from "../../../data/stores/"
import { observer } from "mobx-react";
import MessageStore from "../../../data/stores/message"

@observer
export default class Footer extends React.Component {

    constructor(props) {
        super();
        if (Store.tab.currentIndex == -1) {
            Store.tab.currentIndex = props.index
        }
        this.index = props.index;
        this.ts = 0;

        this.state = {
            isNone: false
        }
    }


    render() {
        // console.log("footer render--" + Store.tab.currentIndex + "--pi-" + this.props.isVisible)
        const index = Store.tab.currentIndex;
        if (this.props.isVisible) {
            this.state.isNone = false;
        }
        const style = { position: "fixed", bottom: 0, animationDuration: ".35s" }
        if (this.state.isNone) {
            style.display = "none"
        }

        return <div className={"bar bar-tab footer animated " + (this.props.isVisible ? "slideInUp" : "slideOutDown")}
                    style={style}>
            {
                Store.tab.tabs.map((tab, tindex) => {
                    return <a onClick={this.onClick(tindex, tab.href, tab)} key={"tab" + tindex}
                              className={"external tab-item" + (index == tindex ? " active" : "")}>
                        <i className={"icon " + tab.cls}></i>
                        <span className="tab-label">{tab.title}</span>
                        {
                            (0, () => {
                                if (tindex === 3 && MessageStore.newMessageCount && MessageStore.newMessageCount.total > 0) {
                                    /*return <span className="badge">{tab.badge}</span>*/
                                    return <span className="badge"
                                                 style={{
                                                     minWidth: 0,
                                                     height: "0.5rem",
                                                     width: "0.5rem",
                                                     left: "55%",
                                                     padding: 0,
                                                     top: "0.3rem",
                                                     border: "0.05rem solid #FFFFFF"
                                                 }}></span>
                                }
                                return null;
                            })()
                        }
                    </a>
                })
            }
        </div>
    }

    componentDidUpdate() {
        if (!this.state.isNone && !this.props.isVisible) {
            clearTimeout(this.ts)
            this.ts = setTimeout(() => {
                this.setState({
                    isNone: true
                })
                this.ts = null;
            }, 250)
        }
        if (this.props.isVisible && this.ts) {
            clearTimeout(this.ts);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.ts);
    }

    onClick(index, href, tab) {
        return (e) => {
            // 别点太快
            if (this.ts && Date.now() - this.ts < 500) {
                return;
            }
            this.ts = Date.now();
            if (Store.tab.currentIndex == index)
                return;
            Store.tab.setIndex(index);
            e.stopPropagation();
            e.preventDefault();
            e.nativeEvent.stopImmediatePropagation();
        }
    }
}