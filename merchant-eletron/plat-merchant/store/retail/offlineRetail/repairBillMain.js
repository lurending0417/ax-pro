import api from '~/api'
import { dateUtil } from '~/util'

export default {
    namespaced: true,
    state: {
        repairBills: [],
        total: 0,
        repairItem: []
    },
    getters: {
        getTotal: state => state.total,
        getRepairBills: state => {
            return state.repairBills.map(item => {
                item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                return item
            })
        }
    },
    mutations: {
        resetRepairBills (state, repairBills) {
            state.repairBills = repairBills
        },
        resetTotal (state, total) {
            state.total = total
        }
    },
    actions: {
        // 获取所有维修单
        apiGetRepairBill ({commit}, obj) {
            api.request({
                url: api.consts._REPAIR_BILL_GET_POST,
                params: obj.params,
                success (data) {
                    if (obj.callBack) {
                        obj.callBack(data)
                    } else {
                        commit('resetRepairBills', data.rows)
                        commit('resetTotal', data.total)
                    }
                }
            })
        },
        // 查询销售记录用于维修
        apiGetPaymentBill({commit, state}, {params, callback}) {
            api.request({
                url: api.consts._RETAIL_GET_TO_REPAIR,
                params,
                success(data) {
                    callback(data)
                }
            })
        },
        // 新增维修记录
        apiPostRepairBill(store, {params, callback}) {
            api.request({
                url: api.consts._REPAIR_BILL_GET_POST,
                method: 'post',
                params,
                success(data) {
                    callback(data)
                }
            })
        },
        // 修改维修记录
        apiPutRepairBill({commit, state}, {params, callback}) {
            api.request({
                url: api.consts._REPAIR_BILL_GET_MODIFY,
                method: 'put',
                params,
                success(data) {
                    callback(data)
                }
            })
        }
    }
}
