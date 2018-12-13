import constUtil from './constUtil'

export default {
    _METADATA_NAME: 'ax_metadata',
    _BASIC_INFO: 'ax_basicInfo',
    _TEMPLATES: 'templates',
    setMetadata(data) {
        let {user, metadata} = data.result
        let temp = {};
        let index = 0;
        for (let i = 0, j = metadata.staffs.length; i < j; i++) {
            if (metadata.staffs[i].id === user.id) {
                temp = metadata.staffs[i];
                index = i;
                break;
            }
        }
        if (index !== 0) {
            // 先删除指定位置的元素，再将登陆人员插入第一个
            metadata.staffs.splice(index, 1);
            metadata.staffs.unshift(temp);
        }
        sessionStorage.setItem(this._METADATA_NAME, JSON.stringify(metadata))
    },
    setBasicInfo(basicInfo) {
        let newBasicInfo = {
            user: basicInfo.result.user,
            staff: basicInfo.result.staff,
            store: basicInfo.result.store,
            merchant: basicInfo.result.merchant,
            authorizedPages: basicInfo.result.authorizedPages
        }
        // authorizedPages: basicInfo.result.authorizedPages
        sessionStorage.setItem(this._BASIC_INFO, JSON.stringify(newBasicInfo))
    },
    setTemplateInLocalStorage(templates) {
        let temps = this.getTemplates()
        let setTemps = temps
        if (temps) {
            for (let key in templates) {
                let flag = false
                for (let id in temps) {
                    if (key === id) {
                        flag = true
                        break
                    }
                }
                if (!flag) {
                    setTemps[key] = templates[key]
                }
            }
        }
        localStorage.setItem(this._TEMPLATES, JSON.stringify(setTemps));
    },
    getTemplates() {
        if (process.browser) {
            return JSON.parse(localStorage.getItem(this._TEMPLATES))
        }
    },
    deleteMetadata() {
        sessionStorage.removeItem(this._METADATA_NAME)
    },
    deleteBasicInfo() {
        sessionStorage.removeItem(this._BASIC_INFO)
    },

    _getBasicInfo() {
        if (process.browser) {
            return JSON.parse(sessionStorage.getItem(this._BASIC_INFO))
        }
    },
    getUser() {
        if (process.browser) {
            return this._getBasicInfo().user
        }
    },
    getMerchantId() {
        if (process.browser) {
            return this.getStaff().merchantId || ''
        }
    },
    getStaff() {
        if (process.browser) {
            return this._getBasicInfo().staff || {}
        }
    },
    getStore() {
        if (process.browser) {
            return this._getBasicInfo().store || {}
        }
    },
    getMerchant() {
        if (process.browser) {
            return this._getBasicInfo().merchant || {}
        }
    },
    getNameFromPropId(prop, id) {
        if (this.getMetadata()[prop]) {
            let objArr = this.getMetadata()[prop]
            for (let i = 0; i < objArr.length; i++) {
                if (objArr[i].id === id) {
                    let obj = objArr[i]
                    if (obj.nickName) {
                        return obj.nickName
                    } else {
                        return obj.name
                    }
                }
            }
        } else {
            return ''
        }
    },
    getStockBillStatu(stockBillStatu) {
        switch (stockBillStatu) {
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
    getAllocateBillStatu(allocateBillStatu) {
        switch (allocateBillStatu) {
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
    getInventoryBillStatu(inventoryBillStatu) {
        let statu = '';
        constUtil._CONST_INVENTORY_TYPE.forEach(type => {
            if (type.value === inventoryBillStatu) {
                statu = type.name
            }
        })
        return statu
    },
    getMetadata() {
        if (process.browser) {
            return JSON.parse(sessionStorage.getItem(this._METADATA_NAME))
        }
    },
    getMetadataStaffs() {
        if (process.browser) {
            return this.getMetadata().staffs ? this.getMetadata().staffs : []
        }
    },
    getMetadataStaffById(id) {
        if (process.browser) {
            if (this.getMetadata().staffs) {
                let staff = this.getMetadata().staffs.find(staff => staff.id === id)
                return staff !== undefined ? staff : {}
            } else {
                return {}
            }
        }
    },
    getMetadataStaffByStoreId(storeId) {
        if (process.browser) {
            let staffs = [];
            if (this.getMetadata().staffs) {
                this.getMetadata().staffs.forEach(staff => {
                    if (staff.storeId === storeId) {
                        staffs.push(staff)
                    }
                })
            }
            return staffs
        }
    },
    getMetadataMetal() {
        if (process.browser) {
            if (this.getMetadata().metal) {
                return this.getMetadata().metal
            } else {
                return []
            }
        }
    },
    getMetadataMetalById(id) {
        if (process.browser) {
            if (this.getMetadata().metal) {
                let metal = this.getMetadata().metal.find(metal => metal.id === id)
                return metal || {}
            } else {
                return {}
            }
        }
    },
    getMetadataCategory() {
        if (process.browser) {
            if (this.getMetadata().category) {
                return this.getMetadata().category
            } else {
                return []
            }
        }
    },
    getMetadataCategoryById(id) {
        if (process.browser) {
            if (this.getMetadataCategory()) {
                let category = this.getMetadataCategory().find(category => category.id === id)
                return category || {}
            } else {
                return {}
            }
        }
    },
    getMetadataVendors() {
        if (process.browser) {
            if (this.getMetadata().vendors) {
                return this.getMetadata().vendors
            } else {
                return []
            }
        }
    },
    getMetadataVendorById(id) {
        if (process.browser) {
            if (this.getMetadataVendors()) {
                let vendor = this.getMetadataVendors().find(vendor => vendor.id === id)
                return vendor !== undefined ? vendor : {}
            } else {
                return {}
            }
        }
    },
    getMetadataPropNameById(id) {
        let result = ''
        this.getMetadata().category.forEach(category => {
            if (category.id === id) {
                result = category.name
            }
        })
        this.getMetadata().metal.forEach(metal => {
            if (metal.id === id) {
                result = metal.name
            }
        })
        this.getMetadata().gem.forEach(gem => {
            if (gem.id === id) {
                result = gem.name
            }
        })
        return result
    },
    getMetadataGem() {
        if (process.browser) {
            if (this.getMetadata().gem) {
                return this.getMetadata().gem
            } else {
                return []
            }
        }
    },
    getMetadataGemById(id) {
        if (process.browser) {
            if (this.getMetadataGem()) {
                let gem = this.getMetadataGem().find(gem => gem.id === id)
                return gem !== undefined ? gem : {}
            } else {
                return {}
            }
        }
    },
    getMetadataWareHouse() {
        if (process.browser) {
            if (this.getMetadata().wareHouse) {
                return this.getMetadata().wareHouse
            } else {
                return []
            }
        }
    },
    getMetadataWareHouseById(id) {
        if (process.browser) {
            if (this.getMetadataWareHouse()) {
                let warehouse = this.getMetadataWareHouse().find(warehouse => warehouse.id === id)
                return warehouse !== undefined ? warehouse : {}
            } else {
                return {}
            }
        }
    },
    getMetadataWareHouseByStoreId(storeId) {
        if (process.browser) {
            let warehouse = [];
            if (this.getMetadataWareHouse()) {
                this.getMetadataWareHouse().forEach(house => {
                    if (house.storeId === storeId) {
                        warehouse.push(house)
                    }
                })
            }
            return warehouse
        }
    },
    getMetadataRejectWareHouse() {
        let recyclerWareHouse = []
        this.getStore() && this.getMetadataWareHouseByStoreId(this.getStore().id).forEach(wareHouse => {
            if (wareHouse.recycle === true) {
                recyclerWareHouse.push(wareHouse)
            }
        })
        return recyclerWareHouse
    },

    getMetadataStore() {
        if (process.browser) {
            if (this.getMetadata().stores) {
                return this.getMetadata().stores
            } else {
                return []
            }
        }
    },
    getMetadataStoreById(id) {
        if (process.browser) {
            if (this.getMetadataStore().length > 0) {
                let store = this.getMetadataStore().find(store => store.id === id)
                return store !== undefined ? store : {}
            } else {
                return {}
            }
        }
    },
    getMetadataCraft() {
        if (process.browser) {
            if (this.getMetadata().craft) {
                return this.getMetadata().craft
            } else {
                return []
            }
        }
    },
    getMetadataCraftById(id) {
        if (process.browser) {
            if (this.getMetadataCraft()) {
                let craft = this.getMetadataCraft().find(craft => craft.id === id)
                return craft !== undefined ? craft : {}
            } else {
                return {}
            }
        }
    },
    getEnumsByKey(key) { // 获取指定枚举值对应的对象数组
        if (process.browser) {
            if (key) {
                return this.getMetadata().enums[key]
            }
        }
    },
    getEnumNameById(id, arr) {
        if (process.browser) {
            for (let i = 0, j = arr.length; i < j; i++) {
                if (arr[i].id === id) {
                    return arr[i].name
                }
            }
        }
    },
    getWarehouseByStoreId() { // 获取当前登录员工所在的门店的所有仓库
        if (process.browser) {
            if (this.getStore()) {
                let storeId = this.getStore().id;
                return this.getMetadataWareHouseByStoreId(storeId)
            } else {
                return []
            }
        }
    },
    getStaffsInDesignStoreByStoreId(_storeId) { // 根据指定门店获取对应员工数组，如果不传则获取当前登录员工的门店的员工数组
        if (process.browser) {
            let staffs = [];
            let storeId = _storeId || ''
            if (this.getStore().id) {
                storeId = _storeId || this.getStore().id
            }
            if (this.getMetadataStaffs().length > 0) {
                this.getMetadataStaffs().forEach((item) => {
                    if (item.storeId === storeId) {
                        staffs.push(item)
                    }
                })
            }
            return staffs
        }
    },
    getWareHouseInDesignStoreByStoreId(storeId) { // 根据指定门店获取对应仓库数组
        if (process.browser) {
            let wareHouses = [];
            if (this.getMetadataWareHouse().length > 0) {
                this.getMetadataWareHouse().forEach((item) => {
                    if (item.storeId === storeId) {
                        wareHouses.push(item)
                    }
                })
            }
            return wareHouses
        }
    },
    getArrByKeyFromMetaData(key) { // 根据指定的key获取metadata中对应的数组
        if (this.getMetadata()[key]) {
            return this.getMetadata()[key]
        } else {
            return []
        }
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
