import api from '~/api'
import {baseUtil, constUtil, dateUtil, componentUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        stockAuditBillList: [], // 采购入库审批记录
        stockAuditDetail: '', // 点击详情的采购入库审批记录对象id
        total: 0
    },
    getters: {
        stocksAuditView(state) {
            return state.stockAuditBillList;
        },
        stocksView: state => { // 入库审批单详情
            state.stockAuditBillList.map(bill => {
                let item = bill.tranBill;
                if (bill.type === 'GOODS_STOCK') {
                    item.wareHouseName = baseUtil.getNameFromPropId('wareHouse', item.wareHouseId)
                    item.vendorName = baseUtil.getNameFromPropId('vendors', item.vendorId)
                    item.buyerName = baseUtil.getNameFromPropId('staffs', item.buyerId)
                    item.pkgWeightShow = item.pkgWeight + item.weightUnit
                    item.pkgCostShow = item.pkgCost + '元'
                    item.status = componentUtil.getStockBillStatus(item.status)
                    item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                    if (constUtil._CONST_COST_PRICE_ALGORITHM.find(ele => item.costPriceAlgorithm === ele.value)) {
                        item.costPriceTypeShow = constUtil._CONST_COST_PRICE_ALGORITHM.find(ele => item.costPriceAlgorithm === ele.value).name
                    }
                    if (constUtil._CONST_STOCK_TYPE.find(ele => item.stockType === ele.value)) {
                        item.stockTypeShow = constUtil._CONST_STOCK_TYPE.find(ele => item.stockType === ele.value).name
                    }
                } else if (bill.type === 'GOODS_STOCK_REJECT') {
                    item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                    item.vendorId = baseUtil.getNameFromPropId('vendors', item.vendorId)
                    if (constUtil._CONST_RETURN_BILL_TYPE.find(ele => ele.value === item.status)) {
                        item.status = constUtil._CONST_RETURN_BILL_TYPE.find(ele => ele.value === item.status).name
                    }
                } else if (bill.type === 'GOODS_INVENTORY') {
                    item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                    item.wareHouseId = baseUtil.getNameFromPropId('wareHouse', item.wareHouseId)
                    item.status = componentUtil.getInventoryBillStatus(item.status)
                    item.creatorId = baseUtil.getNameFromPropId('staffs', item.creatorId)
                }
                item.nodeUserName = baseUtil.getNameFromPropId('staffs', bill.nodeUserId)
                item.recordId = bill.id
                item.unFinished = bill.status === 'WAIT_AUDIT' || bill.status === 'AUDITING'
                let auditRecordStatus = baseUtil.getEnumsByKey('auditRecordStatus');
                if (auditRecordStatus.find(ele => ele.id === bill.status)) {
                    item.status = auditRecordStatus.find(ele => ele.id === bill.status).name
                }
                return bill
            })
            let stockView = [];
            state.stockAuditBillList.forEach((item) => {
                stockView.push(item.tranBill);
            })
            return stockView
        },
        getTotal(state) {
            return state.total
        },
        getStockAuditDetail(state) {
            return state.stockAuditDetail
        }
    },
    mutations: {
        resetTotal(state, total) {
            state.total = total;
        },
        resetStocksList(state, stockAuditBillList) {
            state.stockAuditBillList = stockAuditBillList;
        },
        resetStockAuditDetail(state, stockAuditDetail) {
            state.stockAuditDetail = stockAuditDetail;
        }
    },
    actions: {
        // 审核通过
        auditApprove({commit, state}, params) {
            let {sendParams, callback} = params;
            api.request({
                url: api.consts._AUDIT_APPROVE,
                params: {
                    recordId: sendParams
                },
                method: 'post',
                success(data) {
                    console.log('data:', data);
                    callback()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 审核不通过
        auditDecline({commit, state}, params) {
            let {sendParams, callback} = params;
            api.request({
                url: api.consts._AUDIT_DECLINE,
                params: {
                    recordId: sendParams
                },
                method: 'post',
                success(data) {
                    console.log('data:', data);
                    callback()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 获取或筛选所有的审批记录
        auditRecordListGet({commit, state}, params) {
            api.request({
                url: api.consts._AUDIT_RECORD_ALL_GET,
                params,
                success(data) {
                    commit('resetStocksList', data.rows);
                    commit('resetTotal', data.total);
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 获取审批流转记录
        auditTransactionGet({commit, state}, params) {
            let {sendParams, callback} = params;
            api.request({
                url: api.consts._AUDIT_TRANSACTION_GET,
                params: {
                    recordId: sendParams
                },
                success(data) {
                    console.log('data:', data);
                    commit('resetAuditTransactions', data.rows);
                    callback()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 获取审批记录
        auditRecordGet({commit, state}, params) {
            let {sendParams, callback} = params;
            api.request({
                url: api.consts._AUDIT_RECORD_GET,
                params: {
                    recordId: sendParams
                },
                success(data) {
                    console.log('data:', data);
                    callback()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        }
    }
}
