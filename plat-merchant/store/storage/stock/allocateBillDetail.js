import api from '~/api'
import {baseUtil, numberUtil, calculateUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        allocateBillsDetail: [],
        allocateBill: {},
        staffStoreId: ''
    },
    getters: {
        getAllocateBillsDetail: state => { // 获取调拨单中明细
            return state.allocateBillsDetail.map(detail => {
                console.log(detail)
                if (baseUtil.getNameFromPropId('vendors', detail.vendorId)) {
                    detail.vendorId = baseUtil.getNameFromPropId('vendors', detail.vendorId)
                }
                if (baseUtil.getNameFromPropId('category', detail.categoryId)) {
                    detail.categoryId = baseUtil.getNameFromPropId('category', detail.categoryId)
                }
                if (baseUtil.getNameFromPropId('gem', detail.gemId)) {
                    detail.gemId = baseUtil.getNameFromPropId('gem', detail.gemId)
                }
                if (baseUtil.getNameFromPropId('metal', detail.metalId)) {
                    detail.metalId = baseUtil.getNameFromPropId('metal', detail.metalId)
                }
                if (baseUtil.getNameFromPropId('craft', detail.craftId)) {
                    detail.craftId = baseUtil.getNameFromPropId('craft', detail.craftId)
                }
                return detail
            })
        },
        getAllocateBill: state => state.allocateBill, // 获取当前点击的调拨单信息
        getStaffStoreId: state => { // 获取当前员工店铺id
            state.staffStoreId = baseUtil.getStore().id
            return state.staffStoreId
        },
        getTotalMarkData: state => {
            let obj = {
                nums: 0,
                weight: 0,
                costPrice: 0,
                regularPrice: 0,
                retailPrice: 0,
                extra: 0
            }
            state.allocateBillsDetail.forEach((item, index) => {
                if (item.isChecked) {
                    item.amount && (obj.nums += item.amount)
                    item.weight && (obj.weight += item.weight)
                    item.costPrice && (obj.costPrice += item.costPrice)
                    item.regularPrice && (obj.regularPrice += item.regularPrice)
                    item.retailPrice && (obj.retailPrice += item.retailPrice)
                    if (item.retailPriceAlgorithm === 'TODAY_METAL_PRICE') {
                        obj.extra += calculateUtil.multiply(item.processingCharges, item.weight)
                        if (numberUtil.judgeDecimal(obj.extra)) {
                            obj.extra = Number(obj.extra.toFixed(2));
                        }
                    }
                }
            })
            return obj
        }
    },
    mutations: {
        resetAllocateBillsDetail(state, allocateBillsDetail) {
            state.allocateBillsDetail = allocateBillsDetail
        },
        resetAllocateBill(state, allocateBill) {
            state.allocateBill = allocateBill
        }
    },
    actions: {
        apiAllocateBillsDetail({commit, state}, callback) {
            api.request({
                url: api.consts._STOCK_ALLOCATE_BILL_DETAIL,
                method: 'get',
                params: {
                    billId: state.allocateBill.id
                },
                success(data) {
                    data.rows.forEach(item => {
                        item.isChecked = false
                    })
                    data.rows.map(item => {
                        if (item.retailPriceAlgorithm === 'TODAY_METAL_PRICE') {
                            item.computedProcessingCharges = calculateUtil.multiply(item.weight, item.processingCharges)
                        }
                        return item
                    })
                    commit('resetAllocateBillsDetail', data.rows)
                    callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiAllocateBillsAccept({commit, state}, callback) { // 确认收货
            api.request({
                url: api.consts._STOCK_ALLOCATE_BILL_ACCEPT,
                method: 'post',
                params: {
                    billId: state.allocateBill.id
                },
                success(data) {
                    callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiAllocateBillsReject({commit, state}, callback) { // 拒绝收货
            api.request({
                url: api.consts._STOCK_ALLOCATE_BILL_REJECT,
                method: 'post',
                params: {
                    billId: state.allocateBill.id
                },
                success(data) {
                    callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiAllocateBillConfirmReject({commit, state}, callback) { // 确认拒收
            api.request({
                url: api.consts._STOCK_ALLOCATE_BILL_CONFIRM_REJECT,
                method: 'post',
                params: {
                    billId: state.allocateBill.id
                },
                success(data) {
                    callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        }
    }
}
