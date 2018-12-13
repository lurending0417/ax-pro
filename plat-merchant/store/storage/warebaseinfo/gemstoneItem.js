import api from '~/api'

export default {
    namespaced: true,
    state: {
        gemstoneItems: [],
        enabled: '',
        query: '',
        total: 0,
        start: 0,
        limit: 0
    },
    getters: {
        getGemstoneItemsView (state) {
            return state.gemstoneItems.map(item => {
                item.enabled = item.enabled ? '启用' : '禁用'
                return item
            })
        }
    },
    mutations: {
        resetGemstoneItems (state, gemstoneItems) {
            state.gemstoneItems = gemstoneItems
        },
        resetEnabled (state, enabled) {
            state.enabled = enabled
        },
        resetQuery (state, query) {
            state.query = query
        },
        resetTotal (state, total) {
            state.total = total
        },
        resetPagination (state, params) {
            state.start = params.start
            state.limit = params.limit
        }
    },
    actions: {
        getGemstoneItems ({commit, state}, params) {
            console.log(params)
            params && commit('resetPagination', params)
            api.request({
                url: api.consts._WARE_BASE_INFO_GEM_GET,
                params: {
                    enabled: state.enabled,
                    query: state.query,
                    start: state.start,
                    limit: state.limit
                },
                success (data) {
                    commit('resetGemstoneItems', data.rows)
                    commit('resetTotal', data.total)
                }
            })
        }
    }
}
