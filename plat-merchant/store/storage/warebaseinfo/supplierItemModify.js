import api from '~/api'

export default {
    namespaced: true,
    state: {
        vendorId: '', // 供应商ID
        code: '', // 编号
        name: '', // 名称
        contact: '', // 联系人
        phone: '', // 联系电话
        corpName: '', // 公司名称
        taxNo: '', // 税务编号
        bankName: '', // 开户行
        bankAccount: '', // 银行账号
        address: '', // 联系地址
        enabled: '' // 启用状态
    },
    getters: {
        code: state => state.code,
        name: state => state.name,
        enabled: state => state.enabled
    },
    mutations: {
        resetSupplierItemModifyInfo(state, obj) {
            state.vendorId = obj.id || ''
            state.name = obj.name || ''
            state.code = obj.code || ''
            state.contact = obj.contact || ''
            state.phone = obj.phone || ''
            state.corpName = obj.corpName || ''
            state.taxNo = obj.taxNo || ''
            state.bankName = obj.bankName || ''
            state.bankAccount = obj.bankAccount || ''
            state.address = obj.address || ''
            state.enabled = obj.enabled || ''
        },
        resetEnabled(state, enabled) {
            state.enabled = enabled
        },
        resetCode(state, code) {
            state.code = code
        },
        resetName(state, name) {
            state.name = name
        },
        resetTotal(state, total) {
            state.total = total
        },
        resetPagination(state, params) {
            state.start = params.start
            state.limit = params.limit
        }
    },
    actions: {
        modifySupplier({commit, state}, params) {
            let {sendParams, callBack} = params;
            api.request({
                url: api.consts._WARE_BASE_INFO_SUPPLIER_PUT,
                method: 'PUT',
                params: sendParams,
                success(data) {
                    callBack()
                }
            })
        }
    }
}
