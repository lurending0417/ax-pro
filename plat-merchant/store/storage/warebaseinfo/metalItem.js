import api from '~/api'

export default {
    namespaced: true,
    state: {
        metalItems: [],
        enabled: '',
        query: '',
        total: 0,
        start: 0,
        limit: 0
    },
    getters: {
        getMetalItemsView (state) {
            return state.metalItems.map(item => {
                item.enabled = item.enabled ? '启用' : '禁用'
                return item
            })
        }
    },
    mutations: {
        resetMetalItems (state, metalItems) {
            state.metalItems = metalItems
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
        getMetalItems ({commit, state}, params) {
            console.log(params)
            params && commit('resetPagination', params)
            api.request({
                url: api.consts._WARE_BASE_INFO_METAL_GET,
                params: {
                    enabled: state.enabled,
                    query: state.query,
                    start: state.start,
                    limit: state.limit
                },
                success (data) {
                    commit('resetMetalItems', data.rows)
                    commit('resetTotal', data.total)
                }
            })
        }
    }
}
