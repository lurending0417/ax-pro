import api from '~/api'
import {baseUtil, constUtil, calculateUtil, dateUtil, numberUtil} from '~/util'

const {add, subtract, multiply, divide} = calculateUtil;

export default {
    namespaced: true,
    state: {
        canChange: true,
        retailBill: {}, // 销售单
        userInfo: {}, // 用户信息
        wareItems: [], // 销售单商品明细列表
        metalPrice: [], // 所有材质今日金价
        exchangeBill: {}
    },
    getters: {
        getCanChange: state => state.canChange,
        getUserInfo: state => {
            if (state.userInfo.createTime) {
                state.userInfo.createTime = dateUtil.pattern(new Date(state.userInfo.createTime), 'yyyy-MM-dd HH:mm:ss')
            }
            return state.userInfo
        },
        getWareItems: state => {
            return state.wareItems.map((item, index) => {
                item.categoryName = baseUtil.getNameFromPropId('category', item.categoryId)
                item.metalName = baseUtil.getNameFromPropId('metal', item.metalId)
                item.gemName = baseUtil.getNameFromPropId('gem', item.gemId)
                if (baseUtil.getNameFromPropId('metal', item.metalId)) {
                    if (state.metalPrice.find(ele => ele.metalId === item.metalId)) {
                        item.metalPrice = state.metalPrice.find(ele => ele.metalId === item.metalId).retailPrice
                    }
                }
                if (constUtil._CONST_RETAIL_PRICE.find(ele => ele.value === item.priceType)) {
                    item.priceType = constUtil._CONST_RETAIL_PRICE.find(ele => ele.value === item.priceType).name
                }
                return item
            })
        },
        getExchangeBill: state => {
            if (state.exchangeBill.tranItems) {
                state.exchangeBill.tranItems.forEach(item => {
                    item.metalId = baseUtil.getMetadataMetalById(item.metalId).name
                    item.priceType = constUtil._CONST_RETAIL_PRICE_TYPE.find(ele => ele.value === item.priceType).name
                })
                return state.exchangeBill
            } else {
                return []
            }
        },
        getTotalPrice(state) {
            let obj = {
                totalRetailPrice: 0,
                totalDiscountPrice: 0,
                totalActualPrice: 0
            };
            let {toKeepTwoPlacesOfDecimalAndRound} = numberUtil;
            // 计算totalRetailPrice
            state.wareItems.forEach(item => {
                if (item.retailPrice && item.retailPrice !== '/') {
                    obj.totalRetailPrice += multiply(item.retailPrice, item.amount)
                }
                if (item.price) {
                    obj.totalActualPrice += numberUtil.toKeepTwoPlacesOfDecimalAndRound(parseFloat(item.price));
                }
                // 计算totalDiscountPrice (零售价x(10-折扣比例)/10 + 其他优惠)
                if (item.retailPrice === 0 || (item.retailPrice && item.retailPrice !== '/')) {
                    obj.totalDiscountPrice += add(multiply(multiply(item.retailPrice, divide(subtract(10, toKeepTwoPlacesOfDecimalAndRound(item.ratio)), 10)), item.amount), toKeepTwoPlacesOfDecimalAndRound(item.youhui));
                }
            })
            if (state.exchangeBill.tranItems) {
                state.exchangeBill.tranItems.forEach(ele => {
                    obj.totalActualPrice -= ele.totalCost;
                })
            }
            for (let key in obj) {
                if (numberUtil.judgeDecimal(obj[key])) {
                    obj[key] = numberUtil.toKeepTwoPlacesOfDecimalAndRound(obj[key]);
                }
            }
            obj.totalRetailPrice = obj.totalRetailPrice || 0;
            obj.totalActualPrice = obj.totalActualPrice || 0;
            obj.totalDiscountPrice = obj.totalDiscountPrice || 0;
            return obj
        }
    },
    mutations: {
        resetCanChange(state, canChange) {
            state.canChange = canChange
        },
        resetUserInfo(state, userInfo) {
            state.userInfo = userInfo
        },
        resetWareItems(state, obj) {
            if (obj.data) {
                state.wareItems.push(obj.data)
            }
            if (obj.item) {
                // let temp = state.wareItems;
                let {value, name, item} = obj;
                item[name] = value;
                if (name === 'price') {
                    item.youhui = subtract(multiply(multiply(item.retailPrice, divide(item.ratio, 10)), item.amount), value)
                } else if (name === 'youhui') {
                    item.price = subtract(multiply(item.amount, divide(multiply(item.retailPrice, item.ratio), 10)), value)
                } else if (name === 'ratio') {
                    item.price = subtract(multiply(item.amount, divide(multiply(item.retailPrice, value), 10)), item.youhui)
                } else if (name === 'amount') {
                    item.price = subtract(multiply(value, divide(multiply(item.retailPrice, item.ratio), 10)), item.youhui)
                }
            }
        },
        resetAllWareItems(state, wareItems) {
            wareItems.forEach(item => {
                if (item.priceType === 'WEIGHTED') { // 今日金价
                    // retailPrice 指的是单件的零售价，price指的是多件的总价
                    // processingCharges 指的是元/g时的工费
                    let count = add(multiply(item.metalPrice, item.weight), multiply(item.processingCharges, item.weight))
                    item.regularPrice = count;
                    item.retailPrice = count
                } else if (item.priceType === 'FIXED') {
                    item.processingCharges = '/'
                    item.metalPrice = '/'
                }
            })
            state.wareItems = wareItems
        },
        clearWareItems(state) {
            state.wareItems = []
        },
        deleteWareItem(state, index) {
            state.wareItems.splice(index, 1)
        },
        resetMetalPrice(state, metalPrice) {
            state.metalPrice = metalPrice
        },
        resetExchangeBill(state, exchangeBill) {
            state.exchangeBill = exchangeBill
        }
    },
    actions: {
        apiGetUser({commit, state}, obj) {
            api.request({
                url: api.consts._USER_GET_POST,
                params: {
                    telephone: obj.params.telephone
                },
                success(data) {
                    commit('resetUserInfo', data.result)
                    obj.callback(data)
                },
                fail(error) {
                    commit('resetUserInfo', {})
                    obj.callback(error)
                }
            })
        },
        apiGetWareBySerial({commit, state}, obj) {
            api.request({
                url: api.consts._STOCK_GET_STORAGE,
                params: {
                    serial: obj.params.serial,
                    wareHouseId: obj.params.wareHouseId
                },
                success(data) {
                    let item = data.result
                    item.originAmount = item.amount; // 保存item的原始数量
                    item.amount = 1;
                    item.remark = '';
                    item.metalPrice = 0;
                    if (item.priceType === 'WEIGHTED') { // 今日金价
                        // retailPrice 指的是单件的零售价，price指的是多件的总价
                        let metalPrice = state.metalPrice.find(ele => ele.metalId === item.metalId).retailPrice
                        if (!metalPrice) {
                            alert('获取金价失败，请检查是否正确设置了' + baseUtil.getNameFromPropId('metal', item.metalId) + '的金价')
                            return
                        }
                        item.metalPrice = metalPrice
                        console.log('metalPrice = ' + metalPrice);
                        let count = add(multiply(metalPrice, item.weight), item.computedProcessingCharges);
                        if (numberUtil.judgeDecimal(count)) {
                            count = Number(count.toFixed(2));
                        }
                        console.log('computed', count);
                        item.regularPrice = count;
                        item.retailPrice = count
                        item.processingCharges = item.computedProcessingCharges
                        item.ratio = 10
                        item.youhui = 0
                        item.price = multiply(item.retailPrice, item.amount);
                    } else if (item.priceType === 'FIXED') {
                        item.processingCharges = '/'
                        item.ratio = item.discountRate || 10
                        item.youhui = item.extraDiscount || 0
                        item.price = multiply(item.retailPrice, item.amount)
                    }
                    commit('resetWareItems', {data: item})
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiGetMetalPrice({commit, state}, obj) {
            api.request({
                url: api.consts._METAL_PRICE_GET,
                params: {},
                success(data) {
                    commit('resetMetalPrice', data.rows)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiAddRetailBill({commit, state}, obj) {
            api.request({
                url: api.consts._RETAIL_BILL_GET_POST,
                method: 'post',
                params: {
                    wareHouseId: obj.params.wareHouseId,
                    salesmanId: obj.params.salesmanId,
                    customerId: obj.params.customerId,
                    telephone: obj.params.telephone,
                    nickName: obj.params.nickName,
                    gender: obj.params.gender,
                    exchangeBillId: obj.params.exchangeBillId,
                    itemsJson: obj.params.itemsJson
                },
                success(data) {
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 零售单绑定置换单
        apiGetExchangeBillToBind({commit, state}, obj) {
            api.request({
                url: api.consts._EXCHANGE_BILL_GET_FOR_BIND,
                params: {
                    billNumber: obj.params.billNumber
                },
                success(data) {
                    commit('resetExchangeBill', data.result)
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                    obj.callback(error)
                }
            })
        }
    }
}
