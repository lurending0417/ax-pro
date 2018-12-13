import baseUtil from './baseUtil'
import constUtil from './constUtil'
import dateUtil from './dateUtil'

export default {
    handleResult(arr) { // 处理试戴订单
        let tempArr = [];
        arr.forEach((list) => {
            let item = {};
            // let {leaseRecord, leaseStorage, payRecords} = list
            let {leaseRecord, leaseStorage, leaseShippingRecord, backShippingRecord, outStore} = list
            let {storage} = leaseStorage.storageView;
            let {lease} = leaseStorage;
            item.billNumber = leaseRecord.billNumber;
            item.leaseDays = leaseRecord.leaseDays;
            item.createTime = dateUtil.pattern(new Date(leaseRecord.createTime), 'yyyy-MM-dd HH:mm:ss')
            item.serial = storage.serial;
            item.amount = storage.amount;
            item.storeName = storage.storeName;
            item.outStoreName = outStore.name;
            item.categoryName = baseUtil.getNameFromPropId('category', storage.categoryId);
            item.gemName = baseUtil.getNameFromPropId('gem', storage.gemId);
            item.metalName = baseUtil.getNameFromPropId('metal', storage.metalId);
            item.depositPrice = lease.depositPrice;
            item.rentPrice = lease.rentPrice;
            item.id = leaseRecord.id;
            item.wareHouseId = storage.wareHouseId;
            item.storageId = leaseRecord.storageId;
            item.statusName = baseUtil.getEnumNameById(list.status, baseUtil.getEnumsByKey('leaseRecordStatus'))
            if (leaseShippingRecord.shippingRecord) {
                if (constUtil._CONST_SHIPPER.find(ele => ele.id === leaseShippingRecord.shippingRecord.shipper)) {
                    item.shipperName = constUtil._CONST_SHIPPER.find(ele => ele.id === leaseShippingRecord.shippingRecord.shipper).name;
                }
                item.logisticsCode = leaseShippingRecord.shippingRecord.logisticsCode;
            }
            if (backShippingRecord.shippingRecord) {
                if (constUtil._CONST_SHIPPER.find(ele => ele.id === backShippingRecord.shippingRecord.shipper)) {
                    item.shipperNameBack = constUtil._CONST_SHIPPER.find(ele => ele.id === backShippingRecord.shippingRecord.shipper).name;
                }
                item.logisticsCodeBack = backShippingRecord.shippingRecord.logisticsCode;
            }
            if (list.status === 'LEASE_SHIPPING') {
                // item.express = list.   //
            } else if (list.status === 'SHIPPING_REQUESTED') {
                // item.shipper = list.leaseShippingRecord.shipper
            } else if (list.status === 'WAIT_QC_CONFIRM') { // 'DONE_BUY'
                console.log('test', leaseRecord)
                item.depositCost = leaseRecord.depositCost;
                item.rentCost = leaseRecord.rentCost;
                item.actualRentCost = leaseRecord.actualRentCost;
                item.totalCost = leaseRecord.totalCost;
                item.refundCost = leaseRecord.refundCost;
                item.retailPrice = storage.retailPrice;
            } else if (list.status === 'DONE_BUY') {
                item.depositCost = leaseRecord.depositCost;
                item.rentCost = leaseRecord.rentCost;
                item.actualRentCost = leaseRecord.actualRentCost;
                item.totalCost = leaseRecord.totalCost;
                item.refundCost = leaseRecord.refundCost;
                item.retailPrice = storage.retailPrice;
            }
            tempArr.push(item)
        })
        return tempArr
    },
    /**
     * 用逗号将str分割成数组，根据arr对象数组将分割后的数组转换成对应的中文值，返回中文值
     * @param str 待处理的字符串, required
     * @param arr 对应的数组, required
     */
    handleStr(str, arr) {
        let tempArr = []
        if (str.split(',').indexOf('all') !== -1) {
            tempArr = arr.map(item => item.id)
        } else {
            tempArr = str.split(',');
        }
        return tempArr.map(ele => {
            return arr.find(e => e.id === ele) ? arr.find(e => e.id === ele).name : ''
        }).filter(item => item).join()
    },
    handleBirth(birthStr) {
        let birth = '';
        let arr = birthStr.split('月')
        arr[1] = arr[1].substring(0, arr[1].length - 1)
        arr.forEach(item => {
            if (item.length === 1) {
                item = '0' + item
            }
            birth += item
        })
        return birth
    },
    handleGold(n) {
        let str = n.toString();
        if (str[0] === '-') {
            str = str.slice(1)
        }
        if (str.length > 3) {
            return n / 1000 + 'g'
        } else {
            return n + 'mg'
        }
    },
    /**
     * 给对象数组中指定的对象值加上单位,再将处理后的数组返回
     * @param arr 待处理的对象数组, required
     * @param unitObj 对应的单位对象，指定需要加单位的属性, required
     */
    handleUnit(arr, unitObj) {
        return arr.map(item => {
            for (let unitKey in unitObj) {
                for (let itemKey in item) {
                    if (unitKey === itemKey) {
                        if (item[itemKey] !== '') {
                            item[itemKey] += unitObj[unitKey];
                        }
                        break;
                    }
                }
            }
            return item
        })
    },
    handleItemUnit(value, unit) {
        if (value || value === 0) {
            return value + unit
        } else {
            return value
        }
    },
    handleParam(propsArr, gettedArr) { // 处理参数
        if (propsArr) {
            // 处理参数数组，将选中的值附加到props数组中，便于用vue渲染和回显以及取值
            let props = propsArr.map(param => {
                if (param.preValues) { // 如果有预设值，则根据不同的type给出对应的gettedValue
                    if (param.inputType === 'INPUT') {
                        param.preValues = param.preValues.replace(/,/g, '，')
                        param.gettedValue = ''
                    } else if (param.inputType === 'CHECKBOX') {
                        param.gettedValue = []
                    } else if (param.inputType === 'RADIO') {
                        param.gettedValue = ''
                    }
                    // 将预设值分割成数组
                    param.preValues = param.preValues.split(',')
                } else { // 如果没有预设值，则对应的type为input，给出默认的gettedValue
                    param.gettedValue = ''
                }
                if (gettedArr && gettedArr.length > 0) { // 如果选中的值的数组存在并且大于0,则将gettedValue赋给param
                    gettedArr.forEach(item => {
                        if (item.fieldId === param.id) {
                            // 如果参数的类型为复选框，则将选中的值分割成数组
                            if (param.inputType === 'CHECKBOX' && typeof (item.value) === 'string') {
                                item.value = item.value.split(',')
                            }
                            // 如果参数的类型为单选框，并且选中的值不存在预设值中（用于调整将文本框改成单选框之后遗留下来的问题），
                            // 则将选中的值追加到单选框后
                            if (param.inputType === 'RADIO' && (param.preValues.indexOf(item.value) === -1)) {
                                param.preValues.push(item.value)
                            }
                            param.gettedValue = item.value
                        }
                    })
                }
                return param
            })
            // 遍历处理之后的参数，如果该参数已经被禁用，则判断用户是否处理了这个参数，如果处理了，则显示此参数，但不允许用户修改，否则不予显示
            props.map(item => {
                if (!item.enabled) {
                    if (item.gettedValue.length === 0) {
                        item.isNotShow = true // 不显示的选项
                    } else {
                        item.disabled = true // 显示但禁用的选项
                    }
                }
                return item
            })
            return props
        } else {
            return []
        }
    },
    getStockBillStatus(stockBillStatus) {
        switch (stockBillStatus) {
            case 'TO_SUBMIT':
                return '待提交'
            case 'TO_AUDIT':
                return '待审核'
            case 'AUDIT_DECLINED':
                return '审核失败'
            case 'AUDIT_APPROVED':
                return '审核通过'
        }
    },
    getAllocateBillStatus(allocateBillStatus) {
        switch (allocateBillStatus) {
            case 'TO_ALLOCATE_OUT':
                return '待发货'
            case 'TO_ACCEPT':
                return '待收货'
            case 'ACCEPTED':
                return '已收货'
            case 'REJECTED_TO_CONFIRM':
                return '拒收(待确认)'
            case 'REJECTED_CONFIRMED':
                return '拒收(已确认)'
        }
    },
    getInventoryBillStatus(inventoryBillStatus) {
        let status = '';
        constUtil._CONST_INVENTORY_TYPE.forEach(type => {
            if (type.value === inventoryBillStatus) {
                status = type.name
            }
        })
        return status
    },
    splitProps(propsArr) {
        let params = {
            metal: [],
            category: [],
            gem: []
        };
        propsArr.forEach((item) => {
            switch (item.type) {
                case 'METAL' : {
                    params.metal.push(item);
                    break;
                }
                case 'CATEGORY' : {
                    params.category.push(item);
                    break;
                }
                case 'GEM' : {
                    params.gem.push(item);
                }
            }
        });
        return params;
    },
    getStockTypeByIN(bool) { // 根据bool值获取对应入库单类型
        if (bool) {
            return constUtil._CONST_STOCK_TYPE_IN_OR_OUT.filter(item => item.isIn)
        } else {
            return constUtil._CONST_STOCK_TYPE_IN_OR_OUT.filter(item => !item.isIn)
        }
    }
}
