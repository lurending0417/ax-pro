import api from '~/api'
import {dateUtil, baseUtil, objectUtil, calculateUtil, constUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        mainPageParams: {
            startYmd: '',
            endYmd: '',
            storeId: '',
            wareHouseId: '',
            creatorId: '',
            paid: '',
            query: '',
            start: 0,
            limit: 20
        },
        total: 0,
        totalPay: 0,
        detail: {},
        retailRecycleBills: [], // 获取或筛选的所有回收单
        retailRecycleBillItem: {}, // 某个回收单
        retailRecycleBillDetail: [] // 某个回收单详情
    },

    getters: {
        getRetailRecycleBillsView: state => {
            return state.retailRecycleBills.map(bill => {
                bill.createTime = dateUtil.pattern(new Date(bill.createTime), 'yyyy-MM-dd HH:mm:ss')
                bill.updateTime = dateUtil.pattern(new Date(bill.updateTime), 'yyyy-MM-dd HH:mm:ss')
                bill.paid = bill.paid ? '已付款' : '未付款';
                if (baseUtil.getNameFromPropId('wareHouse', bill.wareHouseId)) {
                    bill.wareHouseId = baseUtil.getNameFromPropId('wareHouse', bill.wareHouseId)
                }
                bill.creatorId = baseUtil.getNameFromPropId('staffs', bill.creatorId)
                bill.updaterId = baseUtil.getNameFromPropId('staffs', bill.updaterId)
                if (bill.customer) {
                    bill.customer.createTime = dateUtil.pattern(new Date(bill.customer.createTime), 'yyyy-MM-dd HH:mm:ss')
                }
                return bill
            })
        },
        getRetailRecycleBillDetailView: state => {
            return state.retailRecycleBillDetail.map(bill => {
                // bill.paid = bill.paid ? '已付款' : '未付款';
                // if (baseUtil.getNameFromPropId('wareHouse', bill.wareHouseId)) {
                //     bill.wareHouseId = baseUtil.getNameFromPropId('wareHouse', bill.wareHouseId)
                // }
                // bill.creatorId = baseUtil.getNameFromPropId('staffs', bill.creatorId)
                bill.updaterId = baseUtil.getNameFromPropId('staffs', bill.updaterId)
                bill.priceType = constUtil._CONST_RETAIL_PRICE_TYPE.find(ele => ele.value === bill.priceType).name
                if (baseUtil.getNameFromPropId('metal', bill.metalId)) {
                    bill.metalId = baseUtil.getNameFromPropId('metal', bill.metalId)
                }
                return bill
            })
        },
        getTotal: state => state.total,
        getTotalPay: state => state.totalPay,
        getRetailRecycleBillItem: state => state.retailRecycleBillItem
    },
    mutations: {
        resetPagination(state, params) {
            state.start = params.start
            state.limit = params.limit
        },
        resetTotal(state, total) {
            state.total = total
        },
        resetRetailRecycleBills(state, retailRecycleBills) {
            state.retailRecycleBills = retailRecycleBills;
        },
        resetMainPageParams(state, obj) {
            state.mainPageParams = objectUtil.replaceSameFieldsValue_1(obj, state.mainPageParams);
        },
        resetRetailRecycleBillItem(state, retailRecycleBillItem) { // 某一个回收单
            state.retailRecycleBillItem = retailRecycleBillItem;
        },
        resetRetailRecycleBillDetail(state, retailRecycleBillDetail) { // 某一个回收单的详情
            state.retailRecycleBillDetail = retailRecycleBillDetail;
        },
        resetTotalPay(state, totalPay) {
            state.totalPay = totalPay.toFixed(2);
        }
    },
    actions: {
        // 查询或筛选回收单
        getRetailRecycleBills({commit, state}, params) {
            params && commit('resetMainPageParams', params)
            api.request({
                url: api.consts._RETAIL_RECYCLE_BILL,
                params: state.mainPageParams,
                success(data) {
                    commit('resetRetailRecycleBills', data.rows)
                    commit('resetTotal', data.total)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 删除回收单
        delRetailRecycleBill({commit, state}, obj) {
            let {billId, callback} = obj;
            api.request({
                url: api.consts._RETAIL_RECYCLE_BILL_ITEM_OPRERATE,
                method: 'delete',
                params: {
                    billId
                },
                success(data) {
                    console.log('删除回收单', data)
                    callback();
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 获取回收单详情
        getRetailRecycleBillDetail({commit, state}, obj) {
            let {billId, callback} = obj;
            console.log(billId);
            api.request({
                url: api.consts._RETAIL_RECYCLE_BILL_ITEM_DETAIL,
                params: {
                    billId
                },
                success(data) {
                    commit('resetRetailRecycleBillDetail', data.rows);
                    callback();
                }
            })
        }

    }
}
