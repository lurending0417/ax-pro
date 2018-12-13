
import _fetch from './fetch'
import regeneratorRuntime from 'regenerator-runtime'


const ReqCacheType = {
    NO_CACHE: 'NO_CACHE',//不缓存
    ONLY_CACHE: 'ONLY_CACHE',// 有缓存就使用缓存
    DOUBLE_CB: 'DOUBLE_CB', // 先使用缓存 然后fetch 再刷新
}

//  可以 外面修改
const ReqConfig = {
    TimeOut: 15000,
    TimeMinRepeat: 1000,
    TimeMinCache: 3600000,
    StateField: 'status',
}

export {
    ReqCacheType,
    ReqConfig
}

import { object2Query } from './func';
import DB from './storage';

const myDb = new DB();



const _getReqId = (url, { method, body }) => {
    // 这里 只用  url 和method 判断   严格的话 可以 把 body 包进来 MD5
    return url + '-' + (method || 'get')
}

const reqKey = "$reqLast$"
const _fail = err => console.error(err)
const _succ = () => { }


export const clearLastReq = () => {
    myDb.removeItem(reqKey);
}

const req = async (api, payload) => {
    let {
        method = 'get',
        body = {},
        headers = {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        fail = _fail,
        success = _succ,
        cache = ReqCacheType.NO_CACHE,
        timeout = 15000,
        noRepeat = true,
        getReqId = _getReqId
    } = payload;

    const m = method.toLowerCase();

    const params = body;

    // 处理 PathVariable（ REST风格URL上的路径参数 ）
    const pathVariables = api.split('/').map((section) => {
        if (/^\{[a-zA-Z0-9_]+\}$/.test(section)) {
            return section.slice(1, -1);
        }
        return null;
    }).filter(element => element);

    if (pathVariables && Object.keys(params).length) {
        for (let i = 0, j = pathVariables.length; i < j; i++) {
            const pv = pathVariables[i];
            const value = params[pv] || '';
            api = api.replace(`{${pv}}`, encodeURIComponent(value));
            delete params[pv];
        }
    }

    // fetch的参数
    let postBody;
    if (headers['Content-Type'].startsWith('multipart/form-data')) {
        postBody = new FormData();
        Object.keys(params).forEach((key) => {
            const value = body[key];
            if (Array.isArray(value) || Immutable.List.isList(value)) {
                value.forEach(item => postBody.append(key, item));
            } else {
                postBody.append(key, value);
            }
        });
    } else {
        postBody = object2Query(params);
        if (m == "get" || m == "delete") {
            api += (api.indexOf('?') > -1 ? "&" : "?") + postBody;
            postBody = null;
        }
    }
    const options = {
        headers,
        body: postBody,
        method: m,
        timeout,
    };

    // 缓存的key
    let id = '';

    // 判断重复
    const nowTs = Date.now();
    if (noRepeat) {
        id = getReqId(api, options);
        let lastReq = (await myDb.getItem(reqKey)) || {};
        let lastRequest = lastReq[id]
        if (lastRequest && (nowTs - lastRequest < ReqConfig.TimeMinRepeat)) {
            return Promise.reject({
                [ReqConfig.StateField]: 403, // Forbidden
                msg: '请勿重复提交'
            })
        }
        lastReq[id] = nowTs
        myDb.setItem(reqKey, lastReq);
    }

    // 判断缓存
    if (options.method == "get" && cache == ReqCacheType.ONLY_CACHE || cache == ReqCacheType.DOUBLE_CB) {
        id = id || getReqId(api, options);
        let lastRes = await myDb.getItem(id + '-lastRes');
        // 缓存 过期时间
        if (lastRes && (nowTs - lastRes.updateAt < ReqConfig.TimeMinCache)) {
            if (cache == ReqCacheType.ONLY_CACHE)
                return Promise.resolve(lastRes.res)
            else if (success) {
                // double 两次掉用
                global.process.nextTick(() => {
                    success(lastRes.res);
                })
            }
        }
    }

    // 请求
    return _fetch(api, options).then(res => {
        return res.text(text => {
            let json = null;
            let result;
            try {
                json = JSON.parse(text);
            } catch (e) {
                json = null;
            } finally {
                if (json && (cache == ReqCacheType.ONLY_CACHE || cache == cache.ReqCacheType.DOUBLE_CB)) {
                    myDb.setItem(id + '-lastRes', {
                        res: json,
                        updateAt: Date.now()
                    });
                }
                return Promise.resolve(json || { [ReqConfig.StateField]: res.status, msg: text })
            }
        })
    })
};

export default req;
