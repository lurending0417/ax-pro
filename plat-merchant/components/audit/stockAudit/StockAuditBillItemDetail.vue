<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <label>单号：</label>{{ preStockView.billNumber }}
            </div>
            <div class="form-group form-group-margin">
                <label>仓库：</label>
                <span>{{ wareHouseId$ }}</span>
            </div>
            <div class="form-group form-group-margin">
                <label>供货商：</label>
                <span>{{ vendorId$ }}</span>
            </div>
            <div class="form-group form-group-margin">
                <label>采购员：</label>
                <span>{{ buyerId$ }}</span>
            </div>
            <div class="form-group form-group-margin">
                <label>买/借：</label>
                <span>{{ stockType$ }}</span>
            </div>
            <div class="form-group form-group-margin" v-model="weightUnit$">
                <label>单位：</label>
                <span>{{ weightUnit$ }}</span>
            </div>
        </div>

        <div class="form-inline">
            <div class="form-group form-group-margin">
                <label>商品类型：</label>{{ preStockView.skuTypeName }}
            </div>
            <div class="form-group form-group-margin">
                <label>销售方式：</label>{{ preStockView.tradeTypeName }}
            </div>
            <div class="form-group form-group-margin">
                <label>素金/非素：</label>{{ preStockView.wareTypeName }}
            </div>
            <div class="form-group form-group-margin">
                <label>成本录入方式：</label>{{ preStockView.costPriceAlgorithmName }}
            </div>
            <div class="form-group form-group-margin" v-show="showCostPriceWayArea">
                <label>总包成本：</label>{{ preStockView.pkgCost }}元
            </div>
            <div class="form-group form-group-margin" v-show="showCostPriceWayArea">
                <label>总包质量：</label>{{ preStockView.pkgWeight }}g
            </div>
            <div class="form-group form-group-margin" v-show="showCostPriceWayArea">
                <label>成本单价：</label>{{ preStockView.costUnitPrice }}元/g
            </div>
            <div class="form-group form-group-margin">
                <label>计价方式：</label>{{ preStockView.retailPriceAlgorithmName }}
            </div>
            <div class="form-group form-group-margin" v-show="showRetailPriceRatio">
                <label>倍率：</label>{{ preStockView.retailPriceRatio }}
            </div>
            <div class="form-group form-group-margin" v-show="showRetailGoldPrice">
                <label>金价：</label>{{ preStockView.retailMetalPrice }}元/克
            </div>
            <div v-if="showProcessingChargesInTitle" class="form-group form-group-margin">
                <label>工费：</label>{{ preStockView.retailProcessingCharges }}
                <span>元/克</span>
            </div>
            <div class="form-group form-group-margin" v-else >
                <label>附加费：</label>{{ preStockView.retailPriceExtra }}
                <span>元/件</span>
            </div>
            <div v-if="showProcessingCharges" class="form-group form-group-margin">
                <label>精品/普货：</label>{{ preStockView.processingTypeName }}
            </div>
        </div>

        <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
            <thead>
            <tr>
                <th>序号</th>
                <th>条码</th>
                <th v-if="showAmountField">数量</th>
                <th v-if="showGemField">宝石</th>
                <th>金属</th>
                <th>品类</th>
                <th v-if="showGemField">工艺</th>
                <th>寓意名</th>
                <th>版号</th>
                <th v-if="showGemInfoFields">宝石质量</th>
                <th v-if="showGemInfoFields">宝石数量</th>
                <th>总质量</th>
                <th>成本价</th>
                <th v-if="showRegularPrice">原价</th>
                <th v-if="showRetailPrice">零售价</th>
                <th v-if="showProcessingCharges">工费</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in stockItemsView">
                <td class="table-bordered">{{ index + 1 }}</td>
                <td class="table-bordered">{{ item.serial }}</td>
                <!--数量-->
                <td v-if="showAmountField" class="table-bordered">
                    <span>{{ item.amount }}</span>
                </td>
                <!--宝石-->
                <td v-if="showGemField" class="table-bordered">
                    <span>{{ item.gemName }}</span>
                </td>
                <!--金属-->
                <td class="table-bordered">
                    <span>{{ item.metalName }}</span>
                </td>
                <!--品类-->
                <td class="table-bordered">
                    <span>{{ item.categoryName }}</span>
                </td>
                <!--工艺-->
                <td v-if="showGemField" class="table-bordered">
                    <span>{{ item.craftName }}</span>
                </td>
                <!--寓意名-->
                <td class="table-bordered">
                    {{ item.moralName }}
                </td>
                <!--版号-->
                <td class="table-bordered">
                    {{ item.modelCode }}
                </td>
                <!--宝石质量-->
                <td v-if="showGemInfoFields" class="table-bordered">
                    {{ item.mainGemWeight }}
                </td>
                <!--宝石数量-->
                <td v-if="showGemInfoFields" class="table-bordered">
                    {{ item.mainGemAmount }}
                </td>
                <!--总质量-->
                <td class="table-bordered">
                    {{ item.weight }}
                </td>
                <!--成本价-->
                <td class="table-bordered">
                    {{ item.costPrice }}
                </td>
                <!--原价-->
                <td v-if="showRegularPrice" class="table-bordered">
                    {{ item.regularPrice }}
                </td>
                <!--折后价-->
                <td v-if="showRetailPrice" class="table-bordered">
                    {{ item.retailPrice }}
                </td>
                <!--工费、附加费-->
                <td v-if="showProcessingCharges" class="table-bordered">
                    {{ item.computedProcessingCharges }}
                </td>
                <td class="table-bordered">
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn btn-sm btn-default'],
                                btnName: '参数'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: addModalName,
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL+index,
                                modalClasses: ['modal-lg'],
                                titleName: '参数'
                            }">
                        <ProcurementParams
                            slot="main"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+index"
                            :CONST_CLOSE_MODAL="addModalName"
                            :params="item"
                            :pageReadOnly="true">
                        </ProcurementParams>
                    </ButtonWithModal>
                </td>
            </tr>
            </tbody>
        </table>

        <div class="row">
            <div class="col-md-9">
                <div class="form-inline" style="line-height: 34px; height: 34px; font-size: 14px;">
                    <div class="form-group" style="margin-right: 20px">
                        <label>总件数：</label>
                        <span>{{ totalItemCount() }}</span>
                    </div>
                    <div class="form-group" style="margin-right: 20px">
                        <label>总质量：</label>
                        <span>{{ totalWeight() }}</span>
                    </div>
                    <div class="form-group" style="margin-right: 20px">
                        <label>总成本：</label>
                        <span>{{ totalCostPrice() }}</span>
                    </div>
                    <div class="form-group" style="margin-right: 20px">
                        <label>总零售价（原价）：</label>
                        <span>{{ totalRetailPrice() }}</span>
                    </div>
                    <div class="form-group" style="margin-right: 20px">
                        <label>总零售价（折后）：</label>
                        <span>{{ discountPrice() }}</span>
                    </div>
                    <!--当计价方式为今日金价的时候显示工费统计-->
                    <div class="form-group" style="margin-right: 20px" v-if="!showRetailPrice">
                        <label>总工费：</label>
                        <span>{{ totalProcessCharging() }}</span>
                    </div>
                </div>
            </div>
            <div class="col-md-3" style="text-align: right">
                <span style="margin-right: 20px" v-if="getStockAuditDetail.unFinished">
                    <button type="button" class="btn btn-primary" @click="clickApprove">通过</button>
                </span>
                <span style="margin-right: 20px" v-if="getStockAuditDetail.unFinished">
                    <button type="button" class="btn btn-danger" @click="clickDecline">驳回</button>
                </span>
                <button type="button" class="btn btn-info" @click="clickBack">返回</button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
    import { baseUtil, constUtil, calculateUtil, numberUtil } from '~/util'
    import StockAuditBillItemParams from '~/components/audit/stockAudit/StockAuditBillItemParams'
    import StockAuditBillMain from '~/components/audit/stockAudit/StockAuditBillMain'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import ProcurementParams from '~/components/storage/stock/ProcurementParams'
    import uuid from 'uuid'

    export default {
        components: {
            StockAuditBillItemParams,
            ProcurementParams,
            ButtonWithModal
        },
        data () {
            return {
                // 初始化数据
                costUnitPrice: 0,
                showCostPriceWayArea: true,
                showRetailPriceRatio: true,
                showRetailGoldPrice: true,
                showRetailExtraUnitPiece: true,
                showRetailExtraUnitGram: true,
                showAmountField: true,
                showGemInfoFields: true,
                showExtraFields: true,
                showRegularPrice: true,
                showRetailPrice: true,
                showProcessingChargesInTitle: true,
                showProcessingCharges: true,
                showGemField: true,
                // 表单数据
                wareHouseId$: '',
                vendorId$: '',
                buyerId$: '',
                stockType$: '',
                weightUnit$: '',
                addModalName: uuid(),
                CONST_CLICK_MODAL: uuid()
            }
        },
        computed: {
            ...mapState('storage/stock/procurementAdd', {
                preStock: 'preStock',
                focusFirstField: 'focusFirstField'
            }),
            ...mapGetters('storage/stock/procurementAdd', {
                preStockView: 'preStockView',
                stockItemsView: 'stockItemsView',
                getCanChange: 'getCanChange'
            }),
            ...mapGetters('audit/stockAudit/stockAuditBillMain', {
                getStockAuditDetail: 'getStockAuditDetail'
            })
        },
        methods: {
            ...mapMutations('audit/stockAudit/stockAuditBill', {
                resetCurrCpn: 'resetCurrCpn'
            }),
            ...mapMutations('storage/stock/procurementAdd', {
                doFocusFirstField: 'doFocusFirstField',
                undoFocusFirstField: 'undoFocusFirstField',
                resetStockItems: 'resetStockItems',
                deleteStockItem: 'deleteStockItem'
            }),
            ...mapActions('storage/stock/procurementAdd', {
                initStockItems: 'initStockItems',
                modifyItem: 'modifyItem',
                addItem: 'addItem',
                deleteItem: 'deleteItem',
                submitAudit: 'submitAudit',
                weightDiff: 'weightDiff'
            }),
            ...mapActions('audit/stockAudit/stockAuditBillMain', {
                auditApprove: 'auditApprove',
                auditDecline: 'auditDecline'
            }),
            calculateTotal(key) {
                let result = 0;
                this.stockItemsView.forEach(item => {
                    if (item[key]) {
                        result += calculateUtil.multiply(item.amount, item[key])
                    }
                })
                return result.toFixed(2)
            },
            // 统计工费
            totalProcessCharging() {
                let count = 0;
                if (!this.showRetailPrice) {
                    return this.calculateTotal('computedProcessingCharges')
                }
                return count
            },
            totalItemCount () {
                return this.stockItemsView.length
            },
            totalWeight() {
                let weight = 0;
                this.stockItemsView.forEach(item => {
                    weight += calculateUtil.multiply(item.amount, item.weight)
                })
                return weight
            },
            totalCostPrice() {
                return this.calculateTotal('costPrice')
            },
            totalRetailPrice() {
                if (this.stockItemsView.length === 0) {
                    return
                }
                if (!this.stockItemsView[0].retailPrice) {
                    if (!this.stockItemsView[0].regularPrice) {
                        return this.calculateTotal('regularPrice')
                    }
                    return 0
                }
                return this.calculateTotal('retailPrice')
            },
            discountPrice() {
                let regularPrice = 0;
                if (this.showRegularPrice) {
                    regularPrice = this.calculateTotal('regularPrice')
                } else {
                    regularPrice = this.calculateTotal('retailPrice')
                }
                return regularPrice
            },
            clickBack () {
                this.resetCurrCpn(StockAuditBillMain)
                this.resetStockItems([])
            },
            clickDelete (event) {
                this.deleteItem({
                    itemId: event.target.value,
                    callback: () => this.deleteStockItem(event.target.value)
                })
            },
            clickSubmit () {
                this.submitAudit(() => {
                    this.clickBack()
                })
            },
            clickApprove() { // 点击通过
                console.log(this.getStockAuditDetail);
                this.auditApprove({
                    callback: () => {
                        this.clickBack()
                    },
                    sendParams: this.getStockAuditDetail.recordId
                })
            },
            clickDecline() { // 点击驳回
                this.auditDecline({
                    callback: () => {
                        this.clickBack()
                    },
                    sendParams: this.getStockAuditDetail.recordId
                })
            },
            initData () {
                // 初始化选中数据
                let _this = this
                let preStockView = _this.preStockView
                console.log(preStockView)
                // 页面值仅能查看
                this.wareHouseId$ = baseUtil.getNameFromPropId('wareHouse', preStockView.wareHouseId)
                this.vendorId$ = baseUtil.getNameFromPropId('vendors', preStockView.vendorId)
                this.buyerId$ = baseUtil.getNameFromPropId('staffs', preStockView.buyerId)
                this.stockType$ = constUtil._CONST_STOCK_TYPE.find(ele => ele.value === preStockView.stockType).name
                this.weightUnit$ = preStockView.weightUnit
                // 初始化是否显示按钮
                this.showAmountField = constUtil._CONST_SKU_TYPE[1].value === _this.preStock.skuType // 单款多件，显示表格输入数量字段
                this.showGemField = constUtil._CONST_WARE_TYPE[1].value === _this.preStock.wareType // 素金只显示金属，没有宝石和工艺
                this.showGemInfoFields = constUtil._CONST_WARE_TYPE[1].value === _this.preStock.wareType // 镶嵌类，显示表格宝石信息字段
                this.showRegularPrice = (function () { // 显示表格原价字段
                    if (constUtil._CONST_WARE_TYPE[0].value === _this.preStock.wareType && // 素金
                        constUtil._CONST_COST_PRICE_ALGORITHM[0].value === _this.preStock.costPriceAlgorithm) // 按重
                        return false

                    return true
                }())
                this.showRetailPrice = _this.preStock.bargainPrice
                // 算单价
                this.costUnitPrice = numberUtil.toKeepTwoPlacesOfDecimalAndRound(calculateUtil.divide(preStockView.pkgCost, preStockView.pkgWeight));
                this.showProcessingCharges = constUtil._CONST_WARE_TYPE[0].value === _this.preStock.wareType && constUtil._CONST_RETAIL_PRICE_TYPE[0].value === _this.preStock.retailPriceType // 素金、按重计价，显示表格工费字段
                this.showProcessingChargesInTitle = constUtil._CONST_RETAIL_PRICE_ALGORITHM[2].value !== _this.preStock.retailPriceAlgorithm // 当售价算法不是成本加成时，显示工费
                // 原价方式
                if (preStockView.costPriceAlgorithm === constUtil._CONST_COST_PRICE_ALGORITHM[0].value) { // 按重
                    _this.showCostPriceWayArea = true
                } else { // 手动输入
                    _this.showCostPriceWayArea = false
                }
                // 售价方式
                (function() {
                    if (preStockView.retailPriceAlgorithm === constUtil._CONST_RETAIL_PRICE_ALGORITHM[0].value) { // 今日金价
                        _this.showRetailPriceRatio = false
                        _this.showRetailGoldPrice = false
                        _this.showRetailExtraUnitPiece = false
                        _this.showRetailExtraUnitGram = true
                    } else if (preStockView.retailPriceAlgorithm === constUtil._CONST_RETAIL_PRICE_ALGORITHM[1].value) { // 指定金价
                        _this.showRetailPriceRatio = false
                        _this.showRetailGoldPrice = true
                        _this.showRetailExtraUnitPiece = false
                        _this.showRetailExtraUnitGram = true
                    } else { // 成本倍率
                        _this.showRetailPriceRatio = true
                        _this.showRetailGoldPrice = false
                        _this.showRetailExtraUnitPiece = true
                        _this.showRetailExtraUnitGram = false
                    }
                }())
                // 初始化入库单明细
                this.initStockItems()
            }
        },
        mounted () {
            this.initData()
        }
    }
</script>

<style>
</style>
