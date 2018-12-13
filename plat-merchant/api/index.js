import axios from 'axios'
import extension from './extension'
import consts from './consts'
import {browserUtil} from '~/util'

export default {
    consts,
    request(opts) {
        if (!opts) throw Error('必须传入opts对象！')
        // 初始化domain
        this._initBaseUrl(opts)
        // 初始化method
        this._initMethod(opts)
        // 初始化url
        this._initUrl(opts)
        // 构建params
        this._buildParams(opts)
        // headers
        this._initHeaders(opts)

        // success
        this._initSuccess(opts)
        // fail
        this._initFail(opts)
        // done
        this._initDone(opts)
        // error
        this._initError(opts)

        // 回调
        this._initBeforeRequestCallback(opts)
        this._initAfterRequestCallback(opts)

        // 发送请求并返回响应内容
        this._sendRequest(opts)
    },
    /** 初始化domain */
    _initBaseUrl(opts) {
        opts.baseUrlTransform = extension.chooseURL()
    },
    /** 初始化method */
    _initMethod(opts) {
        let method = 'get'
        if (opts.method) {
            method = opts.method.toLowerCase()
        }

        opts.methodTransform = method
    },
    /** 初始化url */
    _initUrl(opts) {
        console.log(opts.url)
        if (!opts.url || opts.url === '') throw Error('参数url不能为空！')

        opts.urlTransform = this._replaceParams(opts)
    },
    /** 把restful路径参数的key替换为value */
    _replaceParams(opts) {
        let url = opts.url
        // 获取所有url上的参数名称key
        let allUrlParamsKeys = this._getAllUrlParamsKeys(opts)
        // 替换url上的参数名为参数值
        if (opts.params && allUrlParamsKeys) {
            for (let key in opts.params) {
                let paramKey = allUrlParamsKeys.find(ele => key === ele)
                if (paramKey) {
                    let val = encodeURIComponent(opts.params[paramKey])
                    url = url.replace(`{${paramKey}}`, val)
                }
            }
        }

        return url
    },
    /** 获取所有restful的路径参数的key */
    _getAllUrlParamsKeys(opts) {
        return opts.url
            .split('/')
            .map(urlSection => {
                if (/^\{[a-zA-Z0-9_]+\}$/.test(urlSection)) {
                    return urlSection.slice(1, -1)
                }
            })
            .filter(ele => ele)
    },
    /** 构建参数 */
    _buildParams(opts) {
        if (!opts.params) return null

        let method = opts.methodTransform.toLowerCase()
        // 排除url上的参数
        opts.paramsTransform = this._excludeUrlParams(opts)

        if (method === 'get') {
            opts.urlTransform += this._generateUrlParamsForGetRequest(opts.paramsTransform)
            opts.paramsTransform = null
        } else {
            opts.paramsTransform = this._transformJsonToFormFields(opts.paramsTransform)
        }
        if (opts.notToken) { // 如果是登录页面
            browserUtil.deleleteCookie('access-token')
        }
        // 添加token
        let accessToken = browserUtil.getCookie('access-token')
        let tokenParamPairs = 'access-token=' + (accessToken ? browserUtil.getCookie('access-token') : '')
        if (opts.urlTransform.indexOf('?') === -1) {
            opts.urlTransform += '?' + tokenParamPairs
        } else {
            opts.urlTransform += '&' + tokenParamPairs
        }
    },
    /** 排除url上restful的路径参数 */
    _excludeUrlParams(opts) {
        let newParams = {}
        let allUrlParamsKeys = this._getAllUrlParamsKeys(opts)
        if (opts.params && allUrlParamsKeys) {
            for (let key in opts.params) {
                let paramKey = allUrlParamsKeys.find(ele => key === ele)
                if (!paramKey) {
                    newParams[key] = opts.params[key]
                }
            }
        } else {
            newParams = opts.params
        }

        return newParams
    },
    /** 把json格式参数转成x-www-form-urlencoded格式的参数 */
    _transformJsonToFormFields(params) {
        let index = 0
        let formFields = ''

        for (let key in params) {
            if (index++ !== 0) formFields += '&'
            formFields += key + '=' + encodeURIComponent(params[key])
        }

        return formFields
    },
    /** 为get请求生成参数 */
    _generateUrlParamsForGetRequest(params) {
        let urlParams = this._transformJsonToFormFields(params)

        if (urlParams !== '') {
            urlParams = '?' + urlParams
        }
        return urlParams
    },
    /** 初始化header */
    _initHeaders(opts) {
        opts.headersTransform = {}
        if (opts.headers) {
            opts.headersTransform = opts.headers
        }
        if (!opts.headersTransform['Content-Type'] && opts.params) {
            opts.headersTransform['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    },
    /** 初始化成功后的回调 */
    _initSuccess(opts) {
        if (!opts.success) {
            opts.success = function () {
            }
        }
    },
    /** 初始化失败后的回调 */
    _initFail(opts) {
        if (!opts.fail) {
            opts.fail = function (error) {
                if (error.status === 40103 || error.status === 40102) { // 无效的access-token
                    alert(error.message + '，请重新登录');
                    browserUtil.deleleteCookie('access-token');
                    location.href = '/';
                } else {
                    alert(error.message || '操作失败')
                }
            }
        }
    },
    /** 初始化完成后的回调 */
    _initDone(opts) {
        if (!opts.done) {
            opts.done = function () {
            }
        }
    },
    /** 初始化错误后的回调 */
    _initError(opts) {
        if (!opts.error) {
            opts.error = function (error) {
                alert('服务器繁忙，请稍后再试！');
                console.warn(error)
            }
        }
    },
    /** 初始化请求之前的回调 */
    _initBeforeRequestCallback(opts) {
        opts.beforeRequestCallback = extension.beforeRequestCallback
    },
    /** 初始化请求之后的回调 */
    _initAfterRequestCallback(opts) {
        opts.afterRequestCallback = extension.afterRequestCallback
    },
    /** 发送请求 */
    _sendRequest(opts) {
        opts.beforeRequestCallback()
        axios({
            baseURL: opts.baseUrlTransform,
            method: opts.methodTransform,
            url: opts.urlTransform,
            data: opts.paramsTransform,
            headers: opts.headersTransform
        }).then(function (resp) {
            opts.afterRequestCallback()
            let json = resp.data
            if (json.status !== undefined) {
                if (json.status === 200) {
                    opts.success(json)
                } else {
                    opts.fail(json)
                }
                opts.done(json)
            } else {
                opts.done(json)
            }
        }).catch(function (error) {
            opts.afterRequestCallback()
            opts.error(error)
        })
    }
}
