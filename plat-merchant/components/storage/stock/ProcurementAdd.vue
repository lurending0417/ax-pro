<template>
    <div>
        <div v-if="getCanChange" class="form-inline">
            <div class="form-group form-group-margin">
                <label>单号：</label>{{ preStockView.billNumber }}
            </div>
            <div class="form-group form-group-margin">
                <label>仓库：</label>
                <select class="form-control" v-model="wareHouseId$">
                    <option v-for="warehouse in warehouses" :value="warehouse.id">{{ warehouse.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <label>供货商：</label>
                <select class="form-control" v-model="vendorId$">
                    <option v-for="vendor in vendors" :value="vendor.id">{{ vendor.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <label>采购员：</label>
                <select class="form-control" v-model="buyerId$">
                    <option v-for="staff in staffs" :value="staff.id">{{ staff.nickName }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <label>买/借：</label>
                <select class="form-control" v-model="stockType$">
                    <option v-for="stockType in stockTypes" :value="stockType.value">{{ stockType.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <label>单位：</label>
                <select class="form-control" v-model="weightUnit$">
                    <option v-for="weightUnit in weightUnits" :value="weightUnit.value">{{ weightUnit.name }}</option>
                </select>
            </div>
        </div>

        <div v-else class="form-inline">
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
            <div class="form-group form-group-margin">
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
            <div class="form-group form-group-margin" v-else>
                <label>附加费：</label>{{ preStockView.retailPriceExtra }}
                <span>元/件</span>
            </div>
            <div v-if="showProcessingCharges" class="form-group form-group-margin">
                <label>精品/普货：</label>{{ preStockView.processingTypeName }}
            </div>
        </div>

        <div class="row" style="margin-bottom: 10px">
            <div class="col-md-2"><input type="text" class="form-control"></div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;">搜索定位</button>
            </div>
            <div class="col-md-9" style="text-align: right">
                <span style="margin-right: 10px;">
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn btn-primary'],
                                btnName: '导出模板'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL+'exportInStock',
                                titleName: '导出模板'
                            }">
                        <LeaseExport
                            slot="main"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'exportInStock'"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :billId="preStockView.id"
                            :storeId="preStockView.storeId"
                            :wareType="preStockView.wareType"
                        >
                        </LeaseExport>
                    </ButtonWithModal>
                </span>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-success'],
                                btnStyle: {marginRight: 10 + 'px'},
                                btnName: '批量导入'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL+'import',
                                titleName: '批量导入'
                            }">
                    <LeaseImport
                        slot="main"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'import'"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :billId="preStockView.id"
                        :refreshStock="initStockItems"
                    >
                    </LeaseImport>
                </ButtonWithModal>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-warning'],
                                btnStyle: {marginRight: 10 + 'px'},
                                btnName: '批量打印标签'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'batchPrint',
                                modalClasses: [''],
                                titleName: '选择批量打印模板'
                            }">
                    <PrintTemplate slot="main"
                                   :type="'batchPrint'"
                                   :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                   :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'batchPrint'"></PrintTemplate>
                </ButtonWithModal>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12" style="text-align: right; margin-bottom: 10px">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-warning'],
                                btnStyle: {marginRight: 10 + 'px'},
                                btnName: '打印模板'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'printTemplate',
                                modalClasses: [''],
                                titleName: '选择打印模板'
                            }">
                    <PrintTemplate slot="main"
                                   :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                   :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'printTemplate'"></PrintTemplate>
                </ButtonWithModal>

                <button v-if="getCanChange" class="btn btn-success" style="margin-right: 10px" v-show="showCostShareBtn"
                        @click="clickWeightDiff">秤差成本分摊
                </button>
                <span v-if="getCanChange">
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn btn-info'],
                                btnName: '基本信息修改'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: addModalName,
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL+'add',
                                titleName: '基本信息修改'
                            }">
                        <ProcurementAddDetailModify
                            slot="main"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'add'"
                            :CONST_CLOSE_MODAL="addModalName"
                            :preStock="preStock"
                        >
                        </ProcurementAddDetailModify>
                    </ButtonWithModal>
                </span>

            </div>
        </div>

        <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
            <thead>
            <tr>
                <th>序号</th>
                <th>条码</th>
                <th v-show="showAmountField">数量</th>
                <th v-show="showGemField">宝石</th>
                <th>金属</th>
                <th>品类</th>
                <th v-show="showGemField">工艺</th>
                <th>寓意名</th>
                <th>版号</th>
                <th v-show="showGemInfoFields">宝石质量</th>
                <th v-show="showGemInfoFields">宝石数量</th>
                <th>总质量</th>
                <th>成本价</th>
                <th v-show="showRegularPrice">原价</th>
                <th v-show="showRetailPrice">零售价</th>
                <th v-show="showProcessingCharges">工费</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in stockItemsView" :class="{'tr-cls':item.isFocused}">
                <td class="table-bordered">{{ index + 1 }}</td>
                <td class="table-bordered">{{ item.serial }}</td>
                <!--数量-->
                <td v-show="showAmountField" class="table-bordered">
                    <input
                        v-if="getCanChange"
                        type="number"
                        style="max-width: 50px"
                        @keyup.enter="enterAmount(item.id)"
                        @change="modifyItemHandler($event, item, 'amount')"
                        @focus="changeCurTrColor(index, item)"
                        :ref="'amount' + item.id"
                        :value="item.amount"
                    >
                    <span v-else>{{ item.amount }}</span>
                </td>
                <!--宝石-->
                <td v-show="showGemField" class="table-bordered">
                    <select
                        v-if="getCanChange"
                        style="max-width: 50px"
                        @keydown.enter="enterGem(item.id)"
                        @change="modifyItemHandler($event, item, 'gemId')"
                        @focus="changeCurTrColor(index, item)"
                        :ref="'gem' + item.id"
                    >
                        <option value=""></option>
                        <option
                            v-for="gem in gems"
                            :selected="gem.id === item.gemId"
                            :value="gem.id"
                        >
                            {{ gem.name }}
                        </option>
                    </select>
                    <span v-else>{{ item.gemName }}</span>
                </td>
                <!--金属-->
                <td class="table-bordered">
                    <select
                        v-if="getCanChange"
                        style="max-width: 50px"
                        @keydown.enter="enterMetal(item.id)"
                        @change="modifyItemHandler($event, item, 'metalId')"
                        @focus="changeCurTrColor(index, item)"
                        :ref="'metal' + item.id"
                    >
                        <option value="" v-if="preStockView.wareTypeName === '镶嵌'"></option>
                        <option
                            v-for="metal in metals"
                            :selected="metal.id === item.metalId"
                            :value="metal.id"
                        >
                            {{ metal.name }}
                        </option>
                    </select>
                    <span v-else>{{ item.metalName }}</span>
                </td>
                <!--品类-->
                <td class="table-bordered">
                    <select
                        v-if="getCanChange"
                        style="max-width: 50px"
                        @keydown.enter="enterCategory(item.id)"
                        @change="modifyItemHandler($event, item, 'categoryId')"
                        @focus="changeCurTrColor(index, item)"
                        :ref="'category' + item.id"
                    >
                        <option
                            v-for="category in categories"
                            :selected="category.id === item.categoryId"
                            :value="category.id"
                        >
                            {{ category.name }}
                        </option>
                    </select>
                    <span v-else>{{ item.categoryName }}</span>
                </td>
                <!--工艺-->
                <td v-show="showGemField" class="table-bordered">
                    <select
                        v-if="getCanChange"
                        style="max-width: 50px"
                        @keydown.enter="enterCraft(item.id)"
                        @change="modifyItemHandler($event, item, 'craftId')"
                        @focus="changeCurTrColor(index, item)"
                        :ref="'craft' + item.id"
                    >
                        <option value=""></option>
                        <option
                            v-for="craft in crafts"
                            :selected="craft.id === item.craftId"
                            :value="craft.id"
                        >
                            {{ craft.name }}
                        </option>
                    </select>
                    <span v-else>{{ item.craftName }}</span>
                </td>
                <!--寓意名-->
                <td class="table-bordered">
                    <input
                        v-if="getCanChange"
                        type="text"
                        style="max-width: 50px"
                        @keydown.enter="enterMoralName(item.id)"
                        @change="modifyItemHandler($event, item, 'moralName')"
                        @focus="changeCurTrColor(index, item)"
                        :ref="'moralName' + item.id"
                        :value="item.moralName"
                    >
                    <span v-else>{{ item.moralName }}</span>
                </td>
                <!--版号-->
                <td class="table-bordered">
                    <input
                        v-if="getCanChange"
                        type="text"
                        style="max-width: 50px"
                        @keydown.enter="enterModelCode(item.id)"
                        @change="modifyItemHandler($event, item, 'modelCode')"
                        @focus="changeCurTrColor(index, item)"
                        :ref="'modelCode' + item.id"
                        :value="item.modelCode"
                    >
                    <span v-else>{{ item.modelCode }}</span>
                </td>
                <!--宝石质量-->
                <td v-show="showGemInfoFields" class="table-bordered">
                    <input
                        v-if="getCanChange"
                        type="text"
                        style="max-width: 50px"
                        @keydown.enter="enterMainGemWeight(item.id)"
                        @change="modifyItemHandler($event, item, 'mainGemWeight')"
                        @focus="changeCurTrColor(index, item)"
                        :ref="'mainGemWeight' + item.id"
                        :value="item.mainGemWeight"
                    >
                    <span v-else>{{ item.mainGemWeight }}g</span>
                </td>
                <!--宝石数量-->
                <td v-show="showGemInfoFields" class="table-bordered">
                    <input
                        v-if="getCanChange"
                        type="number"
                        style="max-width: 50px"
                        @keydown.enter="enterMainGemAmount(item.id)"
                        @change="modifyItemHandler($event, item, 'mainGemAmount')"
                        @focus="changeCurTrColor(index, item)"
                        :ref="'mainGemAmount' + item.id"
                        :value="item.mainGemAmount"
                    >
                    <span v-else>{{ item.mainGemAmount }}</span>
                </td>
                <!--总质量-->
                <td class="table-bordered">
                    <input
                        v-if="getCanChange"
                        type="text"
                        style="max-width: 50px"
                        @keydown.enter="enterWeight(item.id)"
                        @change="modifyItemHandler($event, item, 'weight')"
                        @focus="changeCurTrColor(index, item)"
                        :ref="'weight' + item.id"
                        :value="item.weight"
                    >
                    <span v-else>{{ item.weight }}g</span>
                </td>
                <!--成本价-->
                <td class="table-bordered">
                    <input
                        v-if="getCanChange"
                        type="text"
                        style="max-width: 50px"
                        @keydown.enter="enterCostPrice(item.id)"
                        @change="modifyItemHandler($event, item, 'costPrice')"
                        @focus="changeCurTrColor(index, item)"
                        :ref="'costPrice' + item.id"
                        :value="item.costPrice"
                    >
                    <span v-else>{{ item.costPrice }}元</span>
                </td>
                <!--原价-->
                <td v-show="showRegularPrice" class="table-bordered">
                    <input
                        v-if="getCanChange"
                        type="text"
                        style="max-width: 50px"
                        @keydown.enter="enterRegularPrice(item.id)"
                        @change="modifyItemHandler($event, item, 'regularPrice')"
                        @focus="changeCurTrColor(index, item)"
                        :ref="'regularPrice' + item.id"
                        :value="item.regularPrice"
                    >
                    <span v-else>{{ item.regularPrice }}元</span>
                </td>
                <!--折后价-->
                <td v-show="showRetailPrice" class="table-bordered">
                    <input
                        v-if="getCanChange"
                        type="text"
                        style="max-width: 50px"
                        @keydown.enter="enterRetailPrice(item.id)"
                        @change="modifyItemHandler($event, item, 'retailPrice')"
                        @focus="changeCurTrColor(index, item)"
                        :ref="'retailPrice' + item.id"
                        :value="item.retailPrice"
                    >
                    <span v-else>{{ item.retailPrice }}元</span>
                </td>
                <!--工费、附加费-->
                <td v-show="showProcessingCharges" class="table-bordered">
                    {{ item.computedProcessingCharges }}元/件
                </td>
                <td class="table-bordered" @click="changeCurTrColorOnTd(index, item)">
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn btn-sm btn-primary'],
                                btnName: '参数'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: addModalName,
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL+index,
                                modalClasses: ['modal-lg'],
                                titleName: '商品详情'
                            }">
                        <ProcurementParams
                            slot="main"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+index"
                            :CONST_CLOSE_MODAL="addModalName"
                            :params="item"
                            :pageReadOnly="!getCanChange"
                        >
                        </ProcurementParams>
                    </ButtonWithModal>
                    <button v-if="getCanChange" type="button" class="btn btn-sm btn-warning" @click="clickDelete"
                            :value="item.id">删除
                    </button>
                    <button type="button" class="btn btn-sm btn-success" @click="print(item)">标签打印</button>
                </td>
            </tr>
            <tr v-if="getCanChange">
                <td class="table-bordered"><i class="fa fa-plus" style="color: green; cursor: pointer"
                                              @click="clickPlus"></i></td>
                <td class="table-bordered"></td>
                <td v-show="showAmountField" class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td v-show="showGemField" class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td v-show="showGemField" class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td v-show="showGemInfoFields" class="table-bordered"></td>
                <td v-show="showGemInfoFields" class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td v-show="showRegularPrice" class="table-bordered"></td>
                <td v-show="showRetailPrice" class="table-bordered"></td>
                <td v-show="showProcessingCharges" class="table-bordered"></td>
                <td class="table-bordered"></td>
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
                        <span>{{ totalWeight() }}g</span>
                    </div>
                    <div class="form-group" style="margin-right: 20px">
                        <label>总成本：</label>
                        <span>{{ totalCostPrice() }}元</span>
                    </div>
                    <div class="form-group" style="margin-right: 20px">
                        <label>总零售价（原价）：</label>
                        <span>{{ totalRetailPrice() }}元</span>
                    </div>
                    <div class="form-group" style="margin-right: 20px">
                        <label>总零售价（折后）：</label>
                        <span>{{ discountPrice() }}元</span>
                    </div>
                    <!--当计价方式为今日金价的时候显示工费统计-->
                    <div class="form-group" style="margin-right: 20px" v-if="!showRetailPrice">
                        <label>总工费：</label>
                        <span>{{ totalProcessCharging()}}元</span>
                    </div>
                </div>
            </div>
            <div v-if="getCanChange" class="col-md-3" style="text-align: right">
                <button type="button" class="btn btn-info" style="margin-right: 10px" @click="clickSubmit">提交审核</button>
                <button type="button" class="btn btn-info" @click="clickBack">保存并返回</button>
            </div>
            <div v-else class="col-md-3" style="text-align: right">
                <button type="button" class="btn btn-info" @click="clickBack">返回</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
    import {baseUtil, calculateUtil, constUtil, numberUtil} from '~/util'
    import ProcurementMain from '~/components/storage/stock/ProcurementMain'
    import ProcurementAddDetailModify from '~/components/storage/stock/ProcurementAddDetailModify'
    import ProcurementParams from '~/components/storage/stock/ProcurementParams'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import PrintTemplate from '~/components/storage/stock/PrintTemplate'
    import uuid from 'uuid'
    import LeaseExport from '~/components/storage/wearGoods/LeaseExport'
    import LeaseImport from '~/components/storage/wearGoods/LeaseImport'

    export default {
        components: {
            LeaseImport,
            LeaseExport,
            ProcurementParams,
            ProcurementAddDetailModify,
            ButtonWithModal,
            PrintTemplate
        },
        data() {
            return {
                // 初始化数据
                warehouses: [],
                vendors: [],
                staffs: [],
                skuTypes: [],
                stockTypes: [],
                wareTypes: [],
                weightUnits: [],
                costUnitPrice: 0,
                showCostPriceWayArea: true,
                showRetailPriceRatio: true,
                showRetailGoldPrice: true,
                showRetailExtraUnitPiece: true,
                showRetailExtraUnitGram: true,
                showChooseProductBtn: true,
                showCostShareBtn: true,
                showAmountField: true,
                showGemField: true,
                showGemInfoFields: true,
                showProcessingCharges: false,
                showRegularPrice: true,
                showRetailPrice: true,
                showProcessingChargesInTitle: true,
                // 初始化新增数据
                categories: [],
                gems: [],
                metals: [],
                crafts: [],
                // 表单数据
                wareHouseId$: '',
                vendorId$: '',
                buyerId$: '',
                stockType$: '',
                weightUnit$: '',
                addModalName: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                focusIndex: ''
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
            })
        },
        methods: {
            ...mapMutations('storage/stock/procurement', {
                resetCurrCpn: 'resetCurrCpn'
            }),
            ...mapMutations('storage/stock/procurementAdd', {
                doFocusFirstField: 'doFocusFirstField',
                resetStockItems: 'resetStockItems',
                undoFocusFirstField: 'undoFocusFirstField',
                deleteStockItem: 'deleteStockItem'
            }),
            ...mapActions('storage/stock/procurementAdd', {
                initStockItems: 'initStockItems',
                modifyItem: 'modifyItem',
                addItem: 'addItem',
                deleteItem: 'deleteItem',
                submitAudit: 'submitAudit',
                weightDiff: 'weightDiff',
                getPrintInfo: 'getPrintInfo'
            }),
            changeCurTrColorOnTd(index, item) {
                let btnValue = event.target.innerText;
                if (btnValue === '参数' || btnValue === '删除' || btnValue === '标签打印') {
//                    this.resetStockItems({index})
                    this.changeCurTrColor(index, item)
                }
            },
            changeCurTrColor(index, item) {
                if (this.focusIndex !== index && this.focusIndex !== '') {
                    this.stockItemsView[this.focusIndex].isFocused = false;
                }
                this.focusIndex = index;
                item.isFocused = true
            },
            totalProcessCharging() {
                let count = 0;
                if (!this.showRetailPrice) {
                    if (this.stockItemsView.length === 0) {
                        return
                    }
                    return this.calculateTotal('computedProcessingCharges')
                }
                return count
            },
            initData() {
                // 初始化下拉菜单
                this.warehouses = baseUtil.getMetadataWareHouse()
                this.vendors = baseUtil.getMetadataVendors()
                this.staffs = baseUtil.getMetadataStaffs()
                this.stockTypes = constUtil._CONST_STOCK_TYPE
                this.weightUnits = constUtil._CONST_WEIGHT_UNIT
                // 初始化新增数据
                this.categories = baseUtil.getMetadataCategory()
                this.gems = baseUtil.getMetadataGem()
                this.metals = baseUtil.getMetadataMetal()
                this.crafts = baseUtil.getMetadataCraft()
                // 初始化选中数据
                let _this = this
                let preStockView = _this.preStockView
                console.log(preStockView)
                if (this.getCanChange) {
                    // 页面值可修改
                    this.wareHouseId$ = preStockView.wareHouseId
                    this.vendorId$ = preStockView.vendorId
                    this.buyerId$ = preStockView.buyerId
                    this.stockType$ = preStockView.stockType
                } else {
                    // 页面值仅能查看
                    this.wareHouseId$ = baseUtil.getNameFromPropId('wareHouse', preStockView.wareHouseId)
                    this.vendorId$ = baseUtil.getNameFromPropId('vendors', preStockView.vendorId)
                    this.buyerId$ = baseUtil.getNameFromPropId('staffs', preStockView.buyerId)
                    this.stockType$ = constUtil._CONST_STOCK_TYPE.find(ele => ele.value === preStockView.stockType).name
                }
                this.weightUnit$ = preStockView.weightUnit
                // 初始化是否显示按钮
                this.showChooseProductBtn = constUtil._CONST_SKU_TYPE[1].value === _this.preStock.skuType // 单款多件，显示选择商品按钮
                this.showCostShareBtn = constUtil._CONST_WARE_TYPE[0].value === _this.preStock.wareType && constUtil._CONST_SKU_TYPE[1].value !== _this.preStock.skuType// 素金，并且不为单款多件，显示称差成本分摊按钮
                this.showAmountField = constUtil._CONST_SKU_TYPE[1].value === _this.preStock.skuType // 单款多件，显示表格输入数量字段
                this.showGemField = constUtil._CONST_WARE_TYPE[1].value === _this.preStock.wareType // 素金只显示金属，没有宝石和工艺
                this.showGemInfoFields = constUtil._CONST_WARE_TYPE[1].value === _this.preStock.wareType // 镶嵌类，显示表格宝石信息字段
                this.showProcessingCharges = constUtil._CONST_WARE_TYPE[0].value === _this.preStock.wareType && constUtil._CONST_RETAIL_PRICE_TYPE[0].value === _this.preStock.retailPriceType // 素金、按重计价，显示表格工费字段
                this.showProcessingChargesInTitle = constUtil._CONST_RETAIL_PRICE_ALGORITHM[2].value !== _this.preStock.retailPriceAlgorithm // 当售价算法不是成本加成时，显示工费
                // 当特价销售的时候，显示原价（regularPrice）
                this.showRegularPrice = _this.preStock.bargainPrice
                // 显示表格字段，当计价方式为今日金价的时候，不显示零售价
                this.showRetailPrice = _this.preStock.retailPriceAlgorithm !== constUtil._CONST_RETAIL_PRICE_ALGORITHM[0].value

                // 算成本单价
                this.costUnitPrice = numberUtil.toKeepTwoPlacesOfDecimalAndRound(calculateUtil.divide(preStockView.pkgCost, preStockView.pkgWeight));
                // 原价方式
                (function () {
                    if (preStockView.costPriceAlgorithm === constUtil._CONST_COST_PRICE_ALGORITHM[0].value) { // 按重
                        _this.showCostPriceWayArea = true
                    } else { // 手动输入
                        _this.showCostPriceWayArea = false
                    }
                }());
                // 售价方式
                (function () {
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
            },
            // 打印标签
            print(item) {
                this.getPrintInfo({
                    stockItemId: item.id,
                    callback: (data) => {
                        // 打印标签
                        let templates = JSON.parse(window.localStorage.getItem('printTemplate'))
                        let printTemplateChecked = window.localStorage.getItem('printTemplateChecked')
                        let hasTemplate = false
                        for (let key in templates) {
                            if (key === printTemplateChecked) {
                                hasTemplate = true
                            }
                        }
                        console.log('打印标签ing:', data)
                        if (hasTemplate) {
                            console.log('打印标签ing:', data)
                            console.log('=====')
//                            var ffi = requireFFI('ffi')
//                            var ref = requireFFI('ref')
//                            var intP = ref.refType('int')
//                            var DLL = ffi.Library('./TLXLabelPaint', {
//                                'TLXOpenDocumentA': ['int', ['string', intP]],
//                                'TLXSetNamedVariableA': ['int', ['int', 'string', 'string']],
//                                'TLXSetNamedVariableW': ['int', ['int', 'string', 'string']],
//                                'TLXOutputLabel': ['int', ['int', 'int', 'int']],
//                                'TLXOutputDocument': ['int', ['int', 'int', 'int', 'int']],
//                                'TLXOpenDocumentXMLA': ['int', ['string', intP, 'bool']],
//                                'TLXOpenDocumentXMLW': ['int', ['string', intP, 'bool']],
//                                'TLXNamedVarsAddVarDataA': ['int', ['int', 'int', 'string', 'string']],
//                                'TLXEditTemplateXMLA': ['int', ['string', intP]]
//                            })
//
//                            console.log(data)
//                            DLL.TLXOpenDocumentXMLA(TEcoding(templates[printTemplateChecked]), Buffer.alloc(1), false)
//                            if (data.rows[0].storage.modelCode) {
//                                DLL.TLXSetNamedVariableA(1, TEcoding('版号'), TEcoding(data.rows[0].storage.modelCode))
//                            }
//                            DLL.TLXSetNamedVariableA(1, TEcoding('条码'), data.rows[0].storage.serial.toString())
//                            // 金属 + 宝石 + 品类
//                            var proName = ''
//                            if (data.rows[0].storage.metalId) {
//                                proName += baseUtil.getMetadataMetalById(data.rows[0].storage.metalId).name
//                            }
//                            if (data.rows[0].storage.gemId) {
//                                proName += baseUtil.getMetadataGemById(data.rows[0].storage.gemId).name
//                            }
//                            if (baseUtil.getMetadataCategoryById(data.rows[0].storage.categoryId)) {
//                                proName += baseUtil.getMetadataCategoryById(data.rows[0].storage.categoryId).name
//                            }
//                            DLL.TLXSetNamedVariableA(1, TEcoding('基础信息'), TEcoding(proName))
//                            if (data.rows[0].storage.moralName.length > 0) {
//                                DLL.TLXSetNamedVariableA(1, TEcoding('寓意名'), TEcoding(data.rows[0].storage.moralName))
//                            }
//                            if (data.rows[0].storage.computedProcessingCharges.toString().length > 0) {
//                                DLL.TLXSetNamedVariableA(1, TEcoding('工费'), TEcoding('工费：' + data.rows[0].storage.computedProcessingCharges + '元'))
//                            }
//                            if (data.rows[0].storage.regularPrice.toString().length > 0) {
//                                DLL.TLXSetNamedVariableA(1, TEcoding('原价'), TEcoding(data.rows[0].storage.regularPrice.toString() + '元'))
//                            }
//                            if (data.rows[0].storage.retailPrice.toString().length > 0) {
//                                DLL.TLXSetNamedVariableA(1, TEcoding('折后价'), TEcoding(data.rows[0].storage.retailPrice.toString() + '元'))
//                            }
//                            DLL.TLXSetNamedVariableA(1, TEcoding('总质量'), TEcoding('总质量：' + data.rows[0].storage.weight.toString() + data.rows[0].storage.weightUnit))
//                            var propsArr = []
//                            data.rows[0].props.map((item, index) => {
//                                if (item.fieldValue.toString().length > 0) {
//                                    DLL.TLXSetNamedVariableA(1, TEcoding(item.fieldName.toString()), TEcoding(item.fieldName.toString() + '：' + item.fieldValue.toString()))
//                                    propsArr.add(item.fieldValue.toString())
//                                }
//                            })
//                            var fff = DLL.TLXOutputLabel(1, 1, 0)
//                            // var fff =  DLL.TLXOutputDocument(1, 1, 1, 0)
//                            console.log(fff)
                        } else {
                            console.log('请选择打印模板')
                        }
                    }
                })
            },
            // item上的回车
            enterAmount(itemId) {
                if (this.showGemField) {
                    this.$refs['gem' + itemId][0].select()
                } else {
                    this.$refs['metal' + itemId][0].select()
                }
            },
            enterGem(itemId) {
                this.$refs['metal' + itemId][0].select()
            },
            enterMetal(itemId) {
                this.$refs['category' + itemId][0].select()
            },
            enterCategory(itemId) {
                if (this.showGemField) {
                    this.$refs['craft' + itemId][0].select()
                } else {
                    this.$refs['moralName' + itemId][0].select()
                }
            },
            enterCraft(itemId) {
                this.$refs['moralName' + itemId][0].select()
            },
            enterMoralName(itemId) {
                this.$refs['modelCode' + itemId][0].select()
            },
            enterModelCode(itemId) {
                if (this.showGemInfoFields) {
                    this.$refs['mainGemWeight' + itemId][0].select()
                } else {
                    this.$refs['weight' + itemId][0].select()
                }
            },
            enterMainGemWeight(itemId) {
                this.$refs['mainGemAmount' + itemId][0].select()
            },
            enterMainGemAmount(itemId) {
                this.$refs['weight' + itemId][0].select()
            },
            enterWeight(itemId) {
                this.$refs['costPrice' + itemId][0].select()
                this.triggerChangeByHand('weight', itemId);
            },
            enterCostPrice(itemId) {
                if (this.showRegularPrice) {
                    this.$refs['regularPrice' + itemId][0].select()
                } else if (this.showRetailPrice) {
                    this.$refs['retailPrice' + itemId][0].select()
                } else {
                    // 创建一个新的item,或者跳到下一行
                    this.enterRetailPrice(itemId)
                }
                this.triggerChangeByHand('costPrice', itemId);
            },
            enterRegularPrice(itemId) {
                this.$refs['retailPrice' + itemId][0].select()
                this.triggerChangeByHand('regularPrice', itemId);
            },
            enterRetailPrice(itemId) {
                let lastItem = this.stockItemsView[this.stockItemsView.length - 1]
                if (lastItem.id === itemId) {
                    // 创建一个新的item
                    this.addNewItem()
                } else {
                    // select到下一行item
                    let nextItem = {}
                    this.stockItemsView.forEach((ele, index) => {
                        if (ele.id === itemId) {
                            nextItem = this.stockItemsView[++index]
                        }
                    })
                    this.$refs['weight' + nextItem.id][0].select()
                    this.triggerChangeByHand('retailPrice', itemId);
                }
            },
            triggerChangeByHand(symbol, itemId) {
                let ev = document.createEvent('HTMLEvents');
                ev.initEvent('change', false, true);
                this.$refs[symbol + itemId][0].dispatchEvent(ev);
            },
            // 点击加号
            clickPlus() {
                this.addNewItem()
            },
            // 新增一个item
            addNewItem() {
                let itemInfo = {}
                if (this.stockItemsView.length === 0) { // 如果当前页面没有添加item, 新增一个空的item
                    itemInfo = {
                        amount: 1,
                        categoryId: baseUtil.getMetadataCategory()[0] ? baseUtil.getMetadataCategory()[0].id : '',
                        moralName: '',
                        modelCode: '',
                        metalId: baseUtil.getMetadataMetal()[0] ? baseUtil.getMetadataMetal()[0].id : '',
                        weight: 0,
                        costPrice: 0,
                        regularPrice: 0,
                        retailPrice: 0,
                        computedProcessingCharges: 0
                    }
                    if (this.showGemField) { // 镶嵌时有宝石和工艺
                        console.log('// 镶嵌时有宝石和工艺');
                        itemInfo.gemId = baseUtil.getMetadataGem()[0] ? baseUtil.getMetadataGem()[0].id : '';
                        itemInfo.craftId = baseUtil.getMetadataCraft()[0] ? baseUtil.getMetadataCraft()[0].id : '';
                        itemInfo.mainGemAmount = 0;
                        itemInfo.mainGemWeight = 0;
                    } else {
                        itemInfo.gemId = '';
                        itemInfo.craftId = '';
                    }
                } else {
                    itemInfo = {...this.stockItemsView[this.stockItemsView.length - 1]}
                    console.log('itemInfo', itemInfo);
                }
                let pass = {
                    itemInfo,
                    callback(data) {
                        console.log(data.id);
                        this.itemId = data.id
                    }
                }
                this.addItem(pass)
                setTimeout(() => {
                    if (this.$refs['weight' + itemInfo.id]) {
                        this.$refs['weight' + itemInfo.id][0].select()
                    }
                }, 0) // 自动select到weight
            },
            // 点击秤差分摊
            clickWeightDiff() {
                this.weightDiff(() => {
                })
            },
            // 修改item的属性值
            modifyItemHandler(event, item, key) {
                console.log('event', event);
                let value = event.target.value;
                console.log('event, item, key', value, item, key);
                if (key === 'weight') { // 质量保留两位小数，不足补零
                    value = numberUtil.toKeepTwoPlacesOfDecimalAndRoundSupplementZero(Number(value));
                }
                let pass = {
                    key: key,
                    value,
                    itemId: item.id
                }
                this.modifyItem(pass)
                if (key === 'weight') {
                    // 先处理成本金额
                    if (this.preStockView.costPriceAlgorithm === constUtil._CONST_COST_PRICE_ALGORITHM[0].value) { // 按重计价
                        item.costPrice = calculateUtil.multiply(value, numberUtil.toKeepTwoPlacesOfDecimalAndRound(calculateUtil.divide(this.preStockView.pkgCost, this.preStockView.pkgWeight)))
                        this.modifyItem({
                            key: 'costPrice',
                            value: item.costPrice,
                            itemId: item.id
                        });
                    }
                    // 再处理售价
                    this.calculateRegularPriceAndRetailPrice(item)
                    // 处理工费
                    if (this.showProcessingCharges) {
                        item.computedProcessingCharges = calculateUtil.multiply(value, this.preStockView.retailProcessingCharges);
                        this.modifyItem({
                            key: 'computedProcessingCharges',
                            value: item.computedProcessingCharges,
                            itemId: item.id
                        });
                    }
                } else if (key === 'costPrice') {
                    this.calculateRegularPriceAndRetailPrice(item)
                }
                if (!this.showRegularPrice && key === 'retailPrice') {
                    // 如果正常销售没有原价，则把销售折后价的价格设置为销售原价的价格
                    let pass = {
                        key: 'regularPrice',
                        value: event.target.value,
                        itemId: item.id
                    }
                    this.modifyItem(pass)
                }
            },
            calculateRegularPriceAndRetailPrice(item) {
                if (this.showRegularPrice) {
                    if (this.preStockView.retailPriceAlgorithm === constUtil._CONST_RETAIL_PRICE_ALGORITHM[1].value) { // 按指定金价计价
                        if (this.preStockView.bargainPrice) { // 特价销售
                            item.regularPrice = calculateUtil.multiply(item.weight, calculateUtil.add(this.preStockView.regularMetalPrice, this.preStockView.regularProcessingCharges));
                            this.modifyItem({
                                key: 'regularPrice',
                                value: parseInt(item.regularPrice), // Math.round
                                itemId: item.id
                            });
                        }
                        item.retailPrice = calculateUtil.multiply(item.weight, calculateUtil.add(this.preStockView.retailMetalPrice, this.preStockView.retailProcessingCharges));
                        this.modifyItem({
                            key: 'retailPrice',
                            value: parseInt(item.retailPrice),
                            itemId: item.id
                        });
                    } else if (this.preStockView.retailPriceAlgorithm === constUtil._CONST_RETAIL_PRICE_ALGORITHM[2].value) { // 按成本加成
                        if (this.preStockView.bargainPrice) {
                            if (item.costPrice) {
                                item.regularPrice = calculateUtil.add(calculateUtil.multiply(item.costPrice, this.preStockView.regularPriceRatio), this.preStockView.regularPriceExtra);
                                this.modifyItem({
                                    key: 'regularPrice',
                                    value: parseInt(item.regularPrice), // Math.round
                                    itemId: item.id
                                });
                            }
                            item.retailPrice = calculateUtil.add(calculateUtil.multiply(item.costPrice, this.preStockView.retailPriceRatio), this.preStockView.retailPriceExtra);
                            this.modifyItem({
                                key: 'retailPrice',
                                value: parseInt(item.retailPrice), // Math.round
                                itemId: item.id
                            });
                        }
                    }
                } else if (this.showRetailPrice) {
                    if (this.preStockView.retailPriceAlgorithm === constUtil._CONST_RETAIL_PRICE_ALGORITHM[1].value) { // 按指定金价计价
                        item.retailPrice = calculateUtil.multiply(item.weight, calculateUtil.add(this.preStockView.retailMetalPrice, this.preStockView.retailProcessingCharges));
                        this.modifyItem({
                            key: 'retailPrice',
                            value: parseInt(item.retailPrice), // Math.round
                            itemId: item.id
                        });
                    } else if (this.preStockView.retailPriceAlgorithm === constUtil._CONST_RETAIL_PRICE_ALGORITHM[2].value) { // 按成本加成
                        if (item.costPrice) {
                            item.retailPrice = calculateUtil.add(calculateUtil.multiply(item.costPrice, this.preStockView.retailPriceRatio), this.preStockView.retailPriceExtra);
                            this.modifyItem({
                                key: 'retailPrice',
                                value: parseInt(item.retailPrice), // Math.round
                                itemId: item.id
                            });
                        }
                    }
                }
            },
            // 表格下方的统计
            totalItemCount() {
                if (this.showChooseProductBtn) { // 单款多件
                    return this.stockItemsView.map(item => item.amount ? item.amount : 0).reduce((sum, item) => calculateUtil.add(sum, item), 0)
                } else {
                    return this.stockItemsView.length
                }
            },
            totalWeight() {
                let weight = 0;
                if (this.showChooseProductBtn) { // 单款多件
                    this.stockItemsView.forEach(item => {
                        weight += calculateUtil.multiply(item.amount, item.weight)
                    })
                } else {
                    weight = this.stockItemsView
                        .map(item => item.weight)
                        .reduce((sum, item) => calculateUtil.add(sum, item), 0)
                }
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
            calculateTotal(key) {
                let result = 0;
                if (this.showChooseProductBtn) { // 单款多件
                    this.stockItemsView.forEach(item => {
                        if (item[key]) {
                            result += calculateUtil.multiply(item.amount, numberUtil.toKeepTwoPlacesOfDecimalAndRound(item[key]))
                        }
                    })
                } else {
                    result = this.stockItemsView
                        .map(item => item[key] ? numberUtil.toKeepTwoPlacesOfDecimalAndRound(item[key]) : 0)
                        .reduce((sum, item) => calculateUtil.add(sum, item), 0)
                }
                return result
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
            // 聚焦到新增的第一个字段
            focusFirstFieldOfNewItem() {
                let lastItem = this.stockItemsView[this.stockItemsView.length - 1]
                if (lastItem && this.focusFirstField) {
                    this.undoFocusFirstField()
                    this.$refs['weight' + lastItem.id][0].select()
                }
            },
            clickBack() {
                this.resetCurrCpn(ProcurementMain)
            },
            clickDelete(event) {
                this.deleteItem({
                    itemId: event.target.value,
                    callback: () => this.deleteStockItem(event.target.value)
                })
            },
            clickSubmit() {
                this.submitAudit(() => {
                    this.clickBack()
                })
            }
        },
        mounted() {
            this.initData()
        },
        updated() {
            this.focusFirstFieldOfNewItem()
        }
    }
</script>

<style scoped>
    .table-striped>tbody>tr.tr-cls {
        background-color: #81c3c6;
    }
</style>
