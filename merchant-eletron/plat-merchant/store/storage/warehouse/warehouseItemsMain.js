import api from '~/api';
import { baseUtil } from '~/util';

export default {
    namespaced: true,
    state: {
        warehouseItems: [],
        total: 0,
        start: 0,
        limit: 20,
        searchField: '',
        storeId: '',
        staffId: '',
        enabled: ''
    },
    getters: {
        warehouseItemsView (state) {
            return state.warehouseItems.map(item => {
                item.statusDetial = item.enabled ? '启用' : '停用';
                item.recycleDetial = item.recycle ? '回收库' : '销售库';
                item.managerName = baseUtil.getNameFromPropId('staffs', item.managerId)
                item.storeName = baseUtil.getNameFromPropId('stores', item.storeId)
                return item;
            })
        },
        stores() {
            return baseUtil.getMetadataStore()
        },
        staffs() {
            return baseUtil.getMetadataStaffs();
        }
    },
    mutations: {
        resetWarehouseItems (state, items) {
            state.warehouseItems = items
        },
        resetTotal (state, total) {
            state.total = total
        },
        resetStoreId (state, storeId) {
            state.storeId = storeId
        },
        resetStaffId (state, staffId) {
            state.staffId = staffId
        },
        resetChangeEnable (state, enable) {
            state.enabled = enable
        },
        resetSearchField (state, content) {
            state.searchField = content
        },
        resetPagination (state, params) {
            state.start = params.start;
            state.limit = params.limit;
        }
    },
    actions: {
        getWareHouseItems ({commit, state}, params) {
            api.request({
                url: api.consts._WAREHOUSE_GET_POST,
                params: {
                    ...params,
                    merchantId: baseUtil.getMerchantId()
                },
                success (data) {
                    commit('resetWarehouseItems', data.rows);
                    commit('resetTotal', data.total);
                }
            })
        }
    }
}
