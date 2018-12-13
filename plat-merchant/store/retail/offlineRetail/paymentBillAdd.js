import api from '~/api'
import {baseUtil, constUtil, dateUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        canChange: true,
        bill: {},
        billType: '',
        items: [],
        userInfo: [],
        exchangeBill: {}, // 置换单
        exchangeBillItems: [], // 置换单详情
        paymentBillDetail: {}, // 从查看收银单详情进入时
        currentBillType: '', // 当前页面的单据类型
        hasExchangeBill: false // 详情页是否关联置换单
    },
    getters: {
        getCanChange: state => state.canChange,
        getBill: state => {
            state.bill.wareHouseId = baseUtil.getNameFromPropId('wareHouse', state.bill.wareHouseId)
            state.bill.storeId = baseUtil.getNameFromPropId('stores', state.bill.storeId)
            if (state.bill.salesmanId) {
                if (state.bill.salesmanId.indexOf(',') > -1) {
                    state.bill.salesmanId = state.bill.salesmanId.split(',').map(item => {
                        return baseUtil.getMetadataStaffs().find(ele => ele.id === item).nickName
                    }).join()
                } else {
                    state.bill.salesmanId = baseUtil.getNameFromPropId('staffs', state.bill.salesmanId)
                }
            }
            return state.bill
        },
        getUserInfo: state => {
            if (state.userInfo.createTime) {
                state.userInfo.createTime = dateUtil.pattern(new Date(state.userInfo.createTime), 'yyyy-MM-dd HH:mm:ss')
            }
            return state.userInfo
        },
        getBillType: state => state.billType,
        getItems: state => {
            return state.items.map(item => {
                if (state.billType === 'RETAIL_REJECT') { // 退货
                    item.totalCost = item.refundCost
                } else if (state.billType === 'RECYCLE_IN') { // 回收
                    item.totalCost = item.totalCost
                    item.updaterId = baseUtil.getNameFromPropId('staffs', item.updaterId)
                } else {
                    // 零售
                }
                item.categoryId = baseUtil.getNameFromPropId('category', item.categoryId)
                item.gemId = baseUtil.getNameFromPropId('gem', item.gemId)
                item.metalId = baseUtil.getNameFromPropId('metal', item.metalId)
                item.priceType = constUtil._CONST_RETAIL_PRICE_TYPE.find(ele => ele.value === item.priceType).name
                item.regularPrice || (item.regularPrice = '/')
                return item
            })
        },
        getPaymentBillDetail: state => {
            return state.paymentBillDetail
        },
        getExchangeBillItems: state => {
            if (state.exchangeBillItems && state.exchangeBillItems.length > 0) {
                return state.exchangeBillItems.map(item => {
                    item.metalId = baseUtil.getMetadataMetalById(item.metalId).name
                    item.priceType = constUtil._CONST_RETAIL_PRICE_TYPE.find(ele => ele.value === item.priceType).name
                    return item
                })
            } else return []
        },
        getExchangeBill: state => state.exchangeBill,
        getHasExchangeBill: state => state.hasExchangeBill
    },
    mutations: {
        resetCanChange(state, canChange) {
            state.canChange = canChange
        },
        resetBill(state, bill) {
            state.bill = bill
        },
        resetUserInfo(state, userInfo) {
            state.userInfo = userInfo
        },
        resetBillType(state, billType) {
            state.billType = billType
        },
        resetExchangeBill(state, exchangeBill) {
            state.exchangeBill = exchangeBill
        },
        resetExchangeBillItems(state, exchangeBillItems) {
            state.exchangeBillItems = exchangeBillItems
        },
        resetItems(state, items) {
            state.items = items
        },
        clearData(state) {
            state.bill = {}
            state.items = []
        },
        resetPaymentBillDetail(state, paymentBillDetail) {
            state.paymentBillDetail = paymentBillDetail
        },
        resetHasExchangeBill(state, hasExchangeBill) {
            state.hasExchangeBill = hasExchangeBill
        }
    },
    actions: {
        apiGetToPay({commit, state}, obj) {
            api.request({
                url: api.consts._PAYMENT_TO_PAY_GET,
                params: obj.params,
                success(data) {
                    commit('resetBillType', data.result.tranType)
                    commit('resetBill', data.result.tranBill)
                    if (data.result.tranBill.exchangeBillId) { // 销售单如果关联了置换单
                        commit('resetExchangeBill', data.result.exchangeBill)
                        commit('resetExchangeBillItems', data.result.exchangeItems)
                    }
                    commit('resetItems', data.result.tranItems)
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiAddPaymentBill({commit, state}, obj) {
            api.request({
                url: api.consts._PAYMENT_BILL_GET_POST,
                method: 'post',
                params: obj.params,
                success(data) {
                    obj.callback();
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiGetPaymentBillDetail({commit, state}, obj) { // 获取收银单付款详情
            api.request({
                url: api.consts._PAYMENT_BILL_GET_DETAIL,
                params: {
                    billId: obj.params.billId
                },
                success(data) {
                    commit('resetHasExchangeBill', false)
                    commit('resetPaymentBillDetail', data.result.payment)
                    commit('resetBillType', data.result.payment.tranType)
                    commit('resetBill', data.result.tranBill)
                    if (data.result.exchangeBill) { // 销售单如果关联了置换单
                        commit('resetHasExchangeBill', true)
                        commit('resetExchangeBill', data.result.exchangeBill)
                        commit('resetExchangeBillItems', data.result.exchangeItems)
                    }
                    commit('resetItems', data.result.tranItems)
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        }
    }
}
