import api from '~/api'

export default {
    namespaced: true,
    state: {
        categoryItems: [],
        searchField: '',
        enabled: '',
        total: 0,
        start: 0,
        limit: 0
    },
    getters: {
        categoryItemsView (state) {
            return state.categoryItems.map(item => {
                item.enabled = item.enabled ? '启用' : '禁用'
                return item
            })
        }
    },
    mutations: {
        resetCategoryItems (state, items) {
            state.categoryItems = items
        },
        resetTotal (state, total) {
            state.total = total
        },
        resetPagination (state, params) {
            state.start = params.start
            state.limit = params.limit
        },
        resetSearchField (state, content) {
            state.searchField = content
        },
        resetChangeEnable (state, enable) {
            state.enabled = enable
        }
    },
    actions: {
        getCategotyItems ({commit, state}, params) {
            params && commit('resetPagination', params)
            api.request({
                url: api.consts._WARE_BASE_INFO_CATEGORY_GET,
                params: {
                    query: state.searchField,
                    enabled: state.enabled,
                    limit: state.limit,
                    start: state.start
                },
                success (data) {
                    commit('resetCategoryItems', data.rows)
                    commit('resetTotal', data.total)
                }
            })
        },
        inputSearchField ({commit}, content) {
            commit('resetSearchField', content)
        },
        changeEnable ({dispatch, commit}, enable) {
            commit('resetChangeEnable', enable)
            dispatch('getSupplierItems')
        }
    }
}
