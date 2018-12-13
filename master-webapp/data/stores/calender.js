import { observable, action } from "mobx";
import Moment from "moment"
import api from "../../api/api";
import { API_CHECK_MONTH, API_CHECK_BUY } from "../../common/api";
import attendanceStore from "./attendanceStore";
import { PayGATEWAY } from "../../common/constant";

const calDays = 3;
class CalenderStore {
    constructor() {
        const now = new Date();

        this.initData(now.getFullYear(), now.getMonth() + 1)

    }

    onChange = (year, month) => {

    }


    @observable toNext = 0;
    @observable year = 0;
    @observable month = 0
    @observable title = "";
    @observable data = [];
    @observable nextData = [];

    @action
    initData(year, month, dir) {
        if (this.toNext) {
            return;
        }
        if (dir && this.data.length) {
            this.nextData = this.data;
        }
        const d = this.getData(year, month);
        this.data = d.days;
        this.title = `${d.year}年${d.month}月`
        this.year = d.year;
        this.month = d.month

        this.toNext = dir || 0;

        if (dir) {
            setTimeout(() => {
                this.toNext = 0;
                this.nextData = [];
            }, 550)
        }



        if (process.browser) {
            requestAnimationFrame(() => {
                this.onChange(year, month)
            })
        }

    }

    getData(year, month) {
        if (month == 13) {
            year = year + 1;
            month = 1;
        }
        if (month == 0) {
            year = year - 1;
            month = 12;
        }
        const day = month == 2 ? 28 : ((month <= 7 && month % 2 == 1) || (month >= 8 && month % 2 == 0) ? 31 : 30)
        const days = [];
        for (var i = 1; i <= day; i++) {
            const d = new Date(`${year}/${month}/${i}`)
            days.push({
                w: d.getDay(),
                d: i,
                t: d
            })
        }

        return { days, year, month };
    }
}


class SignedCalenderStore extends CalenderStore {
    constructor() {
        super();

        this.checkCache();


    }

    checkCache() {
        if (!process.browser) {
            return;
        }

        // $.toast(this.data.length)
        const time = Moment().format("YYYYMMDD")
        const rs = localStorage.getItem("signed");
        if (rs == time) {
            // 今天已经访问
            setTimeout(() => {
                this.isVisited = true;
            }, 2000)
        }
        else localStorage.setItem("signed", time)
    }

    @observable isSigned = false;

    @observable isVisited = false;
    // 1 动画 2 动画完毕
    @observable toLottery = 0;

    @observable missIndex = 0;


    onChange = (year, month) => {
        return new Promise((s) => {
            // 获取当月的已签
            api.request({
                url: API_CHECK_MONTH,
                showLoading: false,
                params: {
                    billYm: year + "" + (month < 10 ? "0" + month : month)
                }
            }).then(rs => {
                const signed = rs.rows.map(item => item.billYmd + "")
                const buys = attendanceStore.toBuys;
                this.refreshData(year, month, signed, buys)
            })
            // setTimeout(() => {
            //     s();
            //     this.refreshData(year, month, [1, 3, 4, 7], [2, 5, 8])
            // }, 200)
        })
    }

    getYmd = (y, m, d) => {
        return y + "" + (m < 10 ? "0" + m : m) + "" + (d < 10 ? "0" + d : d)
    }

    @action
    refreshData(year, month, signedDays, missDays) {
        // 只取3天
        if (year == this.year && month == this.month) {
            if (signedDays.length) {
                const y = +signedDays[0].substr(0, 4)
                const m = +signedDays[0].substr(4, 2)
                if (y == year && m == month) {
                    signedDays.map(day => {
                        const d = +day.substr(6)
                        this.data[d - 1].isSigned = true
                    })
                }
            }



            // 补课判断
            missDays.forEach(day => {
                const billYmd = day.billYmd + ""
                const y = +billYmd.substr(0, 4)
                const m = +billYmd.substr(4, 2)
                const d = +billYmd.substr(6)
                if (y == year && m == month) {
                    this.data[d - 1].isSigned = 0
                    this.data[d - 1].cost = day.cost;
                }
            })

            this.data = [...this.data]
        }
    }

    @action
    toMiss = () => {
        // $.toast("补课成功")
        return api.request({
            url: API_CHECK_BUY,
            method: "post",
            params: {
                gateway: PayGATEWAY.WEIXIN_MP,
                billYmd: this.getYmd(this.year, this.month, this.missIndex + 1),
                cost: this.data[this.missIndex].cost || 0
            }
        }).then(rs => {
            return {
                result: rs.result,
                succCb: () => {
                    this.data[this.missIndex].isSigned = true
                    this.data = [...this.data]
                }
            }
        })


    }
}


export {
    SignedCalenderStore,
    CalenderStore
}