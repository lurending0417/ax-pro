import api from '~/api'
import {objectUtil, baseUtil, constUtil, dateUtil, componentUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        stockBillId: '',
        stocks: [],
        total: 0,
        sumTotal: {}, // 总的统计
        form: {
            startYmd: '',
            endYmd: '',
            vendorId: '',
            retailPriceType: '',
            stockType: '',
            creatorId: '',
            status: '',
            wareHouseId: '',
            query: '',
            limit: 20,
            start: 0
        }
    },
    getters: {
        stocksView: state => {
            return state.stocks.map(item => {
                item.wareHouseName = baseUtil.getNameFromPropId('wareHouse', item.wareHouseId);
                item.vendorName = baseUtil.getNameFromPropId('vendors', item.vendorId);
                item.creatorName = baseUtil.getNameFromPropId('staffs', item.creatorId);
                item.pkgWeightShow = item.pkgWeight + item.weightUnit
                item.costPriceTypeShow = constUtil._CONST_COST_PRICE_ALGORITHM.find(ele => item.costPriceAlgorithm === ele.value).name
                item.stockTypeShow = constUtil._CONST_STOCK_TYPE.find(ele => item.stockType === ele.value).name
                item.status = componentUtil.getStockBillStatus(item.status)
                item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                return item
            })
        },
        getTotal: state => state.total,
        getStockBillId: state => {
            console.log()
            return state.stockBillId
        },
        getSumTotal: state => state.sumTotal
    },
    mutations: {
        resetForm(state, params) {
            state.form = objectUtil.replaceSameFieldsValue_1(params, state.form)
        },
        resetStocks(state, stocks) {
            state.stocks = stocks
        },
        resetTotal(state, total) {
            state.total = total
        },
        resetSumStocks(state, SumStocks) {
            state.sumTotal = SumStocks.total
        },
        resetStockBillId(state, stockBillId) {
            state.stockBillId = stockBillId
        }
    },
    actions: {
        searchStock({dispatch, commit}, params) {
            params && commit('resetForm', params)
            dispatch('getStocks')
        },
        getStocks({commit, state}) {
            console.log('state.form', state.form)
            api.request({
                url: api.consts._STOCK_GET_POST,
                params: state.form,
                success(data) {
                    let {total, rows, sum} = data;
                    commit('resetSumStocks', sum)
                    commit('resetStocks', rows)
                    commit('resetTotal', total)
                }
            })
        },
        deleteStock({dispatch, commit}, obj) {
            api.request({
                url: api.consts._STOCK_DELETE_GET_PUT,
                method: 'delete',
                params: {
                    stockBillId: obj.deleteId
                },
                success(data) {
                    obj.callback(data)
                }
            })
        },
        watchStock({dispatch, commit}, obj) {
            api.request({
                url: '/goods/stock/{billId}',
                method: 'get',
                params: {
                    billId: obj.billId
                },
                success(data) {
                    obj.callback(data)
                }
            })
        },
        // 修改采购入库单
        modifyStock({dispatch, commit}, {params, callback}) {
            api.request({
                url: '/goods/stock/{billId}',
                method: 'put',
                params,
                success(data) {
                    callback(data)
                }
            })
        }
    }
}
