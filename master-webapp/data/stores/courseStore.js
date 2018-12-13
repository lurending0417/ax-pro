import { observable, action } from "mobx";
import api from "../../api/api";
import BaseStore from "./BaseStore";
import { persist } from "mobx-persist";
import { API_COURSE_ONE_DETAIL, API_COURSE_MEDIA, API_COURSE_UPLOAD_PROGRESS } from "../../common/api";
import CourseGroupStore from "./courseGroupStore";

/**
* 单节课
*  <>-----}|------------------------------->
* 
*/



export default class CourseStore extends CourseGroupStore {
    constructor(id, shareId, error, store) {
        super(id, null)
        this.error = error;
        this.shareId = shareId
        if (store) {
            this.copy({
                result: store
            })
        }
    }

    api = API_COURSE_ONE_DETAIL;

    paramsField = "sectionId"

    shareId = ""

    paramsOther() {
        return {
            shareId: this.shareId
        }
    }


    @observable shareReward = {}

    @persist @observable title = "";



    uploadProgress(ts) {
        if (this.uploadTs && Date.now() - this.uploadTs < 10000) {
            return;
        }
        this.uploadTs = Date.now();
        api.request({
            url: API_COURSE_UPLOAD_PROGRESS,
            params: {
                duration: ts,
                sectionId: this.id
            },
            showLoading:false,
            method: "post"
        })
    }


    @action
    getVideo() {
        // api.request({
        //     url: API_COURSE_MEDIA,
        //     params: {
        //         sectionId: this.id,
        //         quality: "720p"
        //     }
        // }).then(rs => {
        //     this.videoUrl = rs.result;
        // })

        // api.request({
        //     url: API_COURSE_MEDIA,
        //     params: {
        //         sectionId: this.id,
        //         quality: "mp3"
        //     }
        // }).then(rs => {
        //     this.videoUrl = rs.result;
        // })
    }
}