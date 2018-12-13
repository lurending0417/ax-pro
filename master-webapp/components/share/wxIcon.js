import Modal from "../common/modal";

/**
* 展示微信公众号的图标
*  <>-----}|------------------------------->
* 
*/

// 

import wxIcon from "../../static/images/share/wowo.jpg"
import otherIcon from "../../static/images/share/share_other@3x.png";
import LinkBtn from "../common/link";
import UserStore from "../../data/stores/UserStore";

class WxIcon extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            btnText: "查看更多课程",
            title: "请关注“喔喔百家”公众号 查看更多课程",
            img: "",
            desc: "长按识别二维码"
        }
    }

    rendrContent() {

    }
    render() {
        if (UserStore.subscribe) {
            return null;
        }
        return <div className="disp-center" style={{ width: "100%", margin: "0.75rem 0 0", textAlign: "center" }}>
            <LinkBtn onClick={this.show} className="button blue-btn fs-big btn-size-big">{this.state.btnText}</LinkBtn>
            {this.renderModal()}
        </div>
    }


    renderModal() {
        return <Modal onHide={this.onHide} ref="modal">
            <div className="full disp-center">
                <div className="disp-vertical wx-icon">
                    <p>{this.state.title}</p>
                    <img className="wxicon" src={wxIcon}></img>
                    <p>{this.state.desc}</p>
                    <i onClick={this.hide} className="close close-icon"></i>
                </div>
            </div>
        </Modal>
    }

    onHide = () => {
        UserStore.refresh();
    }

    hide = () => {
        this.refs["modal"].hide();
    }

    show = () => {
        this.refs["modal"].show();
    }
}

export default WxIcon;    
