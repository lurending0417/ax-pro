import { ReqCacheType } from '../../libs/tools/api'
import { CallApi } from '../middleware/api'

const callApi = (params) => {
    // 做一些参数的检查，避免开发的时候手滑传错了

    if (global.process.env.NODE_ENV == "development") {
        const keys = [
            'api',
            'success',
            'fail',
            'done',
            'body',
            'headers',
            'loading',
            'cache',
            'method',
            'timeout',
            'noRepeat', // 是否防止重复提交
            'needLogin', // 需要登录
        ];
        Object.keys(params).forEach((key) => {
            if (!keys.includes(key)) {
                throw new Error(`不支持的参数:${key},只能使用以下参数:${keys}`);
            }
        });
        const {
            api,
            success,
            fail,
            done,
            body,
            headers,
            loading,
            cache,
            method,
            timeout,
            noRepeat,
            needLogin,
        } = params;

        if (typeof api !== 'string') {
            throw new Error('接口地址必须是字符串');
        }

        if (typeof success !== 'string' && typeof success !== 'function') {
            throw new Error('success 参数必须传，类型为actionType中定义的字符串或者函数');
        }

        if (fail && typeof fail !== 'string' && typeof fail !== 'function') {
            throw new Error('fail 必须为actionType中定义的字符串或函数');
        }

        if (done && typeof done !== 'function') {
            throw new Error('done 必须为函数');
        }

        if (body && typeof body !== 'object') {
            throw new Error('body参数必须是object');
        }

        if (headers && typeof headers !== 'object') {
            throw new Error('headers参数必须是object');
        }

        if (loading && typeof loading !== 'boolean') {
            throw new Error('loading参数必须是bool');
        }

        if (cache && !cache in ReqCacheType) {
            throw new Error('cache参数必须是ReqCacheType中定义的类型');
        }

        if (method && !['POST', 'GET', 'PUT', 'DELETE'].includes(method)) {
            throw new Error('method参数只能是POST或GET');
        }

        if (timeout && typeof timeout !== 'number') {
            throw new Error('time 必须是毫秒数');
        }


        if (noRepeat && typeof noRepeat !== 'boolean') {
            throw new Error('noRepeat 必须是bool');
        }

        if (needLogin && typeof needLogin !== 'boolean') {
            throw new Error('needLogin 必须是bool');
        }
    }

    return {
        type: CallApi,
        payload: params,
    };
}

export default callApi;
