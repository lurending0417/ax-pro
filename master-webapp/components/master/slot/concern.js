import Link from "../../common/link"
import api from "../../../api/api";
import { API_FOLLOW } from "../../../common/api";
import { fire, on } from "../../../utils/notify"

// 

class Concern extends React.PureComponent {
    constructor(props) {
        super()
        this.state = {
            followTimes: (props.detail || {})["followTimes"] || 0,
            follow: (props.detail || {})["follow"] || false,
            concern_only_number_able: props.concern_only_number_able ? true : false
        }
    }

    componentDidMount() {
        this.unNo = on("MasterConcern", this.refresh)
    }

    refresh = (newItem, obj) => {
        // 已经卸载
        if (!this._reactInternalInstance) {
            return
        }
        if (this == obj) return;
        if (this.props.detail.id == newItem.id) {
            this.props.detail.follow = newItem.follow;
            this.setState({
                follow: newItem.follow,
                followTimes: newItem.followTimes
            })
        }
    }

    static getDerivedStateFromProps(props, preState) {
        if (props.detail && props.detail.followTimes && props.detail.followTimes > preState.followTimes) {
            return {
                followTimes: props.detail.followTimes
            }
        }
        return null;
    }

    render() {
        const detail = this.props.detail || {};
        return <div className="ma-p-concern">
            {
                this.state.concern_only_number_able === false &&
                <Link className={(this.state.follow || this.props.isGray ? "gray-btn-gold" : "gold-border-btn") + " btn-size-normal button button-round theme-bold "} onClick={this.concern}>{this.state.follow ? "已" : ""}关注</Link>
            }
            <span className="fs-bold fs-gold"
            >
                {this.state.followTimes || "很多"}人关注</span>
        </div>
    }

    concern = () => {
        const detail = this.props.detail;
        if (detail && detail.id)
            api.request({
                url: API_FOLLOW,
                method: this.state.follow ? "DELETE" : "POST",
                params: {
                    masterId: detail.id
                }
            }).then(() => {
                $.toast(this.state.follow ? "取关成功" : "关注成功")

                if (this.props.onConcern) {
                    return this.props.onConcern(detail);
                }

                this.setState({
                    followTimes: this.state.followTimes + (this.state.follow ? -1 : 1),
                    follow: !this.state.follow
                })
                detail.follow = !detail.follow;

                // 可能要刷新 列表的数据
                fire("MasterConcern", detail, this)
            })
        else {
            $.toast("数据不对呢")
        }
    }
}

export default Concern;