import { observable, action } from "mobx"
import { persist } from "mobx-persist";
import BaseStore from "./BaseStore";
import { API_SNS_COMMENT_GET, API_WANTED, API_WANTED_DETAIL, API_WANTED_REPALY } from "../../common/api";

class RewardStore extends BaseStore {
  @persist("list") @observable rewardList = [];
  @persist("object") @observable rewardDetail = {};
  @persist("object") @observable params = {};

  @action
  async getRewardList() {
    return await this.request({
      url: API_WANTED,
      method: "get"
    }).then(rs => {
      //console.log(rs);
      this.rewardList = rs.rows;
      Object.assign(this, rs.rows);
    });
  }

  @action
  async postReward(params, callback) {
    return await this.request({
      url: API_WANTED,
      method: "post",
      params
    }).then(rs => {
      //console.log("rs", rs);
      callback && callback(rs.result);
    });
  }

  @action
  async getRewardDetail(params, callback) {
    return await this.request({
      url: API_WANTED_DETAIL,
      method: "get",
      params
    }).then(rs => {
      this.rewardDetail = rs.result;
      Object.assign(this, rs.result);
      callback && callback(rs.result);
    });
  }

  @action
  async rewardReply(params, callback) {
    return await this.request({
      url: API_WANTED_REPALY,
      method: "POST",
      params
    }).then(rs => {
      //console.log("rs", rs);
      callback && callback(rs);
    });
  }

  @action
  async rewardDetailRefresh(params, callback) {
    return await this.request({
      url: API_WANTED_DETAIL,
      method: "get",
      params,
    }).then(rs => {
      this.rewardDetail = rs.result;
      Object.assign(this, rs.result);
      callback && callback();
    });
  }

  // 加载更多评论  回答
  @action
  async getMore(params) {
    return this.request({
      url: API_SNS_COMMENT_GET,
      params,
    }).then((rs) => {
      if (params.billType === "WANTED_REPLY") {
        this.rewardDetail.replies = [...this.rewardDetail.replies, ...rs.rows]
      } else {
        this.rewardDetail.comments = [...this.rewardDetail.replies, ...rs.rows]
      }
    });
  }
}

export default new RewardStore();