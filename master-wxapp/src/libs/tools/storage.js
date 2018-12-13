// 通用db 浏览器 使用 localStorage  server 使用 内存  rn 使用asyncStorage  传进来
// 微信 使用 wx.getStorage
import regeneratorRuntime from 'regenerator-runtime'

class MemStorage {
    cached = {}
    getItem(k) {
        return this.cached[k]
    }
    setItem(k, v) {
        return this.cached[k] = v, true
    }
}

class WxStorage {
    getItem(k) {
        return new Promise((s, f) => {
            try {
                wx.getStorage({
                    key: k,
                    success: function (res) {
                        s(res.data)
                    },
                    fail: err => {
                        return s('')
                        // f(err)
                    }
                })
            }
            catch (e) {
                f(e);
            }

        })
    }
    setItem(k, v) {
        return new Promise((s, f) => {
            try {
                wx.setStorage({
                    key: k,
                    data: v,
                    success: () => {
                        s()
                    },
                    fail: err => f(err)
                })
            }
            catch (e) {
                f(e)
            }

        })
    }
    removeItem(k) {
        return new Promise((s, f) => {
            wx.removeStorage({
                key: k,
                success: function (res) {
                    s()
                },
                fail: err => f(err)
            })
        })
    }
}


export default class UniversalDB {
    constructor(storage) {
        if (storage) {
            this.storage = storage;
        } else {
            //wx
            this.storage = new WxStorage();
            return;
            //browser
            if (typeof localStorage != "undefined") {
                this.storage = localStorage;
            } else {
                //server
                this.storage = new MemStorage();
            }
            //rn
        }
    }
    _key = "$#$"
    storage = null

    async getItem(k) {
        let v = await this.storage.getItem(k);
        if (v && v[0] == "[" && v.substr(0, this._key.length + 4) == `["${this._key}",`) {
            try {
                let nv = JSON.parse(v);
                if (nv[0] == this._key) {
                    if (+nv[2] > Date.now()) {
                        return nv[1];
                    }
                    return null;
                }
            } catch (err) {

            }
        }
        return v;
    }

    setItem(k, v, timeOut = 31536000000) {
        let newV = [this._key, v, Date.now() + (timeOut)]
        return this.storage.setItem(k, JSON.stringify(newV))
    }

    removeItem(k) {
        return this.storage.removeItem(k);
    }
}