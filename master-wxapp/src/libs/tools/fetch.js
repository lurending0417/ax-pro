///** http 请求 浏览器用 isomorphic-fetch（server 和 client 共用）  native 直接 内置 fetch */
// 默认的fetch 没有timeout
// 微信使用 wx.request  body 替换data  url 放入 options

// const _fetch = typeof fetch == "undefined" ? require('isomorphic-fetch') : fetch;
const _fetch = require('./wxFetch.js') ;

const fetchFun = function (url, options) {
    if (typeof url == 'object') {
        options = url;
        url = options.url
    }

    const timeout = options.timeout || 15000;
    let isTimeOut = false;

    delete options.timeout


    let timeoutProm = new Promise((s, f) => {
        setTimeout(() => {
            f({
                status: 408, // timeout
                msg: '网络超时'
            })
        }, timeout)
    })

    return Promise.race([_fetch(url, options), timeoutProm])
}

export default fetchFun;