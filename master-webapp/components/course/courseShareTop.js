import Modal from "../common/modal";
import Moment from "moment"

/**
* 看看谁抢到了
*  <>-----}|------------------------------->
* 
*/

import flagBg from "../../static/images/share/ribbon@2x.png"

// 

class CourseShareTop extends React.PureComponent {
    constructor() {
        super()

        this.state = {
            rows: [{
                nick: "asdf",
                avatar: "https://img.zcool.cn/community/01d65d563877d832f87512f672b15a.jpg@1280w_1l_2o_100sh.webp",
                grabTime: Date.now()
            }, {
                nick: "asdf",
                avatar: "http://dpic.tiankong.com/bx/am/QJ6799330262.jpg?x-oss-process=style/670w",
                grabTime: Date.now()
            }, {
                nick: "asdf",
                avatar: "https://cdn.duitang.com/uploads/item/201510/16/20151016090939_hN4Wm.jpeg",
                grabTime: Date.now()
            }]
        }
    }
    render() {
        return <div className="course-share-top disp-vertical-center imgBg">
            <p onClick={this.showModal} className="desc">看看谁抢到了</p>
            <div className="grab-title disp-vertical-center">
                <img className="w100" src={flagBg}></img>
                <span className="grab-title-desc">厉害了，你是第{this.props.store.drawOrdinal || "~"}个抢到的</span>
            </div>
            <Modal isInner={true} animateShow="fadeIn" animateHide="fadeOut" ref="modal" pos="center">
                <div className="disp-center full">
                    <div className="course-share-top-modal disp-vertical">

                        <div className="cm-content">
                            {
                                (this.props.store.draws || []).map((item, index) => {
                                    return this.renderItem(item, index)
                                })
                            }
                        </div>
                        <div className="grab-title disp-vertical-center">
                            <img className="w100" src={flagBg}></img>
                            <span className="grab-title-desc">厉害了，你是第{this.props.store.drawOrdinal || "~"}个抢到的</span>
                        </div>
                        <i className="icon close-icon" onClick={this.hide}></i>
                    </div>
                </div>

            </Modal>
        </div>
    }

    renderItem(item, index) {
        let { avatar, nick, grabTime } = item;
        grabTime = Moment(grabTime).format("YYYY-MM-DD HH:mm").split(" ")
        return <div key={"item-" + index} className="course-share-top-item disp-hor-start">
            <div className="avator-small">
                <img className="w100" src={avatar}></img>
            </div>

            <span className="fs-bold fs-normal">{nick}</span>
            <div className="grab-time disp-vertical">
                <span className="fs-gray fs-small">{grabTime[0]}</span>
                <span className="fs-gray fs-small">{grabTime[1]}</span>
            </div>
        </div>
    }

    showModal = () => {
        this.refs["modal"].show();
    }

    hide = () => {
        this.refs["modal"].hide();
    }
}

export default CourseShareTop;
