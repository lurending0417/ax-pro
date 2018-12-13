import { observable, action } from "mobx";
import Mock from "mockjs"

let _id = 0;
class BarrageStore {
    constructor(props) {
        if (props) {
            Object.keys(props).forEach(key => {
                this[key] = props[key]
            })
        }

        const _ts = setInterval(() => {
            this.pushMsg("哈似懂非懂-" + Math.random(), 5 + (Math.ceil(2 * Math.random())), { color: Mock.Random.color() })

            if (this.msgs.length > 20) {
                clearInterval(_ts);
            }
        }, 500)


    }

    @action
    startListen() {
        if (this._ts) return;
        this._ts = setInterval(() => {
            if (this.msgs.length) {
                this.checkOut();
            }
            else {
                clearInterval(this._ts);
                this._ts = null;
            }
        }, 1000)
    }

    maxShowCount = 200;
    msgs = [];

    @observable showMsgs = []

    getRows() {
        const now = Date.now();
        return this.msgs.filter(item => item.showTime < now)
    }

    // 行数
    @observable linesCount = 5;

    lineIndex = 0;

    lastShows = {}


    @action
    pushMsg(msg, animDuration = 5, fontSize) {
        const linee = (this.lineIndex++) % this.linesCount
        let st = this.lastShows[linee];
        if (!st) {
            st = Date.now();
        }
        st += 500;
        this.lastShows[linee] = st;
        this.msgs.push({
            id: _id++,
            msg: msg,
            showTime: st,
            line: linee,
            fontSize,
            animDuration
        })

        this.showMsgs = this.getRows();

        this.startListen();
    }

    @action
    checkOut() {
        // 检测 清除
        const ts = Date.now() - 10 * 1000;
        // this.msgs = this.msgs.filter(item => item.showTime > ts);
    }
}

export default BarrageStore