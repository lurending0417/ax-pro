import api from '~/api'

export default {
    namespaced: true,
    state: {
        duryAuths: []
    },
    getters: {
        getDutyAuths: state => state.duryAuths
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
                    console.log(data)
                    commit('resetDutyAuths', data.rows)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        apiAddDutyAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_DUTY_POST_GET,
                method: 'post',
                params: obj.params,
                success (data) {
                    console.log(data)
                    obj.callback(data)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        apiDeleteDutyAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_DUTY_MODIFY_GET_DELETE,
                method: 'delete',
                params: obj.params,
                success (data) {
                    console.log(data)
                    obj.callback(data)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        apiGetRoleAuthTree ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_DUTY_TREE_GET,
                params: obj.params,
                success (data) {
                    console.log(data)
                    obj.callback(data.result)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        apiAddRoleToAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_DUTY_POST,
                method: 'post',
                params: obj.params,
                success (data) {
                    console.log(data)
                    obj.callback(data)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        }
    }
}
