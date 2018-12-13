import {baseUtil, constUtil, numberUtil, calculateUtil} from '~/util'
import api from '~/api'

export default {
    namespaced: true,
    state: {
        focusFirstField: false,
        preStock: {},
        stockItems: [],
        canChange: false, // 页面中值能否被改变
        printInfos: [] // 需要打印的数组
    },
    getters: {
        preStockView (state) {
            let view = Object.assign({}, state.preStock);
            view.wareHouseName = baseUtil.getNameFromPropId('wareHouse', view.wareHouseId)
            view.vendorName = baseUtil.getNameFromPropId('vendors', view.vendorId)
            view.staffName = baseUtil.getNameFromPropId('staffs', view.creatorId)
            view.skuTypeName = constUtil._CONST_SKU_TYPE.find(ele => ele.value === view.skuType).name
            view.tradeTypeName = view.bargainPrice ? '特价零售' : '正常零售'
            view.stockTypeName = constUtil._CONST_STOCK_TYPE.find(ele => ele.value === view.stockType).name
            view.wareTypeName = constUtil._CONST_WARE_TYPE.find(ele => ele.value === view.wareType).name
            if (view.processingType) {
                view.processingTypeName = constUtil._CONST_PROCESSING_TYPE.find(ele => ele.id === view.processingType).name
            }
            view.costPriceAlgorithmName = constUtil._CONST_COST_PRICE_ALGORITHM.find(ele => ele.value === view.costPriceAlgorithm).name
            view.retailPriceAlgorithmName = constUtil._CONST_RETAIL_PRICE_ALGORITHM.find(ele => ele.value === view.retailPriceAlgorithm).name
            view.costUnitPrice = (function () {
                let result = calculateUtil.divide(view.pkgCost, view.pkgWeight)
                if (numberUtil.isNumber(result)) {
                    return numberUtil.toKeepTwoPlacesOfDecimalAndRound(result)
                } else {
                    return 0
                }
            }());
            return view
        },
        stockItemsView (state) {
            return state.stockItems
        },
        getCanChange: state => state.canChange
    },
    mutations: {
        resetPreStock(state, preStock) {
            state.preStock = preStock
        },
        resetStockItems (state, obj) {
            if (obj.index || obj.index === 0) {
                let temp = state.stockItems
                temp = temp.map((item, index) => {
                    item.isFocused = false;
                    if (index === obj.index) {
                        item.isFocused = true
                    }
                    return item
                })
                state.stockItems = [...temp]
            } else {
                state.stockItems = obj
            }
        },
        resetProcurementCanChange(state, canChange) {
            state.canChange = canChange
        },
        addStockItem(state, stockItem) {
            state.stockItems.push(stockItem)
        },
        modifyItemLocal(state, pass) {
            state.stockItems.forEach(item => {
                if (item.id === pass.itemId) {
                    item[pass.key] = pass.value
                }
            })
        },
        doFocusFirstField(state) {
            state.focusFirstField = true
        },
        undoFocusFirstField(state) {
            state.focusFirstField = false
        },
        deleteStockItem(state, deleteId) {
            var arr = []
            for (var i = 0; i < state.stockItems.length; i++) {
                if (state.stockItems[i].id !== deleteId) {
                    arr.push(state.stockItems[i])
                }
            }
            state.stockItems = arr
        },
        resetPrintInfo (state, printInfos) {
            state.printInfos = printInfos
        }

    },
    actions: {
        initStockItems({commit, state}) {
            api.request({
                url: api.consts._STOCK_ITEMS_GET_POST,
                params: {
                    stockBillId: state.preStock.id
                },
                success (data) {
                    data.rows.map(item => {
                        item.isFocused = false;
                        return item
                    })
                    commit('resetStockItems', data.rows)
                }
            })
        },
        addItem({state, commit}, pass) {
            let itemInfo = pass.itemInfo
            api.request({
                method: 'post',
                url: api.consts._STOCK_ITEMS_GET_POST,
                params: {
                    ...itemInfo,
                    stockBillId: state.preStock.id
                },
                success(data) {
                    commit('addStockItem', data.result)
                    commit('doFocusFirstField')
                    pass.callback(data.result)
                }
            })
        },
        modifyItem ({state, commit}, pass) { // 修改入库单明细
            commit('modifyItemLocal', pass)
            let params = {
                stockBillId: state.preStock.id,
                stockItemId: pass.itemId,
                [pass.key]: pass.value
            }
            api.request({
                method: 'put',
                url: api.consts._STOCK_ITEM_PUT_DELETE,
                params: {
                    ...params
                },
                success (data) {
                    console.log('pass', pass)
                    console.log('pass return data', data.result)
                }
            })
        },
        deleteItem ({state, commit}, obj) {
            api.request({
                method: 'delete',
                url: api.consts._STOCK_ALLOCATE_BILL_ITEMS_DELETE,
                params: {
                    billId: state.preStock.id,
                    itemId: obj.itemId
                },
                success(data) {
                    obj.callback()
                }
            })
        },
        submitAudit({state, commit}, callback) {
            api.request({
                url: api.consts._STOCK_ITEM_SUBMIT_AUDIT,
                method: 'post',
                params: {
                    billId: state.preStock.id
                },
                success(data) {
                    callback(data)
                }
            })
        },
        weightDiff({state, commit}, callback) {
            api.request({
                url: api.consts._STOCK_WEIGHT_DIFF,
                method: 'post',
                params: {
                    billId: state.preStock.id
                },
                success(data) {
                    commit('resetStockItems', data.rows)
                    callback(data)
                }
            })
        },
        getPrintInfo({state, commit}, obj) {
            var params = {}
            if (obj.storageId) {
                params['storageId'] = obj.storageId
            }
            if (obj.stockItemId) {
                params['stockItemId'] = obj.stockItemId
            }
            if (obj.stockBillId) {
                params['stockBillId'] = obj.stockBillId
            }
            console.log(obj)
            console.log(params)
            api.request({
                url: api.consts._STOKE_LABEL_PRINT,
                method: 'get',
                params: {...params},
                success(data) {
                    commit('resetPrintInfo', data.rows)
                    obj.callback(data)
                }
            })
        },
        goodsPrint ({state, commit}, callback) {
            api.request({
                url: '/goods/print',
                method: 'get',
                params: {
                    stockBillId: state.preStock.id
                },
                success (data) {
                    localStorage.setItem('printTemplateBatch', JSON.stringify(data.rows))
                }
            })
        }
    }
}
