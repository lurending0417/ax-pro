import api from '~/api'

export default {
    namespaced: true,
    state: {
        duryAuthTpls: []
    },
    getters: {
        getDutyAuthTpls: state => state.duryAuthTpls
    },
    mutations: {
        resetDutyAuthTpls (state, duryAuthTpls) {
            state.duryAuthTpls = duryAuthTpls
        }
    },
    actions: {
        apiGetDutyAuthTpl ({commit, state}) {
            api.request({
                url: api.consts._AUTH_DUTY_TPL_POST_GET,
                method: 'get',
                params: {},
                success (data) {
                    console.log(data)
                    commit('resetDutyAuthTpls', data.rows)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        apiAddDutyAuthTpl ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_DUTY_TPL_POST_GET,
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
        apiDeleteDutyAuthTpl ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_DUTY_TPL_MODIFY_GET_DELETE,
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
        apiGetRoleAuthTplTree ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_DUTY_TREE_TPL_GET,
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
                url: api.consts._AUTH_ROLE_DUTY_TPL_POST,
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
