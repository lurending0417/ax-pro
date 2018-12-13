import api from '~/api'

export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {
        apiGetOneDutyAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_DUTY_MODIFY_GET_DELETE,
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
        apiModifyDutyAuth ({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_DUTY_MODIFY_GET_DELETE,
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
