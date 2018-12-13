import Link from "../../components/common/link"
import UserStore from "../../data/stores/UserStore";

// 

class VideoBuy extends React.Component {
    constructor() {
        super()
        this.state = {
            isAudio: false
        }
    }
    render() {
        const store = this.props.store;
        const opendVip = UserStore.vip;
        const buyed = store.playAble;

        if (buyed) {
            return null;
        }
        return <div className="pays-v disp-vertical-center" style={{
            height: 240
        }}>
            <p>开通会员解锁所有课程</p>
            <div className="pays-btn" onClick={() => { console.log("clicked") }}>
                {
                    (0, () => {
                        if (!buyed && !opendVip) {
                            return <Link onClick={this.buySection} className="button btn-size-normal gold-border-btn">单集课程￥{store.sectionPrice}</Link>
                        }
                    })()
                }
                {
                    (0, () => {
                        if (!opendVip) {
                            return <Link onClick={this.openVip} className="button btn-size-normal gold-btn">开通会员</Link>
                        }
                    })()
                }


            </div>
        </div>
    }

    switch = () => {
        this.setState({
            isAudio: !this.state.isAudio
        })
    }

    openVip = () => {
        this.props.openVip();
    }

    buySection = () => {
        this.props.buySection(this.props.store)
    }
}

export default VideoBuy;