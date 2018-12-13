import api from '~/api'

export default {
    namespaced: true,
    state: {
        code: '',
        name: '',
        labelName: '',
        enabled: true,
        total: 0,
        start: 0,
        limit: 20
    },
    getters: {},
    mutations: {
        resetCode (state, code) {
            state.code = code
        },
        resetName (state, name) {
            state.name = name
        },
        resetLabelName (state, labelName) {
            state.labelName = labelName
        },
        resetEnabled (state, enabled) {
            state.enabled = enabled
        }
    },
    actions: {
        addCategotyItem ({commit, state}, obj) {
            let {callback, params} = obj
            api.request({
                url: api.consts._WARE_BASE_INFO_CATEGORY_POST,
                method: 'post',
                params,
                success (data) {
                    callback(data)
                }
            })
        }
    }
}
