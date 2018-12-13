import api from '~/api'
import {baseUtil, dateUtil, calculateUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        paymentBills: [],
        total: 0
    },
    getters: {
        getTotal: state => state.total,
        getPaymentBills: state => {
            let temp = [];
            state.paymentBills.map(item => {
                let obj = {};
                obj = item.payment;
                obj.createTime = dateUtil.pattern(new Date(obj.createTime), 'yyyy-MM-dd HH:mm:ss')
                obj.creatorId = baseUtil.getNameFromPropId('staffs', obj.creatorId)
                obj.realPrice = calculateUtil.adds([obj.paymentOfAlipay, obj.paymentOfCash, obj.paymentOfCoupon, obj.paymentOfGold, obj.paymentOfPos, obj.paymentOfWallet, obj.paymentOfWeixin])
                temp.push(obj)
                return item
            })
            return temp
        },
        getStaffs: () => {
            return baseUtil.getMetadataStaffs()
        }
    },
    mutations: {
        resetPaymentBills(state, paymentBills) {
            state.paymentBills = paymentBills
        },
        resetPagination(state, params) {
            state.start = params.start
            state.limit = params.limit
        },
        resetTotal(state, total) {
            state.total = total
        }
    },
    actions: {
        apiGetPaymentBill({commit, state}, params) {
            api.request({
                url: api.consts._PAYMENT_BILL_GET_POST,
                params: params,
                success(data) {
                    console.log(data)
                    commit('resetPaymentBills', data.rows)
                    commit('resetTotal', data.total)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        }
    }
}
