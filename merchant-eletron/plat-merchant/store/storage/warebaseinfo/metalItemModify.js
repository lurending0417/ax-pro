import api from '~/api'

export default {
    namespaced: true,
    state: {
        metalId: '',
        code: '',
        name: '',
        labelName: '',
        enabled: ''
    },
    getters: {},
    mutations: {
        resetInfo (state, obj) {
            state.metalId = obj.id || ''
            state.code = obj.code || ''
            state.name = obj.name || ''
            state.labelName = obj.labelName || ''
            state.enabled = obj.enabled === '启用'
        },
        resetMetalId (state, gemId) {
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
        modifyMetalItem ({commit, state}, callback) {
            api.request({
                url: api.consts._WARE_BASE_INFO_METAL_PUT,
                method: 'put',
                params: {
                    metalId: state.metalId,
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
