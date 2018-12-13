import {baseUtil} from '~/util'
import api from '~/api'

export default {
    namespaced: true,
    state: {
        storeId: '',
        enabled: '',
        name: '',
        managerId: '',
        staffs: [],
        recycle: ''
    },
    getters: {
        stores() {
            return baseUtil.getMetadataStore()
        },
        staffs(state) {
            return state.staffs
        },
        storeId(state) {
            return state.storeId
        }
    },
    mutations: {
        resetStoreId(state, storeId) {
            state.storeId = storeId
        },
        resetEnabled(state, enabled) {
            state.enabled = enabled
        },
        resetName(state, name) {
            state.name = name
        },
        resetManager(state, managerId) {
            state.managerId = managerId
        },
        resetRecycle(state, recycle) {
            state.recycle = recycle
        },
        resetStaffs(state, storeId) {
            if (!storeId && baseUtil.getMetadataStore()) {
                storeId = baseUtil.getMetadataStore()[0].id
            }
            state.staffs = baseUtil.getMetadataStaffByStoreId(storeId)
        }
    },
    actions: {
        addAction({state}, obj) {
            let {callback, params} = obj
            api.request({
                method: 'post',
                url: api.consts._WAREHOUSE_GET_POST,
                params,
                success(data) {
                    console.log(data);
                    callback()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        }
    }
}
