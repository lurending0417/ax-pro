import api from '~/api'
import {browserUtil, baseUtil, encryptSignUtil, authUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        mobile: '',
        password: '',
        validateCode: '',
        validateToken: '',
        params: ''
    },
    mutations: {
        resetMobile(state, mobile) {
            state.mobile = mobile
        },
        resetPassword(state, password) {
            state.password = password
        },
        resetValidateCode(state, validateCode) {
            state.validateCode = validateCode
        },
        resetValidateToken(state, token) {
            state.validateToken = token
        },
        resetParams(state, params) {
            state.params = params
        }
    },
    actions: {
        loginAction({state, commit, dispatch}, obj) {
            let {params, callback} = obj
            let sendParams = {
                telephone: state.mobile,
                ip: '192.0.0.1',
                client: 'MERCHANT'
            };
            if (params.isPasswordType) {
                sendParams.password = state.password
            } else {
                sendParams.smsToken = state.validateToken;
                sendParams.smsCode = state.validateCode;
            }
            api.request({
                method: 'post',
                url: api.consts._USER_TOKEN_POST,
                notToken: true,
                params: sendParams,
                success(data) {
                    commit('resetParams', params)
                    browserUtil.setCookie('access-token', data.result.token);
                    if (data.result.chooseMerchant) {
                        callback(data.result)
                    } else {
                        dispatch('handleLogin', data)
                        dispatch('downloadTemplate');
                    }
                },
                fail(data) {
                    params.swal({
                        text: data.message,
                        type: 'error'
                    });
                    console.warn(data);
                }
            })
        },
        // 切换商户
        switchMerchant({state, commit, dispatch}, {params, callback}) {
            api.request({
                method: 'post',
                url: api.consts._USER_LOGIN_SWITCH_MERCHANT,
                params,
                success(data) {
                    dispatch('handleLogin', data)
                    callback()
                }
            })
        },
        handleLogin({state}, data) {
            baseUtil.setBasicInfo(data);
            baseUtil.setMetadata(data);
            browserUtil.setCookie('access-token', data.result.token);
            authUtil.createAuthorizedPages(data.result.authorizedPages);
            state.params.swal({
                type: 'success',
                title: '登陆成功！',
                showConfirmButton: false
            });
            if (baseUtil._getBasicInfo() && authUtil.getAuthorizedPages()) {
                setTimeout(function () {
                    location.href = '/welcome';
                    // state.params.router.push('/welcome')
                }, 1000);
            } else {
                state.params.swal({
                    text: '登录失败，请重新登录',
                    type: 'error'
                });
            }
        },
        handleResetPassword({state}, data) {
            baseUtil.setBasicInfo(data);
            baseUtil.setMetadata(data);
            browserUtil.setCookie('access-token', data.result.token);
            authUtil.createAuthorizedPages(data.result.authorizedPages);
            state.params.swal({
                type: 'success',
                title: '重置密码成功！即将跳转到首页……',
                showConfirmButton: false
            });
            if (baseUtil._getBasicInfo() && authUtil.getAuthorizedPages()) {
                setTimeout(function () {
                    location.href = '/welcome';
                }, 1000);
            } else {
                state.params.swal({
                    text: '登录失败，请重新登录',
                    type: 'error'
                });
            }
        },
        downloadTemplate() {
            api.request({
                url: api.consts._DOWNLOAD_TEMPLATE,
                params: {},
                success(data) {
                    baseUtil.setTemplateInLocalStorage(data.result);
                }
            })
        },
        resetPasswordAction({state, commit, dispatch}, {params, callback}) {
            api.request({
                method: 'put',
                url: api.consts._USER_RESET_PASSWORD,
                notToken: true,
                params: params.sendParams,
                success(data) {
                    commit('resetParams', params)
                    browserUtil.setCookie('access-token', data.result.token);
                    if (data.result.chooseMerchant) {
                        callback(data.result)
                    } else {
                        dispatch('handleResetPassword', data)
                        dispatch('downloadTemplate');
                    }
                },
                fail(data) {
                    params.swal({
                        text: data.message,
                        type: 'error'
                    });
                    console.warn(data);
                }
            })
        },
        resetPasswordSettingAction({state}, params) { // 个人设置页面重设密码
            api.request({
                method: 'post',
                url: api.consts._USER_RESET_PASSWORD,
                params: params.sendParams,
                success(data) {
                    params.callBack()
                }
            })
        },
        logout({state}, params) {
            api.request({
                method: 'post',
                url: api.consts._USER_LOGOUT_POST,
                params: {},
                success(data) {
                    params.callBack()
                }
            })
        },
        // 发送短信验证码
        sendSmsCode({state, commit}, callBack) {
            api.request({
                method: 'post',
                url: api.consts._SEND_MS_CODE,
                params: {
                    telephone: state.mobile,
                    sign: encryptSignUtil.encrypt(state.mobile),
                    voice: false
                },
                success(data) {
                    console.log('data', data);
                    commit('resetValidateToken', data.result);
                    callBack(data)
                }
            })
        }
    }
}
