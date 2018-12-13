import api from '~/api'

export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {
        apiGetOneRoleGroupAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_GROUP_MODIFY_GET_DELETE,
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
        apiGetOneRoleAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_MODIFY_GET_DELETE,
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
        apiModifyRoleGroupAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_GROUP_MODIFY_GET_DELETE,
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
        apiModifyRoleAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_ROLE_MODIFY_GET_DELETE,
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
