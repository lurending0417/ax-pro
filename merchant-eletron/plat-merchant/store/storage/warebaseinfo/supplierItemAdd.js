import api from '~/api'

export default {
    namespaced: true,
    state: {
        merchantId: '', // 商户ID
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
    getters: {},
    mutations: {
        resetSupplierItemAddInfo (state, obj) {
            state.merchantId = obj.merchantId
            state.code = obj.code
            state.name = obj.name
            state.contact = obj.contact
            state.phone = obj.phone
            state.corpName = obj.corpName
            state.taxNo = obj.taxNo
            state.bankName = obj.bankName
            state.bankAccount = obj.bankAccount
            state.address = obj.address
            state.enabled = obj.enabled
        },
        resetTotal (state, total) {
            state.total = total
        },
        resetPagination (state, params) {
            state.start = params.start
            state.limit = params.limit
        }
    },
    actions: {
        addSupplier ({commit, state}, callback) {
            api.request({
                url: api.consts._WARE_BASE_INFO_SUPPLIER_POST,
                method: 'post',
                params: {
                    merchantId: state.merchantId,
                    code: state.code ? state.code : '',
                    name: state.name ? state.name : '',
                    contact: state.contact ? state.contact : '',
                    phone: state.phone ? state.phone : '',
                    corpName: state.corpName ? state.corpName : '',
                    taxNo: state.taxNo ? state.taxNo : '',
                    bankName: state.bankName ? state.bankName : '',
                    bankAccount: state.bankAccount ? state.bankAccount : '',
                    address: state.address ? state.address : '',
                    enabled: state.enabled ? state.enabled : ''
                },
                success (data) {
                    if (data.status === 200) {
                        callback()
                    }
                },
                fail (error) {
                    alert(error.message)
                }
            })
        }
    }
}
