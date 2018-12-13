import api from '~/api'
import {constUtil, objectUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        auditFlowSetList: [],
        mainPageParams: {
            limit: 10,
            start: 0,
            type: ''
        },
        total: 0,
        dutyList: [],
        auditFlowNodeList: [] // 某个审批流程的所有审批节点
    },
    getters: {
        getAuditFlowSetList(state) {
            state.auditFlowSetList.map(bill => {
                bill.auditName = constUtil._CONST_AUDIT_TYPE.find(ele => ele.value === bill.auditType).name
                // 将提交岗分割成数组
                bill.startDutyIds$ = [];
                bill.startDutyIds.split(',').forEach((item) => {
                    bill.startDutyIds$.push(state.dutyList.find(duty => duty.id === item))
                });
                // 将审核节点分割成数组
                // bill.nodeDutyIds$ = [];
                // bill.nodeDutyIds.split('|').forEach((node, index) => {
                //     // bill.nodeDutyIds$[index] = []
                //     // node.split(',').forEach((item, i) => {
                //     //     bill.nodeDutyIds$[index].push(state.dutyList.find(duty => duty.id === item))
                //     // })
                // })
                return bill
            })
            return state.auditFlowSetList
        },
        getAuditFlowNodeList(state) {
            return state.auditFlowNodeList.map(item => {
                // 将审批节点分割成数组
                item.nodeDutyIds$ = [];
                item.dutyIds.split(',').forEach((i) => {
                    item.nodeDutyIds$.push(state.dutyList.find(duty => duty.id === i))
                });
                return item
            })
        },
        getTotal(state) {
            return state.total;
        },
        dutyList(state) {
            return state.dutyList;
        }
    },
    mutations: {
        resetAuditFlowSetList(state, auditFlowSetList) {
            state.auditFlowSetList = auditFlowSetList;
            return state.auditFlowSetList
        },
        resetAuditFlowNodeList(state, auditFlowNodeList) {
            state.auditFlowNodeList = auditFlowNodeList;
            return state.auditFlowNodeList
        },
        resetTotal(state, total) {
            return state.total
        },
        resetMainPageParams(state, obj) {
            // let tempObj = state.mainPageParams
            // for (let key in obj) {
            //     for (let k in tempObj) {
            //         if (key === k) {
            //             tempObj[key] = obj[key];
            //             break;
            //         }
            //     }
            // }
            // state.mainPageParams = {...tempObj}
            state.mainPageParams = objectUtil.replaceSameFieldsValue_1(obj, state.mainPageParams);
        },
        resetDutyList(state, dutyList) {
            state.dutyList = dutyList;
            return state.dutyList
        }
    },
    actions: {
        // 获取或筛选所有审批流程
        auditFlowSetListGet ({commit, state}, params) {
            params && commit('resetMainPageParams', params)
            api.request({
                url: api.consts._AUDIT_FLOW_GET,
                params: state.mainPageParams,
                success (data) {
                    commit('resetAuditFlowSetList', data.rows)
                    commit('resetTotal', data.total)
                }
            })
        },
        // 新增审批流程
        auditFlowSetListAdd ({commit, state}, params) {
            let {callback, sendParams} = params;
            // params && commit('resetMainPageParams', params)
            api.request({
                url: api.consts._AUDIT_FLOW_GET,
                params: sendParams,
                method: 'post',
                success (data) {
                    callback()
                }
            })
        },
        // 修改审批流程
        auditFlowSetListUpdate ({commit, state}, params) {
            let {callback, sendParams} = params;
            api.request({
                url: api.consts._AUDIT_FLOW_UPDATE,
                params: sendParams,
                method: 'put',
                success (data) {
                    callback()
                }
            })
        },
        // 获取审核节点
        auditFlowNodeListGet ({commit, state}, flowId) {
            api.request({
                url: api.consts._AUDIT_NODE_LIST_GET,
                params: {
                    flowId
                },
                success (data) {
                    console.log('data:', data);
                    commit('resetAuditFlowNodeList', data.rows)
                }
            })
        },
        // 获取所有岗位
        getDutyList ({commit, state}) {
            api.request({
                url: api.consts._DUTY_TPL_GET,
                params: {
                    enabled: true
                },
                success (data) {
                    commit('resetDutyList', data.rows)
                }
            })
        }
    }
}
