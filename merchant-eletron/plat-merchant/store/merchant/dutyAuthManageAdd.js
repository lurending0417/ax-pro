import api from '~/api'

export default {
    namespaced: true,
    state: {
        duryAuths: []
    },
    getters: {
        getDutyAuths: state => {
            return state.duryAuths.map(item => {
                item.name = item.code + '、' + item.name;
                return item
            })
        }
    },
    mutations: {
        resetDutyAuths (state, duryAuths) {
            state.duryAuths = duryAuths
        }
    },
    actions: {
        apiGetDutyAuth ({commit, state}) {
            api.request({
                url: api.consts._AUTH_DUTY_POST_GET,
                method: 'get',
                params: {},
                success (data) {
                    commit('resetDutyAuths', data.rows)
                }
            })
        },
        apiAddDutyAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_DUTY_POST_GET,
                method: 'post',
                params: obj.params,
                success (data) {
                    obj.callback(data)
                }
            })
        },
        apiDeleteDutyAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_DUTY_MODIFY_GET_DELETE,
                method: 'delete',
                params: obj.params,
                success (data) {
                    obj.callback(data)
                }
            })
        },
        apiGetRoleAuthTree ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_DUTY_TREE_GET,
                params: obj.params,
                success (data) {
                    obj.callback(data.result)
                }
            })
        },
        apiAddRoleToAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_DUTY_POST,
                method: 'post',
                params: obj.params,
                success (data) {
                    obj.callback(data)
                }
            })
        }
    }
}
