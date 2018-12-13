import {Message, MessageBox} from 'element-ui'
import axios from 'axios'
import url from "./url"
import {LoadingEvent} from "../components/common/LoadingEvent";
import baseUtil from "../util/baseUtil";

export default {

    url,

    request(options) {

        if (!options) {
            throw Error('必须传入opts对象！');
        }

        // Magic，序列化后重新解析成对象，脱离引用，可以任意修改，不影响传入对象的自身值。
        if (options.url) {
            options.url = JSON.parse(JSON.stringify(options.url));
        }
        if (options.params) {
            options.params = JSON.parse(JSON.stringify(options.params));
        }

        // 处理 BaseURL
        let env = process.env.NODE_ENV || '';
        switch (env) {
            case 'dev': {
                options.baseUrl = process.env.devBaseUrl;
                break;
            }
            case 'test': {
                options.baseUrl = process.env.testBaseUrl;
                break;
            }
            case 'production': {
                options.baseUrl = process.env.prodBaseUrl;
                break;
            }
            default: {
                throw Error('不匹配的运行环境：' + env);
            }
        }

        // 处理 Method
        if (options.method) {
            options.method = options.method.toLowerCase();
        } else if (options.url && options.url.method) {
            options.method = options.url.method;
        }

        // 处理 URL
        if (options.url && options.url.url) {
            options.url = options.url.url
        }
        if (!options.url || typeof(options.url) !== 'string' || options.url === '') {
            throw Error('参数url不能为空');
        }

        // 处理 PathVariable（ REST风格URL上的路径参数 ）
        let pathVariables = options.url.split('/').map(section => {
            if (/^\{[a-zA-Z0-9_]+\}$/.test(section)) {
                return section.slice(1, -1);
            }
        }).filter(element => element);
        if (pathVariables && options.params) {
            for (let i = 0, j = pathVariables.length; i < j; i++) {
                let pv = pathVariables[i], value = options.params[pv];
                if (!value) {
                    Message.error('参数' + pv + '不能为空');
                    return false;
                }
                options.url = options.url.replace(`{${pv}}`, encodeURIComponent(value));
                delete options.params[pv];
            }
        }

        // 处理 其他请求参数
        if (options.method === 'get') {
            for (let key in options.params) {
                options.url += (options.url.indexOf('?') === -1 ? '?' : '&') + key + '=' + encodeURIComponent(options.params[key]);
            }
        } else {
            let params = '';
            for (let key in options.params) {
                params += (params ? '&' : '') + key + '=' + encodeURIComponent(options.params[key]);
            }
            options.params = params;
        }

        // 处理 AccessToken
        let accessToken = baseUtil.getAccessToken();
        if (typeof(accessToken) == 'string' && accessToken.length > 0) {
            options.url += (options.url.indexOf('?') === -1 ? '?' : '&') + 'access-token=' + accessToken;
        }

        // 处理 Header
        if (!options.headers) {
            options.headers = {};
        }
        if (!options.headers['Content-Type'] && options.params) {
            options.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
        }

        // 处理 Callback
        if (!options.fail) {
            options.fail = function (json) {
                switch (json.status) {
                    case 40102:
                    case 40103: {
                        MessageBox.confirm('当前登录信息已失效，是否重新登录？', {
                            type: 'warning'
                        }).then(() => {
                            baseUtil.logout();
                        }).catch(() => {
                        });
                        break;
                    }
                    default: {
                        Message.error(json.message || '操作失败');
                    }
                }
            };
        }

        // 打开加载中的遮罩层
        LoadingEvent.$emit("mask");

        // 使用axios发送请求
        axios({
            baseURL: options.baseUrl,
            method: options.method,
            url: options.url,
            data: options.params,
            headers: options.headers
        }).then(function (resp) {
            LoadingEvent.$emit("unmask");
            let json = resp.data
            if (json.status === 200) {
                options.success && options.success(json)
            } else {
                options.fail(json);
            }
        }).catch(function (error) {
            LoadingEvent.$emit("unmask");
            Message.error(error.toString());
        });

    }

}
