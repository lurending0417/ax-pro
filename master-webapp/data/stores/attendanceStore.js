/**
* 签到情况
*  <>-----}|------------------------------->
* 
*/

import { observable, action } from "mobx"
import BaseStore from "./BaseStore"
import { API_CHECK_STAT, API_CHECK_TOP } from "../../common/api";
import { persist } from "mobx-persist";
import moment from "moment";
class AttendanceStore extends BaseStore {

    constructor() {
        super();


        if (process.browser) {
            this.refresh();
        }

    }

    @action
    refresh() {
        return this.request({
            url: API_CHECK_STAT,
            params: {

            }
        }).then(rs => {
            this.recoveryFromObj(rs.result)

            let last = rs.result.checkIns.slice(-1)[0];
            last = last && last.billYmd
            if (moment().format("YYYYMMDD") == last) {
                this.isSigned = true;
            }
            return rs;
        })
    }

    @persist @observable id = 0;

    @observable checkIns = [];
    @observable toBuys = [];
    @observable helpCount = 0;
    @observable helpers = [];
    @observable checkCount = 0;
    @observable isSigned = false;

    @observable topInfo = {};

    @action
    async getTopsList() {
      return await this.request({
        url: API_CHECK_TOP,
        method: "get",
      }).then(rs => {
        console.log("topInfo", rs);
        this.topInfo = rs.result;
      })
    }


}

export default new AttendanceStore();

