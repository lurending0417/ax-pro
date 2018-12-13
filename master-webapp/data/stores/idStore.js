import api from "../../api/api";
import BaseStore from "./BaseStore";
import { action } from "mobx";
import { waitAuth } from "../../utils/wx";

// id refresh copy

export default class IdBaseStore {

    _id = ""

    _auto = true;


    api = "";

    paramsField = ""

    paramsOther() {
        return {}
    }

    _refreshedCb = []
    _refreshed = false;

    needAuth = true;

    get id() { return this._id; }
    set id(v) {
        if (this._id != v) {
            this._id = v;
            if (process.browser)
                requestAnimationFrame(() => {
                    this.refresh(v);
                })

        }
    }



    // 添加刷新 回调
    done(cb) {
        if (this._refreshed) {
            cb();
        }
        else
            this._refreshedCb.push(cb);
    }

    req(nowid) {
        return api.request({
            url: this.api,
            params: {
                [this.paramsField]: nowid,
                ...this.paramsOther()
            }
        })
    }

    async refresh(nowid) {
        if (nowid) {
            this._refreshed = false;
            if (this.needAuth) {
                await waitAuth()
            }
            //console.log(23)
            await this.req(nowid).then(rs => {
                //console.log(23)
                if (this.id != nowid) {
                    return;
                }
                this._refreshed = true;

                this.copy(rs);

                this._refreshedCb.forEach(item => {
                    item();
                })
                this._refreshedCb = []
            })
        }
    }

    @action
    copy(rs) {
        BaseStore.prototype.recoveryFromObj.call(this, rs.result);
    }
}