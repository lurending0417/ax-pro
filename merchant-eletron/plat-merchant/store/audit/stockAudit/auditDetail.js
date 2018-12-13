import api from '~/api'
import { baseUtil, dateUtil } from '~/util'

export default {
    namespaced: true,
    state: {
        auditTransactions: [] // 审批流转记录
    },
    getters: {
        getAuditTransactions(state) {
            return state.auditTransactions.map(bill => {
                bill.createTime = dateUtil.pattern(new Date(bill.createTime), 'yyyy-MM-dd HH:mm:ss')
                bill.creatorId = baseUtil.getNameFromPropId('staffs', bill.creatorId)
                return bill
            })
        }
    },
    mutations: {
        resetAuditTransactions(state, auditTransactions) {
            state.auditTransactions = auditTransactions;
        }
    },
    actions: {
        // 获取审批流转记录
        auditTransactionGet ({commit, state}, params) {
            // let {sendParams, callback} = params;
            api.request({
                url: api.consts._AUDIT_TRANSACTION_GET,
                params: {
                    recordId: params
                },
                success (data) {
                    console.log('获取审批流转记录data:', data);
                    commit('resetAuditTransactions', data.rows);
                    // callback()
                },
                fail (error) {
                    alert(error.message)
                }
            })
        }
    }
}
