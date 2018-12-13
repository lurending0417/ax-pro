import api from '~/api'
import { baseUtil } from '~/util'

export default {
    namespaced: true,
    state: {
        saleReturnBill: {}, // 生成的退货单
        saleReturnBillItems: [], // 退货单明细
        totalAmount: 0, // 总数量
        totalWeight: 0, // 总质量
        totalRegularPrice: 0, // 总原价
        totalProcessCharging: 0, // 总工费
        totalCostPrice: 0 // 总成本价
    },
    getters: {
        getSaleReturnBill: state => {
            if (baseUtil.getNameFromPropId('vendors', state.saleReturnBill.vendorId)) {
                state.saleReturnBill.vendorId = baseUtil.getNameFromPropId('vendors', state.saleReturnBill.vendorId)
            }
            return state.saleReturnBill
        },
        getSaleReturnBillItems: state => {
            return state.saleReturnBillItems.map(item => {
                item.categoryId = baseUtil.getNameFromPropId('category', item.categoryId)
                item.gemId = baseUtil.getNameFromPropId('gem', item.gemId)
                item.metalId = baseUtil.getNameFromPropId('metal', item.metalId)
                item.craftId = baseUtil.getNameFromPropId('craft', item.craftId)
                return item
            })
        }
    },
    mutations: {
        clearData (state) {
            state.saleReturnBillItems = []
        },
        resetSaleReturnBill (state, saleReturnBill) {
            state.saleReturnBill = saleReturnBill
        },
        resetSaleReturnBillItems (state, saleReturnBillItems) {
            state.saleReturnBillItems = saleReturnBillItems
        },
        resetTotalNumber (state) {
            state.totalAmount = 0
            state.totalWeight = 0
            state.totalRegularPrice = 0
            state.totalProcessCharging = 0
            state.totalCostPrice = 0
            state.saleReturnBillItems.forEach(item => {
                state.totalAmount += item.amount
                state.totalWeight += item.weight
                state.totalCostPrice += item.costPrice || 0
                if (item.regularPrice) {
                    state.totalRegularPrice += item.regularPrice
                }
                if (item.computedProcessingCharges) {
                    state.totalProcessCharging += item.computedProcessingCharges
                }
            })
        }
    },
    actions: {
        // 生成退货单
        apiAddSaleReturnBill ({state, commit}, obj) {
            api.request({
                url: api.consts._STOCK_REJECT_GET_POST_BILL,
                method: 'post',
                params: obj.params,
                success (data) {
                    console.log(data.result)
                    commit('resetSaleReturnBill', data.result)
                    obj.callback(data)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        // 退货单添加明细
        apiAddSaleReturnItem ({state, commit}, obj) {
            api.request({
                url: api.consts._STOCK_REJECT_GET_POST_ITEM,
                method: 'post',
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
        // 获取退货单明细
        apiGetSaleReturnItem ({state, commit}, obj) {
            api.request({
                url: api.consts._STOCK_REJECT_GET_POST_ITEM,
                params: obj.params,
                success (data) {
                    console.log(data)
                    commit('resetSaleReturnBillItems', data.rows)
                    commit('resetTotalNumber')
                    obj.callback(data)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        // 删除退货单明细
        apiDeleteSaleReturnItem ({state, commit}, obj) {
            api.request({
                url: api.consts._STOCK_REJECT_DELETE_ITEM,
                method: 'delete',
                params: {
                    billId: obj.params.billId,
                    itemId: obj.params.itemId
                },
                success (data) {
                    state.saleReturnBillItems.forEach((item, index) => {
                        if (item.id === obj.params.itemId) {
                            state.saleReturnBillItems.splice(index, 1)
                            commit('resetTotalNumber')
                        }
                    })
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        // 退货单提交审核
        apiSubmitSaleReturnItem ({state, commit}, obj) {
            api.request({
                url: api.consts._STOCK_REJECT_SUBMIT_BILL,
                method: 'post',
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
