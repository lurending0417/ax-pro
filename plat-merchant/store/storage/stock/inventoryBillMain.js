import api from '~/api'
import {dateUtil, baseUtil, calculateUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        inventoryBills: [], // 获取所有盘点单
        newInventoryBill: {}, // 新添加的盘点单
        searchInfo: {},
        startYmd: '',
        endYmd: '',
        creatorId: '',
        normal: '',
        storeId: '',
        wareHouseId: '',
        status: '',
        query: '',
        total: 0,
        wareHouseById: '',
        InventoryBillItemsTotal: 0, // InventoryBillItem页面上的total
        addInventoryBillItem: {}, // 新增盘点单返回的数据
        inventoryBillItems: [], // 某个盘点单下面所有的商品详情
        amountStatistics: {}, // 盘点单详情统计账面数据
        inputAmountStatistics: {}, // 盘点单详情统计实盘数据
        lossOrGainNums: {} // 查看差异显示统计的盈亏
    },
    getters: {
        getInventoryBillStatus(state) {
            let status = state.addInventoryBillItem.status
            if (status === 'TO_SUBMIT' || status === 'AUDIT_DECLINED' || status === '未完成' || status === '审核未通过') {
                return true
            } else {
                return false
            }
        },
        getInventoryBillsView: state => {
            let temp = [];
            temp = state.inventoryBills.map(bill => {
                bill.createTime = dateUtil.pattern(new Date(bill.createTime), 'yyyy-MM-dd HH:mm:ss')
                if (baseUtil.getNameFromPropId('wareHouse', bill.wareHouseId)) {
                    bill.wareHouseId = baseUtil.getNameFromPropId('wareHouse', bill.wareHouseId)
                }
                if (baseUtil.getInventoryBillStatu(bill.status)) {
                    bill.status = baseUtil.getInventoryBillStatu(bill.status)
                }
                bill.creatorId = baseUtil.getNameFromPropId('staffs', bill.creatorId)
                return bill
            })
            return temp;
        },
        getInventoryBillItemsView: state => {
            return state.inventoryBillItems.map(bill => {
                if (bill.amount < bill.inputAmount) {
                    bill.lossOrGain = '盘盈'
                } else if (bill.amount === bill.inputAmount) {
                    bill.lossOrGain = '正常'
                } else {
                    bill.lossOrGain = '盘亏'
                }
                return bill
            })
        },
        getAddInventoryBillItem: state => {
            let wareHouseId = state.addInventoryBillItem.wareHouseId;
            if (baseUtil.getNameFromPropId('wareHouse', wareHouseId)) {
                state.addInventoryBillItem.wareHouseId = baseUtil.getNameFromPropId('wareHouse', wareHouseId);
            }
            return state.addInventoryBillItem
        },
        getTotal: state => state.total,
        getInventoryBillItemsTotal: state => state.InventoryBillItemsTotal,
        getInventoryBillItemsStatistics: state => { // 统计账面数据
            return state.amountStatistics
        },
        getInputAmountStatistics: state => { // 统计实盘数据
            return state.inputAmountStatistics
        },
        getLossOrGain: state => { // 统计盘盈盘亏总数据（用于在查看差异中显示）
            let lossNum = 0;
            let gainNum = 0;
            let lossPrice = 0;
            let gainPrice = 0;
            let lossOrGainNums = {};
            state.inventoryBillItems.forEach((item, index) => {
                let lossOrGain = item.inputAmount - item.amount;
                if (item.amount === 0) {
                    gainNum += item.inputAmount;
                    if (item.retailPrice) {
                        gainPrice += item.inputAmount * item.retailPrice;
                    }
                } else {
                    if (lossOrGain > 0) {
                        gainNum += lossOrGain;
                        if (item.retailPrice) {
                            gainPrice += lossOrGain * item.retailPrice;
                        }
                    } else if (lossOrGain < 0) {
                        lossNum += Math.abs(lossOrGain);
                        if (item.retailPrice) {
                            lossPrice += Math.abs(lossOrGain) * item.retailPrice;
                        }
                        // lossNum += Math.abs(lossOrGain);
                    }
                }
            });
            lossOrGainNums.lossNum = lossNum;
            lossOrGainNums.gainNum = gainNum;
            lossOrGainNums.lossPrice = lossPrice;
            lossOrGainNums.gainPrice = gainPrice;
            state.lossOrGainNums = lossOrGainNums;
            return state.lossOrGainNums;
        }
    },
    mutations: {
        resetPagination(state, params) {
            state.start = params.start
            state.limit = params.limit
        },
        resetInventoryBills(state, inventoryBills) {
            state.inventoryBills = inventoryBills
        },
        resetTotal(state, total) {
            state.total = total
        },
        resetInventoryBillItemsTotal(state, total) {
            state.InventoryBillItemsTotal = total
        },
        resetStartYmd(state, startYmd) {
            state.startYmd = startYmd
        },
        resetEndYmd(state, endYmd) {
            state.endYmd = endYmd
        },
        resetInventoryBillItem(state, obj) {
            state.addInventoryBillItem = obj.item;
            if (obj.callback) {
                obj.callback();
            }
        },
        resetInventoryBillDetailItems(state, object) {
            if (object.type) {
                if (object.type === 'modify') {
                    state.inventoryBillItems.splice(object.index, 1, object.item)
                } else if (object.type === 'delete') {
                    state.inventoryBillItems.splice(object.index, 1)
                }
            } else {
                state.inventoryBillItems = object;
            }
            state.inventoryBillItems.map(item => {
                if (item.priceType === 'WEIGHTED') {
                    item.computedProcessingCharges = calculateUtil.multiply(calculateUtil.multiply(item.weight, item.processingCharges), item.amount)
                } else {
                    item.computedProcessingCharges = ''
                }
            })
        },
        resetWareHouseId(state, wareHouseId) {
            state.wareHouseId = wareHouseId;
        },
        resetStatus(state, status) {
            state.status = status;
        },
        resetQuery(state, query) {
            state.query = query;
        },
        resetStaffId(state, creatorId) {
            state.creatorId = creatorId;
        },
        resetStatic(state, {inputed, system}) {
            state.amountStatistics = {
                totalNums: system.amount,
                totalWeight: system.weight, // 总质量
                totalRetailPrice: system.retailPrice, // 总零售价（折后价）
                totalRegularPrice: system.regularPrice, // 总零售价（原价）
                processingCharges: system.computedProcessingCharges // 工费
            } // 盘点单详情统计账面数据
            state.inputAmountStatistics = {
                totalNums: inputed.amount,
                totalWeight: inputed.weight, // 总质量
                totalRetailPrice: inputed.retailPrice, // 总零售价（折后价）
                totalRegularPrice: inputed.regularPrice, // 总零售价（原价）
                processingCharges: inputed.computedProcessingCharges // 工费
            } // 盘点单详情统计实盘数据
        }
    },
    actions: {
        // 获取或筛选所有盘点单
        getInventoryBills({commit, state}, params) {
            console.log('params', params);
            api.request({
                url: api.consts._STOCK_INVENTORY_BILL_GET,
                method: 'get',
                params,
                success(data) {
                    commit('resetInventoryBills', data.rows)
                    commit('resetTotal', data.total)
                },
                failed(error) {
                    console.log(error.message)
                }
            })
        },
        // 删除盘点单
        deleteInventoryBill({commit, state}, delObj) {
            let {deleteInventoryBillId, callback} = delObj;
            api.request({
                url: api.consts._STOCK_INVENTORY_BILL_DELETE,
                method: 'delete',
                params: {
                    billId: deleteInventoryBillId
                },
                success(data) {
                    callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 创建盘点单
        addInventoryBills({commit, state}, obj) {
            api.request({
                url: api.consts._STOCK_INVENTORY_BILL_CREATE,
                method: 'post',
                params: {
                    wareHouseId: obj.params.id
                },
                success(data) {
                    let resetInventoryBillItem = data.result;
                    commit('resetInventoryBillItem', {item: resetInventoryBillItem})
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 获取新建盘点单下面所有商品的盘点详情
        getInventoryBillItems({commit, state}, billId) {
            console.log('获取新建盘点单下面所有商品的盘点详情', state.addInventoryBillItem);
            let id = state.addInventoryBillItem.id || billId;
            api.request({
                url: api.consts._STOCK_INVENTORY_BILL_ITEMS_GET,
                params: {
                    billId: id
                },
                success({result}) {
                    console.log('result', result)
                    let {rows, inputed, system} = result;
                    commit('resetStatic', {inputed, system});
                    commit('resetInventoryBillDetailItems', rows);
                    // commit('resetInventoryBillItemsTotal', data.total);
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 修改盘点明细的盘点数量
        updateInventoryItemNum({commit, state}, updateObj) {
            let {amount, itemId, callback, index} = updateObj;
            let billId = state.addInventoryBillItem.id;
            api.request({
                url: api.consts._STOCK_INVENTORY_BILL_ITEM_UPDATE,
                method: 'put',
                params: {
                    billId,
                    itemId,
                    amount
                },
                success(data) {
                    callback(data.result);
                    let {item, inputed, system} = data.result;
                    commit('resetStatic', {inputed, system});
                    commit('resetInventoryBillDetailItems', {item, type: 'modify', index});
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 添加盘点明细
        addInventoryBillItemDetail({commit, state}, obj) {
            let {callback, serial, index} = obj;
            let params = {
                billId: state.addInventoryBillItem.id,
                serial
            };
            if (obj.amount) {
                params.amount = obj.amount;
            }
            api.request({
                url: api.consts._STOCK_INVENTORY_BILL_ITEM_DETAIL_ADD,
                method: 'post',
                params,
                success(data) {
                    callback(data.result);
                    let {item, inputed, system} = data.result;
                    commit('resetStatic', {inputed, system});
                    commit('resetInventoryBillDetailItems', {item, type: 'modify', index});
                },
                fail(error) {
                    alert(error.message);
                }
            })
        },
        // 删除盘点明细
        delInventoryBillItemDetail({commit, state}, obj) {
            let {callback, itemId, index} = obj;
            let billId = state.addInventoryBillItem.id;
            api.request({
                url: api.consts._STOCK_INVENTORY_BILL_ITEM_DETAIL_DEL,
                method: 'delete',
                params: {
                    billId,
                    itemId
                },
                success(data) {
                    callback(data.result);
                    let {item, inputed, system} = data.result;
                    if (item.id) {
                        commit('resetInventoryBillDetailItems', {item, type: 'modify', index});
                    } else {
                        commit('resetInventoryBillDetailItems', {type: 'delete', index});
                    }
                    commit('resetStatic', {inputed, system});
                },
                fail(error) {
                    alert(error.message);
                }
            })
        },
        // 将盘点单执行【提交审核】的操作
        submitInventoryBill({commit, state}, obj) {
            let {callback} = obj;
            let billId = state.addInventoryBillItem.id;
            api.request({
                url: api.consts._STOCK_INVENTORY_BILL_ITEM_SUBMIT,
                method: 'post',
                params: {
                    billId
                },
                success(data) {
                    console.log(data);
                    callback();
                },
                fail(error) {
                    alert(error.message);
                }
            })
        }
    }
}
