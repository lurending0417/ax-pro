import api from '~/api'
import { baseUtil } from '~/util'

export default {
    namespaced: true,
    state: {
        stockItemParams: {
            storage: {
                serial: '',
                weight: '',
                costPrice: '',
                regularPrice: '',
                retailPrice: ''
            }
        },
        categoryParams: [],
        gemParams: [],
        metalParams: []
    },
    getters: {
        getStockItemParams: state => state.stockItemParams,
        getCategoryParams: state => state.categoryParams,
        getGemParams: state => state.gemParams,
        getMetalParams: state => state.metalParams
    },
    mutations: {
        resetStockItemParams (state, stockItemParams) {
            stockItemParams.props.forEach(prop => {
                if (prop.preValues) {
                    if (prop.inputType === 'INPUT') {
                        prop.preValues = prop.preValues.replace(/,/g, '，')
                    }
                    prop.fieldValue = prop.fieldValue.split(',')
                    console.log('prop.fieldValue', prop.fieldValue);
                }
            })
            state.stockItemParams = stockItemParams
        },
        resetCategoryParams (state, categoryId) {
            state.categoryParams = baseUtil.getMetadataCategoryById(categoryId)
            state.categoryParams.props.map(param => {
                if (param.preValues) {
                    if (param.inputType === 'INPUT') {
                        param.preValues = param.preValues.replace(/,/g, '，')
                    }
                    param.preValues = param.preValues.split(',')
                }
                return param
            })
        },
        resetGemParams (state, gemId) {
            state.gemParams = baseUtil.getMetadataGemById(gemId)
            state.gemParams.props.map(param => {
                if (param.preValues) {
                    if (param.inputType === 'INPUT') {
                        param.preValues = param.preValues.replace(/,/g, '，')
                    }
                    param.preValues = param.preValues.split(',')
                }
                return param
            })
        },
        resetMetalParams (state, metalId) {
            state.metalParams = baseUtil.getMetadataMetalById(metalId)
            state.metalParams.props.map(param => {
                if (param.preValues) {
                    if (param.inputType === 'INPUT') {
                        param.preValues = param.preValues.replace(/,/g, '，')
                    }
                    param.preValues = param.preValues.split(',')
                }
                return param
            })
        }
    },
    actions: {
        // 查看库存详情
        apiGetStockItemParams ({state, commit}, obj) {
            api.request({
                url: api.consts._STOCK_STORAGE_GET_PARAMS,
                params: obj.params,
                success (data) {
                    commit('resetStockItemParams', data.result)
                    obj.callback(data.result)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        // 修改库存参数信息
        apiPutStockItemParams ({state, commit}, obj) {
            api.request({
                url: api.consts._STOCK_STORAGE_PUT_PARAMS,
                method: 'put',
                params: {
                    storageId: obj.storageId,
                    props: obj.props
                },
                success (data) {
                    obj.callback(data)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        // 获取库存参数嘻嘻
        apiGetStockItemParams_1 ({state, commit}, obj) {
            api.request({
                url: api.consts._STOCK_STORAGE_PUT_PARAMS,
                params: {
                    storageId: obj.storageId
                },
                success (data) {
                    obj.callBack(data)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        }
    }
}
