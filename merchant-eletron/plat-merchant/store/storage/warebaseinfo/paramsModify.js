import api from '~/api'

export default {
    namespaced: true,
    state: {
        fieldId: '',
        code: '',
        name: '',
        inputType: '',
        preValues: '',
        required: '',
        enabled: ''
    },
    getters: {},
    mutations: {
        resetFieldId (state, fieldId) {
            state.fieldId = fieldId
        },
        resetCode (state, code) {
            state.code = code
        },
        resetName (state, name) {
            state.name = name
        },
        resetInputType (state, inputType) {
            if (inputType === '文本框') {
                inputType = 'INPUT'
            } else if (inputType === '单选框') {
                inputType = 'RADIO'
            } else if (inputType === '复选框') {
                inputType = 'CHECKBOX'
            }
            state.inputType = inputType
        },
        resetPreValues (state, preValues) {
            state.preValues = preValues
        },
        resetRequired (state, required) {
            if (required === '必填') {
                required = true
            } else if (required === '非必填') {
                required = false
            }
            state.required = required
        },
        resetEnabled (state, enabled) {
            if (enabled === '启用') {
                enabled = true
            } else if (enabled === '禁用') {
                enabled = false
            }
            state.enabled = enabled
        }
    },
    actions: {
        modifyParams ({commit, state}, callback) {
            api.request({
                url: api.consts._WARE_BASE_INFO_PARAMS_PUT,
                method: 'put',
                params: {
                    fieldId: state.fieldId,
                    code: state.code,
                    name: state.name,
                    inputType: state.inputType,
                    preValues: state.preValues,
                    required: state.required,
                    enabled: state.enabled
                },
                success (data) {
                    if (data.status === 200) {
                        callback()
                    }
                }
            })
        }
    }
}
