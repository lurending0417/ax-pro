// import '../mock';
import apiFetch, { ReqCacheType, ReqConfig, clearLastReq } from '../../libs/tools/api'
import { ApiServer } from '../../common/constant'
import { Loading } from '../../common/actionType'


ReqConfig.StateField = "status"

export const CallApi = "CallApi"

const showLoading = (loading, next) => {
    next({
        type: Loading,
        payload: loading
    })
}


clearLastReq()

export default store => next => (action) => {
    const { type, payload } = action;
    if (type != CallApi) {
        return next(action);
    }


    let {
        loading = true,
        success,
        fail,
        cache = ReqCacheType.NO_CACHE,
        requestOnlyWhen,
        headers = {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        done,
        api,
        ...others
    } = payload;


    let url = api.toString();
    url = /http/.test(url) ? url : (ApiServer + url)

    if (api.method) {
        others.method = api.method
    }

    let token = store.getState().user.get('token');
    if (token) {
        url += "?access-token=" + token
    }
    // headers['authorization'] = 'Bearer ' + token;
    // others.headers = headers;



    let beforeReq = () => {
        loading && showLoading(true, next)
    }

    let toResult = (tag, rs) => {
        let ty = typeof tag;
        if (ty == "string") {
            next({
                type: tag,
                payload: rs
            })
        }
        else if (ty == "function") {
            tag(rs)
        }
    }

    let afterReq = (err, rs) => {
        loading && showLoading(false, next)

        if (err) {
            toResult(fail, err)
        }
        else if (rs[ReqConfig.StateField] != 200) {
            toResult(fail, rs)
        }
        else {
            toResult(success, rs)
        }

        done && done(err, null)
    }

    beforeReq()
    try {
        apiFetch(url, others).then(rs => {
            afterReq(null, rs)
        }).catch(err => {
            console.log(err)
            afterReq(err, null)
        })
    }
    catch (err) {
        console.log(err)
        afterReq(err, null)
    }



}