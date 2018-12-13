import api from '~/api'
import { baseUtil, constUtil, dateUtil } from '~/util'

export default {
    namespaced: true,
    state: {
        canChange: true,
        metalPrice: [],
        userInfo: {},
        totalPay: 0,
        exchangeBillDetail: {}, // 置换单信息
        exchangeBillDetailItems: [] // 置换单详情列表
    },
    getters: {
        getCanChange: state => state.canChange,
        getMetalPrice: state => state.metalPrice,
        getUserInfo: state => {
            console.log('userInfo', state.userInfo);
            if (state.userInfo) {
                if (state.userInfo.gender) {
                    state.userInfo.gender = constUtil._CONST_USER_GENDER.find(ele => ele.value === state.userInfo.gender).name
                }
                state.userInfo.createTime = dateUtil.pattern(new Date(state.userInfo.createTime), 'yyyy-MM-dd HH:mm:ss')
            } else {
                state.userInfo = {
                    gender: '',
                    nickName: '',
                    telephone: '',
                    createTime: ''
                }
            }
            return state.userInfo
        },
        getExchangeBillDetail: state => {
            state.exchangeBillDetail.wareHouseId = baseUtil.getNameFromPropId('wareHouse', state.exchangeBillDetail.wareHouseId)
            return state.exchangeBillDetail
        },
        getExchangeBillDetailItems: state => {
            return state.exchangeBillDetailItems.map(item => {
                item.metalId = baseUtil.getMetadataMetalById(item.metalId).name
                item.priceType = constUtil._CONST_RETAIL_PRICE_TYPE.find(ele => ele.value === item.priceType).name
                return item
            })
        },
        getTotalPay(state) {
            return state.totalPay
        }
    },
    mutations: {
        resetCanChange (state, canChange) {
            state.canChange = canChange
        },
        resetMetalPrice (state, metalPrice) {
            state.metalPrice = metalPrice
        },
        resetUserInfo (state, userInfo) {
            console.log('userInfo', userInfo);
            state.userInfo = userInfo
        },
        resetExchangeBillDetail (state, exchangeBillDetail) {
            state.exchangeBillDetail = exchangeBillDetail
            state.userInfo = exchangeBillDetail.customer
        },
        resetExchangeBillDetailItems (state, exchangeBillDetailItems) {
            state.exchangeBillDetailItems = exchangeBillDetailItems
        }
    },
    actions: {
        apiAddExchangeBill ({commit, state}, obj) {
            api.request({
                url: api.consts._EXCHANGE_BILL_GET_POST,
                method: 'post',
                params: obj.params,
                success (data) {
                    console.log(data)
                    obj.callback(data)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        apiGetMetalPrice ({commit, state}) {
            api.request({
                url: api.consts._METAL_PRICE_GET,
                params: {},
                success (data) {
                    console.log(data)
                    commit('resetMetalPrice', data.rows)
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        apiGetUser ({commit, state}, obj) {
            api.request({
                url: api.consts._USER_GET_POST,
                params: {
                    telephone: obj.params.telephone
                },
                success (data) {
                    commit('resetUserInfo', data.result)
                    obj.callback(data)
                },
                fail (error) {
                    commit('resetUserInfo', {})
                    obj.callback(error)
                }
            })
        },
        apiGetExchangeBillDetail ({commit, state}, obj) {
            api.request({
                url: api.consts._EXCHANGE_BILL_DELETE_GET,
                params: {...obj.params},
                success (data) {
                    console.log(data)
                    commit('resetExchangeBillDetail', data.result)
                    obj.callback()
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        apiGetExchangeBillItem ({commit, state}, obj) {
            api.request({
                url: api.consts._EXCHANGE_BILL_ITEM_GET,
                params: {...obj.params},
                success (data) {
                    console.log(data)
                    commit('resetExchangeBillDetailItems', data.rows)
                    obj.callback()
                },
                fail (error) {
                    alert(error.message)
                }
            })
        }
    }
}
