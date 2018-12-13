/**
* 带close icon 的modal
*  <>-----}|------------------------------->
* 
*/

import Modal from "./modal"
import LinkBtn from "./link"

class CloseModal extends React.PureComponent {
    constructor() {
        super()
    }
    render() {
        const { ...others } = this.props;
        return <Modal pos="center" {...others} ref={ref => this.modal = ref}>
            <div className="full disp-vertical-center-center">
                {this.props.children}
                <i className="icon close-icon" style={{ marginTop: ".75rem" }} onClick={() => this.modal.hide()} />
            </div>
        </Modal>
    }

    show = () => this.modal.show()
    hide = () => this.modal.hide()
}

export default CloseModal;
