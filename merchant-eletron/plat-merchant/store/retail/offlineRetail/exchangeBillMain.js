import api from '~/api'
import { baseUtil, dateUtil } from '~/util'

export default {
    namespaced: true,
    state: {
        exchangeBills: [],
        start: 0,
        limit: 20,
        total: 0
    },
    getters: {
        getTotal: state => state.total,
        getExchangeBills: state => {
            return state.exchangeBills.map(item => {
                item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                item.paid ? item.paid = '已付款' : item.paid = '未付款'
                item.creatorId = baseUtil.getNameFromPropId('staffs', item.creatorId)
                item.storeId = baseUtil.getMetadataStoreById(item.storeId).name
                item.wareHouseId = baseUtil.getNameFromPropId('wareHouse', item.wareHouseId)
                return item
            })
        }
    },
    mutations: {
        resetExchangeBills (state, exchangeBills) {
            state.exchangeBills = exchangeBills
        },
        resetTotal (state, total) {
            state.total = total
        },
        resetPagination (state, params) {
            state.start = params.start
            state.limit = params.limit
        }
    },
    actions: {
        apiGetExchangeBill ({commit, state}, obj) {
            obj.page && commit('resetPagination', obj.page)
            api.request({
                url: api.consts._EXCHANGE_BILL_GET_POST,
                params: {
                    start: state.start,
                    limit: state.limit,
                    ...obj.params
                },
                success (data) {
                    console.log(data)
                    commit('resetExchangeBills', data.rows)
                    commit('resetTotal', data.total)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        apiDeleteExchangeBill ({commit, state}, obj) {
            api.request({
                url: api.consts._EXCHANGE_BILL_DELETE_GET,
                method: 'delete',
                params: {...obj.params},
                success (data) {
                    console.log(data)
                    obj.callback()
                },
                fail (error) {
                    alert(error.message)
                }
            })
        }
    }
}
