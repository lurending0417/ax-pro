import api from '~/api'
import util from '../../../util/baseUtil'

export default {
    namespaced: true,
    state: {
        goldPriceItems: []
    },
    getters: {
        getGoldPriceItemsView(state) {
            state.goldPriceItems.forEach(item => {
                util.getMetadata().metal.forEach(metal => {
                    if (item.metalId === metal.id) {
                        item.metalName = metal.name
                    }
                })
            })
            state.goldPriceItems.forEach(item => {
                util.getMetadata().staffs.forEach(staff => {
                    if (item.updaterId === staff.id) {
                        item.operationPeople = staff.nickName
                    }
                })
            })
            return state.goldPriceItems
        }
    },
    mutations: {
        resetGoldPriceItems(state, goldPriceItems) {
            state.goldPriceItems = goldPriceItems
        }
    },
    actions: {
        getGoldPriceItems(store, params) {
            api.request({
                url: api.consts._WARE_BASE_INFO_GOLDPRICE_GET,
                params: {},
                success(data) {
                    store.commit('resetGoldPriceItems', data.rows)
                }
            })
        },
        getMetaData(store, callback) {
            api.request({
                url: api.consts._GET_META_DATA,
                params: {},
                success(data) {
                    util.setBasicInfo(data);
                    util.setMetadata(data);
                    if (callback) {
                        callback()
                    }
                }
            })
        }
    }
}
