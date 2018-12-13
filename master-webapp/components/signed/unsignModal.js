import CloseModal from "../../components/common/modalWithClose"
import LinkBtn from "../common/link"
import { wxPay } from "../../utils/wx";
import attendanceStore from "../../data/stores/attendanceStore";

class UnSignModal extends React.PureComponent {
    constructor() {
        super()
    }
    render() {
        return <CloseModal ref={ref => this.modal = ref}>
            <div className="signed-miss disp-vertical-center-center">
                <h3>补课</h3>
                <p>很遗憾，这天您忘记学习，可缴纳补课费：{this.props.money},完成这天的学习任务</p>
                <LinkBtn onClick={this.toSucc} className="button button-round btn-size-normal gold-border-btn">提交</LinkBtn>
            </div>
        </CloseModal>
    }

    show = () => this.modal.show()

    toSucc = () => {
        this.props.store.toMiss().then(rs => {
            wxPay(rs.result, (err) => {
                if (!err) {
                    rs.succCb();

                    // 
                    attendanceStore.refresh();
                }
            })
        });

        requestAnimationFrame(() => {
            this.modal.hide()
        })

    }
}

export default UnSignModal;