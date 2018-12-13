import api from '~/api'

export default {
    namespaced: true,
    state: {
        dutys: [],
        total: 0
    },

    getters: {
        getTotal: state => {
            return state.total
        },
        getDutys: state => {
            return state.dutys.map(item => {
                item.enabled = item.enabled ? '启用' : '禁用'
                return item
            })
        }
    },
    mutations: {
        resetTotal (state, total) {
            state.total = total
        },
        resetDutys (state, dutys) {
            state.dutys = dutys
        }
    },
    actions: {
        apiGetDuty ({commit, state}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._AUTH_DUTY_POST_GET,
                params: params,
                success (data) {
                    console.log('data:', data.rows)
                    commit('resetDutys', data.rows)
                    commit('resetTotal', data.total)
                    callback(data.rows)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        }
    }
}
