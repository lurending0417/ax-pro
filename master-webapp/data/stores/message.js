import { observable, action } from "mobx"
import { persist } from "mobx-persist";
import BaseStore from "./BaseStore";

import {
    API_SNS_COMMENT_GET, API_SNS_REWARD_POST, API_SNS_AGREE_POST, API_VIP_POST,
    API_SNS_EVALUATE_POST, API_MESSAGE_COUNT_GET, API_MESSAGE_DETAIL_GET
} from "../../common/api"

class Message extends BaseStore {
    constructor() {
        super();
    }

    @persist("list") @observable remarkList = []; // 评论列表
    @persist("list") @observable msgCommentList = []; // 消息页面的评论列表
    @persist("list") @observable msgAgreeList = []; // 消息页面的评论列表
    @persist("list") @observable msgWantedList = []; // 消息页面的评论列表
    @persist("object") @observable newMessageCount = {}; // 未读消息统计

    // 获取评论列表
    @action
    async getRemarkList(params) {
        return await this.request({
            url: API_SNS_COMMENT_GET,
            method: "get",
            params
        }).then(rs => {
            //console.log("rs", rs)
            if (rs.status === 200)
                this.remarkList = rs.rows
        })
    }

    // 发起打赏
    @action
    async postReward({ params, callback }) {
        return await this.request({
            url: API_SNS_REWARD_POST,
            method: "post",
            params
        }).then(rs => {
            // 打赏成功
            //console.log("rs", rs.status)
            callback(rs)
        })
    }

    // 点赞
    @action
    async postAgree({ params, callback, method }) {
        return await this.request({
            url: API_SNS_AGREE_POST,
            method: method || "post",
            params
        }).then(rs => {
            // 点赞成功
            // //console.log("rs", rs.status)
            callback && callback(rs)
            return rs;
        })
    }

    // 发表评价
    @action
    async postEvaluate({ params, callback }) {
        return await this.request({
            url: API_SNS_EVALUATE_POST,
            method: "post",
            params
        }).then(rs => {
            // 评价成功
            //console.log("rs", rs.status)
            callback()
        })
    }

    // 统计未读消息
    @action
    async getNewMessageCount() {
        return await this.request({
            url: API_MESSAGE_COUNT_GET,
            method: "get",
            params: {}
        }).then(rs => {
            //console.log("rs", rs.result)
            this.newMessageCount = rs.result || {}
        })
    }

    // 获取系统消息
    @action
    async getMessageByType(params) {
        return await this.request({
            url: API_MESSAGE_DETAIL_GET,
            method: "get",
            params
        }).then(rs => {
            //console.log("rs", rs.rows)
            switch (params.billType) {
                case "COMMENT": {
                    this.msgCommentList = rs.rows || [];
                    break
                }
                case "WANTED": {
                    this.msgWantedList = rs.rows || [];
                    break
                }
                case "AGREE": {
                    this.msgAgreeList = rs.rows || [];
                    break
                }
            }
        })
    }

    // vip
    @action
    async postVip({ params, callback }) {
        return await this.request({
            url: API_VIP_POST,
            method: "post",
            params
        }).then(rs => {
            callback(rs)
        })
    }
}

export default new Message();