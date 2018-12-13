// import extension from '../../../data/api/extension';
// import { isWhiteList } from "../../../common/constant/whiteList";
// import { getAppBaseUrl, getAppid } from "../../../common/constant/common";
import { getApiUrl } from "../common/constant";
import CancelPromise from "../utils/cancelPromise"

const ServerReq = process.browser ? null : require("request")
import CookieHelper from "../utils/cookie"
import "../mock"
import Storage from "../utils/storage"
import { isWx, auth, waitAuth } from "../utils/wx";
import loadingStore from "../data/stores/loadingStore";

const localstorage = new Storage({ cookieList: ["token"] });


/**api快速访问*/
export default {
    /**
     * 网络请求
     * @param opts 选项
     * @showLoading 进度条
     * @optsAttr method 请求类型（get、post、delete、patch、put）
     * @optsAttr url 路径
     * @optsAttr params 请求参数（包括restful架构的/api/school/:schoolId/classroom/:classroomId中的参数，get请求的/api/student?name=tom中的参数，亦或消息体中的参数）
     * @optsAttr headers 请求头
     * @optsAttr success 请求成功后的回调，即data.success === true
     * @optsAttr fail 请求失败后的回调，即data.success === false
     * @optsAttr done 请求完成后的回调（不能于success和fail同时使用）
     * @optsAttr error 请求发生错误的回调
     */
    async request(opts, cookie) {
        if (!opts) throw Error("必须传入opts对象！");
        const { auth = true } = opts;
        if (process.browser && auth) {
            await waitAuth()
        }
        //初始化method
        this._initMethod(opts);
        //初始化url
        this._initUrl(opts);
        if (cookie) {
            this._initServerSide(opts, cookie)
        }
        //构建params
        this._buildParams(opts);
        //headers
        this._initHeaders(opts);

        //success
        this._initSuccess(opts);
        //fail
        this._initFail(opts);
        //done
        this._initDone(opts);
        //error
        this._initError(opts);

        //callback
        this._initBeforeRequestCallback(opts);
        this._initAfterRequestCallback(opts);

        //发送请求并返回响应内容
        return this._sendRequest(opts);
    },
    /**初始化method*/
    _initMethod(opts) {
        let method = "get";
        if (opts.method) {
            method = opts.method.toLowerCase();
        }

        opts.methodTransform = method;
    },
    /**初始化url*/
    _initUrl(opts) {

        if (!opts.url || opts.url === "") throw Error("参数url不能为空！");

        opts.urlTransform = this._replaceParams(opts);
    },
    _initServerSide(opts, cookie) {
        //server端需要
        if (process.browser)
            return;
        if (cookie) {
            opts.token = CookieHelper.get("token", cookie)
        }
    },
    /**把restful路径参数的key替换为value*/
    _replaceParams(opts) {
        let url = getApiUrl() + opts.url;
        //获取所有url上的参数名称key
        const allUrlParamsKeys = this._getAllUrlParamsKeys(opts);
        //替换url上的参数名为参数值
        if (opts.params && allUrlParamsKeys) {
            for (const key in opts.params) {
                const paramKey = allUrlParamsKeys.find(ele => key === ele);
                if (paramKey) {
                    const val = opts.params[paramKey];
                    url = url.replace(`{${paramKey}}`, val);
                }
            }
        }

        return url;
    },
    /**获取所有restful的路径参数的key*/
    _getAllUrlParamsKeys(opts) {
        return opts.url
            .split("/")
            .map(urlSection => {
                if (/^\{[a-zA-Z0-9_]+\}$/.test(urlSection)) {
                    return urlSection.slice(1, -1)
                }
            })
            .filter(ele => ele);
    },
    _getToken(opts) {
        if (process.browser) {
            return localstorage.getItemRaw("token")
        }
        else {
            if (!opts) {
                return "";
            }
            return opts.token || ""
        }
    },
    /**构建参数*/
    _buildParams(opts) {
        // if (!opts.params) return null;

        const method = opts.methodTransform.toLowerCase();
        //排除url上的参数
        opts.paramsTransform = this._excludeUrlParams(opts);

        if (method === "get" || method == "delete") {
            opts.urlTransform += this._generateUrlParamsForGetRequest(opts.paramsTransform);
            opts.paramsTransform = null;
        } else {
            opts.paramsTransform = this._transformJsonToFormFields(opts.paramsTransform);
        }

        // 添加token
        const accessToken = this._getToken()
        // let tokenParamPairs = 'access-token=' + (accessToken ? window.localStorage.getItem('token') : 'access-token')
        const tokenParamPairs = accessToken ? "access-token=" + accessToken : accessToken
        if (accessToken)
            if (opts.urlTransform.indexOf("?") === -1) {
                opts.urlTransform += "?" + tokenParamPairs
            } else {
                opts.urlTransform += "&" + tokenParamPairs
            }
    },
    /**排除url上restful的路径参数*/
    _excludeUrlParams(opts) {
        let newParams = {};
        const allUrlParamsKeys = this._getAllUrlParamsKeys(opts);
        if (opts.params && allUrlParamsKeys) {
            for (const key in opts.params) {
                const paramKey = allUrlParamsKeys.find(ele => key === ele);
                if (!paramKey) {
                    newParams[key] = opts.params[key];
                }
            }
        } else {
            newParams = opts.params;
        }

        return newParams;
    },
    /**把json格式参数转成x-www-form-urlencoded格式的参数*/
    _transformJsonToFormFields(params) {
        let index = 0,
            formFields = "";


        for (const key in params) {
            if (params[key] === null) continue;
            if (index++ !== 0) formFields += "&";
            formFields += key + "=" + encodeURIComponent(params[key]);
        }

        return formFields;
    },
    /**为get请求生成参数*/
    _generateUrlParamsForGetRequest(params) {
        let urlParams = this._transformJsonToFormFields(params);

        if (urlParams !== "") {
            urlParams = "?" + urlParams;
        }
        return urlParams;
    },
    /**初始化header*/
    _initHeaders(opts) {
        let headers;
        if (!process.browser) {
            headers = {};
            if (opts.headers) {
                opts.headersTransform = (opts.headers);
            }
            if (("Content-Type" in headers) && opts.params) {
                headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
            }
        }
        else {
            headers = new Headers();
            if (opts.headers) {
                opts.headersTransform = new Headers(opts.headers);
            }
            if (!headers.has("Content-Type") && opts.params) {
                headers.append("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
            }
        }

        opts.headersTransform = headers;
    },
    /**初始化成功后的回调*/
    _initSuccess(opts) {
        if (!opts.success) {
            opts.success = function () {
            };
        }
    },
    /**初始化失败后的回调*/
    _initFail(opts) {
        if (!opts.fail) {
            opts.fail = function () {
            };
        }
    },
    /**初始化完成后的回调*/
    _initDone(opts) {
        if (!opts.done) {
            opts.done = function () {
                // console.log('更新后数据集>>>>>>>>>>>>>>>>>>>>')
                // console.log(JSON.parse(JSON.stringify(require('../../../data/stores'))))
            };
        }
    },
    /**初始化错误后的回调*/
    _initError(opts) {
        // 如果 token 错误  从新 登录
        const me = this;
        if (!opts.error) {
            opts.error = function (err) {
                me._checkError(err)
                const msg = err && err.message || "请稍后再试"
                if (process.browser) {
                    if (/fail/.test(msg)) {
                        return;
                    }
                    $.toast(msg, 2000)
                }
            };
        }
        else {
            const oldErr = opts.error;
            opts.error = (err) => {
                me._checkError(err);
                oldErr(err);
            }
        }

    },
    _checkError: (err) => {
        const msg = err && err.message || ""
        if (process.browser && /access-token/.test(msg)) {
            localStorage.setItem("token", "")
            if (isWx()) {
                $.toast("登录过期~", 2000)
                setTimeout(() => {
                    auth(true);
                }, 1500)
            }

            // 抛出 不网下走
            throw new Error("登录过期")
        }

    },

    /**初始化请求之前的回调*/
    _initBeforeRequestCallback(opts) {
        // opts.beforeRequestCallback = extension.beforeRequestCallback();
    },
    /**初始化请求之后的回调*/
    _initAfterRequestCallback(opts) {
        // opts.afterRequestCallback = extension.afterRequestCallback();
    },
    _showLoading(opts) {
        const willShow = "showLoading" in opts ? opts["showLoading"] : true;
        willShow && loadingStore.showLoading(opts._loadingId);
    },
    _hideLoading(opts) {
        const willShow = "showLoading" in opts ? opts["showLoading"] : true;
        willShow && loadingStore.hideLoading(opts._loadingId)
    },
    /**发送请求*/
    _sendRequest(opts) {

        const send = {
            method: opts.methodTransform,
            headers: opts.headersTransform,
            body: opts.paramsTransform
        }
        const fet = (0, () => {
            if (process.browser) {
                this._showLoading(opts);
                return fetch(opts.urlTransform, send)
            }
            return new Promise((s, f) => {
                ServerReq(opts.urlTransform, { ...send, timeout: 5000 }, (err, res, body) => {
                    if (err) return f(err);
                    let json;
                    try {
                        json = JSON.parse(body);
                        return s({
                            json: () => Promise.resolve(json)
                        })
                    }
                    catch (e) {
                        return f(e);
                    }

                })
            })

        })()
        // return fetch(opts.urlTransform, {
        //     method: opts.methodTransform,
        //     headers: opts.headersTransform,
        //     body: opts.paramsTransform
        // })

        return fet.then(response => {
            // 有可能 返回空
            let rs;
            if (opts.method == "delete") {
                return response.text().then(s => {
                    if (!s) {
                        rs = { status: 200 }
                    }
                    else {
                        try {
                            rs = JSON.parse(s)
                        }
                        catch (e) {
                            if (response.status == 200) {
                                rs = { status: 200 }
                            }
                            else {
                                return Promise.reject(e)
                            }
                        }
                    }
                    return rs
                })
            }
            else rs = response.json()

            return rs
        }).then(json => {

            this._hideLoading(opts);
            if (json.status == 200) {
                return json;
            }
            return Promise.reject(json)
            // if (this._tokenIsOk(json)) {
            // if (json.status !== 200)
            //     window.alertDialog.show({
            //         title: json.message,
            //         submit: '知道了',
            //         cancel: false
            //     });
            // window.loading && window.loading.hidden()
            // return json;
            // }
            // else {
            //     sessionStorage.removeItem('token')
            //     window.loading && window.loading.hidden()
            //     window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + getAppid() + '&redirect_uri=' + encodeURIComponent(getAppBaseUrl() + opts.pathname) + '&response_type=code&scope=snsapi_base#wechat_redirect';
            // }
            // else if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'prod') {
            //     if (!isWhiteList(this.props.location.pathname)) {
            //         window.loading && window.loading.hidden()
            //         window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + getAppid() + '&redirect_uri=' + encodeURIComponent(getAppBaseUrl() + opts.pathname) + '&response_type=code&scope=snsapi_base#wechat_redirect';
            //     }
            // }
        })
            .catch(error => {
                this._hideLoading(opts);
                // opts.afterRequestCallback();
                // window.loading && window.loading.hidden()
                console.error("fetch error in " + opts.urlTransform)
                console.error("fetch error info : " + JSON.stringify(error))
                opts.error(error);
                return Promise.reject(error);
            });
    },
    /**
     * request包装方法
     * @param basic 基本参数：url、method
     * @param params 其他请求参数
     * @param headers 请求头
     * @param success 成功后的回调
     */
    requestWrapper(basic, params, headers, success) {
        const opts = {
            method: basic.method,
            url: basic.url
        };

        if (this._deal3Params(opts, params, headers, success)) return this.request(opts);
        if (this._deal2Params(opts, params, headers)) return this.request(opts);
        if (this._deal1Params(opts, params)) return this.request(opts);
    },
    _deal3Params(opts, params, headers, success) {
        if (!params || !headers || !success) return false;

        opts.params = params;
        opts.headers = headers;
        opts.success = success;

        return true;
    },
    _deal2Params(opts, params, headers) {
        if (!params || !headers) return false;

        opts.params = params;
        if (headers instanceof Function) {
            opts.success = headers;
        } else {
            opts.headers = headers;
        }

        return true;
    },
    _deal1Params(opts, params) {
        if (!params) return false;

        if (params instanceof Function) {
            opts.success = params;
        } else {
            opts.params = params;
        }

        return true;
    }
    // _tokenIsOk(json) {
    //     if (json.status === 40101 || json.status === 40102 || json.status === 40103)
    //         return false
    //     return true
    // }
};