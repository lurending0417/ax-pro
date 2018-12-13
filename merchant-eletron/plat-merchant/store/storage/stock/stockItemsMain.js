import api from '~/api'
import { baseUtil, constUtil } from '~/util'

export default {
    namespaced: true,
    state: {
        stockItems: [],
        storeId: '',
        wareHouseId: '',
        metalId: '',
        gemId: '',
        categoryId: '',
        craftId: '',
        priceType: '',
        stockType: '',
        vendorId: '',
        billType: '',
        minWeight: '',
        maxWeight: '',
        minMainGemWeight: '',
        maxMainGemWeight: '',
        minRegularPrice: '',
        maxRegularPrice: '',
        query: '',
        total: 0,
        start: 0,
        limit: 20
    },
    getters: {
        getTotal: state => state.total,
        getStockItems: state => {
            return state.stockItems.map(item => {
                item.vendorName = baseUtil.getNameFromPropId('vendors', item.vendorId)
                if (item.stockType) {
                    item.stockTypeName = constUtil._CONST_WARE_GETTYPE.find(ele => ele.value === item.stockType).name
                }
                if (item.retailPriceAlgorithm) {
                    item.retailPriceAlgorithmName = constUtil._CONST_RETAIL_PRICE_ALGORITHM.find(ele => ele.value === item.retailPriceAlgorithm).name
                }
                return item
            })
        }
    },
    mutations: {
        resetStockItems (state, stockItems) {
            state.stockItems = stockItems
        },
        resetStoreId (state, storeId) {
            state.storeId = storeId
        },
        resetWareHouseId (state, wareHouseId) {
            state.wareHouseId = wareHouseId
        },
        resetMetalId (state, metalId) {
            state.metalId = metalId
        },
        resetGemId (state, gemId) {
            state.gemId = gemId
        },
        resetCategoryId (state, categoryId) {
            state.categoryId = categoryId
        },
        resetCraftId (state, craftId) {
            state.craftId = craftId
        },
        resetPriceType (state, priceType) {
            state.priceType = priceType
        },
        resetStockType (state, stockType) {
            state.stockType = stockType
        },
        resetVendorId (state, vendorId) {
            state.vendorId = vendorId
        },
        resetBillType (state, billType) {
            state.billType = billType
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
        apiGetStockItem ({state, commit}, params) {
            api.request({
                url: api.consts._STOCK_STORAGE_GET,
                params,
                success (data) {
                    commit('resetStockItems', data.rows)
                    commit('resetTotal', data.total)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        // 获取流转记录
        apiGetStorageTransRecord ({state, commit}, obj) {
            let {params, callback} = obj
            api.request({
                url: api.consts._STOCK_STORAGE_TRANS_RECORD_GET,
                params,
                success (data) {
                    callback(data)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        }
    }
}
