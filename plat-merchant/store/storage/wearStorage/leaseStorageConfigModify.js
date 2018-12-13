import api from '~/api'
// import {baseUtil} from '~/util'

export default {
    namespaced: true,
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
        apiGetLeaseParams({commit, state}, {params, callback}) {
            api.request({
                url: api.consts._STOCK_ITEM_PARAMS_GET,
                method: 'get',
                params,
                success(data) {
                    // commit('resetProcurementParams', data.rows)
                    callback(data.rows)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiPutProcurementParams({commit, state}, obj) {
            api.request({
                url: api.consts._STOCK_ITEM_PARAMS_PUT,
                method: 'put',
                params: {
                    billId: state.billId,
                    itemId: state.itemId,
                    props: obj.props
                },
                success(data) {
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        }
    }
}
