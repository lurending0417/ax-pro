import { observable, action } from "mobx";
import moment from "moment"
import React from "react"
import ReactDom from "react-dom"
import { observer } from "mobx-react";
import Modal from "../../components/common/modal"
import { persist } from "mobx-persist";
import BaseStore from "../../data/stores/BaseStore";

const _id = 0;

class MsgStore extends BaseStore {
    constructor() {
        super();

        if (process.browser) {
            let ms = localStorage.getItem("log-history")
            if (ms) {
                try {
                    ms = JSON.parse(ms);
                }
                catch (e) {
                    console.error(e)
                    ms = []
                }
                this.msgs = ms;
            }
        }

    }

    maxLength = 20

    @observable isVisible = false

    @observable msgs = [];

    @persist @observable maxId = 100;

    @action
    pushMsg = msg => {

        msg.id = this.maxId++;
        msg.time = moment().format("HH:mm:ss")
        this.msgs.push(msg)


        if (process.browser) {
            localStorage.setItem("log-history", JSON.stringify(this.msgs.slice(-100)))
        }
    }

    @action
    clear = () => {
        this.msgs = []
    }
}

const msgStore = new MsgStore();

const getMsg = msg => {
    if (typeof msg === "object") {
        msg = msg.message || JSON.stringify(msg)
    }
    return msg;
}

export const debug = msg => {
    msgStore.pushMsg({
        msg: getMsg(msg),
        type: "debug"
    });
}

export const error = msg => {
    msgStore.pushMsg({
        msg: getMsg(msg),
        type: "error"
    });
}

export const clear = () => {
    msgStore.clear();
}

@observer
class MsgBox extends React.Component {
    render() {
        const style = {
            width: "100%",
            height: "100%",
            zIndex: 99999,
            backgroundColor: "green",
            overflowY: "auto"
        }
        return <Modal isInner={true} zIndex="9999999" animateShow={"slideInDown"} animateHide={"slideOutUp"} style={style} visible={msgStore.isVisible}>
            <div style={{ overflow: "auto" }} className="full">
                <div  >
                    <a onClick={this.hide} className="button btn-size-normal gold-btn button-round" style={{
                        position: "absolute",
                        top: "1.7rem",
                        left: "25%",
                        zIndex: 999999
                    }}>取消</a>
                    <a onClick={this.clear} className="button btn-size-normal gold-btn button-round" style={{
                        position: "absolute",
                        top: "1.7rem",
                        right: "25%",
                        zIndex: 999999
                    }}>清除</a>
                    <div>
                        {
                            msgStore.msgs.map((item, index) => {
                                return <p key={"item-" + item.id + "-" + index} id={item.id} style={{ color: item.type == "error" ? "red" : "black", padding: ".25rem" }}>{item.time + "-->" + item.msg}</p>
                            })
                        }
                    </div>
                </div>
            </div>

        </Modal>

    }

    componentDidUpdate() {
        if (msgStore.msgs.length > msgStore.maxLength) {
            var d = document.querySelector("#DebuG div")
            d.scroll(0, d.scrollHeight + 100);
        }
    }

    hide() {
        msgStore.isVisible = false;
    }

    clear() {
        msgStore.clear();
    }
}


(0, () => {
    if (process.browser) {
        if (process.env.NODE_ENV == "production") {
            console.log = function () { };
        }

        return;
        // if (process.env.NODE_ENV == "development") {
        //     return;
        // }
        const rawLog = console.log;
        console.log = function () {
            const msgs = Array.prototype.slice.call(arguments, 0);
            rawLog.apply(console, msgs)

            debug(msgs.map(item => {
                return getMsg(item)
            }).join(" "))
        }

        const rawError = console.error;
        console.error = function () {
            const msgs = Array.prototype.slice.call(arguments, 0);
            rawError.apply(console, msgs)

            error(msgs.map(item => {
                return getMsg(item)
            }).join(" "))
        }

        setTimeout(() => {
            const id = "DebuG"
            let el = document.getElementById(id);
            if (!el) {
                // el = document.createElement("div");
                // el.id = id;
                // document.body.appendChild(el)

                $("body").append(`<div id='${id}'/>`)

                el = $("#" + id)[0];

                // $(".page").click(() => {
                //     msgStore.isVisible = true;
                // })
                // 改成长按
                let ts = 0;
                const max = 1500;
                $("body").delegate(".bar-nav", "touchstart", () => {
                    ts = Date.now()
                })
                $("body").delegate(".bar-nav", "touchmove", (e) => {
                    const dis = Date.now() - ts;
                    if (dis > max) {
                        ts = 0;
                        msgStore.isVisible = true;
                        // e.preventDefault()
                    }
                })
                $("body").delegate(".bar-nav", "touchend", (e) => {
                    const dis = Date.now() - ts;
                    if (dis > max) {
                        ts = 0;
                        msgStore.isVisible = true;
                    }

                    // e.preventDefault()
                })


                ReactDom.render(<MsgBox />, el);
            }
        }, 500)
    }
})();
