import api from '~/api'
import {baseUtil} from '~/util'

export default {
    namespaced: true,
    state: {
        metalPrice: 0,
        metalPriceArr: [],
        recyclerWareHouse: [] // 回收仓
    },

    getters: {
        getRetailRecycleBillAddView: state => {
            // return state.retailRecycleBills.map(bill => {
            //     bill.createTime = dateUtil.pattern(new Date(bill.createTime), 'yyyy-MM-dd HH:mm:ss')
            //     bill.updateTime = dateUtil.pattern(new Date(bill.updateTime), 'yyyy-MM-dd HH:mm:ss')
            //     bill.paid = bill.paid ? '已付款' : '未付款';
            //     if (baseUtil.getNameFromPropId('wareHouse', bill.wareHouseId)) {
            //         bill.wareHouseId = baseUtil.getNameFromPropId('wareHouse', bill.wareHouseId)
            //     }
            //     bill.creatorId = baseUtil.getNameFromPropId('staffs', bill.creatorId)
            //     bill.updaterId = baseUtil.getNameFromPropId('staffs', bill.updaterId)
            //     return bill
            // })
            return state.retailRecycleBillAdd
        },
        getMetalPriceArr: state => {
            return state.metalPriceArr.map((item) => {
                item.name = baseUtil.getNameFromPropId('metal', item.metalId);
                return item
            });
        },
        getRrecyclerWareHouse () {
            let recyclerWareHouse = []
            baseUtil.getMetadataWareHouseByStoreId(baseUtil.getStore().id).forEach(wareHouse => {
                if (wareHouse.recycle === true) {
                    recyclerWareHouse.push(wareHouse)
                }
            })
            return recyclerWareHouse
        }
    },
    mutations: {
        resetMetalPriceArr(state, metalPriceArr) {
            state.metalPriceArr = metalPriceArr;
        }
    },
    actions: {
        // 新增回收单
        addRetailRecycleBill ({commit, state}, params) {
            let {callback, commitObj} = params;
            api.request({
                url: api.consts._RETAIL_RECYCLE_BILL,
                method: 'post',
                params: commitObj,
                success (data) {
                    callback(data);
                },
                fail (error) {
                    alert(error.message)
                }
            })
        },
        // 通过金属获取金价
        getMetalPriceByMetal ({commit, state}) {
            // console.log('通过金属获取金价', );
            if (state.metalPriceArr.length === 0) {
                api.request({
                    url: api.consts._WARE_BASE_INFO_GOLDPRICE_GET,
                    params: {},
                    success (data) {
                        commit('resetMetalPriceArr', data.rows);
                    },
                    fail (error) {
                        alert(error.message)
                    }
                })
            }
        }
    }
}
