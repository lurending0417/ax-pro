import api from '~/api'

export default {
    namespaced: true,
    state: {
        categoryParamItems: [],
        type: '',
        targetId: '',
        enabled: '',
        query: '',
        total: 0,
        start: 0,
        limit: 20,
        deleteFieldId: ''
    },
    getters: {
        getCategotyParamsItems(state) {
            return state.categoryParamItems.map(item => {
                item.enabled = item.enabled ? '启用' : '禁用'
                item.required = item.required ? '必填' : '非必填'
                if (item.inputType === 'INPUT') {
                    item.inputType = '文本框'
                } else if (item.inputType === 'RADIO') {
                    item.inputType = '单选框'
                } else if (item.inputType === 'CHECKBOX') {
                    item.inputType = '复选框'
                }
                return item
            })
        }
    },
    mutations: {
        resetDeleteFieldId(state, deleteFieldId) {
            state.deleteFieldId = deleteFieldId
        },
        resetCategotyParamItems(state, categoryParamItems) {
            state.categoryParamItems = categoryParamItems
        },
        resetType(state, type) {
            state.type = type
        },
        resetTargetId(state, targetId) {
            state.targetId = targetId
        },
        resetEnabled(state, enabled) {
            state.enabled = enabled
        },
        resetQuery(state, query) {
            state.query = query
        },
        resetTotal(state, total) {
            state.total = total
        },
        resetPagination(state, params) {
            state.start = params.start
            state.limit = params.limit
        }
    },
    actions: {
        getParams({commit, state}, params) {
            params && commit('resetPagination', params)
            api.request({
                url: api.consts._WARE_BASE_INFO_PARAMS_GET,
                method: 'get',
                params: {
                    type: state.type,
                    targetId: state.targetId,
                    enabled: state.enabled,
                    query: state.query,
                    start: state.start,
                    limit: state.limit
                },
                success(data) {
                    commit('resetCategotyParamItems', data.rows)
                    commit('resetTotal', data.total)
                },
                fail(error) {
                    alert(error.message);
                }
            })
        },
        deleteParam({commit, state}, callback) {
            api.request({
                url: api.consts._WARE_BASE_INFO_PARAMS_DELETE,
                method: 'delete',
                params: {
                    fieldId: state.deleteFieldId
                },
                success(data) {
                    callback(data)
                },
                fail(error) {
                    alert(error.message);
                }
            })
        }
    }
}
