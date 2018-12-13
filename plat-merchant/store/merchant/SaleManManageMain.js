import api from '~/api'
import {constUtil, baseUtil, dateUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        staffs: [],
        total: 0,
        dutysArr: [] // 保存岗位
    },

    getters: {
        getStaffs: state => {
            return state.staffs.map(item => {
                item.gender && (item.gender = constUtil._CONST_USER_GENDER.find(ele => ele.value === item.gender).name)
                item.storeId && (item.storeId = baseUtil.getMetadataStoreById(item.storeId).name)
                item.createTime && (item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss'))
                item.atWork ? item.atWork = '在职' : item.atWork = '离职';
                return item
            })
        },
        getTotal: state => {
            return state.total
        },
        getDutyArr: state => state.dutysArr
    },
    mutations: {
        resetTotal(state, total) {
            state.total = total
        },
        resetDutysArr(state, dutysArr) {
            state.dutysArr = dutysArr
        },
        resetStaffs(state, staffs) {
            state.staffs = staffs
        }
    },
    actions: {
        // 获取商户内的员工
        apiGetStaffs({commit, dispatch, state}, params) {
            api.request({
                url: api.consts._STAFF_GET_POST,
                params: params,
                success(data) {
                    data.rows.map((item) => {
                        item.dutyName = '';
                        item.dutyIds.forEach((dutyId) => {
                            state.dutysArr.forEach((duty, index) => {
                                if (duty.id === dutyId) {
                                    item.dutyName += duty.name + ','
                                }
                            });
                        });
                        item.dutyName = item.dutyName.slice(0, item.dutyName.length - 1);
                        return item;
                    });
                    commit('resetStaffs', data.rows);
                    commit('resetTotal', data.total)
                }
            })
        },
        apiAddStaff({commit, state}, obj) {
            api.request({
                url: api.consts._STAFF_GET_POST,
                method: 'post',
                params: obj.params,
                success(data) {
                    obj.callback()
                }
            })
        },
        apiGetStaff({commit, state}, obj) {
            api.request({
                url: api.consts._STAFF_MODIFY_GET,
                params: obj.params,
                success(data) {
                    obj.callback(data.result)
                }
            })
        },
        apiModifyStaff({commit, state}, obj) {
            api.request({
                url: api.consts._STAFF_MODIFY_GET,
                method: 'put',
                params: obj.params,
                success(data) {
                    obj.callback()
                }
            })
        },
        // 获取所有岗位
        apiGetDuty({commit, state}, obj) {
            api.request({
                url: api.consts._AUTH_DUTY_POST_GET,
                params: obj.params,
                success(data) {
                    commit('resetDutysArr', data.rows)
                    if (obj.callback) {
                        obj.callback(data.rows)
                    }
                }
            })
        }
    }
}
