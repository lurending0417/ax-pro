import api from '~/api'

export default {
    namespaced: true,
    state: {
        gemId: '',
        code: '',
        name: '',
        labelName: '',
        enabled: ''
    },
    getters: {},
    mutations: {
        resetInfo (state, obj) {
            state.gemId = obj.id || ''
            state.code = obj.code || ''
            state.name = obj.name || ''
            state.labelName = obj.labelName || ''
            state.enabled = obj.enabled === '启用'
        },
        resetGemId (state, gemId) {
            state.gemId = gemId
        },
        resetCode (state, event) {
            state.code = event.target.value
        },
        resetName (state, event) {
            state.name = event.target.value
        },
        resetLabelName (state, event) {
            state.labelName = event.target.value
        },
        resetEnabled (state, event) {
            state.enabled = event.target.value
        }
    },
    actions: {
        modifyGemstoneItem ({commit, state}, callback) {
            api.request({
                url: api.consts._WARE_BASE_INFO_GEM_PUT,
                method: 'put',
                params: {
                    gemId: state.gemId,
                    code: state.code,
                    name: state.name,
                    labelName: state.labelName,
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
