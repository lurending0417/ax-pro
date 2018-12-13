import api from '~/api'

export default {
    namespaced: true,
    state: {
        labelName: '',
        categoryId: '',
        code: '',
        name: '',
        enabled: ''
    },
    getters: {},
    mutations: {
        resetInfo (state, obj) {
            state.categoryId = obj.id || ''
            state.labelName = obj.labelName || ''
            state.code = obj.code || ''
            state.name = obj.name || ''
            state.enabled = obj.enabled || ''
        },
        resetLabelName (state, labbelName) {
            state.labbelName = labbelName
        },
        resetCategoryId (state, categoryId) {
            state.categoryId = categoryId
        },
        resetCode (state, code) {
            state.code = code
        },
        resetName (state, name) {
            state.name = name
        },
        resetEnabled (state, enabled) {
            state.enabled = enabled
        }
    },
    actions: {
        modifyCategotyItem ({commit, state}, callback) {
            api.request({
                url: api.consts._WARE_BASE_INFO_CATEGORY_PUT,
                method: 'put',
                params: {
                    labelName: state.labelName,
                    categoryId: state.categoryId,
                    code: state.code,
                    name: state.name,
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
