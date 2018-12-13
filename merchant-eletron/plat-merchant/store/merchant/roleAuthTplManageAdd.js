import api from '~/api'

export default {
    namespaced: true,
    state: {
        roleAuthTpls: []
    },
    getters: {
        getRoleAuthTpls: state => state.roleAuthTpls
    },
    mutations: {
        resetRoleAuthTpls (state, roleAuthTpls) {
            state.roleAuthTpls = roleAuthTpls
        }
    },
    actions: {
        apiGetRoleAuthTpl ({commit, state}) {
            api.request({
                url: api.consts._AUTH_ROLE_TREE_GET,
                method: 'get',
                params: {},
                success (data) {
                    console.log(data)
                    commit('resetRoleAuthTpls', data.rows)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        apiAddRoleGroupAuthTpl ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_GROUP_TPL_POST_GET,
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
        apiDeleteRoleGroupAuthTpl ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_GROUP_TPL_MODIFY_GET_DELETE,
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
        apiAddRoleAuthTpl ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_TPL_POST_GET,
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
        apiDeleteRoleAuthTpl ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_TPL_MODIFY_GET_DELETE,
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
        apiGetRoleActionAuthTplTree ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_ACTION_TPL_TREE_GET,
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
        apiAddRoleActionAuthTpl ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_ACTION_TPL_POST,
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
