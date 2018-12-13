import { observable, action } from "mobx";
import api from "../../api/api";
import { API_COURSE_LIST, API_DB_QUESTION, API_MASTER_FENGCAI } from "../../common/api";

class MasterDetail {
    @observable masterInfo = {};

    @action
    recovery(props) {
        let ps = props;
        if (typeof props == "string") {
            ps = {};
            props.substr(1).split("&").forEach(item => {
                const items = item.split("=");
                if (items.length == 2) {
                    ps[items[0]] = decodeURIComponent(items[1])
                }
            })
        }
        Object.keys(ps).forEach(k => {
            this.masterInfo[k] = ps[k];
        })
        //console.log("sss - recovery");
    }

    @observable
    courses = []

    @observable
    coursesCount = 0;

    @observable
    answers = []

    @observable
    answersCount = 0;

    @observable
    desc = "";




    refresh() {
        //console.log("refresh");
        api.request({
            url: API_COURSE_LIST,
            params: {
                masterId: this.masterInfo.id,
                start: 0,
                limit: 5
            }
        }).then(rs => {
            //console.log("rs ---> ", rs.rows)
            this.courses = rs.rows;
            this.coursesCount = rs.total;
        })

        api.request({
            url: API_DB_QUESTION,
            params: {
                masterId: this.masterInfo.id,
                start: 0,
                limit: 5
            }
        }).then(rs => {
            //console.log("rs ---> ", rs.rows)
            this.answers = rs.rows;
            this.answersCount = rs.total;
        })

        api.request({
            url: API_MASTER_FENGCAI,
            params: {
                masterId: this.masterInfo.id,
            }
        }).then(rs => {
            this.desc = rs.result;
        })
    }
}


export default MasterDetail