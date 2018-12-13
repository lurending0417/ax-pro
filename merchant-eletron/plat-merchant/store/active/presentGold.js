import api from '~/api'
import {baseUtil, dateUtil} from '~/util'

function handleStr(str, arr, tag) {
    let tempArr = []
    if (str === 'all') {
        tempArr = arr.map(item => item.id)
    } else {
        tempArr = str.split(',');
    }
    return tempArr.map(ele => {
        return arr.find(e => e.id === ele) ? arr.find(e => e.id === ele).name : ''
    }).filter(item => item).join()
}

export default {
    namespaced: true,
    state: {
        goldPresentRuleList: [] // 黄金赠送规则列表
    },
    getters: {
        getGoldPresentRuleList(state) {
            console.log('getGoldPresentRuleList');
            let metalArr = baseUtil.getMetadataMetal()
            let gemArr = baseUtil.getMetadataGem()
            let storeArr = baseUtil.getMetadataStore()
            return state.goldPresentRuleList.map(item => {
                // bill.createTime = dateUtil.pattern(new Date(bill.createTime), 'yyyy-MM-dd HH:mm:ss')
                item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                item.creatorName = baseUtil.getNameFromPropId('staffs', item.creatorId)
                // 拼装宝石和金属
                item.material = handleStr(item.metalIds, metalArr, 'metal') + ',' + handleStr(item.gemIds, gemArr, 'gem')
                // 拼装门店
                item.store = handleStr(item.storeIds, storeArr, 'store')
                item.status = item.enabled ? '启用' : '停用'
                return item
            })
        }
    },
    mutations: {
        resetGoldPresentRuleList(state, goldPresentRuleList) {
            state.goldPresentRuleList = goldPresentRuleList
        }
    },
    actions: {
        // 获取黄金赠送规则
        apiGetGoldPresentRuleList({commit}) {
            api.request({
                url: api.consts._PROMO_RETAIL_GOLD_RULE,
                params: {},
                success(data) {
                    commit('resetGoldPresentRuleList', data.rows)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 新增黄金赠送规则
        apiPostGoldPresentRuleList({commit, state}, obj) {
            let {params, callBack} = obj;
            api.request({
                url: api.consts._PROMO_RETAIL_GOLD_RULE,
                method: 'post',
                params,
                success() {
                    callBack();
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 修改黄金赠送规则
        apiPutGoldPresentRuleList(store, obj) {
            let {params, callBack} = obj;
            api.request({
                url: api.consts._PROMO_RETAIL_GOLD_RULE_BY_ID,
                method: 'put',
                params,
                success() {
                    callBack();
                },
                fail(error) {
                    alert(error.message)
                }
            })
        }
    }
}
