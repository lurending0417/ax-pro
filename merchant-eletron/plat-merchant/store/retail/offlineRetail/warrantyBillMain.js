import api from '~/api'
import {baseUtil, dateUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        warrantyBills: [],
        warrantyBillItemList: [],
        total: 0,
        warrantyBillItem: {} // 某一个质保单
    },
    getters: {
        getWarrantyBills: state => {
            return state.warrantyBills.map(bill => {
                bill.storeName = baseUtil.getNameFromPropId('stores', bill.storeId)
                bill.createTime = dateUtil.pattern(new Date(bill.createTime), 'yyyy-MM-dd HH:mm:ss')
                if (bill.customer) {
                    bill.telephone = bill.customer.telephone
                    bill.customer.createTime = dateUtil.pattern(new Date(bill.customer.createTime), 'yyyy-MM-dd HH:mm:ss')
                }
                bill.salesmanName = baseUtil.getNameFromPropId('staffs', bill.salesmanId)
                return bill
            })
        },
        getWarrantyBillItemList(state) {
            return state.warrantyBillItemList.map(item => {
                item.metalName = baseUtil.getNameFromPropId('metal', item.metalId)
                item.gemName = baseUtil.getNameFromPropId('gem', item.gemId)
                item.categoryName = baseUtil.getNameFromPropId('category', item.categoryId)
                item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                return item
            })
        },
        getWarrantyBillItem(state) {
            return state.warrantyBillItem
        },
        getTotal: state => state.total
    },
    mutations: {
        resetWarrantyBills(state, warrantyBills) {
            state.warrantyBills = warrantyBills
        },
        resetWarrantyBillItemList(state, warrantyBillItemList) {
            state.warrantyBillItemList = warrantyBillItemList
        },
        resetTotal(state, total) {
            state.total = total
        },
        resetWarrantyBillItem(state, warrantyBillItem) {
            state.warrantyBillItem = warrantyBillItem
        }
    },
    actions: {
        // 获取所有质保单
        apiGetWarrantyBills({commit, state}, params) {
            api.request({
                url: api.consts._RETAIL_CONSUME_GET,
                params: {...params},
                success(data) {
                    commit('resetWarrantyBills', data.rows)
                    commit('resetTotal', data.total)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 新增质保单
        apiPostWarrantyBill({commit, state}, obj) {
            let {params, callBack} = obj
            api.request({
                url: api.consts._RETAIL_CONSUME_POST,
                method: 'post',
                params,
                success(data) {
                    callBack();
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 根据id获取质保单详情
        apiGetWarrantyBillItem({commit, state}, obj) {
            let {params, callBack} = obj
            api.request({
                url: api.consts._RETAIL_CONSUME_DETAIL_ITEMS_GET,
                params,
                success(data) {
                    commit('resetWarrantyBillItemList', data.rows);
                    callBack()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        }
    }
}
