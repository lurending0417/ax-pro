import api from '~/api'
import {componentUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        messageTemplateList: [], // 消息列表
        messageTemplateItem: {}, // 新增的消息对象
        queryConditions: {}, // 高级条件查询对象
        query: '',
        curTotal: 0,
        total: 0,
        customerId: '',
        userList: [] // 用户列表
    },
    mutations: {
        resetMessageTemplateList(state, messageTemplateList) {
            state.messageTemplateList = messageTemplateList
        },
        resetMessageTemplateItem(state, messageTemplateItem) {
            state.messageTemplateItem = messageTemplateItem
        },
        resetQueryConditions(state, queryConditions) {
            if (queryConditions) {
                let temp = {...queryConditions}
                temp.gender.join(',');
                temp.storeId.join(',');
                if (temp.startBirth) {
                    temp.birthStart = componentUtil.handleBirth(temp.startBirth)
                }
                if (temp.endBirth) {
                    temp.birthEnd = componentUtil.handleBirth(temp.endBirth)
                }
                delete temp.startBirth
                delete temp.endBirth
                state.queryConditions = temp
            } else {
                state.queryConditions = {}
            }
        },
        resetQuery(state, messageTemplateItem) {
            state.messageTemplateItem = messageTemplateItem
        },
        resetCurTotal(state, curTotal) {
            state.curTotal = curTotal
        },
        resetUserList(state, userList) {
            state.userList = userList.map(item => {
                return item.id
            }).join()
        },
        resetTotal(state, total) {
            state.total = total
        },
        resetCustomerId(state, customerId) {
            state.customerId = customerId
        }
    },
    actions: {
        // 获取通知模板
        apiGetMessageTemplateList({commit, state}, params) {
            api.request({
                url: api.consts._GET_MESSAGE_TEMPLATE,
                params,
                success(data) {
                    commit('resetMessageTemplateList', data.rows)
                }
            })
        },
        // 新增通知模板
        apiPostMessageTemplate({commit, state}, {params, callback}) {
            api.request({
                url: api.consts._GET_MESSAGE_TEMPLATE,
                params,
                method: 'post',
                success(data) {
                    commit('resetMessageTemplateItem', data.result)
                    callback()
                }
            })
        },
        // 修改通知模板
        apiPutMessageTemplate({commit, dispatch, state}, {params, callback}) {
            api.request({
                url: api.consts._MODIFY_MESSAGE_TEMPLATE_BY_ID,
                params,
                method: 'put',
                success(data) {
                    dispatch('apiGetMessageTemplateList', {})
                    callback(data)
                }
            })
        },
        // 删除通知模板
        apiDelMessageTemplate({dispatch, state}, params) {
            api.request({
                url: api.consts._MODIFY_MESSAGE_TEMPLATE_BY_ID,
                params,
                method: 'delete',
                success(data) {
                    dispatch('apiGetMessageTemplateList', {})
                }
            })
        },
        // 发送消息通知
        apiPostMessageTemplateSend({dispatch, state}, {params, callback, fromUser}) {
            api.request({
                url: api.consts._POST_MESSAGE_TEMPLATE_SEND,
                params,
                method: 'post',
                success(data) {
                    callback()
                    if (!fromUser) {
                        dispatch('apiGetMessageTemplateList', {})
                    }
                }
            })
        },
        // 获取发送消息通知记录
        apiGetMessageTemplateSendRecord(store, callback) {
            api.request({
                url: api.consts._GET_MESSAGE_TEMPLATE_SEND_RECORD,
                params: {},
                method: 'get',
                success(data) {
                    callback(data.rows)
                }
            })
        },
        // 查询商户的用户数
        apiGetMerchantCustomerCount(store, {callback, params}) {
            api.request({
                url: api.consts._GET_MERCHANT_CUSTOMER_COUNT,
                params,
                method: 'get',
                success(data) {
                    callback(data.result)
                }
            })
        }
    }
}
