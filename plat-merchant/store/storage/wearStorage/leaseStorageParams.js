import api from '~/api'
import {baseUtil, componentUtil} from '~/util'

const handleParam = componentUtil.handleParam;

export default {
    namespaced: true,
    state: {
        procurementParams: [],
        billId: '',
        itemId: '',
        categoryParams: [],
        gemParams: [],
        metalParams: []
    },
    getters: {
        getProcurementParams: state => state.procurementParams,
        getCategoryParams: state => {
            return state.categoryParams
        },
        getGemParams: state => {
            return state.gemParams
        },
        getMetalParams: state => {
            return state.metalParams
        }
    },
    mutations: {
        resetProcurementParams(state, procurementParams) {
            state.procurementParams = procurementParams
        },
        resetBillId(state, billId) {
            state.billId = billId
        },
        resetItemId(state, itemId) {
            state.itemId = itemId
        },
        resetCategoryParams(state, obj) {
            let {categoryId, gettedArr} = obj;
            state.categoryParams = {}
            state.categoryParams = baseUtil.getMetadataCategoryById(categoryId)
            state.categoryParams.props = handleParam(state.categoryParams.props, gettedArr);
        },
        resetGemParams(state, obj) {
            let {gemId, gettedArr} = obj;
            state.gemParams = {}
            state.gemParams = baseUtil.getMetadataGemById(gemId)
            state.gemParams.props = handleParam(state.gemParams.props, gettedArr);
        },
        resetMetalParams(state, obj) {
            let {metalId, gettedArr} = obj;
            state.metalParams = {}
            state.metalParams = baseUtil.getMetadataMetalById(metalId)
            state.metalParams.props = handleParam(state.metalParams.props, gettedArr);
        },
        resetAllParams(state) {
            state.categoryParams = {}
            state.gemParams = {}
            state.metalParams = {}
        }
    },
    actions: {
        apiGetLeaseParams({commit, state}, {params, callback}) {
            api.request({
                url: api.consts._STOCK_ITEM_PARAMS_GET,
                method: 'get',
                params,
                success(data) {
                    // commit('resetProcurementParams', data.rows)
                    callback(data.rows)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiPutStorageParams({commit, state}, {params, callback}) {
            api.request({
                url: api.consts._STOCK_ITEM_PARAMS_PUT,
                method: 'put',
                params,
                success(data) {
                    callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        }
    }
}
