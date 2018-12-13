import { observable, action, reaction } from "mobx"
import { persist } from "mobx-persist";
import BaseStore from "./BaseStore";

import { API_USER_INFO, API_LOGIN } from "../../common/api"
import { getUrlParam } from "../../utils/func";
import api from "../../api/api";
import { waitAuth } from "../../utils/wx";


class UserStore extends BaseStore {
    constructor() {
        super();
        if (process.browser) {
            process.nextTick(() => {
                this.refresh()
            })
        }
    }

    @observable subscribe = false;
    @persist @observable nick = ""
    @persist @observable name = ""
    @persist @observable age = 20
    @persist @observable phone = "";
    @persist @observable token = "";
    @persist @observable wxcode = "";
    @persist @observable avatar = "";
    @persist @observable vip = false;
    @persist @observable master = false;
    @persist @observable userId = "";
    @persist @observable weixinOpenId = "";
    @persist @observable id = "";
    @persist @observable score = "";

    @action
    changeName(name) {
        this.name = name
    }


    @action
    addAge() {
        this.age += 1
    }

    @action
    copyFrom(obj, master) {
        console.log(obj)
        Object.keys(obj).forEach(key => {
            this[key] = obj[key]
        })


        if (this.master && master)
            this.score = master.score
    }

    @action
    refresh() {
        waitAuth().then(() => {
            if (!process.browser) {
                return;
            }
            this.request({
                url: API_USER_INFO,
                method: "get",
                showLoading: false
            }).then(rs => {
                this.copyFrom(rs.result.user, rs.result.master)
                this.userId = rs.result.user.id;
            })
        })
    }

    @action
    async getStorages() {
        return Promise.resolve({
            rows: []
        })
    }

    async wxLogin(req) {
        // 把微信登录 直接 放到服务器 进行
        if (req) {
            const code = getUrlParam("code", req.url)
            if (code) {
                const rs = await api.request({
                    url: API_LOGIN,
                    method: "post",
                    params: {
                        code: code,
                        client: "WAP"
                    }
                })

                this.copyFrom(rs.result.user, rs.result.master)
                this.userId = rs.result.user.id;
                // 结果 渲染到 div 传入
            }
        }
    }


}

export default new UserStore();