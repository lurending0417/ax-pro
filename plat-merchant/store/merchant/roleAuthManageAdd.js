import api from '~/api'

export default {
    namespaced: true,
    state: {
        roleAuths: []
    },
    getters: {
        getRoleAuths: state => state.roleAuths
    },
    mutations: {
        resetRoleAuths (state, roleAuths) {
            state.roleAuths = roleAuths
        }
    },
    actions: {
        apiGetRoleAuth ({commit, state}) {
            api.request({
                url: api.consts._AUTH_ROLE_TREE_GET,
                method: 'get',
                params: {},
                success (data) {
                    console.log(data)
                    commit('resetRoleAuths', data.rows)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        apiAddRoleGroupAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_GROUP_POST_GET,
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
        apiDeleteRoleGroupAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_GROUP_MODIFY_GET_DELETE,
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
        apiAddRoleAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_POST_GET,
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
        apiDeleteRoleAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_MODIFY_GET_DELETE,
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
        apiGetRoleActionAuthTree ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_ACTION_TREE_GET,
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
        apiAddRoleActionAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_ACTION_POST,
                method: 'post',
                params: obj.params,
                success (data) {
                    console.log(data)
                    obj.callback(data.result)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        }
    }
}
