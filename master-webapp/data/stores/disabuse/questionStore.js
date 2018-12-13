import { observable, action } from "mobx"
import { persist } from "mobx-persist";
import BaseStore from "../BaseStore";
import {
  API_DB__QUESTION_REPLY, API_DB_QUESTION, API_DB_QUESTION_DETAIL, API_DB_QUESTION_LISTEN,
  API_DB_QUESTION_MY, API_DB_QUESTION_PURSUIT, API_SNS_COMMENT_GET
} from "../../../common/api";



class QuestionStore extends BaseStore {
  constructor() {
    super();
  }

  @persist("list") @observable questionlist = [];
  @persist("object") @observable questionDetial = {};
  @persist("object") @observable params = {};

  @action
  async getQuestiosList() {
    return await this.request({
      url: API_DB_QUESTION,
      method: "get"
    }).then(rs => {

      this.questionlist = rs.rows;
      Object.assign(this, rs.rows);
    });
  }

  @action
  async getQuestionDetial(params) {
    return await this.request({
      url: API_DB_QUESTION_DETAIL,
      method: "get",
      params
    }).then(rs => {
      // //console.log(rs.result);
      this.questionDetial = rs.result;
      Object.assign(this, rs.result);
    })
  }

  @action
  async askQuestion(params, callback) {
    return await this.request({
      url: API_DB_QUESTION,
      method: "post",
      params
    }).then(rs => {
      //console.log(rs.result);
      callback && callback(rs.result);
    })
  }


  // 我的解惑
  async getMyQuestion() {
    return await this.request({
      url: API_DB_QUESTION_MY,
      method: "get"
    }).then(rs => {
      //console.log(rs.result);
      callback && callback(rs.result);
    })
  }
  // 大师回答 追问
  async questionReply(params, callback) {
    return await this.request({
      url: API_DB__QUESTION_REPLY,
      method: "post",
      params
    }).then(rs => {
      //console.log(rs.result);
      callback && callback(rs.result);
    })
  }

  // 偷听
  @action
  async goListen(params, callback) {
    return await this.request({
      url: API_DB_QUESTION_LISTEN,
      method: "post",
      params
    }).then(rs => {
      //console.log(rs.result);
      callback && callback(rs.result);
    })
  }

  // 大师赠送解惑次数
  @action
  async giveQuestionTimes(params, callback) {
    return this.request({
      url: API_DB_QUESTION_PURSUIT,
      method: "post",
      params
    }).then(rs => {
      callback && callback(rs.result);
    })
  }

  // 大师详情刷新
  @action
  async questionDetailRefresh(params, callback) {
    return this.request({
      url: API_DB_QUESTION_DETAIL,
      method: "get",
      params
    }).then(rs => {
      //console.log(rs.result);
      this.questionDetial = rs.result;
      Object.assign(this, rs.result);
      callback && callback();
    })
  }
  @action
  async questionEvaluate() {
    this.questionDetial.toEvaluate = false;
  }

  //
  @action getMoreComments(params) {
    return this.request({
      url: API_SNS_COMMENT_GET,
      params
    }).then(rs => {
      this.questionDetial.comments = [...this.questionDetial.comments, ...rs.rows];
    })
  }
}



export default new QuestionStore();