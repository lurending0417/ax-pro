import api from '~/api'

export default {
    namespaced: true,
    state: {
        type: '', // 字段类型
        targetId: '', // 类型ID
        code: '',
        name: '',
        inputType: '', // 录入方式
        preValues: '', // 预设值
        required: '', // 必填字段
        enabled: ''
    },
    getters: {},
    mutations: {
        resetType (state, type) {
            state.type = type
        },
        resetTargetId (state, targetId) {
            state.targetId = targetId
        },
        resetCode (state, code) {
            state.code = code
        },
        resetName (state, name) {
            state.name = name
        },
        resetInputType (state, inputType) {
            state.inputType = inputType
        },
        resetPreValues (state, preValues) {
            state.preValues = preValues
        },
        resetRequired (state, required) {
            state.required = required
        },
        resetEnabled (state, enabled) {
            state.enabled = enabled
        }
    },
    actions: {
        addParams ({commit, state}, obj) {
            let {callback, params} = obj
            api.request({
                url: api.consts._WARE_BASE_INFO_PARAMS_POST,
                method: 'post',
                params,
                success (data) {
                    if (data.status === 200) {
                        callback()
                    }
                }
            })
        }
    }
}
