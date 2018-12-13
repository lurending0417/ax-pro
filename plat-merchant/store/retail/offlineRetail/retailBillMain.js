import api from '~/api'
import {baseUtil, dateUtil, constUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        retailBills: [],
        total: 0,
        exchangeBill: {},
        exchangeBillItems: [],
        hasExchangeBill: false
    },
    getters: {
        getRetailBills: state => {
            return state.retailBills.map(bill => {
                if (baseUtil.getNameFromPropId('wareHouse', bill.wareHouseId)) {
                    bill.wareHouseId = baseUtil.getNameFromPropId('wareHouse', bill.wareHouseId)
                }
                if (bill.salesmanId.indexOf(',') === -1) {
                    bill.salesmanName = baseUtil.getNameFromPropId('staffs', bill.salesmanId)
                } else {
                    let tempStr = '';
                    let tempArr = bill.salesmanId.split(',');
                    tempArr.forEach((staffId) => {
                        tempStr += baseUtil.getNameFromPropId('staffs', staffId) + ','
                    })
                    bill.salesmanName = tempStr.slice(0, tempStr.length - 1);
                }
                if (bill.paid === true || bill.paid === false) {
                    bill.paid = bill.paid ? '已付款' : '未付款'
                }
                bill.createTime = dateUtil.pattern(new Date(bill.createTime), 'yyyy-MM-dd HH:mm:ss')
                return bill
            })
        },
        getExchangeBill: state => {
            return state.exchangeBill
        },
        getExchangeBillItems: state => {
            state.exchangeBillItems.map(item => {
                item.metalName = baseUtil.getMetadataMetalById(item.metalId).name
                item.priceType = constUtil._CONST_RETAIL_PRICE_TYPE.find(ele => ele.value === item.priceType).name
                return item
            })
            return state.exchangeBillItems
        },
        getHasExchangeBill: state => {
            return state.hasExchangeBill
        },
        getWareHouse: () => {
            return baseUtil.getWarehouseByStoreId()
        },
        getStaffs: () => {
            return baseUtil.getMetadataStaffs()
        },
        getTotal: state => state.total
    },
    mutations: {
        resetRetailBills(state, retailBills) {
            state.retailBills = retailBills
        },
        resetPagination(state, params) {
            state.start = params.start
            state.limit = params.limit
        },
        resetTotal(state, total) {
            state.total = total
        },
        resetExchangeBill(state, exchangeBill) {
            state.exchangeBill = exchangeBill
        },
        resetHasExchangeBill(state, hasExchangeBill) {
            state.hasExchangeBill = hasExchangeBill
        },
        resetExchangeItems(state, exchangeBillItems) {
            state.exchangeBillItems = exchangeBillItems
        }
    },
    actions: {
        apiGetRetailBill({commit, state}, params) {
            api.request({
                url: api.consts._RETAIL_GET_POST_BILL,
                params: {...params},
                success(data) {
                    commit('resetRetailBills', data.rows)
                    commit('resetTotal', data.total)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiDeleteRetailBill({commit, state}, obj) {
            api.request({
                url: api.consts._RETAIL_DELETE_GET_BILL,
                method: 'delete',
                params: {
                    billId: obj.params.billId
                },
                success(data) {
                    state.retailBills.splice(obj.index, 1)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 获取单个零售单
        apiGetRetailBillItem({commit, state}, obj) {
            api.request({
                url: api.consts._RETAIL_DELETE_GET_BILL,
                method: 'get',
                params: {
                    billId: obj.params.billId
                },
                success(data) {
                    obj.callback(data)
                }
            })
        }
    }
}
