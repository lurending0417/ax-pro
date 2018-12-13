import { observable, action } from "mobx"
import { persist } from "mobx-persist";
import BaseStore from "./BaseStore";

import { API_MY_ATTENTION } from "../../common/api"


class AttentionStore extends BaseStore {
    constructor() {
        super();
    }

    @persist("list") @observable attentionList = []


    // @action
    // async getAttention() {
    // 	return await this.request({
    // 		url: API_MY_ATTENTION,
    // 		method: "get"
    // 	}).then(rs => {
    // 		//console.log(rs)
    // 		this.attentionList = [...this.attentionList, ...rs.result.rows]
    // 		Object.assign(this, rs.result);
    // 	})
    // }


}

export default new AttentionStore();