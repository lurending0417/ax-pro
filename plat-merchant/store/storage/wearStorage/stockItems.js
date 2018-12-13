import api from '~/api'
import {baseUtil, objectUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        searchParams: { // 获取的所有试戴商品列表
            storeId: '',
            wareHouseId: '',
            metalId: '',
            gemId: '',
            categoryId: '',
            craftId: '',
            query: '',
            priceType: 'FIXED',
            skuType: 'SINGLE',
            leaseAble: false,
            hasStorage: true,
            start: '',
            limit: ''
        },
        stockItems: [], // 所有可以试戴的商品列表
        total: 0
    },
    getters: {
        getTotal: state => state.total,
        getStockItems: state => {
            return state.stockItems.map(item => {
                item.storeName = baseUtil.getNameFromPropId('stores', item.storeId);
                item.wareHouseName = baseUtil.getNameFromPropId('wareHouse', item.wareHouseId);
                item.categoryName = baseUtil.getNameFromPropId('category', item.categoryId);
                item.gemName = baseUtil.getNameFromPropId('gem', item.gemId);
                item.metalName = baseUtil.getNameFromPropId('metal', item.metalId);
                return item
            })
        },
        getItemsCheckedStatus: state => {
            let temp = state.stockItems;
            if (temp) {
                for (let i = 0, j = temp.length; i < j; i++) {
                    if (!temp[i].isChecked) {
                        return false
                    }
                }
            }
            return true
        }
    },
    mutations: {
        resetSeachParams(state, obj) {
            state.searchParams = objectUtil.replaceSameFieldsValue_1(obj, state.searchParams);
        },
        resetTotal(state, total) {
            state.total = total
        },
        resetStockItems(state, obj) {
            obj.stockItems && (state.stockItems = obj.stockItems);
        }
    },
    actions: {
        apiGetStockItem({state, commit}, params) {
            params && commit('resetSeachParams', params)
            api.request({
                url: api.consts._STOCK_STORAGE_GET,
                params: state.searchParams,
                success(data) {
                    // 定义变量控制全选，默认为false
                    data.rows.map(item => {
                        item.isChecked = false;
                        return item
                    })
                    commit('resetStockItems', {
                        stockItems: data.rows
                    })
                    commit('resetTotal', data.total)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiAddWearGoodsList({state, commit}, obj) { // 添加试戴商品
            api.request({
                url: api.consts._LEASE_STORAGE_LIST,
                params: {
                    storageIds: obj.storageIds
                },
                method: 'post',
                success(data) {
                    // console.log(data)
                    obj.callBack()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        }
    }
}
