import {
    RequestLoadingEvent,
    _CONST_OPEN_REQUEST_LOADING,
    _CONST_CLOSE_REQUEST_LOADING
} from '~/components/RequestLoadingEvent'

/** api的扩展 */
export default {
    beforeRequestCallback () {
        RequestLoadingEvent.$emit(_CONST_OPEN_REQUEST_LOADING)
    },
    afterRequestCallback () {
        RequestLoadingEvent.$emit(_CONST_CLOSE_REQUEST_LOADING)
    },
    requestFailCallback (data) {
        // todo
        let errorCode = parseInt(data.errorCode)
        // token失效
        if (errorCode === 4002) {
        } else if (errorCode === 40103) { // token无效

        }
    },
    chooseURL() {
        let env = process.env.PLAT_ENV || '';
        switch (env) {
            case 'dev': {
                return process.env.devBaseUrl;
            }
            case 'test': {
                return process.env.testBaseUrl;
            }
            case 'prod': {
                return process.env.prodBaseUrl;
            }
            default: {
                throw Error('不匹配的运行环境：' + env);
            }
        }
    }
}
