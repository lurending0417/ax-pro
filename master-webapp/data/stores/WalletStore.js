import { observable, action } from "mobx"
import { persist } from "mobx-persist";
import BaseStore from "./BaseStore";

import { API_MY_WALLET, API_MY_WALLET_DETAIL, API_MY_WALLET_RECHARGE, API_MY_WALLET_WITHDRAW } from "../../common/api"


class WalletStore extends BaseStore {
    constructor() {
        super();
    }

    @persist("list") @observable walletDetail;

    @observable amount;

    // 获取钱包信息
    @action
    async getWallet(params, callback) {
        return await this.request({
            url: API_MY_WALLET,
            method: "get",
            params
        }).then(rs => {
            //console.log("rs", rs)
            this.amount = rs.result
            callback && callback(rs)
        })
    }

    // 钱包明细
    @action
    async getWalletDetail() {
        return await this.request({
            url: API_MY_WALLET_DETAIL,
            method: "get"
        }).then(rs => {
            //console.log("rs", rs)
            this.walletDetail = rs.rows
            Object.assign(this, rs.rows);
        })
    }

    // 充值
    @action
    async recharge(params, callback) {
        return await this.request({
            url: API_MY_WALLET_RECHARGE,
            method: "post",
            params
        }).then(rs => {
            //console.log("rs", rs)
            callback && callback(rs)
        })
    }

    // 提现
    @action
    async withdraw(params, callback) {
        return await this.request({
            url: API_MY_WALLET_WITHDRAW,
            method: "post",
            params
        }).then(rs => {
            //console.log("rs", rs)
            callback && callback(rs)
        })
    }

}

export default new WalletStore();