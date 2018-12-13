import LinkBtn from "../common/link";

// 


class OpenVip extends React.PureComponent {
    constructor() {
        super()
    }

    renderImg() {
        return <LinkBtn onClick={this.props.onClick} className=" course-vip">
            <div className="icon-vip-btn" />
        </LinkBtn>
    }

    render() {
        return this.renderImg();
        return <div onClick={this.props.onClick} className="disp-vertical-center-center"><div className="course-vip disp-vertical-center-center">
            <svg width="100%" height="100%" viewBox={"0 0 315 45"}>
                <defs>
                    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: "#ECC89A", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#DDAF6E", stopOpacity: 1 }} />
                    </linearGradient>
                </defs>

                <polygon points={"0,0 219,0 189,45 0,45"} style={{
                    fill: "url(#gold)"
                }}>

                </polygon>
                <polygon points={"219,0 315,0 315,45 189,45"} style={{
                    fill: "#2B2B2E"
                }}>

                </polygon>
            </svg>
            <div className="disp-hor-start ">
                <a className="button disp-vertical-center intr">
                    <span>开通会员解锁所有课程</span>
                    <span>
                        <span>原价￥<em className="money text-through">322</em>/年</span>
                        <span className="fs-small">{" 超值价￥"}<em className="money">123.3</em>/年</span></span>
                </a>
                <a className="button open">立即开通</a>

            </div>
        </div></div>
    }
}

export default OpenVip;