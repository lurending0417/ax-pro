import api from '~/api'
import {baseUtil, constUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        canChange: true,
        rejectWares: [], // 需要退货的商品
        rejectDetailInfo: {},
        bill: [],
        items: [],
        payBillNumber: [],
        rejectWareHouse: [],
        rejectManId: [],
        paymentBills: [] // 新增页面点击搜索的返回值
    },
    getters: {
        getCanChange: state => state.canChange,
        getRejectWares: state => {
            return state.rejectWares.map(item => {
                item.categoryId && (item.categoryId = baseUtil.getNameFromPropId('category', item.categoryId))
                item.gemId && (item.gemId = baseUtil.getNameFromPropId('gem', item.gemId))
                item.metalId && (item.metalId = baseUtil.getNameFromPropId('metal', item.metalId))
                item.priceType && (item.priceType = constUtil._CONST_RETAIL_PRICE_TYPE.find(ele => ele.value === item.priceType).name)
                return item
            })
        },
        getBill: state => state.bill,
        getPaymentBills(state) {
            if (state.paymentBills.length > 0) {
                state.paymentBills.map((list, index) => {
                    list.items.map((item) => {
                        item.categoryId && (item.categoryId = baseUtil.getNameFromPropId('category', item.categoryId))
                        item.gemId && (item.gemId = baseUtil.getNameFromPropId('gem', item.gemId))
                        item.metalId && (item.metalId = baseUtil.getNameFromPropId('metal', item.metalId))
                        item.priceType && (item.priceType = constUtil._CONST_RETAIL_PRICE_TYPE.find(ele => ele.value === item.priceType).name)
                        item.weight && (item.weight = item.weight + item.weightUnit)
                        item.regularPrice || (item.regularPrice = '/')
                        if (item.rejectAmount < item.amount) {
                            item.canReject = true
                        } else {
                            item.canReject = false
                        }
                        item.hasChoosed = false
                        return item
                    })
                    return list
                })

                return state.paymentBills
            }
        },
        getRejectDetailInfo: state => state.rejectDetailInfo,
        getPayBillNumberObj(state) {
            let {bill, items, payBillNumber} = state;
            return {...bill, items, payBillNumber}
        }
    },
    mutations: {
        resetPaymentBills(state, paymentBills) {
            state.paymentBills = paymentBills;
        },
        resetRejectWares(state, rejectWares) {
            state.rejectWares = rejectWares
        },
        resetRejectDetailInfo(state, rejectDetailInfo) {
            state.rejectDetailInfo = rejectDetailInfo
        },
        clearData(state) {
            state.billNumber = ''
            state.rejectWares = []
            state.bill = []
            state.items = []
            state.payBillNumber = []
        },
        resetCanChange(state, canChange) {
            state.canChange = canChange
        }
    },
    actions: {
        apiGetPaymentBill({commit, state}, obj) {
            api.request({
                url: api.consts._RETAIL_GET_TO_REJECT,
                params: {
                    telephone: obj.params.telephone,
                    payBillNumber: obj.params.payBillNumber
                },
                success(data) {
                    commit('clearData')
                    data.rows.map(list => {
                        list.items.map(item => {
                            item.refundMoneyByInput = 0;
                            return item
                        })
                        return list
                    })
                    commit('resetPaymentBills', data.rows)
                    obj.callback(data)
                }
            })
        },
        apiAddRejectBill({commit, state}, obj) {
            api.request({
                url: api.consts._REJECT_BILL_GET_POST,
                method: 'post',
                params: obj.params,
                success(data) {
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiGetRejectBillItem({commit, state}, obj) {
            api.request({
                url: api.consts._REJECT_BILL_ITEM_GET,
                params: obj.params,
                success(data) {
                    commit('clearData')
                    commit('resetRejectWares', data.rows)
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        }
    }
}
