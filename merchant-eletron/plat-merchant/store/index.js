import Vuex from 'vuex'
import auth from './auth'
import login from './login'
import warehouseItemsMain from './storage/warehouse/warehouseItemsMain'
import warehouseItemsAdd from './storage/warehouse/warehouseItemsAdd'
import warehouseItemsModify from './storage/warehouse/warehouseItemsModify'
import procurementMain from './storage/stock/procurementMain'
import procurementAddPre from './storage/stock/procurementAddPre'
import procurementAdd from './storage/stock/procurementAdd'
import procurement from './storage/stock/procurement'
import procurementParams from './storage/stock/procurementParams'
import supplierItem from './storage/warebaseinfo/supplierItem'
import supplierItemAdd from './storage/warebaseinfo/supplierItemAdd'
import supplierItemModify from './storage/warebaseinfo/supplierItemModify'
import categoryItem from './storage/warebaseinfo/categoryItem'
import categoryItemAdd from './storage/warebaseinfo/categoryItemAdd'
import categoryItemModify from './storage/warebaseinfo/categoryItemModify'
import params from './storage/warebaseinfo/params'
import paramsAdd from './storage/warebaseinfo/paramsAdd'
import paramsModify from './storage/warebaseinfo/paramsModify'
import gemstoneItem from './storage/warebaseinfo/gemstoneItem'
import gemstoneItemAdd from './storage/warebaseinfo/gemstoneItemAdd'
import gemstoneItemModify from './storage/warebaseinfo/gemstoneItemModify'
import metalItem from './storage/warebaseinfo/metalItem'
import metalItemAdd from './storage/warebaseinfo/metalItemAdd'
import metalItemModify from './storage/warebaseinfo/metalItemModify'
import craftItem from './storage/warebaseinfo/craftItem'
import craftItemAdd from './storage/warebaseinfo/craftItemAdd'
import craftItemModify from './storage/warebaseinfo/craftItemModify'
import goldPriceItem from './storage/warebaseinfo/goldPriceItem'
import goldPriceItemModify from './storage/warebaseinfo/goldPriceItemModify'
import history from './storage/warebaseinfo/history'
import allocateBillMain from './storage/stock/allocateBillMain'
import allocateBillDetail from './storage/stock/allocateBillDetail'
import allocateBill from './storage/stock/allocateBill'
import inventoryBill from './storage/stock/inventoryBill'
import stockItemsMain from './storage/stock/stockItemsMain'
import stockItemsParams from './storage/stock/stockItemsParams'
import inventoryBillMain from './storage/stock/inventoryBillMain'
import saleReturnMain from './storage/stock/saleReturnMain'
import saleReturnAdd from './storage/stock/saleReturnAdd'
import retailRecycleBill from './retail/offlineRetail/retailRecycleBill'
import retailBill from './retail/offlineRetail/retailBill'
import warrantyBillMain from './retail/offlineRetail/warrantyBillMain'
import retailBillMain from './retail/offlineRetail/retailBillMain'
import repairBillMain from './retail/offlineRetail/repairBillMain'
import retailBillAdd from './retail/offlineRetail/retailBillAdd'
import retailRecycleBillMain from './retail/offlineRetail/retailRecycleBillMain'
import retailRecycleBillAdd from './retail/offlineRetail/retailRecycleBillAdd'
import paymentBillMain from './retail/offlineRetail/paymentBillMain'
import paymentBillAdd from './retail/offlineRetail/paymentBillAdd'
import saleReturnAuditBill from './audit/stockAudit/saleReturnAuditBill'
import stockAuditBill from './audit/stockAudit/stockAuditBill'
import auditDetail from './audit/stockAudit/auditDetail'
import stockAuditBillMain from './audit/stockAudit/stockAuditBillMain'
import rejectBillMain from './retail/offlineRetail/rejectBillMain'
import rejectBillAdd from './retail/offlineRetail/rejectBillAdd'
import roleAuthManageAdd from './merchant/roleAuthManageAdd'
import roleAuthManageModify from './merchant/roleAuthManageModify'
import dutyAuthManageAdd from './merchant/dutyAuthManageAdd'
import dutyAuthManageModify from './merchant/dutyAuthManageModify'
import storeManageMain from './merchant/storeManageMain'
import SaleManManageMain from './merchant/SaleManManageMain'
import JobManageMain from './merchant/JobManageMain'
import auditFlowSet from './systemSetting/auditFlowSet'
import printTemplate from './systemSetting/printTemplate'
import templateManage from './systemSetting/templateManage'
import exchangeBillMain from './retail/offlineRetail/exchangeBillMain'
import exchangeBillAdd from './retail/offlineRetail/exchangeBillAdd'
import handoverBill from './retail/offlineRetail/handoverBill'
import dutyAuthTplManageAdd from './authTpl/dutyAuthTplManageAdd'
import dutyAuthTplManageModify from './authTpl/dutyAuthTplManageModify'
import roleAuthTplManageAdd from './authTpl/roleAuthTplManageAdd'
import roleAuthTplManageModify from './authTpl/roleAuthTplManageModify'
import wearGoodsMain from './storage/wearStorage/wearGoodsMain'
import leaseManageMain from './storage/wearStorage/leaseManageMain'
import leaseStorageParams from './storage/wearStorage/leaseStorageParams'
import leaseStorageConfigModify from './storage/wearStorage/leaseStorageConfigModify'
import stockItems from './storage/wearStorage/stockItems'
import wearRecords from './wear/wearRecords'
import presentGold from './active/presentGold'
import goldAccount from './account/goldAccount'
import statement from './account/statement'
import walletAccount from './account/walletAccount'
import userList from './userManage/userList'
import notice from './userManage/notice'
import statisticalRetail from './retail/statisticalReport/statisticalRetail'

export default () => new Vuex.Store({
    modules: {
        auth,
        login,
        authTpl: {
            namespaced: true,
            modules: {
                dutyAuthTplManageAdd,
                dutyAuthTplManageModify,
                roleAuthTplManageAdd,
                roleAuthTplManageModify
            }
        },
        active: {
            namespaced: true,
            modules: {
                presentGold
            }
        },
        account: {
            namespaced: true,
            modules: {
                goldAccount,
                statement,
                walletAccount
            }
        },
        storage: {
            namespaced: true,
            modules: {
                stock: {
                    namespaced: true,
                    modules: {
                        procurementMain,
                        procurementAddPre,
                        procurementAdd,
                        procurement,
                        procurementParams,
                        allocateBillMain,
                        allocateBillDetail,
                        allocateBill,
                        inventoryBill,
                        stockItemsMain,
                        stockItemsParams,
                        inventoryBillMain,
                        saleReturnMain,
                        saleReturnAdd
                    }
                },
                warehouse: {
                    namespaced: true,
                    modules: {
                        warehouseItemsMain,
                        warehouseItemsAdd,
                        warehouseItemsModify
                    }
                },
                warebaseinfo: {
                    namespaced: true,
                    modules: {
                        supplierItem,
                        supplierItemAdd,
                        supplierItemModify,
                        categoryItem,
                        categoryItemAdd,
                        categoryItemModify,
                        params,
                        paramsAdd,
                        paramsModify,
                        gemstoneItem,
                        gemstoneItemAdd,
                        gemstoneItemModify,
                        metalItem,
                        metalItemAdd,
                        metalItemModify,
                        craftItem,
                        craftItemAdd,
                        craftItemModify,
                        goldPriceItem,
                        goldPriceItemModify,
                        history
                    }
                },
                wearStorage: {
                    namespaced: true,
                    modules: {
                        wearGoodsMain,
                        leaseManageMain,
                        leaseStorageParams,
                        leaseStorageConfigModify,
                        stockItems
                    }
                }
            }
        },
        retail: {
            namespaced: true,
            modules: {
                offlineRetail: {
                    namespaced: true,
                    modules: {
                        retailBill,
                        retailBillMain,
                        retailBillAdd,
                        paymentBillMain,
                        paymentBillAdd,
                        retailRecycleBillMain,
                        retailRecycleBillAdd,
                        retailRecycleBill,
                        rejectBillMain,
                        rejectBillAdd,
                        exchangeBillMain,
                        exchangeBillAdd,
                        handoverBill,
                        warrantyBillMain,
                        repairBillMain
                    }
                },
                statisticalReport: {
                    namespaced: true,
                    modules: {
                        statisticalRetail
                    }
                }
            }
        },
        audit: {
            namespaced: true,
            modules: {
                stockAudit: {
                    namespaced: true,
                    modules: {
                        stockAuditBill,
                        saleReturnAuditBill,
                        stockAuditBillMain,
                        auditDetail
                    }
                }
            }
        },
        merchant: {
            namespaced: true,
            modules: {
                storeManageMain,
                SaleManManageMain,
                JobManageMain,
                roleAuthManageAdd,
                roleAuthManageModify,
                dutyAuthManageAdd,
                dutyAuthManageModify
            }
        },
        systemSetting: {
            namespaced: true,
            modules: {
                auditFlowSet,
                templateManage,
                printTemplate
            }
        },
        wear: {
            namespaced: true,
            modules: {
                wearRecords
            }
        },
        userManage: {
            namespaced: true,
            modules: {
                userList,
                notice
            }
        }
    },
    state: {
        authorizedObj: {}
    },
    mutations: {
        resetAuthorizedObj(state, authorizedObj) {
            state.authorizedObj = authorizedObj
        }
    }
});
