import api from '~/api'
// import {baseUtil, dateUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        goldPresentRuleList: [] // 黄金赠送规则列表
    },
    getters: {
    },
    mutations: {
    },
    actions: {
        // 黄金买入
        buyGold({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._ACCOUNT_GOLD_BUY_POST,
                method: 'post',
                params,
                success(data) {
                    callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 黄金卖出
        sellGold({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._ACCOUNT_GOLD_SELL_POST,
                method: 'post',
                params,
                success(data) {
                    callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 获取黄金账户
        getGoldAccount({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._ACCOUNT_GOLD_GET,
                method: 'get',
                params,
                success(data) {
                    callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 获取账户的动账记录
        getGoldTranRecored({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._ACCOUNT_TRAN,
                method: 'get',
                params,
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
