/**
 * 悬赏Item组件
 */
class RewardItem extends React.PureComponent {
    constructor() {
        super()
    }

    render() {
        return <div className="card color-default">
            <div valign="bottom" className="card-header color-white no-border no-padding">
                <img className="card-cover"
                     style={{ padding: "1rem 1rem 0" }}
                     src="//gd1.alicdn.com/bao/uploaded/i1/TB1kzlgHVXXXXbtXpXXXXXXXXXX_!!0-item_pic.jpg_640x640.jpg"
                     alt=""/>
            </div>
            <div className="card-content">
                <div className="card-content-inner">
                    <div className="row" style={{ lineHeight: "1.35rem" }}>
                        <div className="col-40">
                            课程名称
                        </div>
                        <div className="col-5">&nbsp;</div>
                        <div className="col-33">
                            <div className="button button-warning">系列精选</div>
                        </div>
                        <div className="col" style={{ textAlign: "right" }}>
                            ¥1000
                        </div>
                    </div>
                    <p>课程介绍 balabalabala</p>
                    <div style={{ textAlign: "right" }}>
                        <span className="icon icon-message"></span>
                        <span style={{ marginRight: "0.4rem" }}> 54 </span>
                        <span className="icon icon-star"></span>
                        <span style={{ marginRight: "0.4rem" }}> 4 </span>
                        <span className="icon icon-share"></span>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default RewardItem;