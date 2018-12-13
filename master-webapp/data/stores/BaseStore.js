import { observable, action } from "mobx"
import { persistUtil } from "../../utils/index"
import api from "../../api/api";
import CookieHelper from "../../utils/cookie"
import Storage from "../../utils/storage"
import { ListStore } from "../../components/common/list";

const locStorage = new Storage({});

class BaseStore extends ListStore {

    NAME = ""

    @observable total = 0;

    constructor(props) {
        super(props)
        persistUtil.put(this.NAME || this.constructor.name, this);
    }

    @action
    async recovery(rawCookie) {
        if (!process.browser) {
            // 服务端 从cookie 恢复
            const rs = CookieHelper.get(this.NAME || this.constructor.name, rawCookie);
            if (rs) {
                // //console.log(rs);
                this.recoveryFromObj(rs);
            }
        }
        else {
            // const r = locStorage.getItemRaw(this.constructor.name);
            // if (r) {
            // 	Object.assign(this, r)
            // }
        }
    }

    recoveryFromObj(rs) {
        Object.keys(rs).forEach(key => {
            this[key] = rs[key];
        })

    }


    async request(opts, callback) {
        return api.request(opts).then(rs => {
            return callback && callback(rs), Promise.resolve(rs)
        })
        // callback && callback(await api.request(opts))
    }

}

export default BaseStore;