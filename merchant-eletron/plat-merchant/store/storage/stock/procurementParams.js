import api from '~/api'
import {baseUtil, componentUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        procurementParams: [],
        categoryParams: [],
        gemParams: [],
        metalParams: []
    },
    getters: {
        getProcurementParams: state => state.procurementParams,
        getCategoryParams: state => state.categoryParams,
        getGemParams: state => state.gemParams,
        getMetalParams: state => state.metalParams
    },
    mutations: {
        resetProcurementParams(state, procurementParams) {
            state.procurementParams = procurementParams
        },
        resetCategoryParams(state, obj) {
            let {categoryId, gettedArr} = obj;
            state.categoryParams = {}
            state.categoryParams = baseUtil.getMetadataCategoryById(categoryId)
            state.categoryParams.props = componentUtil.handleParam(state.categoryParams.props, gettedArr);
        },
        resetGemParams(state, obj) {
            let {gemId, gettedArr} = obj;
            state.gemParams = {}
            state.gemParams = baseUtil.getMetadataGemById(gemId)
            state.gemParams.props = componentUtil.handleParam(state.gemParams.props, gettedArr);
        },
        resetMetalParams(state, obj) {
            let {metalId, gettedArr} = obj;
            state.metalParams = {}
            state.metalParams = baseUtil.getMetadataMetalById(metalId)
            state.metalParams.props = componentUtil.handleParam(state.metalParams.props, gettedArr);
        },
        resetAllParams(state) {
            state.categoryParams = {}
            state.gemParams = {}
            state.metalParams = {}
        }
    },
    actions: {
        apiGetProcurementParams({commit, state}, {callback, params}) {
            api.request({
                url: api.consts._STOCK_ITEM_PARAMS_GET,
                method: 'get',
                params,
                success(data) {
                    commit('resetProcurementParams', data.rows)
                    callback(data)
                }
            })
        },
        apiPutProcurementParams({commit, state}, obj) {
            api.request({
                url: api.consts._STOCK_ITEM_PARAMS_PUT,
                method: 'put',
                params: obj.params,
                success(data) {
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        }
    }
}
