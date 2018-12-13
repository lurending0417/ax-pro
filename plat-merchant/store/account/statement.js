import api from '~/api'
import {dateUtil, componentUtil} from '~/util';

export default {
    namespaced: true,
    state: {
        tranRecords: [] // 账户的动账记录
    },
    getters: {
    },
    mutations: {
        resetTranRecord(state, {rows, accountType}) {
            state.tranRecords = rows.map(item => {
                item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                if (accountType.slice(0, 4) === 'GOLD') {
                    item.balance = componentUtil.handleGold(item.balance)
                }
                return item
            })
        }
    },
    actions: {
        // 获取黄金日统计表
        getGoldDailyReport({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._REPORT_FINANCE_GOLD_STAT_DAILY,
                method: 'get',
                params,
                success(data) {
                    callback(data)
                }
            })
        },
        // 获取钱包日统计表
        getWalletDailyReport({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._REPORT_FINANCE_WALLET_STAT_DAILY,
                method: 'get',
                params,
                success(data) {
                    callback(data)
                }
            })
        },
        // 获取试戴收入日账单
        getLeaseDailyReport({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._REPORT_FINANCE_LEASE_STAT_INCOME,
                method: 'get',
                params,
                success(data) {
                    callback(data)
                }
            })
        },
        // 获取账户的动账记录
        getGoldTranRecored({commit}, params) {
            api.request({
                url: api.consts._ACCOUNT_TRAN,
                method: 'get',
                params,
                success(data) {
                    commit('resetTranRecord', {
                        rows: data.rows,
                        accountType: params.accountType
                    })
                }
            })
        }
    }
}
