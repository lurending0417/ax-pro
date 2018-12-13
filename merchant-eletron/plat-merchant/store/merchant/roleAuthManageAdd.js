import api from '~/api'

function handleCode(data) {
    data.map(item => {
        item.label = item.code + '、' + item.label;
        if (item.children) {
            return handleCode(item.children)
        } else {
            return item
        }
    })
    return data
}

export default {
    namespaced: true,
    state: {
        roleAuths: []
    },
    getters: {
        getRoleAuths: state => {
            return handleCode(state.roleAuths)
        }
    },
    mutations: {
        resetRoleAuths(state, roleAuths) {
            state.roleAuths = roleAuths
        }
    },
    actions: {
        apiGetRoleAuth({commit, state}) {
            api.request({
                url: api.consts._AUTH_ROLE_TREE_GET,
                method: 'get',
                params: {},
                success(data) {
                    commit('resetRoleAuths', data.rows)
                }
            })
        },
        apiAddRoleGroupAuth({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_GROUP_POST_GET,
                method: 'post',
                params: obj.params,
                success(data) {
                    obj.callback(data)
                }
            })
        },
        apiDeleteRoleGroupAuth({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_GROUP_MODIFY_GET_DELETE,
                method: 'delete',
                params: obj.params,
                success(data) {
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiAddRoleAuth({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_POST_GET,
                method: 'post',
                params: obj.params,
                success(data) {
                    obj.callback(data)
                }
            })
        },
        apiDeleteRoleAuth({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_MODIFY_GET_DELETE,
                method: 'delete',
                params: obj.params,
                success(data) {
                    obj.callback(data)
                }
            })
        },
        apiGetRoleActionAuthTree({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_ACTION_TREE_GET,
                params: obj.params,
                success(data) {
                    obj.callback(data.result)
                }
            })
        },
        apiAddRoleActionAuth({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_ACTION_POST,
                method: 'post',
                params: obj.params,
                success(data) {
                    obj.callback(data.result)
                }
            })
        }
    }
}
