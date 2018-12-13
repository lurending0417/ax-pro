import api from '~/api'
import {dateUtil, baseUtil, numberUtil, calculateUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        allocateBills: [], // 获取所有调拨单
        newAllocateBill: {}, // 新添加的调拨单
        searchInfo: {},
        startYmd: '',
        endYmd: '',
        sourceStoreId: '',
        sourceWareHouseId: '',
        targetStoreId: '',
        targetWareHouseId: '',
        allocatedById: '',
        acceptedById: '',
        status: '',
        query: '',
        total: 0,
        stores: '', // 新增调拨单中的数据
        modifyTargetStoreId: '', // 修改调拨单中的数据
        modifyTargetWareHouseId: '', // 修改调拨单中的数据
        allocateBillItems: [], // 调拨单中库存明细
        serial: '', // 库存的唯一值,
        deleteAllocateBillId: '', // 删除调拨单的id
        modifyAllocateBillItem: {}, // 修改的调拨单明细对象
        addPageCanChange: true // 新增页面是否可以修改
    },
    getters: {
        getAllocateBillsView: state => {
            return state.allocateBills.map(bill => {
                bill.createTime = dateUtil.pattern(new Date(bill.createTime), 'yyyy-MM-dd HH:mm:ss')
                bill.status = baseUtil.getAllocateBillStatu(bill.status)
                bill.storeName = baseUtil.getNameFromPropId('stores', bill.storeId)
                bill.targetStoreName = baseUtil.getNameFromPropId('stores', bill.targetStoreId)
                bill.targetWareHouseName = baseUtil.getNameFromPropId('wareHouse', bill.targetWareHouseId)
                bill.allocatedByName = baseUtil.getNameFromPropId('staffs', bill.allocatedById)
                bill.acceptedByName = baseUtil.getNameFromPropId('staffs', bill.acceptedById)
                return bill
            })
        },
        getNewAllocateBill: state => {
            return state.newAllocateBill
        },
        getSearchInfo: state => {
            return state.searchInfo
        },
        getTotal: state => state.total,
        getStores: state => state.stores,
        getAllocateBillItems: state => {
            return state.allocateBillItems.map(billItem => {
                billItem.vendorId = baseUtil.getNameFromPropId('vendors', billItem.vendorId)
                billItem.categoryId = baseUtil.getNameFromPropId('category', billItem.categoryId)
                billItem.gemId = baseUtil.getNameFromPropId('gem', billItem.gemId)
                billItem.metalId = baseUtil.getNameFromPropId('metal', billItem.metalId)
                billItem.craftId = baseUtil.getNameFromPropId('craft', billItem.craftId)
                return billItem
            })
        },
        getPropsCount: state => {
            console.log(state.allocateBillItems)
            var obj = {
                amount: 0,
                weight: 0,
                costPrice: 0,
                regularPrice: 0,
                retailPrice: 0,
                processingCharges: 0
            }
            state.allocateBillItems.forEach(item => {
                item.amount && (obj.amount += item.amount)
                item.amount ? (item.weight && (obj.weight += item.weight * item.amount)) : (item.weight && (obj.weight += item.weight))
                item.amount ? (item.costPrice && (obj.costPrice += item.costPrice * item.amount)) : (item.costPrice && (obj.costPrice += item.costPrice))
                item.amount ? (item.regularPrice && (obj.regularPrice += item.regularPrice * item.amount)) : (item.regularPrice && (obj.regularPrice += item.regularPrice))
                item.amount ? (item.retailPrice && (obj.retailPrice += item.retailPrice * item.amount)) : (item.retailPrice && (obj.retailPrice += item.retailPrice))
                if (item.retailPriceAlgorithm === 'TODAY_METAL_PRICE') {
                    obj.processingCharges += calculateUtil.multiply(item.processingCharges, item.weight)
                    if (numberUtil.judgeDecimal(obj.processingCharges)) {
                        obj.processingCharges = Number(obj.processingCharges.toFixed(2));
                    }
                }
            })
            for (let key in obj) {
                if (numberUtil.judgeDecimal(obj[key])) {
                    obj[key] = numberUtil.toKeepTwoPlacesOfDecimalAndRound(obj[key]);
                }
            }
            return obj
        },
        getShowSearch: state => state.notShowSearch,
        getAddPageCanChange: state => state.addPageCanChange
    },
    mutations: {
        initSearchInfo(state) {
            var stores = []
            baseUtil.getMetadata().stores.forEach(store => {
                var storeObj = {}
                var wareHouses = []
                var staffs = []
                storeObj['name'] = store.name
                storeObj['id'] = store.id
                storeObj['isOutChecked'] = false
                storeObj['isInChecked'] = false
                baseUtil.getMetadata().wareHouse.forEach(wareHouse => {
                    if (store.id === wareHouse.storeId) {
                        var wareHouseObj = {}
                        wareHouseObj['name'] = wareHouse.name
                        wareHouseObj['id'] = wareHouse.id
                        wareHouseObj['isChecked'] = false
                        wareHouses.push(wareHouseObj)
                    }
                })
                storeObj['wareHouses'] = wareHouses
                baseUtil.getMetadata().staffs.forEach(staff => {
                    if (store.id === staff.storeId) {
                        var staffObj = {}
                        staffObj['name'] = staff.nickName
                        staffObj['id'] = staff.id
                        staffObj['isChecked'] = false
                        staffs.push(staffObj)
                    }
                })
                storeObj['staffs'] = staffs
                stores.push(storeObj)
            })
            state.searchInfo['stores'] = stores
        },
        resetStartYmd(state, startYmd) {
            state.startYmd = startYmd
        },
        resetEndYmd(state, endYmd) {
            state.endYmd = endYmd
        },
        resetStatus(state, status) {
            state.status = status
        },
        resetQuery(state, query) {
            state.query = query
        },
        resetNewAllocateBill(state, newAllocateBill) {
            state.newAllocateBill = newAllocateBill
        },
        resetAllocateBills(state, allocateBills) {
            state.allocateBills = allocateBills
        },
        resetPagination(state, params) {
            state.start = params.start
            state.limit = params.limit
        },
        resetTotal(state, total) {
            state.total = total
        },
        resetModifyTargetStoreId(state, modifyTargetStoreId) {
            state.modifyTargetStoreId = modifyTargetStoreId
        },
        resetModifyTargetWareHouseId(state, modifyTargetWareHouseId) {
            state.modifyTargetWareHouseId = modifyTargetWareHouseId
        },
        resetStores(state) {
            var stores = []
            baseUtil.getMetadata().stores.forEach(store => {
                var storeObj = {}
                var wareHouses = []
                var staffs = []
                storeObj['name'] = store.name
                storeObj['id'] = store.id
                baseUtil.getMetadata().wareHouse.forEach(wareHouse => {
                    if (store.id === wareHouse.storeId) {
                        var wareHouseObj = {}
                        wareHouseObj['name'] = wareHouse.name
                        wareHouseObj['id'] = wareHouse.id
                        wareHouses.push(wareHouseObj)
                    }
                })
                storeObj['wareHouses'] = wareHouses
                baseUtil.getMetadata().staffs.forEach(staff => {
                    if (store.id === staff.storeId) {
                        var staffObj = {}
                        staffObj['name'] = staff.nickName
                        staffObj['id'] = staff.id
                        staffs.push(staffObj)
                    }
                })
                storeObj['staffs'] = staffs
                stores.push(storeObj)
            })
            state.stores = stores
        },
        resetAllocateBillItems(state, allocateBillItems) {
            state.allocateBillItems = allocateBillItems
        },
        resetSerial(state, serial) {
            state.serial = serial
        },
        resetDeleteAllocateBillId(state, deleteAllocateBillId) {
            state.deleteAllocateBillId = deleteAllocateBillId
        },
        resetModifyAllocateBillItem(state, modifyAllocateBillItem) {
            state.modifyAllocateBillItem = modifyAllocateBillItem
        },
        resetAddPageCanChange(state, addPageCanChange) {
            state.addPageCanChange = addPageCanChange
        }
    },
    actions: {
        getAllocateBills({commit}, params) {
            api.request({
                url: api.consts._STOCK_ALLOCATE_GET,
                params,
                success(data) {
                    commit('resetAllocateBills', data.rows)
                    commit('resetTotal', data.total)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        addAllocateBill({commit, state}, callback) {
            api.request({
                url: api.consts._STOCK_ALLOCATE_ADD_POST,
                method: 'post',
                params: {},
                success(data) {
                    commit('resetNewAllocateBill', data.result)
                    callback()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        modifyAllocateBill({commit, state}, callback) {
            api.request({
                url: api.consts._STOCK_ALLOCATE_ADD_PUT,
                method: 'put',
                params: {
                    billId: state.newAllocateBill.id,
                    targetStoreId: state.modifyTargetStoreId,
                    targetWareHouseId: state.modifyTargetWareHouseId
                },
                success(data) {
                    commit('resetNewAllocateBill', data.result)
                    callback()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        addAllocateBillItems({commit, dispatch, state}, callback) {
            api.request({
                url: api.consts._STOCK_ALLOCATE_ADD_ITEMS_POST,
                method: 'post',
                params: {
                    billId: state.newAllocateBill.id,
                    serial: state.serial
                },
                success(data) {
                    dispatch('getAllocateBillItems', callback)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        getAllocateBillItems({commit, state}, callback) {
            api.request({
                url: api.consts._STOCK_ALLOCATE_ADD_ITEMS_GET,
                params: {
                    billId: state.newAllocateBill.id
                },
                success(data) {
                    let rows = data.rows;
                    rows.map(item => {
                        if (item.retailPriceAlgorithm === 'TODAY_METAL_PRICE') {
                            item.computedProcessingCharges = calculateUtil.multiply(item.weight, item.processingCharges)
                        }
                        // item.computedProcessingCharges = item.processingCharges
                        return item
                    })
                    commit('resetAllocateBillItems', rows)
                    callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        outAllocateBill({commit, state}, callback) { // 调拨出库
            api.request({
                url: api.consts._STOCK_ALLOCATE_OUT,
                method: 'post',
                params: {
                    billId: state.newAllocateBill.id
                },
                success(data) {
                    callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        deleteAllocateBill({commit, state}, callback) { // 删除调拨单
            api.request({
                url: api.consts._STOCK_ALLOCATE_BILL_DELETE,
                method: 'delete',
                params: {
                    billId: state.deleteAllocateBillId
                },
                success(data) {
                    callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        modifyAllocateBillItemAmount({commit, state}, callback) { // 修改调拨单明细数量
            api.request({
                url: api.consts._STOCK_ALLOCATE_BILL_ITEMS_AMOUNT,
                method: 'put',
                params: {
                    ...state.modifyAllocateBillItem
                },
                success(data) {
                    state.allocateBillItems.forEach(item => {
                        if (data.result.id === item.id) {
                            item.amount = data.result.amount
                        }
                    })
                    callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        deleteAllocateBillItem({commit, state}, params) { // 删除调拨单明细
            let {sendParams, callBack} = params;
            api.request({
                url: api.consts._STOCK_ALLOCATE_BILL_ITEMS_AMOUNT,
                method: 'delete',
                params: sendParams,
                success(data) {
                    callBack(data);
                },
                fail(error) {
                    alert(error.message)
                }
            })
        }
    }
}
