import { observable, action } from "mobx";
import api from "../../api/api";
import { persist } from "mobx-persist";
import { API_COURSE_SERIES_DETAIL } from "../../common/api";
import BaseStore from "./BaseStore";
import sysStore from "./sysStore";
import { waitAuth } from "../../utils/wx";
import IdBaseStore from "./idStore";

// 

class CourseGroupStore extends IdBaseStore {
    constructor(courseId, error, store) {
        super()

        if (store) {
            this._auto = false;
            this.copy({
                result: store
            })
        }
        else this.id = courseId;
        if (error) this.error = error
    }


    error = () => { }


    api = API_COURSE_SERIES_DETAIL;

    paramsField = "courseId"
    paramsOther() {
        return {}
    }

    _refreshedCb = []
    _refreshed = false;


    @persist @observable title = "";
    @observable toBuyCourse = true
    @observable coursePrice = 100;
    @observable sectionPrice = 100;
    @observable banner = "";
    @observable title = "";
    @observable intro = "";
    @observable code = 1;
    @observable studied = false;
    @observable video = false;
    @observable playAble = false;
    @observable favorite = false;
    @observable toBuyCourse = false;
    @observable agree = false;
    @observable master = {};


    courseId = "";
    @observable sections = []
    @observable students = [];
    @observable replies = [];
    @observable comments = [];
    @observable commentTimes = 0;

    @observable shareMoney = 0;

    // 添加刷新 回调
    done(cb) {
        if (this._refreshed) {
            cb();
        }
        else
            this._refreshedCb.push(cb);
    }

    @action
    async refresh(nowid) {
        if (nowid) {
            this._refreshed = false;
            return waitAuth().then(() => {
                return api.request({
                    url: this.api,
                    params: {
                        [this.paramsField]: nowid,
                        ...this.paramsOther()
                    }
                }).then(rs => {

                    if (this.id != nowid) {
                        return;
                    }
                    this._refreshed = true;

                    this.copy(rs);

                    this.handleShareMoney();

                    this._refreshedCb.forEach(item => {
                        item();
                    })
                    this._refreshedCb = []
                }).catch(err => {
                    if (this.error) {
                        this.error()
                    }
                })
            });
        }
    }

    handleShareMoney() {
        this.shareMoney = (this.coursePrice || 0) * sysStore.shareCourse
    }

    // 外面传进来
    refreshComments = () => {

    }

    @action
    copy(rs) {
        BaseStore.prototype.recoveryFromObj.call(this, rs.result);
    }
}

export default CourseGroupStore;