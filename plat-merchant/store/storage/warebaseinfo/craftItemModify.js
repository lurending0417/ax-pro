import api from '~/api'

export default {
    namespaced: true,
    state: {
        labelName: '',
        craftId: '',
        code: '',
        name: '',
        enabled: ''
    },
    getters: {},
    mutations: {
        resetInfo (state, obj) {
            state.craftId = obj.id || ''
            state.labelName = obj.labelName || ''
            state.code = obj.code || ''
            state.name = obj.name || ''
            state.enabled = obj.enabled || ''
        },
        resetLabelName (state, labbelName) {
            state.labbelName = labbelName
        },
        resetCraftId (state, craftId) {
            state.craftId = craftId
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
        modifyCraftItem ({commit, state}, callback) {
            api.request({
                url: api.consts._WARE_BASE_INFO_CRAFT_PUT,
                method: 'put',
                params: {
                    labelName: state.labelName,
                    craftId: state.craftId,
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
