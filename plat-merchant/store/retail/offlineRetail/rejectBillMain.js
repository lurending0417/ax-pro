import api from '~/api'
import { baseUtil } from '~/util'

export default {
    namespaced: true,
    state: {
        rejectBills: [],
        total: 0
    },
    getters: {
        getTotal: state => state.total,
        getRejectBills: state => {
            return state.rejectBills.map(bill => {
                bill.wareHouseId = baseUtil.getMetadataWareHouse().find(ele => ele.id === bill.wareHouseId).name
                bill.salesmanId = baseUtil.getMetadataStaffs().find(ele => ele.id === bill.salesmanId).nickName
                bill.paid ? bill.paid = '已退款' : bill.paid = '未退款'
                return bill
            })
        },
        getRejectWareHouse: () => {
            let recyclerWareHouse = []
            baseUtil.getStore() && baseUtil.getMetadataWareHouseByStoreId(baseUtil.getStore().id).forEach(wareHouse => {
                if (wareHouse.recycle === true) {
                    recyclerWareHouse.push(wareHouse)
                }
            })
            return recyclerWareHouse
        },
        getStaffs: () => {
            return baseUtil.getMetadataStaffs()
        }
    },
    mutations: {
        resetRejectBills (state, rejectBills) {
            state.rejectBills = rejectBills
        },
        resetPagination (state, params) {
            state.start = params.start
            state.limit = params.limit
        },
        resetTotal (state, total) {
            state.total = total
        }
    },
    actions: {
        apiGetRejectBill ({commit, state}, params) {
            api.request({
                url: api.consts._REJECT_BILL_GET_POST,
                params,
                success (data) {
                    console.log(data)
                    commit('resetRejectBills', data.rows)
                    commit('resetTotal', data.total)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        apiDeleteRejectBill ({commit, state}, obj) {
            api.request({
                url: api.consts._REJECT_BILL_DELETE,
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
        }
    }
}
