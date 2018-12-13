import api from '~/api'
import {constUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        type: '', // 用户行为分析中的type
        districtCode: '', // 用户行为分析中的districtCode
        districtName: '', // 用户行为分析中的districtName
        leaseOrRetail: '', // 判断是点击了查看线上试戴，还是线下零售
        customerId: '', // 用户Id
        telephone: '' // 用户手机号
    },
    getters: {
        getLeaseOrRetail: (state) => state.leaseOrRetail,
        getTelephone: (state) => state.telephone,
        getType: (state) => {
            if (state.type) {
                return constUtil._CONST_USER_TYPE.filter(item => item.id === state.type)[0].name
            } else {
                return ''
            }
        },
        getDistrictName: (state) => state.districtName,
        getCustomerId: (state) => state.customerId
    },
    mutations: {
        resetLeaseOrRetail(state, leaseOrRetail) {
            state.leaseOrRetail = leaseOrRetail;
        },
        resetCustomerId(state, item) {
            let {userId, telephone} = item;
            state.customerId = userId;
            state.telephone = telephone;
        },
        resetType(state, type) {
            state.type = type;
        },
        resetDistrictCode(state, {districtCode, districtName}) {
            state.districtCode = districtCode;
            state.districtName = districtName;
        }
    },
    actions: {
        // 获取或筛选所有审批流程
        apiGetUserStatRegionDetail ({commit, state}, {params, callback}) {
            api.request({
                url: api.consts._MERCHANT_CUSTOMER_STAT_REGION_DETAIL,
                params: {
                    ...params,
                    type: state.type,
                    districtCode: state.districtCode
                },
                success(data) {
                    callback(data)
                }
            })
        }
    }
}
