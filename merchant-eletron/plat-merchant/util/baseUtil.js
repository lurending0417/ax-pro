
export default {
    _METADATA_NAME: 'ax_metadata',
    _BASIC_INFO: 'ax_basicInfo',
    _TEMPLATES: 'templates',
    setMetadata(data) { // 设置metadata
        let {user, metadata} = data.result;
        // 处理staff数组，让登录的人排在第一个
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
        // 处理wareHouse数组，让禁用的wareHouse的name后面加上停用两个字
        metadata.wareHouse.map(item => {
            if (!item.enabled) {
                item.name += '(停用)'
            }
            return item
        })
        sessionStorage.setItem(this._METADATA_NAME, JSON.stringify(metadata))
    },
    setBasicInfo(basicInfo) { // 设置basicInfo
        let newBasicInfo = {
            user: basicInfo.result.user,
            staff: basicInfo.result.staff,
            store: basicInfo.result.store,
            merchant: basicInfo.result.merchant
        }
        // authorizedPages: basicInfo.result.authorizedPages
        sessionStorage.setItem(this._BASIC_INFO, JSON.stringify(newBasicInfo))
    },
    setTemplateInLocalStorage(templates) { // 设置模板
        let temps = this.getTemplates()
        if (temps) {
            localStorage.removeItem(this._TEMPLATES)
        }
        localStorage.setItem(this._TEMPLATES, JSON.stringify(templates));
    },

    deleteMetadata() { // 删除metadata
        sessionStorage.removeItem(this._METADATA_NAME)
    },
    deleteBasicInfo() { // 删除basicInfo
        sessionStorage.removeItem(this._BASIC_INFO)
    },

    getTemplates() { // 获取模板
        if (process.browser) {
            return JSON.parse(localStorage.getItem(this._TEMPLATES))
        }
    },

    // ==============================  basicInfo  ==========================
    getBasicInfo() { // 获取basicInfo
        if (process.browser) {
            return JSON.parse(sessionStorage.getItem(this._BASIC_INFO))
        }
    },

    getBasicInfoByKey(key) { // 通过key获取basicInfo中的指定对象
        if (process.browser) {
            return this.getBasicInfo()[key] || {}
        }
    },

    // merchant
    getMerchant() {
        if (process.browser) {
            return this.getBasicInfoByKey('merchant') || {}
        }
    },
    getMerchantId() {
        if (this.getMerchant()) {
            return this.getMerchant().id || ''
        }
    },

    // staff
    getStaff() {
        if (process.browser) {
            return this.getBasicInfoByKey('staff') || {}
        }
    },

    // store
    getStore() {
        if (process.browser) {
            return this.getBasicInfoByKey('store') || {}
        }
    },

    // ==============================  Metadata  ==========================
    getMetadata() {
        if (process.browser) {
            return JSON.parse(sessionStorage.getItem(this._METADATA_NAME))
        }
    },

    getMetadataArrFromKey(key) { // 根据指定的key获取metadata中对应的数组
        if (this.getMetadata()[key]) {
            return this.getMetadata()[key]
        } else {
            return []
        }
    },

    getNameFromPropId(prop, id) { // 根据指定的prop(key),获取对应name/nickname
        if (this.getMetadataArrFromKey(prop)) {
            let objArr = this.getMetadataArrFromKey(prop)
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

    // staffs
    getMetadataStaffs() {
        return this.getMetadataArrFromKey('staffs')
    },

    getMetadataStaffByStoreId(obj) { // 获取metadata中指定门店的所有员工, 如果不传storeId则返回当前门店的所有员工
        if (process.browser) {
            let staffs = [];
            let aimStoreId = this.getStore().id;
            if (obj && obj.storeId) {
                aimStoreId = obj.storeId;
            }
            if (this.getMetadataStaffs().length > 0) {
                this.getMetadataStaffs().forEach(staff => {
                    if (staff.storeId === aimStoreId) {
                        if (obj && obj.atWork) {
                            if (staff.atWork) {
                                staffs.push(staff)
                            }
                        } else {
                            staffs.push(staff)
                        }
                    }
                })
            }
            return staffs
        }
    },

    // metal
    getMetadataMetal() {
        return this.getMetadataArrFromKey('metal')
    },

    getMetadataMetalById(id) { // 获取metadata中指定的metal对象
        if (this.getMetadataMetal().length > 0) {
            let metal = this.getMetadataMetal().find(metal => metal.id === id)
            return metal || {}
        } else {
            return {}
        }
    },

    // category
    getMetadataCategory() {
        return this.getMetadataArrFromKey('category')
    },

    getMetadataCategoryById(id) { // 获取metadata中指定的category对象
        if (this.getMetadataCategory().length > 0) {
            let category = this.getMetadataCategory().find(category => category.id === id)
            return category || {}
        } else {
            return {}
        }
    },

    // vendors
    getMetadataVendors(obj) { // 默认获取所有vendor,如果传递{enabled: true},则返回所有启用的vendors
        let vendors = this.getMetadataArrFromKey('vendors');
        if (obj && obj.enabled) {
            return vendors.filter(item => item.enabled)
        }
        return vendors
    },

    // gem
    getMetadataGem() {
        return this.getMetadataArrFromKey('gem')
    },

    getMetadataGemById(id) { // 获取metadata中指定的gem对象
        if (this.getMetadataGem().length > 0) {
            let gem = this.getMetadataGem().find(gem => gem.id === id)
            return gem || {}
        } else {
            return {}
        }
    },

    // wareHouse
    getMetadataWareHouse(obj) { // 获取metadata中的仓库,如果传递了{enabled: true}，则返回启用的仓库，否则返回所有仓库
        let wareHouse = this.getMetadataArrFromKey('wareHouse')
        if (obj && obj.enabled) {
            return wareHouse.filter(item => item.enabled)
        }
        return wareHouse
    },

    getMetadataWareHouseByStoreId(obj) { // 获取metadata中指定门店的所有仓库,如果不传，就获取当前门店的所有仓库
        if (process.browser) {
            let warehouse = [];
            let aimStoreId = this.getStore().id;
            if (obj && obj.storeId) {
                aimStoreId = obj.storeId
            }
            if (this.getMetadataWareHouse().length > 0) {
                this.getMetadataWareHouse().forEach(house => {
                    if (house.storeId === aimStoreId) {
                        if (obj && obj.enabled) {
                            if (house.enabled) {
                                warehouse.push(house)
                            }
                        } else {
                            warehouse.push(house)
                        }
                    }
                })
            }
            return warehouse
        }
    },

    getMetadataRejectWareHouse(obj) { // 获取metadata中指定门店的回收仓库，默认为当前门店的所有回收仓库
        if (process.browser) {
            let recycleWareHouse = []
            let aimStoreId = this.getStore().id;
            if (obj && obj.storeId) {
                aimStoreId = obj.storeId
            }
            this.getMetadataWareHouseByStoreId({storeId: aimStoreId}).forEach(wareHouse => {
                if (wareHouse.recycle === true) {
                    if (obj && obj.enabled) {
                        if (wareHouse.enabled) {
                            recycleWareHouse.push(wareHouse)
                        }
                    } else {
                        recycleWareHouse.push(wareHouse)
                    }
                }
            })
            return recycleWareHouse
        }
    },

    // stores
    getMetadataStore(obj) { // 获取metadata中的store,如果传递了{enabled: true}，则返回启用的store，否则返回所有store
        let stores = this.getMetadataArrFromKey('stores');
        if (obj && obj.enabled) {
            return stores.filter(item => item.enabled)
        }
        return stores
    },

    getMetadataStoreById(id) { // 获取metadata中指定的stores对象
        if (this.getMetadataStore().length > 0) {
            let store = this.getMetadataStore().find(store => store.id === id)
            return store || {}
        } else {
            return {}
        }
    },

    // craft
    getMetadataCraft() { // 获取metadata中指定的craft对象
        return this.getMetadataArrFromKey('craft')
    },

    // enums
    getEnumsByKey(key) { // 获取指定枚举值对应的对象数组
        if (process.browser) {
            if (key) {
                return this.getMetadataArrFromKey('enums')[key]
            }
        }
    },

    getEnumNameById(id, arr) { // 根据对应枚举数组获取指定枚举值的name
        for (let i = 0, j = arr.length; i < j; i++) {
            if (arr[i].id === id) {
                return arr[i].name
            }
        }
    }
}
