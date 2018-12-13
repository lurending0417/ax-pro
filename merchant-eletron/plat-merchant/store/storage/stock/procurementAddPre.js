import api from '~/api'
import {objectUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        wareHouseId$: '',
        vendorId$: '',
        buyerId$: '',
        skuType$: '',
        bargainPrice$: '',
        stockType$: '',
        wareType$: '',
        weightUnit$: '',
        pkgCost$: '',
        pkgWeight$: '',
        costPriceAlgorithm$: '',
        retailPriceAlgorithm$: '',
        retailPriceRatio$: '',
        retailMetalPrice$: '',
        retailPriceExtra$: '',
        retailProcessingCharges$: ''
    },
    mutations: {
        resetForm(state, params) {
            objectUtil.replaceFormFieldsValue(params, state)
        }
    },
    actions: {
        saveStock({commit, state}, obj) {
            let {params, callback} = obj;
            if (params.retailPriceAlgorithm === 'TODAY_METAL_PRICE') {
                params.retailPriceType = 'WEIGHTED'
            } else {
                params.retailPriceType = 'FIXED'
            }
            api.request({
                method: 'post',
                url: api.consts._STOCK_GET_POST,
                params,
                success(data) {
                    callback(data)
                }
            })
        }
    }
}
