import api from '~/api'
// import {baseUtil, dateUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        goldPresentRuleList: [] // 黄金赠送规则列表
    },
    getters: {
        getGoldPresentRuleList(state) {
            console.log('getGoldPresentRuleList');
            // let metalArr = baseUtil.getMetadataMetal()
            // let gemArr = baseUtil.getMetadataGem()
            // let storeArr = baseUtil.getMetadataStore()
            // return state.goldPresentRuleList.map(item => {
            //     // bill.createTime = dateUtil.pattern(new Date(bill.createTime), 'yyyy-MM-dd HH:mm:ss')
            //     item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
            //     item.creatorName = baseUtil.getMetadataStaffById(item.creatorId).nickName;
            //     // 拼装宝石和金属
            //     item.material = handleStr(item.metalIds, metalArr, 'metal') + ',' + handleStr(item.gemIds, gemArr, 'gem')
            //     // 拼装门店
            //     item.store = handleStr(item.storeIds, storeArr, 'store')
            //     item.status = item.enabled ? '启用' : '停用'
            //     return item
            // })
        }
    },
    mutations: {
    },
    actions: {
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
        },
        // 获取现金类账户
        getCashConfig({commit}, obj) {
            console.log('获取现金类账户', obj);
            let {params, callback} = obj
            api.request({
                url: api.consts._ACCOUNT_CASH_GET,
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
        // 充值(获取记录)
        rechargeCashWalletRecord({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._ACCOUNT_CASH_WALLET_RECHARGE_OFFLINE,
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
        // 充值(预创建)
        rechargeCashWalletPre({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._ACCOUNT_CASH_WALLET_RECHARGE_OFFLINE_PRE,
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
        // 充值(正式提交创建)
        rechargeCashWalletPost({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._ACCOUNT_CASH_WALLET_RECHARGE_OFFLINE,
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
        // 充值(添加附件)
        rechargeCashWalletAddAttach({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._ACCOUNT_CASH_WALLET_RECHARGE_OFFLINE_ATTACH_ADD,
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
        // 充值(删除附件)
        rechargeCashWalletDelAttach({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._ACCOUNT_CASH_WALLET_RECHARGE_OFFLINE_ATTACH_DEL,
                method: 'delete',
                params,
                success(data) {
                    callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 发起预支押金的动作
        advancedCashWallet({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._ACCOUNT_CASH_ADVANCED,
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
        // 向预支账户或罚息账户还款
        repayCashWallet({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._ACCOUNT_CASH_WALLET_REPAY,
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
        // 发起提现请求
        withdrawCashWallet({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._ACCOUNT_CASH_WITHDRAW,
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
        // 提现请求记录
        withdrawCashWalletRecord({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._ACCOUNT_CASH_WITHDRAW,
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
        // 获取商户账户基本信息
        getMerchantAccountBaseInfo({commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._MERCHANT_BANK_ACCOUNT,
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
