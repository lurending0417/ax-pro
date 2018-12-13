import api from '~/api'
import ChinaAreaData from 'china-area-data'

export default {
    namespaced: true,
    state: {
        total: 0,
        storeList: [] // 所有门店
    },

    getters: {
        getStoreListView: state => {
            return state.storeList.map((item) => {
                item.enabledStatus = item.enabled ? '启用' : '禁用'
                return item
            });
        },
        getMerchantId: state => {
            return state.mainPageParams.merchantId;
        },
        getTotal: state => {
            return state.total
        },
        reginData() {
            let provinces = [];
            let china = ChinaAreaData['86'];
            for (let provinceCode in china) {
                let province = {
                    value: provinceCode,
                    label: china[provinceCode]
                };
                let provinceChildren = [];
                let cities = ChinaAreaData[provinceCode];
                for (let cityCode in cities) {
                    let city = {
                        value: cityCode,
                        label: cities[cityCode],
                        children: []
                    };
                    let districts = ChinaAreaData[cityCode];
                    for (let districtCode in districts) {
                        city.children.push({
                            value: districtCode,
                            label: districts[districtCode]
                        });
                    }
                    provinceChildren.push(city);
                }
                province.children = provinceChildren;
                provinces.push(province);
            }
            return provinces;
        }
    },
    mutations: {
        resetTotal(state, total) {
            state.total = total
        },
        resetStoreList(state, storeList) {
            state.storeList = storeList
        }
    },
    actions: {
        // 获取商户门店
        getStoreByStoreId({commit, state}, params) {
            api.request({
                url: api.consts._STORE_LIST_GET,
                params,
                success(data) {
                    commit('resetStoreList', data.rows)
                    commit('resetTotal', data.total)
                }
            })
        },
        // 向商户新增门店
        addStoreToMerchant({commit, state}, params) {
            let {callback, sendParams} = params;
            api.request({
                url: api.consts._STORE_LIST_GET,
                method: 'post',
                params: sendParams,
                success(data) {
                    callback();
                }
            })
        },
        // 修改门店的基本信息
        updateStoreById({commit, state}, params) {
            let {callback, sendParams} = params;
            api.request({
                url: api.consts._MERCHANT_STORE_ITEM_UPDATE,
                method: 'put',
                params: sendParams,
                success(data) {
                    callback();
                }
            })
        },
        // 获取地址
        apiGetAddress({commit, state}, params) {
            let {callback, sendParams} = params;
            api.request({
                url: api.consts._ADDRESS_ITEM,
                method: 'get',
                params: sendParams,
                success(data) {
                    callback(data.result);
                }
            })
        }
    }
}
