import { observable, action } from "mobx"
import { persist } from "mobx-persist";
import BaseStore from "./BaseStore";

import { API_MY_INVITE, API_MY_INVITE_DETAIL } from "../../common/api"


class InviteStore extends BaseStore {
    constructor() {
        super();
    }

    @persist @observable invite;
    @persist("list") @observable inviteDetail;


    @action
    async getInvite() {
        return await this.request({
            url: API_MY_INVITE,
            method: "get"
        }).then(rs => {
            this.invite = rs.result
        })
    }

    @action
    async getInviteDetail() {
        return await this.request({
            url: API_MY_INVITE_DETAIL,
            method: "get"
        }).then(rs => {
            //console.log(rs)
            this.inviteDetail = rs.result.rows
            Object.assign(this, rs.result);
        })
    }

}

export default new InviteStore();