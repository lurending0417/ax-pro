import api from '~/api'
import {objectUtil, componentUtil} from '~/util'
let handleResult = componentUtil.handleResult

export default {
    namespaced: true,
    state: {
        mainPageParams: {
            merchantId: '',
            outStoreId: '',
            outWareHouseId: '',
            backStoreId: '',
            backWareHouseId: '',
            customerId: '',
            metalIds: '',
            gemIds: '',
            categoryIds: '',
            limit: 20,
            start: 0,
            storeId: '',
            status: '',
            query: ''
        },
        total: {
            waitShipping: 0,
            shippingRequested: 0,
            leasingShipping: 0,
            leasing: 0,
            leaseCancled: 0,
            backShipping: 0,
            waitRejectQc: 0,
            doneQcOk: 0,
            doneQcFail: 0,
            doneBuy: 0
        },
        wearRecordList: {
            waitShipping: [],
            shippingRequested: [],
            leasingShipping: [],
            leasing: [],
            leaseCancled: [],
            backShipping: [],
            waitRejectQc: [],
            doneQcOk: [],
            doneQcFail: [],
            doneBuy: []
        } // 试戴订单列表
    },
    getters: {
        getWearRecordWaitShipping(state) {
            return handleResult(state.wearRecordList.waitShipping);
        },
        getWearRecordShippingRequested(state) {
            return handleResult(state.wearRecordList.shippingRequested);
        },
        getWearRecordLeasingShipping(state) {
            return handleResult(state.wearRecordList.leasingShipping);
        },
        getWearRecordLeasing(state) {
            return handleResult(state.wearRecordList.leasing);
        },
        getWearRecordLeaseCancled(state) {
            return handleResult(state.wearRecordList.leaseCancled);
        },
        getWearRecordBackShipping(state) {
            return handleResult(state.wearRecordList.backShipping);
        },
        getWearRecordWaitRejectQc(state) {
            return handleResult(state.wearRecordList.waitRejectQc);
        },
        getWearRecordDoneQcOk(state) {
            return handleResult(state.wearRecordList.doneQcOk);
        },
        getWearRecordDoneQcFail(state) {
            return handleResult(state.wearRecordList.doneQcFail);
        },
        getWearRecordDoneBuy(state) { // 测试
            return handleResult(state.wearRecordList.doneBuy);
        },
        getTotal(state) {
            return state.total
        }
    },
    mutations: {
        resetTotal(state, obj) {
            if (obj.status === 'WAIT_SHIPPING') {
                state.total.waitShipping = obj.total;
            } else if (obj.status === 'SHIPPING_REQUESTED') {
                state.total.shippingRequested = obj.total;
            } else if (obj.status === 'LEASE_SHIPPING') {
                state.total.leasingShipping = obj.total;
            } else if (obj.status === 'LEASING,BACK_SHIPPING_REQUESTED') {
                state.total.leasing = obj.total;
            } else if (obj.status === 'CANCELED_BY_USER,CANCELED_BY_SYS,CANCELED_BY_STORE') {
                state.total.leaseCancled = obj.total;
            } else if (obj.status === 'BACK_SHIPPING') {
                state.total.backShipping = obj.total;
            } else if (obj.status === 'WAIT_REJECT_QC,WAIT_BACK_QC') {
                state.total.waitRejectQc = obj.total;
            } else if (obj.status === 'DONE_QC_OK') {
                state.total.doneQcOk = obj.total;
            } else if (obj.status === 'DONE_QC_FAIL,WAIT_QC_CONFIRM') {
                state.total.doneQcFail = obj.total;
            } else if (obj.status === 'DONE_BUY') {
                state.total.doneBuy = obj.total;
            }
        },
        resetWearRecordList(state, obj) {
            if (obj.status === 'WAIT_SHIPPING') { // 待发货
                state.wearRecordList.waitShipping = obj.list;
            } else if (obj.status === 'SHIPPING_REQUESTED') { // 待取件
                state.wearRecordList.shippingRequested = obj.list;
            } else if (obj.status === 'LEASE_SHIPPING') { // 已发货
                state.wearRecordList.leasingShipping = obj.list;
            } else if (obj.status === 'LEASING,BACK_SHIPPING_REQUESTED') { // 用户已收
                state.wearRecordList.leasing = obj.list;
            } else if (obj.status === 'CANCELED_BY_USER,CANCELED_BY_SYS,CANCELED_BY_STORE') { // 已取消
                state.wearRecordList.leaseCancled = obj.list;
            } else if (obj.status === 'BACK_SHIPPING') { // 待收货
                state.wearRecordList.backShipping = obj.list;
            } else if (obj.status === 'WAIT_REJECT_QC,WAIT_BACK_QC') { // 待质检
                state.wearRecordList.waitRejectQc = obj.list;
            } else if (obj.status === 'DONE_QC_OK') { // 无损还货
                state.wearRecordList.doneQcOk = obj.list;
            } else if (obj.status === 'DONE_QC_FAIL,WAIT_QC_CONFIRM') { // 有损还货
                state.wearRecordList.doneQcFail = obj.list;
            } else if (obj.status === 'DONE_BUY') { // 转买
                state.wearRecordList.doneBuy = obj.list;
            }
        },
        resetMainPageParams(state, obj) {
            state.mainPageParams = objectUtil.replaceSameFieldsValue_1(obj, state.mainPageParams);
        }
    },
    actions: {
        // 获取或筛选所有指定状态的试戴订单，在params里面进行区分
        apiGetWearRecordsList({commit, state}, params) {
            params && commit('resetMainPageParams', params)
            api.request({
                url: api.consts._LEASE_RECORDS_LIST,
                params: state.mainPageParams,
                success(data) {
                    console.log('获取或筛选所有指定状态' + params.status + '的试戴订单', data.rows);
                    commit('resetWearRecordList', {
                        list: data.rows,
                        status: params.status
                    })
                    commit('resetTotal', {
                        status: params.status,
                        total: data.total
                    })
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 通过id获取试戴订单
        apiGetDeliverDetailById({commit, state}, obj) {
            api.request({
                url: api.consts._LEASE_RECORDS_DETAIL,
                params: obj.params,
                success(data) {
                    console.log('通过id获取试戴订单', data.result);
                    obj.callBack(data.result)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 检测商品条码与试戴订单是否匹配
        apiDeliverValidateSerial({commit, state}, obj) {
            api.request({
                url: api.consts._LEASE_VALIDATE_SERIAL,
                params: obj.params,
                method: 'put',
                success(data) {
                    console.log('检测商品条码与试戴订单是否匹配', data.result);
                    obj.callBack(data.result)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 试戴订单发货
        apiLeaseRecordOut({commit, state}, obj) {
            api.request({
                url: api.consts._LEASE_RECORDS_OUT,
                params: obj.params,
                method: 'post',
                success(data) {
                    console.log('试戴订单发货', data);
                    obj.callBack()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 试戴订单收货
        apiLeaseRecordAccept({commit, state}, obj) {
            api.request({
                url: api.consts._LEASE_RECORDS_ACCEPT,
                params: obj.params,
                method: 'post',
                success(data) {
                    console.log('试戴订单收货', data);
                    obj.callBack()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 取消订单
        apiLeaseRecordCancle({commit, state}, obj) {
            api.request({
                url: api.consts._LEASE_RECORDS_CANCLE,
                params: obj.params,
                method: 'post',
                success(data) {
                    console.log('取消订单', data);
                    obj.callBack()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 预约快递取件(内容未改)
        apiPreExpressSend({commit, state}, obj) {
            api.request({
                url: api.consts._LEASE_PRE_DELIVER_OUT,
                params: obj.params,
                method: 'post',
                success(data) {
                    console.log('预约快递取件', data);
                    obj.callBack()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 进行商品质检
        apiLeasingInspection({commit, state}, obj) {
            api.request({
                url: api.consts._LEASE_INSPECTION,
                params: obj.params,
                method: 'post',
                success(data) {
                    console.log('进行商品质检', data);
                    obj.callBack()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 修改试戴质检记录
        apiLeasingInspectionModify({commit, state}, obj) {
            api.request({
                url: api.consts._LEASE_INSPECTION_MODIFY,
                params: obj.params,
                method: 'put',
                success(data) {
                    console.log('修改试戴质检记录', data);
                    obj.callBack()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 获取某个门店的详情
        apiGetStoreDetail({commit, state}, obj) {
            api.request({
                url: api.consts._MERCHANT_STORE_ITEM_UPDATE,
                params: obj.params,
                method: 'get',
                success(data) {
                    console.log('获取某个门店的详情', data.result);
                    obj.callBack(data.result)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 发送短信验证码
        sendSmsCode({state}, obj) {
            let {callBack, params} = obj
            api.request({
                method: 'post',
                url: api.consts._SEND_MS_CODE,
                params: params,
                success(data) {
                    console.log('data', data);
                    callBack(data)
                }
            })
        }
    }
}
