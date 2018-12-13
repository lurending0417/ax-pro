import api from '~/api'
import util from '~/util/baseUtil'
import dataUtil from '~/util/dateUtil'

export default {
    namespaced: true,
    state: {
        historyItems: [],
        entityId: '',
        startYmd: '',
        endYmd: '',
        total: 0,
        start: 0,
        limit: 0
    },
    getters: {
        historyItemsView (state) {
            return state.historyItems.map(item => {
                item.createTime = dataUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                util.getMetadata().staffs.forEach(staff => {
                    if (item.creatorId === staff.id) {
                        item.creatorName = staff.nickName
                    }
                })
                return item
            })
        }
    },
    mutations: {
        resetHistoryItems (state, historyItems) {
            state.historyItems = historyItems
        },
        resetEntityId (state, entityId) {
            state.entityId = entityId
        },
        resetStartYmd (state, startYmd) {
            state.startYmd = startYmd
        },
        resetEndYmd (state, endYmd) {
            state.endYmd = endYmd
        },
        resetPagination (state, params) {
            state.start = params.start
            state.limit = params.limit
        },
        resetTotal (state, total) {
            state.total = total
        }
    },
    actions: {
        getHistoryItems ({commit, state}, params) {
            console.log(params)
            params && commit('resetPagination', params)
            api.request({
                url: api.consts._WARE_BASE_INFO_HISTORY_GET,
                params: {
                    entityId: state.entityId,
                    start: state.start,
                    limit: state.limit
                },
                success (data) {
                    console.log(data)
                    commit('resetHistoryItems', data.rows)
                    commit('resetTotal', data.total)
                }
            })
        }
    }
}
