// 

import util from "../../utils/renderUtil"
import CommonImg from "../common/img";

let ch = 375;
if (process.browser) {
    ch = window.screen.availWidth;
}

class HomeCourse extends React.PureComponent {
    static defaultProps = {
        rounded: true,
        padding: 30
    }



    constructor(props) {
        super()
        ch = ch - props.padding;
        this.state = {
            height: (ch * 150 / (375)) + "px"
        }
    }
    componentDidMount() {
        requestAnimationFrame(() => {
            const ch = document.body.clientWidth;
            console.log("width>" + document.body.clientWidth + ",w>" + window.screen.availWidth)
            console.log("height>" + ch)
            const ah = ((ch) * 150 / (375)) + "px";
            console.log("height ah>" + ah)
            this.setState({
                height: ah
            })
        })

    }

    toCourse = () => {
        if (this.props.onClick) {
            return this.props.onClick();
        }
        if (Math.random() > 0.5)
            return this.props.navigation.navTo("/course/one")
        this.props.navigation.navTo("/course/group")
    }

    render() {
        const style = {
            height: this.state.height,
            minHeight: this.state.height
        }
        if (!this.props.rounded) {
            style.borderRadius = 0;
        }
        const tag = util.renderCourseTag(this.props.tag)
        return <div ref="container" onClick={this.toCourse} style={style} className="home-course-banner theme-radius">
            <img src={this.props.src} />
            {
                (0, () => {
                    if (tag) {
                        return <div className={`tag ${tag == "免费课程" ? "tag-blue" : ""} ${tag == "限时折扣" ? "tag-yellow" : ""}`}>
                            <em>{tag}</em>
                        </div>
                    }
                })()
            }
            {
                (0, () => {
                    if (this.props.time) {
                        return <span className="home-course-time btn-cycle" >{this.props.time}</span>
                    }
                })()
            }
        </div>
    }
}

export default HomeCourse;