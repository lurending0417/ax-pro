/**
* server side 服务器 直接 获取 code 登录  然后 渲染到页面
* client side 从页面读取 token
*  <>-----}|------------------------------->
* 
*/



import Storage from "../utils/storage";
const sto = new Storage({
    cookieList: ["token"]
})

class WxStore {

    constructor() {
        if (process.browser) {
            this.token = sto.get("token")
        }
    }

    token = ""
    waitList = [];

    async recovery(rawCookie) {
        if (!process.browser) {
            // 服务端 从cookie 恢复
            const rs = CookieHelper.get("token", rawCookie);
            if (rs) {
                this.token = rs;
            }
        }
        else {
            const r = sto.getItem("token");
            this.token = r;
        }
    }

    authSucc(token) {
        this.waitList.forEach(item => item(token));
    }


    auth(cookie) {
        if (!process.browser) {
            this.authOnServer(cookie);
        }
    }

    authOnServer() {

    }

    waitAuth() {
        if (this.token) {
            return Promise.resolve(this.token);
        }
        return new Promise(s => {
            this.waitList.push(s);
        })
    }
}

export default WxStore;