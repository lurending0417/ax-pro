/**
 * 微信环境
 *  <>-----}|------------------------------->
 *
 */
import { WxAuthJs, WxAuthUser, WxAppId, getApiUrl } from "../common/constant"
import { getUrlParam, query2Object, object2Query } from "./func"
import { API_LOGIN, API_WX_JS } from "../common/api"


export const isWx = () => {
    if (!process.browser) return false;
    return (navigator && navigator.userAgent || "").indexOf("MicroMessenger/") > -1;
}

const registerWx = (ready, debug) => {
    wx.ready(() => {
        _isReady = location.href;
        debug("ready succ")
        // $.toast("readyed")

        if (ready) {
            return ready();
        }

        wx.onMenuShareAppMessage({
            title: "title",
            desc: "desc",
            link: location.href,
            imgUrl: "http://www.baidu.com/icon.png",
            trigger: function (res) {
                //alert('用户点击发送给朋友');
            },
            success: function (res) {
                alert("已分享");
            },
            cancel: function (res) {
                alert("已取消");
            },
            fail: function (res) {
                alert("分享失败");
            }
        });

        wx.onMenuShareTimeline({
            title: "title",
            desc: "desc",
            link: location.href,
            imgUrl: "http://www.baidu.com/icon.png",
            trigger: function (res) {
            },
            success: function (res) {

                Common.OnfrendShreSucc && Common.OnfrendShreSucc();
                alert("已分享");

            },
            cancel: function (res) {
                alert("已取消");
            },
            fail: function (res) {
                alert("分享失败");
            }
        });
    })
}

const requ = (url, body, method = "get") => {
    if (body) {
        body = object2Query(body);
    }
    else {
        body = ""
    }

    url = getApiUrl() + url

    if (method == "get") {
        url += "?" + body;
    }

    const send = {
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        method: method || "get"
    }

    if (method == "post") {
        send.body = body;
    }

    return fetch(url, send).then(res => {
        return res.json()
    }).catch(err => {
        console.log(err)
        // $.toast("网络异常，请稍后再试")
    })
}

const configWx = (res, ready, debug) => {
    const readyWx = (rs) => {
        const {
            timestamp,
            nonceStr,
            signature,
            appId
        } = rs.result;

        wx.error(function (res) {
            // $.toast(JSON.stringify(res));
            // if(process.env=="development")
            // debug(res);
        });

        wx.config({
            debug: process.env == "development",
            appId: appId || WxAppId,
            timestamp,
            nonceStr,
            signature,
            jsApiList: [
                "updateAppMessageShareData",
                "updateTimelineShareData",
                "onMenuShareTimeline", //朋友圈
                "onMenuShareAppMessage", // 朋友
                "startRecord", // 开始录音
                "stopRecord", //
                "onVoiceRecordEnd",
                "playVoice",
                "pauseVoice",
                "stopVoice",
                "onVoicePlayEnd",
                "uploadVoice",
                "downloadVoice",
                "chooseImage",
                "previewImage",
                "uploadImage",
                "downloadImage",
                "translateVoice",
                "openLocation",
                "getLocation",
                "scanQRCode",
                "chooseWXPay"
            ]
        })

        // $.toast("ready start")

        setTimeout(() => {
            registerWx(ready, debug)
        }, 200)
    }

    if (res) {
        return readyWx(res);
    }

    debug("fetch")
    requ(API_WX_JS, {
        url: (location.href)
    }).then(rs => {
        if (typeof wx === "undefined") {
            return setTimeout(() => {
                configWx(rs, ready, debug)
            }, 100)
        }
        debug("ready--" + JSON.stringify(rs))
        readyWx(rs);
    })
}

/**授权跳转 */
export const auth = (cb, cb1) => {
    const force = cb === true ? true : false;


    if (!isWx()) {
        return;
    }

    let wxOpenId = null;
    if (force) {
        cb = cb1;
        localStorage.setItem("token", "")
    }
    else wxOpenId = localStorage.getItem("token")

    if (!force && wxOpenId) {
        return;
    }

    let wxCode = getUrlParam("code");
    const lastCode = localStorage.getItem("wxCode");
    if (lastCode == wxCode) {
        wxCode = null;
    }

    if (wxCode) {
        // return;
        localStorage.setItem("wxCode", wxCode);

        requ(API_LOGIN, {
            code: wxCode,
            client: "WAP"
        }, "post").then(rs => {
            cb && cb(null, rs)
        }).catch(err => {
            cb && cb(err)
        })
        return;
    }
    else {
        // 重定向 获取code
        // const scope="snsapi_base"
        const scope = "snsapi_userinfo"
        // const redir=location.host +(path?`/${path.replace(/\//g,"$")}`:"")
        let redir = (location.href);
        const ps = query2Object(location.href) || {};
        if (ps.code) {
            delete ps.code;
        }
        redir = `${location.protocol}//${location.host}${location.pathname}?` + object2Query(ps);

        redir = encodeURIComponent(redir);

        console.log("red>", redir)


        location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WxAppId}&redirect_uri=${redir}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`
    }
}

var _isReady = false;

/** js sdk 准备 */
export const setUp = (ready = () => {
}, debug = (s) => {
    console.log(s)
}) => {
    debug("wx check")
    if (isWx()) {
        debug("wx begin")
        if (_isReady === location.href) {
            return;
        }
        debug("ready config")
        configWx(null, ready, debug)
    }
    else {
        debug("not wx")
    }
}

export const checkApi = (api) => {
    return new Promise((s, f) => {
        wx.checkJsApi({
            jsApiList: [api], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function (res) {
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                s();
            },
            fail: err => {
                // $.toast(">>" + JSON.stringify(err))
                f(err)
            }
        });
    })

}


export const wxPayByBridge = (params, cb) => {
    WeixinJSBridge.invoke(
        "getBrandWCPayRequest", {
            "appId": params.appId,//公众号名称，由商户传入
            "timeStamp": params.timeStamp,//时间戳，自1970年以来的秒数
            "nonceStr": params.nonceStr,//随机串
            "package": params.package,
            "signType": params.signType,//微信签名方式：
            "paySign": params.paySign//微信签名
        },
        function (res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                $.toast("支付成功")
                cb(null)
            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                $.toast("用户取消")
                cb("用户取消")
            } else {
                $.toast("支付失败，请稍后再试")
                cb("支付失败，请稍后再试")
            }
        }
    );

}

// 支付
export const wxPay = (result, cb) => {
    if (!isWx()) {
        return cb("不是微信环境")
    }
    // 未准备
    if (_isReady != location.href)
        return wxPayByBridge(result, cb)
    const { timeStamp, nonceStr, signType, paySign } = result || {};

    wx.chooseWXPay({
        timestamp: timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
        package: result.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: paySign, // 支付签名
        success: function (res) {
            // 支付成功后的回调函数
            cb(null, res)
        },
        fail: err => {

            cb(err)
        }
    });
}

// wait auth
export const waitAuth = () => {
    if (!isWx() || !process.browser) {
        return Promise.resolve();
    }
    const token = localStorage.getItem("token");
    if (token) {
        return Promise.resolve();
    }
    else {
        return new Promise(s => {
            setTimeout(() => {
                waitAuth().then(() => {
                    s();
                })
            }, 100)
        })
    }
}

const uploadOne = async (rawId) => {
    if (!rawId) return "";
    return new Promise(s => {
        wx.uploadImage({
            localId: rawId.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                console.log("upload succ")
                var serverId = res.serverId; // 返回图片的服务器端ID
                // 传给服务器
                s(serverId);
            },
            fail: (err) => {
                console.log(JSON.stringify(err).substr(0, 100))
                s("")
            }
        });
    })

}

export const wxUploadImgs = async (arrs) => {
    if (!(arrs instanceof Array)) {
        arrs = [arrs]
    }
    if (!arrs.length) {
        return [];
    }
    if (arrs.length == 1) {
        const rs = await uploadOne(arrs[0])
        return [rs].filter(Boolean)
    }

    const rs = [];
    for (var i = 0, l = arrs.length; i < l; i++) {
        const mid = await uploadOne(arrs[i]);
        if (mid) {
            rs.push(mid)
        }
    }
    return rs;
}

const getLocalOne = async (rawId) => {
    if (!rawId) return "";
    return new Promise(s => {
        wx.getLocalImgData({
            localId: rawId.toString(), // 图片的localID
            success: function (res) {
                var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                // var imgs = this.state.imgArr.push(localData);
                s(localData)
            },
            fail: err => {
                console.error(err);
                s("")
            }
        });
    })
}

export const wxGetLocalImgDatas = async (arrs) => {
    if (!(arrs instanceof Array)) {
        arrs = [arrs]
    }
    if (arrs.length == 1) {
        const rs = await getLocalOne(arrs[0])
        return [rs].filter(Boolean)
    }

    const rs = [];
    for (var i = 0, l = arrs.length; i < l; i++) {
        const mid = await getLocalOne(arrs[i]);
        if (mid) {
            rs.push(mid)
        }
    }
    return rs;
}



export const wxShare = async ({ title, desc, path, imgUrl, times = 0 }) => {
    imgUrl = imgUrl || (location.protocol + "//" + location.host + "/static/share.png")
    console.log("init share")
    if (!isWx()) {
        return;
    }
    if (times > 100) {
        return;
    }
    if (!_isReady) {
        return new Promise((s, f) => {
            setTimeout(() => {
                wxShare({ title, desc, path, imgUrl, times: times + 1 }).then(s);
            }, 100)
        })
    }
    const link = location.protocol + "//" + location.host + path
    console.log("inited share--" + link)
    wx.ready(() => {
        console.log("readyed share")
        // 6.7.2 
        wx.updateAppMessageShareData({
            title: title,
            desc: desc,
            link: link,
            imgUrl: imgUrl || "https://f1.9999ax.com/user/avatar/201809/a7d94df75b514a1b9959e3ed82b3cb9c"
        }, res => {
            console.log(JSON.stringify(res || {}))
            console.log("app msg updated")
        });

        wx.updateTimelineShareData({
            title: title,
            desc: desc,
            link: link,
            imgUrl: imgUrl || "https://f1.9999ax.com/user/avatar/201809/a7d94df75b514a1b9959e3ed82b3cb9c"
        }, res => {
            console.log(JSON.stringify(res || {}))
            console.log("time line msg updated")
        });

        // 老版本
        wx.onMenuShareAppMessage({
            title: title,
            desc: desc,
            link: link,
            imgUrl: imgUrl || "https://f1.9999ax.com/user/avatar/201809/a7d94df75b514a1b9959e3ed82b3cb9c",
            trigger: function (res) {
                console.log("用户点击发送给朋友");
            },
            success: function (res) {
                console.log("已分享");
            },
            cancel: function (res) {
                console.log("已取消");
            },
            fail: function (res) {
                console.log("分享失败");
            }
        });

        wx.onMenuShareTimeline({
            title: title,
            desc: desc,
            link: link,
            imgUrl: imgUrl || "https://f1.9999ax.com/user/avatar/201809/a7d94df75b514a1b9959e3ed82b3cb9c",
            trigger: function (res) {
                console.log("用户点击发送给朋友");
            },
            success: function (res) {

                console.log("已分享");

            },
            cancel: function (res) {
                console.log("已取消");
            },
            fail: function (res) {
                console.log("分享失败");
            }
        });
    })

}


