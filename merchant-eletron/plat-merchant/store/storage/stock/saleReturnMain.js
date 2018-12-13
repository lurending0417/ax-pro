import api from '~/api'
import { dateUtil, baseUtil, constUtil } from '~/util'

export default {
    namespaced: true,
    state: {
        saleReturnItems: [],
        total: 0
    },
    getters: {
        getTotal: state => state.total,
        getSaleReturnItems: state => {
            return state.saleReturnItems.map(item => {
                item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                item.vendorId = baseUtil.getNameFromPropId('vendors', item.vendorId)
                item.status = constUtil._CONST_RETURN_BILL_TYPE.find(ele => ele.value === item.status).name
                item.creatorId = baseUtil.getNameFromPropId('staffs', item.creatorId)
                return item
            })
        }
    },
    mutations: {
        resetSaleReturnItems (state, saleReturnItems) {
            state.saleReturnItems = saleReturnItems
        },
        resetTotal (state, total) {
            state.total = total
        }
    },
    actions: {
        apiGetSaleReturnItems ({state, commit}, params) {
            api.request({
                url: api.consts._STOCK_REJECT_GET_POST_BILL,
                params,
                success (data) {
                    commit('resetSaleReturnItems', data.rows)
                    commit('resetTotal', data.total)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        apiDeleteSaleReturnBill ({state, commit}, obj) {
            api.request({
                url: api.consts._STOCK_REJECT_DELETE_BILL,
                method: 'delete',
                params: {
                    billId: obj.params.billId
                },
                success (data) {
                    obj.callback(data)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        }
    }
}
