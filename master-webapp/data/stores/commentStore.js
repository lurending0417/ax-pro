import BaseStore from "./BaseStore";
import { action, observable } from "mobx"
import { API_SNS_COMMENT_POST, API_SNS_COMMENT_REPLY } from "../../common/api";
import { persist } from "mobx-persist";

class CommentStore extends BaseStore {

  // 发表评论
  @persist @observable hah = 0;

  @action
  async postComment(params, callback) {
    return await this.request({
      url: API_SNS_COMMENT_POST,
      method: "post",
      params
    }).then(rs => {
      // //console.log(rs.result);
      callback && callback(rs.result);
    })
  }

  // 评论 回复
  @action
  async commentReply(params, callback) {
    return await this.request({
      url: API_SNS_COMMENT_REPLY,
      method: "post",
      params
    }).then(rs => {
      // //console.log(rs.result);
      callback && callback(rs);
    })
  }
}

export default new CommentStore();