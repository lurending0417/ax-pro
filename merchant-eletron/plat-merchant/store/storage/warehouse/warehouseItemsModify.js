import { baseUtil } from '~/util';
import api from '~/api';

export default {
    namespaced: true,
    state: {
        warehouse: {}
    },
    getters: {
        stores() {
            return baseUtil.getMetadataStore()
        },
        staffs() {
            return baseUtil.getMetadataStaffs();
        }
    },
    mutations: {
        resetWarehouse(state, warehouse) {
            state.warehouse = warehouse;
        }
    },
    actions: {
        modify({ state }, params) {
            console.log(state);
            api.request({
                method: 'put',
                url: api.consts._WAREHOUSE_DELETE_GET_PUT,
                params: {
                    ...params.form,
                    wareHouseId: state.warehouse.id
                },
                success() {
                    console.log('success');
                    params.callback();
                }
            });
        }
    }
}
