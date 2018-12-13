import React, { PureComponent } from "react";
import Atten_Plan from "../../components/common/atten_plan";
import Modal from "../../components/common/modal";
import Atten_Expert from "../../components/common/atten_expert";
import Calender from "../../components/signed/signedCalender"
import navable from "../../components/common/nav/navable";
import bgImg from "../../static/images/signed/base@3x.png"

@navable("/attendance/attendance")
class Attendance extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      top: true,
    }
  }
  // static navProps() {
  //   return {
  //     title: "签到"
  //   }
  // }
  componentDidMount() {

  }

  render() {
    return (
      <div className="atten_container">
        <div className="atten-top-bg">
          <img src={bgImg}></img>
        </div>
        <Atten_Plan
          expertCallback={
            () => {
              this.modal.show();
              requestAnimationFrame(() => {
                this.expert.scrollToTop();
              });
            }}
        />
        <Calender navigation={this.props.navigation} />
        <Modal ref={modal => this.modal = modal}>
          <Atten_Expert
            ref={expert => this.expert = expert}
            closeCallback={() => this.modal.hide()}
            top={this.state.top}
          />
        </Modal>
      </div>
    )
  }
}

export default Attendance;