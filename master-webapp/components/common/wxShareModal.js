import { wxShare } from "../../utils/wx";
import Modal from "./modal";

/**
* 分享的modal
*  <>-----}|------------------------------->
* 
*/

// 

class WxShareModal extends React.PureComponent {
    constructor() {
        super()
    }

    componentDidMount() {
        if (this.props.title) {
            this.updateInfo({
                title: this.props.title,
                desc: this.props.desc,
                path: this.props.path,
                imgUrl: this.props.imgUrl
            })
        }
    }

    render() {
        return <Modal ref="modal" animateShow="fadeIn" animateHide="fadeOut">
            <img onClick={this.hide} src="" style={{
                position: "absolute",
                top: "15px",
                right: "15px"
            }}></img>
        </Modal>
    }

    updateInfo(opts) {
        wxShare(opts)
    }

    hide = () => {
        this.refs["modal"].hide();
    }

    show = () => {
        this.refs["modal"].show();
    }
}

export default WxShareModal;



// show(){
//     wxShare({

//     })
// }