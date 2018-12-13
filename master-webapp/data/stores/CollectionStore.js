import { observable, action } from "mobx"
import { persist } from "mobx-persist";
import BaseStore from "./BaseStore";

import { API_MY_COLLECTION, API_USER_INFO } from "../../common/api"
import * as Mock from "mockjs";
import Api from "../../api/api";


class CollectionStore extends BaseStore {
    constructor() {
        super();
    }

    @persist("list") @observable rows = []
    @persist("list") @observable course_list = []
    @persist("list") @observable question_list = []
    @persist("list") @observable reward_list = []


    // 获取收藏
    @action
    async getCollection(params, callback) {
        return await this.request({
            url: API_MY_COLLECTION,
            method: "get",
            params
        }).then(rs => {
            switch (params.billType) {
                case "COURSE":
                    this.course_list = rs.rows
                    break;
                case "QUESTION":
                    this.question_list = rs.rows
                    break;
                case "WANTED":
                    this.reward_list = rs.rows
                    break;
            }
            // //console.log("rs", rs)
            callback && callback(rs)
        })
    }

    // 添加收藏
    @action
    async doCollection(params, callback) {
        return await this.request({
            url: API_MY_COLLECTION,
            method: "post",
            params
        }).then(rs => {
            // //console.log("rs", rs)
            callback && callback(rs)
        })
    }

    // 取消收藏
    @action
    async delCollection(params, callback) {
        return await this.request({
            url: API_MY_COLLECTION,
            method: "delete",
            params
        }).then(rs => {
            // //console.log("rs", rs)
            callback && callback(rs)
        })
    }



}

export default new CollectionStore();