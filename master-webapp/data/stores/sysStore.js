import BaseStore from "./BaseStore";
import { waitAuth } from "../../utils/wx";
import api from "../../api/api";
import { API_GET_SYS } from "../../common/api";
import { observable } from "mobx";

class SysStore {
    constructor() {
        this._cached = []
        this.init();
    }
    done = (cb) => {
        if (this.inited) {
            cb()
        }
        else {
            this._cached.push(cb)
        }
    }

    init() {
        waitAuth().then(rs => {
            api.request({
                url: API_GET_SYS,
                method: "get",
                auth: false,
                showLoading: false
            }).then(rs => {
                this.inited = true;

                BaseStore.prototype.recoveryFromObj.call(this, rs.result)

                this._cached.forEach(item => {
                    item();
                })

            })
        })
    }

    @observable categories = [];
    @observable vipActualCost = 0;
    @observable vipOriginalCost = 0;
    @observable withdrawTimesQuota = 0;
    @observable maxWithdraw = 0;
    @observable minWithdraw = 0;

    @observable shareCourse = 0.25;

}

export default new SysStore();