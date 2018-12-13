import api from '~/api'
import {constUtil, componentUtil, baseUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        teamRule: {}, // 多人业绩分配设置
        equivalentList: [],
        merchantVersion: 'SMART' // 商户版本
    },
    getters: {
        getMerchantVersion (state) {
            return state.merchantVersion
        },
        getTeamRule(state) {
            return state.teamRule;
        },
        getEquivalentList(state) {
            return state.equivalentList.map((item, index) => {
                let metalArr = baseUtil.getMetadataMetal()
                let gemArr = baseUtil.getMetadataGem()
                let categoryArr = baseUtil.getMetadataCategory()
                let wareTypes = [{id: 'MIXED', name: '非素'}, {id: 'PURE', name: '素金'}]
                let processingTypes = [{id: 'HIGH', name: '精品'}, {id: 'NORMAL', name: '普货'}]
                item.enabledName = item.enabled ? '启用' : '禁用';
                item.categoryName = componentUtil.handleStr(item.categoryIds, categoryArr)
                item.gemName = componentUtil.handleStr(item.gemIds, gemArr)
                item.metalName = componentUtil.handleStr(item.metalIds, metalArr)
                item.processingTypeName = componentUtil.handleStr(item.processingTypes, processingTypes)
                item.tranTypeName = componentUtil.handleStr(item.tranTypes, constUtil._CONST_BUSINESS_TYPE)
                item.wareTypeName = componentUtil.handleStr(item.wareTypes, wareTypes)
                item.priceTypeName = componentUtil.handleStr(item.priceTypes, constUtil._CONST_EQUIVALENT_PRICE_TYPE)
                // 处理无金属，无宝石
                if (index === 0) {
                    console.log('item.metalName', item.metalName)
                    console.log('item.gemName', item.gemName)
                }
                if (item.metalIds.split(',').indexOf('none') !== -1) {
                    if (item.metalName) {
                        item.metalName += ',无金属'
                    } else {
                        item.metalName += '无金属'
                    }
                }
                if (item.gemIds.split(',').indexOf('none') !== -1) {
                    if (item.gemName) {
                        item.gemName += ',无宝石'
                    } else {
                        item.gemName += '无宝石'
                    }
                }
                return item
            });
        }
    },
    mutations: {
        resetTeamRule(state, teamRule) {
            state.teamRule = {
                customRule: teamRule.customRule,
                byEqual: teamRule.byEqual
            }
        },
        resetEquivalentList(state, equivalentList) {
            state.equivalentList = equivalentList
        },
        resetMerchantVersion(state, merchantVersion) {
            state.merchantVersion = merchantVersion
        }
    },
    actions: {
        // 获取多人业绩分配规则
        apiGetTeamRule({state, commit}) {
            api.request({
                url: api.consts._REPORT_PERFORMANCE_TEAM_SHARE_RULE,
                method: 'get',
                params: {},
                success(data) {
                    commit('resetTeamRule', data.result)
                }
            })
        },
        // 设置多人业绩分配规则
        apiPostTeamRule(store, {params, callback}) {
            api.request({
                url: api.consts._REPORT_PERFORMANCE_TEAM_SHARE_RULE,
                method: 'post',
                params,
                success(data) {
                    callback(data)
                }
            })
        },
        // 获取等效项
        apiGetEquivalentItem({commit}) {
            api.request({
                url: api.consts._REPORT_PERFORMANCE_PACKAGE,
                params: {},
                success(data) {
                    commit('resetEquivalentList', data.rows)
                }
            })
        },
        // 新增等效项
        apiPostEquivalentItem(store, {params, callback}) {
            api.request({
                url: api.consts._REPORT_PERFORMANCE_PACKAGE,
                method: 'post',
                params,
                success(data) {
                    callback(data)
                }
            })
        },
        // 修改等效项
        apiPutEquivalentItem(store, {params, callback}) {
            api.request({
                url: api.consts._REPORT_PERFORMANCE_PACKAGE_MODIFY,
                method: 'put',
                params,
                success(data) {
                    callback(data)
                }
            })
        }
    }
}
