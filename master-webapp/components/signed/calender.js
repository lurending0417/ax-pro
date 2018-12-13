/**
* 日历
*  <>-----}|------------------------------->
* 
*/

import Moment from "moment"
import { observer } from "mobx-react"
import { CalenderStore } from "../../data/stores/calender"
import { isIos } from "../../utils/platform";
import AnimateDiv from "../common/animtedDiv";
// 

const weeks = ["日", "一", "二", "三", "四", "五", "六"];

@observer
class Calender extends React.Component {
    constructor(props) {
        super()

        this.store = props.store || new CalenderStore()
        const now = new Date();
        this.nowY = now.getFullYear();
        this.nowM = now.getMonth() + 1;
    }



    renderHeader() {
        const enableNext = this.store.year < this.nowY || (this.store.year == this.nowY && this.store.month < this.nowM)
        return <div className="calender-header">
            <i style={{ width: 40, marginLeft: ".6rem" }} onClick={this.toPre} className="icon icon-left"></i>
            <span className="calender-title">{this.store.title}</span>
            <i style={{ width: 40, textAlign: "right", marginRight: ".6rem", color: enableNext ? "#663305" : "#cdcdcd" }} onClick={this.toNext} className="icon icon-right"></i>
        </div>
    }

    toPre = () => {
        this.store.initData(this.store.year, this.store.month - 1, -1)
    }

    toNext = () => {
        if (this.store.year > this.nowY) {
            return;
        }
        if (this.store.year == this.nowY && this.store.month >= this.nowM) {
            return;
        }

        this.store.initData(this.store.year, this.store.month + 1, 1)
    }

    renderRow(items, pre, index) {
        if (!items.length) {
            return null;
        }
        return <div className={"calender-row calender-row-" + pre} key={pre + index}>
            {
                weeks.map((item, i) => {
                    return <div className="calender-td" key={pre + "-" + index + "-" + i}>
                        {
                            (0, () => {
                                if (items.length == 7) {
                                    return this.renderTd(items[i], index, i)
                                }
                                else {
                                    return items.reduce((last, now) => {
                                        if (last) return last;
                                        if (now.w == i) {
                                            return this.renderTd(now, index, i)
                                        }
                                        return null;
                                    }, null)
                                }

                            })()
                        }

                    </div>
                })}
        </div>
    }

    renderTd(item, rowIndex, colIndex) {
        if (this.props.renderTd) {
            return this.props.renderTd(item, rowIndex, colIndex)
        }
        if (rowIndex) {
            return <span>
                {item.d}
                {item.render && item.render()}
            </span>
        }
        return <span>{item}</span>
    }
    renderBody() {
        const dir = this.store.toNext;
        let nextCla = "", nowCla = "";
        // ios 动画错误 不用动画

        let nowWay = "", nextWay = "";
        if (dir > 0) {
            nowWay = "slideInRight"
            nextWay = "slideOutLeft"
            nextCla = "animated faster slideOutLeft"
            nowCla = "animated faster slideInRight"
        }
        else if (dir < 0) {
            nextCla = "animated faster slideOutRight"
            nowCla = "animated faster slideInLeft"
            nowWay = "slideInLeft"
            nextWay = "slideOutRight"
        }
        // let nextRows;
        // if (isIos()) {
        //     nowCla = "";
        //     nextCla = "none";
        //     // nextRows = null;

        //     return this.renderRows(this.store.data)
        // }
        // else
        const nextRows = this.renderNextRows(this.store.nextData, nextWay);



        return <div style={{ position: "relative" }}>
            <AnimateDiv animted={!!nowWay} duration={250} animateWay={nowWay} className={"disp-vertical "}>
                {this.renderRows(this.store.data)}
            </AnimateDiv>
            {nextRows}
        </div>
    }

    renderNextRows(data, cla) {
        if (data.length) {
            const rows = this.renderRows(data);
            return <AnimateDiv style={{
                position: "absolute",
                top: 0,
                left: 0
            }} duration={250} animateWay={cla} animted={!!cla} className={"disp-vertical "}>
                {rows}
            </AnimateDiv>
        }
        return null;
    }

    renderRows = data => {
        const rows = [];

        let index, max, items;
        for (var i = 1; i <= 6; i++) {
            if (!index) {
                index = 0;
                max = 7 - data[0].w;
            }
            else {
                max = 7;
            }
            items = data.slice(index, index + max)
            index += max;
            rows.push(this.renderRow(items, "body", i))
        }

        return rows;
    }

    render() {
        return <div style={this.props.style} className={(this.props.className || "") + " calender"}>
            {this.renderHeader()}
            {this.renderRow(weeks, "title", 0)}
            {this.renderBody()}
        </div>
    }
}

export default Calender;

