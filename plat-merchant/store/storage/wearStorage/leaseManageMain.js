import {baseUtil, objectUtil, constUtil, numberUtil} from '~/util'
import api from '~/api'

export default {
    namespaced: true,
    state: {
        wearGoodsList: [], // 获取的所有试戴商品列表
        modifyParams: { // 修改接口传参
            storageIds: '333',
            status: '222',
            depositPrice: '',
            rentPrice: ''
        },
        total: 0
    },
    getters: {
        getTotal: state => {
            console.log('state.total', state.total)
            return state.total
        },
        getWearGoodsList(state) {
            let tableShowDatas = [];
            state.wearGoodsList.forEach(list => {
                let item = {};
                let storage = list.storageView.storage;
                let lease = list.lease;
                constUtil._CONST_LEASE_STATUS.forEach((obj) => {
                    if (obj.id === lease.status) {
                        item.statusName = obj.name;
                        item.status = obj.id;
                    }
                })
                item.storeName = baseUtil.getNameFromPropId('stores', storage.storeId);
                item.wareHouseName = baseUtil.getNameFromPropId('wareHouse', storage.wareHouseId);
                item.categoryName = baseUtil.getNameFromPropId('category', storage.categoryId);
                item.gemName = baseUtil.getNameFromPropId('gem', storage.gemId);
                item.metalName = baseUtil.getNameFromPropId('metal', storage.metalId);
                item.leaseDays = 20;
                item.serial = storage.serial;
                item.amount = storage.amount;
                item.retailPrice = storage.retailPrice;
                item.depositPrice = lease.depositPrice;
                item.rentPrice = lease.rentPrice;
                item.imageCount = lease.imageCount;
                item.id = lease.id;
                item.storageId = storage.id;
                item.isChecked = list.isChecked;
                item.lockedStorage = lease.lockedStorage;
                tableShowDatas.push(item);
            })
            return tableShowDatas
        },
        getComputed(state) {
            let obj = {
                serialAmount: 0,
                amount: 0,
                weight: 0,
                retailPrice: 0,
                depositPrice: 0,
                rentPrice: 0
            }
            state.wearGoodsList.forEach(item => {
                obj.amount += item.storageView.storage.amount
                obj.weight += item.storageView.storage.weight
                obj.retailPrice += item.storageView.storage.retailPrice
                obj.depositPrice += item.lease.depositPrice
                obj.rentPrice += item.lease.rentPrice
            })
            obj.serialAmount = state.wearGoodsList.length
            for (let key in obj) {
                if (numberUtil.judgeDecimal(obj[key])) {
                    obj[key] = numberUtil.toKeepTwoPlacesOfDecimalAndRound(obj[key]);
                }
            }
            return obj
        },
        getItemsCheckedStatus: state => {
            let temp = state.wearGoodsList;
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
        resetWearGoodsList(state, obj) {
            obj.wearGoodsList && (state.wearGoodsList = obj.wearGoodsList);
            if (obj.index >= 0) {
                let temp = state.wearGoodsList;
                temp[obj.index].isChecked = obj.isChecked;
                state.wearGoodsList = temp;
                // state.wearGoodsList.splice(obj.index, 1, obj.item)
            }
            if (obj.tag) { // 全选或是取消全选
                let temp = state.wearGoodsList;
                temp.forEach((item) => {
                    if (obj.isCheckedAll) {
                        item.isChecked = false;
                    } else {
                        item.isChecked = true;
                    }
                })
                state.wearGoodsList = temp;
            }
        },
        resetTotal(state, total) {
            console.log('resetTotal', total);
            state.total = total
        },
        resetModifyParams(state, obj) {
            state.modifyParams = objectUtil.replaceSameFieldsValue_1(obj, state.modifyParams);
        }
    },
    actions: {
        apiGetWearGoodsList({state, commit}, params) { // 获取试戴商品
            api.request({
                url: api.consts._LEASE_STORAGE_LIST,
                params,
                success(data) {
                    console.log('data.total', data);
                    // 定义变量控制全选，默认为false
                    data.rows.map(item => {
                        item.isChecked = false;
                        return item
                    })
                    commit('resetWearGoodsList', {
                        wearGoodsList: data.rows
                    })
                    commit('resetTotal', data.total)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiLeaseConfigModify({state, commit}, obj) { // 批量上下架商品 修改试戴商品信息
            obj.params && commit('resetModifyParams', obj.params)
            api.request({
                url: api.consts._LEASE_STORAGE_LIST,
                method: 'put',
                params: state.modifyParams,
                success(data) {
                    console.log('修改（上下架，修改金额）成功', data)
                    obj.callBack()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiLeaseConfigDetail({state, commit}, obj) { // 获取试戴商品详细信息
            console.log({storageId: obj.storageId})
            api.request({
                url: api.consts._LEASE_CONFIG_DETAIL,
                method: 'get',
                params: {storageId: obj.storageId},
                success(data) {
                    console.log('获取成功', data.result)
                    obj.callBack(data.result)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiPostLeaseStorage({state, commit}, obj) { // 添加试戴商品
            let {params, callBack} = obj;
            api.request({
                url: api.consts._LEASE_STORAGE_POST_SIMPLE,
                method: 'post',
                params,
                success(data) {
                    console.log('获取成功', data.result)
                    callBack(data.result)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiPutGoodsStorage({state, commit}, obj) { // 修改库存信息（简版用）
            let {params, callBack} = obj;
            api.request({
                url: api.consts._GOODS_STORAGE_PUT,
                method: 'put',
                params,
                success(data) {
                    callBack()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        }
    }
}
