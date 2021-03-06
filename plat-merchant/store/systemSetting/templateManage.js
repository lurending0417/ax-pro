import api from '~/api'
import {constUtil, baseUtil} from '~/util'

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
        templateLists: [],
        total: 0
    },
    getters: {
        getTemplates(state) {
            let metalArr = baseUtil.getMetadataMetal()
            let gemArr = baseUtil.getMetadataGem()
            let categoryArr = baseUtil.getMetadataCategory()
            return state.templateLists.map(item => {
                if (item.priceType) {
                    item.priceTypeName = constUtil._CONST_PRINT_PRICE_TYPE.find(ele => ele.id === item.priceType).name;
                }
                item.pureType = item.pure ? '素金' : '非素'
                item.metalName = handleStr(item.metalIds, metalArr, 'metal')
                item.gemName = handleStr(item.gemIds, gemArr, 'gem')
                item.categoryName = handleStr(item.categoryIds, categoryArr, 'category')
                return item
            })
        },
        getTotal: state => state.total
    },
    mutations: {
        resetTemplateLists(state, templateLists) {
            state.templateLists = templateLists
        },
        resetTotal(state, total) {
            state.total = total
        }
    },
    actions: {
        // 获取模板列表
        apiGetTemplateList({commit}, params) {
            api.request({
                url: api.consts._GOODS_PRINT_TEMPLATE_LABEL_LIST,
                params,
                success (data) {
                    commit('resetTemplateLists', data.rows)
                    commit('resetTotal', data.total)
                }
            })
        },
        // 删除
        apiDelTemplate(store, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._GOODS_PRINT_TEMPLATE_LABEL_DEL,
                method: 'delete',
                params,
                success (data) {
                    callback()
                }
            })
        }
    }
}
