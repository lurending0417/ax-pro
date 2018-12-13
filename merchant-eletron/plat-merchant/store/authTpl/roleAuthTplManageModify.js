import api from '~/api'

export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {
        apiGetOneRoleGroupAuthTpl ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_GROUP_TPL_MODIFY_GET_DELETE,
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
        apiGetOneRoleAuthTpl ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_TPL_MODIFY_GET_DELETE,
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
        apiModifyRoleGroupAuthTpl ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_GROUP_TPL_MODIFY_GET_DELETE,
                method: 'put',
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
        apiModifyRoleAuthTpl ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_TPL_MODIFY_GET_DELETE,
                method: 'put',
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
