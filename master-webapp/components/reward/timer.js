import mixable from "../../utils/mixable";
import reactTimer from "react-timer-mixin"

/**
* 悬赏倒计时 提出来
*  <>-----}|------------------------------->
* 
*/

// 

@mixable(reactTimer)
class RewardTimer extends React.PureComponent {
    constructor(props) {
        super()
        this.state = {
            leftTime: "00:00:00",
            closeTime: props.closeTime,
            refresh: this.getLeftTime
        }
    }

    componentDidMount() {
        this.getLeftTime();
    }

    static getDerivedStateFromProps(nextProps, preState) {
        if (nextProps.closeTime != preState.closeTime) {
            requestAnimationFrame(() => {
                preState.refresh();
            })

            return {
                closeTime: nextProps.closeTime
            }
        }
        return null;
    }

    addNumber = (num) => {
        var nnum = (num > 9) ? num : ("0" + num);
        return nnum;
    }


    getLeftTime = () => {
        const closeTime = this.state.closeTime
        if (!closeTime) {
            return 0;
        }

        const now = new Date(Date.now()).getTime();
        const leftTime = closeTime - now;
        if (leftTime <= 0) {
            this.setState({
                leftTime: "00:00:00"
            })
            return null;
        }
        var leftHours = this.addNumber(Math.floor(leftTime / 1000 / 60 / 60 % 24));
        var leftMinutes = this.addNumber(Math.floor(leftTime / 1000 / 60 % 60));
        var leftSeconds = this.addNumber(Math.floor(leftTime / 1000 % 60));
        this.setState({
            leftTime: `${leftHours}:${leftMinutes}:${leftSeconds}`
        })
        if (leftTime > 0) {
            this._ts = this.setTimeout(() => this.getLeftTime()
                , 1000);
        } else {
            clearTimeout(this._ts);
        }
    }

    render() {
        const { detail } = this.props;
        if (detail.closed) {
            if (detail.replies.length === 0) {
                return <span className="fs-small fs-gray">悬赏无人回答</span>
            }
            return <span className="fs-small fs-gray"><span className="fs-gold">{`赏金已被${detail.replies[0].user ? detail.replies[0].user.nick : "热心的小喔"}领取`}</span></span>
        }
        return <span className="fs-small fs-gray">距离悬赏结束还剩：<span className="fs-gold">{this.state.leftTime}</span></span>
    }
}

export default RewardTimer;

