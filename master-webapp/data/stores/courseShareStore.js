import IdBaseStore from "./idStore";
import { observable } from "mobx";
import api from "../../api/api";
import { API_COURSE_SHARE_GET, API_COURSE_SHARE_DRAW } from "../../common/api";
import sysStore from "./sysStore";

export default class CourseShareStore extends IdBaseStore {
    constructor(id, store) {
        super()

        this.needAuth = false;


        if (store) {
            this.copy({
                result: store
            })
        }
        else {
            this.id = id;
        }
    }

    needAuth = false

    api = API_COURSE_SHARE_GET;
    _auto = false;
    paramsField = "shareId";

    @observable
    sectionTitle = "";

    @observable
    avatar = ""

    @observable
    nick = "";

    @observable
    quota = 10

    draw() {
        return api.request({
            url: API_COURSE_SHARE_DRAW,
            params: {
                shareId: this.id
            },
            method: "post"
        })
    }

    handleShareMoney() {
        this.shareMoney = (this.sectionPrice || 0) * sysStore.shareCourse
    }


}