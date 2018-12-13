<template>
    <div class="tabs-container">
        <ul class="nav nav-tabs">
            <li v-for="(tabTitle, index) in getTabsAuth" :class="{ active: tabTitle.active }" :key="tabTitle.key">
                <a :data-target="'#' + tabTitle.identity" @click="clickTabTitle(index)">{{ tabTitle.titleName }}</a>
            </li>
        </ul>
        <div class="tab-content">
            <div v-for="(tabContent, index) in tabsContent" :id="tabContent.identity" class="tab-pane"
                 :class="{ active: tabContent.active }">
                <div class="panel-body" >
                        <component :is="tabContent.contentComponent" :changeTab="changeTab" ref="tabComponent" :index="index"
                                   :data-item="tabContent.active"></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import {TabsEvent} from '~/components/TabsEvent'
    import Vue from 'vue'
    import {ChangeTabEvent} from '~/components/ChangeTabEvent'
    import {authUtil} from '~/util'
    // 发货
    import PendingDelivery from '~/components/wear/deliver/PendingDelivery'
    import PendingToken from '~/components/wear/deliver/PendingToken'
    import Delivered from '~/components/wear/deliver/Delivered'
    import UserReceived from '~/components/wear/deliver/UserReceived'
    import Canceled from '~/components/wear/deliver/Canceled'
    // 收货
    import PendingReceived from '~/components/wear/receipt/PendingReceived'
    import PendingInspection from '~/components/wear/receipt/PendingInspection'
    import ReturnSuccess from '~/components/wear/receipt/ReturnSuccess'
    import ReturnWithLoss from '~/components/wear/receipt/ReturnWithLoss'
    // 转买
    import ToPurchase from '~/components/wear/toPurchase/ToPurchase'
    // 试戴订单报表
    import DeliverList from '~/components/wear/wearReports/DeliverList'
    import ReceiveList from '~/components/wear/wearReports/ReceiveList'
    import LeaseStatistics from '~/components/wear/wearReports/LeaseStatistics'
    // 打印模板
    import PrintTemplate from '~/components/systemSetting/printTemplate/PrintTemplate'
    import PrintManage from '~/components/systemSetting/printManage/PrintManage'
    import ReceiptTemplate from '~/components/systemSetting/receiptManage/ReceiptManage'
    // 系统设置
    import AuditFlowSet from '~/components/systemSetting/AuditFlowSet'
    // 库存明细
    import StockItems from '~/components/storage/stock/StockItems'
    import Procurement from '~/components/storage/stock/Procurement'
    import SaleReturn from '~/components/storage/stock/SaleReturn'
    import AllocateBill from '~/components/storage/stock/AllocateBill'
    import InventoryBill from '~/components/storage/stock/InventoryBill'
    // 商品基础信息设置
    import SupplierItem from '~/components/storage/wareBaseInfo/SupplierItem'
    import CategoryItem from '~/components/storage/wareBaseInfo/CategoryItem'
    import GemstoneItem from '~/components/storage/wareBaseInfo/GemstoneItem'
    import GoldPriceItem from '~/components/storage/wareBaseInfo/GoldPriceItem'
    import MetalItem from '~/components/storage/wareBaseInfo/MetalItem'
    import CraftItem from '~/components/storage/wareBaseInfo/CraftItem'
    // 库房设置
    import WareHouseItems from '~/components/storage/warehouse/WareHouseItems'
    // 试戴商品
    import InitSetting from '~/components/storage/wearGoods/InitSetting'
    import WearGoodsList from '~/components/storage/wearGoods/WearGoodsList'
    import LeaseManage from '~/components/storage/wearGoods/LeaseManage'
    // 报表
    import StockTransaction from '~/components/storage/reports/StockTransaction'
    import StockReport from '~/components/storage/reports/StockReport'
    // 线下零售
    import RetailBill from '~/components/retail/offlineRetail/RetailBill'
    // 统计零售
    import BonusBasicSetting from '~/components/retail/statisticalReport/BonusBasicSetting'
    import SalesReport from '~/components/retail/statisticalReport/SalesReport'
    // 零售新增
    import RetailBillMain from '~/components/retail/offlineRetail/RetailBillMain'
    import RetailBillAdd from '~/components/retail/offlineRetail/RetailBillAdd'
    import PaymentBill from '~/components/retail/offlineRetail/PaymentBill'
    import RetailRecycleBill from '~/components/retail/offlineRetail/RetailRecycleBill'
    import RejectBill from '~/components/retail/offlineRetail/RejectBill'
    import ExchangeBill from '~/components/retail/offlineRetail/ExchangeBill'
    import HandoverBill from '~/components/retail/offlineRetail/HandoverBill'
    import WarrantyBill from '~/components/retail/offlineRetail/WarrantyBill'
    import RepairBill from '~/components/retail/offlineRetail/RepairBill'
    // 角色管理
    import RoleManage from '~/components/merchant/authManage/RoleAuthManage'
    import DutyAuthManage from '~/components/merchant/authManage/DutyAuthManage'
    import SaleManManage from '~/components/merchant/SaleManManage'
    import StoreManage from '~/components/merchant/StoreManage'
    // 审批单据
    import InventoryAudit from '~/components/audit/stockAudit/InventoryAudit'
    import SaleReturnAuditBill from '~/components/audit/stockAudit/SaleReturnAuditBill'
    import StockAuditBill from '~/components/audit/stockAudit/StockAuditBill'
    // 黄金赠送
    import PresentRule from '~/components/active/presentGold/PresentRule'
    import PresentDetail from '~/components/active/presentGold/PresentDetail'
    // 卡券管理
    import CouponManage from '~/components/active/couponManage/CouponManage'
    // 资金账户
    import AcountBaseInfo from '~/components/acount/acountInfo/AcountBaseInfo'
    import WalletAccount from '~/components/acount/acountInfo/WalletAccount'
    import GoldenAccount from '~/components/acount/acountInfo/GoldenAccount'
    import DateReportInCash from '~/components/acount/statement/DateReportInCash'
    import DateReportInGold from '~/components/acount/statement/DateReportInGold'
    import DateReportInLease from '~/components/acount/statement/DateReportInLease'
    import DateReportInLogistics from '~/components/acount/statement/DateReportInLogistics'
    // 用户中心
    import UserBehaviorAnalysis from '~/components/userManage/userAnalysis/UserBehaviorAnalysis'
    import UserIncreaseAnalysis from '~/components/userManage/userAnalysis/UserIncreaseAnalysis'
    import UserList from '~/components/userManage/userList/UserList'
    import NoticeSetting from '~/components/userManage/notice/NoticeSetting'
    import UserStockStatistics from '~/components/userManage/userStatistics/UserStockStatistics'

    export default {
        props: ['tabsContent', 'path'],
        components: {
            DateReportInCash,
            DateReportInGold,
            DateReportInLease,
            DateReportInLogistics,
            BonusBasicSetting,
            SalesReport,
            UserBehaviorAnalysis,
            UserIncreaseAnalysis,
            UserList,
            NoticeSetting,
            UserStockStatistics,
            ReceiveList,
            DeliverList,
            LeaseStatistics,
            ReceiptTemplate,
            AcountBaseInfo,
            WalletAccount,
            GoldenAccount,
            CouponManage,
            PresentDetail,
            PresentRule,
            InventoryAudit,
            SaleReturnAuditBill,
            StockAuditBill,
            SaleManManage,
            StoreManage,
            DutyAuthManage,
            RoleManage,
            RetailBill,
            RepairBill,
            PaymentBill,
            RetailRecycleBill,
            RejectBill,
            ExchangeBill,
            HandoverBill,
            WarrantyBill,
            PendingDelivery,
            PendingToken,
            Delivered,
            UserReceived,
            Canceled,
            PendingReceived,
            PendingInspection,
            ReturnSuccess,
            ReturnWithLoss,
            ToPurchase,
            PrintTemplate,
            PrintManage,
            AuditFlowSet,
            StockItems,
            Procurement,
            SaleReturn,
            AllocateBill,
            InventoryBill,
            SupplierItem,
            CategoryItem,
            GemstoneItem,
            GoldPriceItem,
            MetalItem,
            CraftItem,
            WareHouseItems,
            InitSetting,
            WearGoodsList,
            LeaseManage,
            StockReport,
            StockTransaction
        },
        data() {
            return {
                getTabsAuth: []
            }
        },
        computed: {
            ...mapGetters('auth', {
                // getTabsAuth: 'tabs',
                getCurrTabIndex: 'getCurrTabIndex'
            })
        },
        methods: {
            ...mapMutations('auth', {
                resetCurrTabIndex: 'resetCurrTabIndex'
            }),
            ...mapMutations('retail/offlineRetail/retailBill', {
                resetCurrCpn: 'resetCurrCpn',
                resetIsFromExchange: 'resetIsFromExchange'
            }),
            buildTabsAuth() {
                this.getTabsAuth.forEach((tabTitle, index) => {
                    // if (tabTitle.identity === this.getCurrTabIndex) {
                    if (index === 0) {
                        tabTitle.active = true
                    } else {
                        tabTitle.active = false
                    }
                    tabTitle.key = Math.random()
                    return tabTitle
                })
            },
            buildTabsContent() {
                this.tabsContent.forEach((tabContent, index) => {
                    // if (tabContent.identity === this.getCurrTabIndex) {
                    if (index === 0) {
                        tabContent.active = true
                    } else {
                        tabContent.active = false
                    }
                    return tabContent
                })
            },
            triggerOn(index) {
                let tabComponents = this.$refs.tabComponent;
                if (this.tabsContent[index].active) {
                    tabComponents[index].$emit('init');
                }
            },
            clickTabTitle(index) {
                const identity = event.target.getAttribute('data-target').slice(1)
                this.changeTab(identity)
                this.triggerOn(index);
                TabsEvent.$emit(identity)
            },
            changeTab(identity, billNumber) {
                console.log('changeTab', identity);
                if (identity === 'retailBill' && billNumber) {
                    console.log('billNumber', billNumber);
                    this.resetCurrCpn(RetailBillAdd);
                    this.resetIsFromExchange(true);
                } else {
                    this.resetCurrCpn(RetailBillMain);
                }
                this.getTabsAuth.forEach((tabTitle, index) => {
                    tabTitle.active = false
                    if (tabTitle.identity === identity) {
                        tabTitle.active = true
                        Vue.set(this.getTabsAuth, index, tabTitle)
                    }
                })
                if (this.tabsContent) {
                    this.tabsContent.forEach((tabContent, index) => {
                        tabContent.active = false
                        if (tabContent.identity === identity) {
                            tabContent.active = true
                            Vue.set(this.tabsContent, index, tabContent)
                        }
                    })
                    console.log(identity)
                }
            },
            toPayListener() {
                ChangeTabEvent.$off('JUMP_TO_PAYMENT')
                ChangeTabEvent.$on('JUMP_TO_PAYMENT', (billId) => {
                    if (this.tabsContent) {
                        console.log('跳转收银，JUMP_TO_PAYMENT', billId)
                        this.tabsContent.forEach(tabContent => {
                            if (tabContent.identity === 'paymentBill') {
                                // 跳转到收银新增页面
                                ChangeTabEvent.$emit('JUMP_TO_PAYMENT_ADD', billId)
                            }
                        })
                        this.changeTab('paymentBill')
                    }
                })
            }
        },
        created() {
            if (authUtil.getAuthorizedPages()) {
                let tabsAuth = authUtil.getAuthorizedPages().tabsAuth
                this.getTabsAuth = tabsAuth.filter(auth => auth.pathname === this.path)
                this.buildTabsAuth();
                this.buildTabsContent();
            }
        },
        beforeMount() {
            console.log('@@@ Tab beforeMount');
            // 其他页面点击跳转到收银页面，执行跳转动作
            this.toPayListener()
            // 置换页面点击跳转到零售页面，执行跳转动作
            // this.toRetailListener()
        }
    }
</script>

<style>

</style>
