import api from '~/api'

export default {
    namespaced: true,
    state: {
        metalId: '',
        retailPrice: ''
    },
    getters: {},
    mutations: {
        resetInfo (state, obj) {
            state.metalId = obj.id || ''
            state.retailPrice = obj.retailPrice || ''
        },
        resetMetalId (state, metalId) {
            state.metalId = metalId
        },
        resetRetailPrice (state, retailPrice) {
            state.retailPrice = retailPrice.target.value
        }
    },
    actions: {
        modifyRetailPrice ({commit, state}, callback) {
            api.request({
                url: api.consts._WARE_BASE_INFO_GOLDPRICE_PUT,
                method: 'put',
                params: {
                    metalId: state.metalId,
                    retailPrice: state.retailPrice
                },
                success (data) {
                    if (data.status === 200) {
                        callback()
                    }
                }
            })
        }
    }
}
