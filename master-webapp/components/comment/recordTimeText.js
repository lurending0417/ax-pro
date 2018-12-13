import Modal from "../common/modal";
import mixable from "../../utils/mixable";
import TimerMix from "react-timer-mixin"
/**
* 录音倒计时
*  <>-----}|------------------------------->
* 
*/

const MaxTime = 60;

// 

@mixable(TimerMix)
class RecordTime extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            time: MaxTime
        }
    }

    hide() {
        this.modal.hide();
    }

    show() {
        if (this.ts) {
            clearInterval(this.ts)
        }
        this.setState({
            time: MaxTime
        })
        this.modal.show();

        this.ts = this.setInterval(() => {
            if (this.state.time) {
                this.setState({
                    time: this.state.time - 1
                })
            }
            else {
                clearInterval(this.ts);
                this.ts = null;
                this.modal.hide();

                this.onClose && this.onClose();
            }
        }, 1000)
    }

    makeRef = ref => this.modal = ref;

    render() {
        let ms = {
            height: '45%',
            alignItems: 'center',
            justifyContent: 'center',
        }
        return <Modal showModal={false} ref={this.makeRef} style={ms}>
            <div className="disp-center record-time">
                {this.state.time}
            </div>
        </Modal>
    }
}

export default RecordTime;

