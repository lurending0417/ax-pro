import { observable, action } from "mobx"
import { persist } from "mobx-persist";
import BaseStore from "./BaseStore";

import img_cash_1 from "../../static/images/lottery/lottery_cash_1.png"
import img_cash_2 from "../../static/images/lottery/lottery_cash_2.png"
import img_cash_3 from "../../static/images/lottery/lottery_cash_3.png"
import img_cash_4 from "../../static/images/lottery/lottery_cash_4.png"
import img_cash_5 from "../../static/images/lottery/lottery_cash_5.png"
import img_cash_6 from "../../static/images/lottery/lottery_cash_6.png"
import img_cash_7 from "../../static/images/lottery/lottery_cash_7.png"
import img_cash_8 from "../../static/images/lottery/lottery_cash_8.png"

import { API_GET_LOTTERY, API_POST_LOTTERY } from "../../common/api"


class LotteryStore extends BaseStore {
    constructor() {
        super();
    }

    @observable imgs = [img_cash_1, img_cash_2, img_cash_3, img_cash_4, img_cash_5, img_cash_6]

    @persist("list") @observable lotteries = [];

    @observable remainTimes = 0
    @observable totalTimes = 0

    @action
    async getLottery(back) {
        return await this.request({
            url: API_GET_LOTTERY,
            method: "get"
        }).then(rs => {
            this.lotteries = rs.result.items
            this.remainTimes = rs.result.remainTimes
            this.totalTimes = rs.result.totalTimes

            let index = 0;
            this.lotteries.forEach((item) => {
                if (item.type === "CASH") {
                    item["img"] = this.imgs[index]
                    index++;
                } else if (item.type === "PHONE") {
                    item["img"] = img_cash_7
                } else if (item.type === "CUP") {
                    item["img"] = img_cash_8
                }
            })
            back && back(this)
        })
    }

    @action
    async postLottery(back, e) {
        return await this.request({
            url: API_POST_LOTTERY,
            method: "post"
        }).then(rs => {
            this.remainTimes--;
            back && back(rs.result, e)
        })
    }

}

export default new LotteryStore();