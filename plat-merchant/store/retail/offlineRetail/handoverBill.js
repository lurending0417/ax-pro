import api from '~/api'
import {dateUtil, baseUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        total: 0,
        handoverBills: [] // 获取或筛选的所有交班单
    },
    getters: {
        getHandoverBillsView: state => {
            return state.handoverBills.map(bill => {
                bill.createTime = dateUtil.pattern(new Date(bill.createTime), 'yyyy-MM-dd HH:mm:ss')
                bill.updateTime = bill.updateTime === 0 ? '' : dateUtil.pattern(new Date(bill.updateTime), 'yyyy-MM-dd HH:mm:ss')
                bill.wareHouseId = baseUtil.getNameFromPropId('wareHouse', bill.wareHouseId)
                let staffs = baseUtil.getMetadataStaffs();
                staffs.forEach((staff) => {
                    if (staff.id === bill.confirmedById) {
                        bill.confirmedById = staff.nickName
                    }
                })
                return bill
            })
        },
        getTotal: state => state.total
    },
    mutations: {
        resetTotal (state, total) {
            state.total = total
        },
        resetHandoverBills(state, handoverBills) {
            state.handoverBills = handoverBills
        }
    },
    actions: {
        // 查询或筛选交班单
        getHandoverBills ({commit, state}, params) {
            api.request({
                url: api.consts._HANDOVER_BILL_GET_POST_DELETE,
                method: 'get',
                params,
                success (data) {
                    commit('resetHandoverBills', data.rows)
                    commit('resetTotal', data.total)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        // 删除交班单
        delHandoverBill ({commit, state}, obj) {
            let {recordId, callback} = obj;
            api.request({
                url: api.consts._HANDOVER_BILL_DELETE,
                method: 'delete',
                params: {
                    recordId
                },
                success (data) {
                    console.log('删除交班单', data)
                    callback();
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        // 发起交班单
        addHandoverBill ({commit, state}, obj) {
            let {wareHouseId, callback} = obj;
            api.request({
                url: api.consts._HANDOVER_BILL_GET_POST_DELETE,
                method: 'post',
                params: {
                    wareHouseId
                },
                success (data) {
                    console.log('发起交接班', data)
                    callback();
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        // 接收交班
        confirmdHandoverBill ({commit, state}, obj) {
            let {sendParams, callback} = obj;
            console.log('11111111', sendParams);
            callback()
            api.request({
                url: api.consts._HANDOVER_BILL_CONFIRM,
                method: 'post',
                params: sendParams,
                success (data) {
                    console.log('接收交班', data)
                    callback();
                },
                fail (error) {
                    alert(error.message)
                }
            })
        }
        // // 重置用户密码
        // resetUserPassword ({commit, state}, obj) {
        //     let {sendParams, callback} = obj;
        //     console.log('sendParams', sendParams);
        //     api.request({
        //         url: api.consts._USER_RESET_PASSWORD,
        //         method: 'post',
        //         params: sendParams,
        //         success (data) {
        //             console.log('重置用户密码', data)
        //             callback();
        //         },
        //         fail (error) {
        //             alert(error.message)
        //         }
        //     })
        // }
    }
}
