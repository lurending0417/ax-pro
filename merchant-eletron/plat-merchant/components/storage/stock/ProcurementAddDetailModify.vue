<template>
    <div style="text-align: left">
        <div class="modal-body">
            <div class="form-inline">
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
                    <label>条码生成规则：</label>
                    <select class="form-control" v-model="serialSource$">
                        <option v-for="item in serialSources" :value="item.id">{{ item.name }}</option>
                    </select>
                </div>
                <div class="form-group form-group-margin">
                    <label>采购员：</label>
                    <select class="form-control" v-model="buyerId$">
                        <option v-for="staff in staffs" :value="staff.id">{{ staff.nickName }}</option>
                    </select>
                </div>
                <div class="form-group form-group-margin">
                    <label>商品类型：</label>
                    <select class="form-control" v-model="skuType$">
                        <option v-for="skuType in skuTypes" :value="skuType.value">{{ skuType.name }}</option>
                    </select>
                </div>
                <div class="form-group form-group-margin">
                    <label>销售方式：</label>
                    <select class="form-control" v-model="bargainPrice$">
                        <option :value="false">正常零售</option>
                        <option :value="true">特价零售</option>
                    </select>
                </div>
                <div class="form-group form-group-margin">
                    <label>买/借：</label>
                    <select class="form-control" v-model="stockType$">
                        <option v-for="stockType in stockTypes" :value="stockType.value">{{ stockType.name }}</option>
                    </select>
                </div>
                <div class="form-group form-group-margin">
                    <label>素金/非素：</label>
                    <select class="form-control" v-model="wareType$">
                        <option v-for="wareType in wareTypes" :value="wareType.value">{{ wareType.name }}</option>
                    </select>
                </div>
                <div class="form-group form-group-margin">
                    <label>单位：</label>
                    <select class="form-control" v-model="weightUnit$">
                        <option v-for="weightUnit in weightUnits" :value="weightUnit.value">{{ weightUnit.name }}
                        </option>
                    </select>
                </div>

                <div class="hr-line-dashed"></div>

                <!--成本价的确定方式-->
                <div>
                    <h4 style="text-align: center; margin-bottom: 15px;">成本价的确定方式</h4>
                    <div class="form-inline">
                        <div class="form-group form-group-margin">
                            <label>录入方式：</label>
                            <select class="form-control" v-model="costPriceAlgorithm$">
                                <option v-for="costPriceAlgorithm in costPriceAlgorithms"
                                        :value="costPriceAlgorithm.value">
                                    {{ costPriceAlgorithm.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="form-inline" v-show="showCostPriceWayArea">
                        <div class="form-group form-group-margin">
                            <label>总包成本：</label>
                            <input v-model="pkgCost$" type="number" class="form-control" style="width: 100px"/>
                            <span style="margin-left: 5px">元</span>
                        </div>
                        <div class="form-group form-group-margin">
                            <label>总包质量：</label>
                            <input v-model="pkgWeight$" type="number" class="form-control" style="width: 100px"/>
                            <span style="margin-left: 5px">克</span>
                        </div>
                    </div>
                    <div class="form-inline" v-show="showCostPriceWayArea">
                        <div class="form-group form-group-margin">
                            <label>单位：</label>
                            <span>{{ costUnitPrice }}</span>
                            <span style="margin-left: 5px">元/g</span>
                        </div>
                    </div>
                    <div class="hr-line-dashed"></div>
                </div>

                <!--零售价的确定方式-->
                <!------------------------------------------------------------------------>
                <!--正价零售-->
                <div v-if="!bargainPrice$">
                    <h4 style="text-align: center; margin-bottom: 15px;">零售价的确定方式</h4>
                    <!--素金-->
                    <!-------------------------------------->
                    <div v-if="isPure">
                        <div class="form-inline">
                            <div class="form-group form-group-margin">
                                <label>计价方式：</label>
                                <select class="form-control" v-model="retailPriceAlgorithm$">
                                    <option v-for="retailPriceAlgorithm in retailPriceAlgorithms"
                                            :value="retailPriceAlgorithm.value">{{ retailPriceAlgorithm.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group form-group-margin">
                                <label>精品/普货：</label>
                                <select class="form-control" v-model="processingType$">
                                    <option v-for="item in processingTypes"
                                            :value="item.id">{{ item.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="form-inline">
                            <div class="form-group form-group-margin" v-show="showRetailPriceRatio">
                                <label>倍率：</label>
                                <input v-model="normalPure.retailPriceRatio$" type="number" class="form-control"
                                       style="width: 80px"/>
                            </div>
                            <div class="form-group form-group-margin" v-show="showRetailGoldPrice">
                                <label>金价：</label>
                                <input v-model="normalPure.retailMetalPrice$" type="number" class="form-control"
                                       style="width: 80px"/>
                                <span style="margin-left: 5px">元/克</span>
                            </div>
                            <div class="form-group form-group-margin" v-show="showRetailProcessingCharges">
                                <label>工费：</label>
                                <input v-model="normalPure.retailProcessingCharges$" type="number" class="form-control"
                                       style="width: 100px"/>
                                <span style="margin-left: 5px">元/克</span>
                            </div>
                            <div class="form-group form-group-margin" v-show="showRetailPriceExtra">
                                <label>附加费：</label>
                                <input v-model="normalPure.retailPriceExtra$" type="number" class="form-control"
                                       style="width: 100px"/>
                                <span style="margin-left: 5px">元/件</span>
                            </div>
                        </div>
                    </div>
                    <!--非素金-->
                    <div v-else>
                        <div class="form-inline">
                            <div class="form-group form-group-margin">
                                <label>计价方式：{{retailPriceAlgorithmName}}</label>
                            </div>
                        </div>
                        <div class="form-inline">
                            <div class="form-group form-group-margin">
                                <label>倍率：</label>
                                <input v-model="normalFixed.retailPriceRatio$" type="number" class="form-control"
                                       style="width: 80px"/>
                            </div>
                            <div class="form-group form-group-margin">
                                <label>附加费：</label>
                                <input v-model="normalFixed.retailPriceExtra$" type="number" class="form-control"
                                       style="width: 100px"/>
                                <span style="margin-left: 5px">元/件</span>
                            </div>
                        </div>
                    </div>

                </div>
                <!------------------------------------------------------------------------>
                <!--特价零售-->
                <div v-else>
                    <h4 style="text-align: center; margin-bottom: 15px;">零售价的确定方式</h4>
                    <!--素金-->
                    <div v-if="isPure">
                        <div class="form-inline">
                            <div class="form-group form-group-margin">
                                <label>计价方式：</label>
                                <select class="form-control" v-model="retailPriceAlgorithm$">
                                    <option v-for="retailPriceAlgorithm in retailPriceAlgorithms"
                                            :value="retailPriceAlgorithm.value">{{ retailPriceAlgorithm.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <!--原价-->
                        <fieldset>
                            <legend>原价</legend>
                            <div class="form-inline">
                                <div class="form-group form-group-margin" v-show="showRetailPriceRatio">
                                    <label>倍率：</label>
                                    <input v-model="bargainPure.regularPriceRatio$" type="number" class="form-control"
                                           style="width: 80px"/>
                                </div>
                                <div class="form-group form-group-margin" v-show="showRetailGoldPrice">
                                    <label>金价：</label>
                                    <input v-model="bargainPure.regularMetalPrice$" type="number" class="form-control"
                                           style="width: 80px"/>
                                    <span style="margin-left: 5px">元/克</span>
                                </div>
                                <div class="form-group form-group-margin" v-show="showRetailProcessingCharges">
                                    <label>工费：</label>
                                    <input v-model="bargainPure.regularProcessingCharges$" type="number"
                                           class="form-control"
                                           style="width: 100px"/>
                                    <span style="margin-left: 5px">元/克</span>
                                </div>
                                <div class="form-group form-group-margin" v-show="showRetailPriceExtra">
                                    <label>附加费：</label>
                                    <input v-model="bargainPure.regularPriceExtra$" type="number"
                                           class="form-control"
                                           style="width: 100px"/>
                                    <span style="margin-left: 5px">元/件</span>
                                </div>
                            </div>
                        </fieldset>
                        <!--折后价-->
                        <fieldset>
                            <legend>折后价</legend>
                            <div class="form-inline">
                                <div class="form-group form-group-margin" v-show="showRetailPriceRatio">
                                    <label>倍率：</label>
                                    <input v-model="bargainPure.retailPriceRatio$" type="number" class="form-control"
                                           style="width: 80px"/>
                                </div>
                                <div class="form-group form-group-margin" v-show="showRetailGoldPrice">
                                    <label>金价：</label>
                                    <input v-model="bargainPure.retailMetalPrice$" type="number" class="form-control"
                                           style="width: 80px"/>
                                    <span style="margin-left: 5px">元/克</span>
                                </div>
                                <div class="form-group form-group-margin" v-show="showRetailProcessingCharges">
                                    <label>工费：</label>
                                    <input v-model="bargainPure.retailProcessingCharges$" type="number"
                                           class="form-control"
                                           style="width: 100px"/>
                                    <span style="margin-left: 5px">元/克</span>
                                </div>
                                <div class="form-group form-group-margin" v-show="showRetailPriceExtra">
                                    <label>附加费：</label>
                                    <input v-model="bargainPure.retailPriceExtra$" type="number" class="form-control"
                                           style="width: 100px"/>
                                    <span style="margin-left: 5px">元/件</span>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <!--镶嵌-->
                    <div v-else>
                        <div class="form-inline">
                            <div class="form-group form-group-margin">
                                <label>计价方式：{{retailPriceAlgorithmName}}</label>
                            </div>
                        </div>
                        <fieldset>
                            <legend>原价</legend>
                            <div class="form-inline">
                                <div class="form-group form-group-margin">
                                    <label>倍率：</label>
                                    <input v-model="bargainFixed.regularPriceRatio$" type="number" class="form-control"
                                           style="width: 80px"/>
                                </div>
                                <div class="form-group form-group-margin">
                                    <label>附加费：</label>
                                    <input v-model="bargainFixed.regularPriceExtra$" type="number" class="form-control"
                                           style="width: 100px"/>
                                    <span style="margin-left: 5px">元/件</span>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend>折后价</legend>
                            <div class="form-inline">
                                <div class="form-group form-group-margin">
                                    <label>倍率：</label>
                                    <input v-model="bargainFixed.retailPriceRatio$" type="number" class="form-control"
                                           style="width: 80px"/>
                                </div>
                                <div class="form-group form-group-margin">
                                    <label>附加费：</label>
                                    <input v-model="bargainFixed.retailPriceExtra$" type="number" class="form-control"
                                           style="width: 100px"/>
                                    <span style="margin-left: 5px">元/件</span>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>

            </div>
        </div>
        <div class="modal-footer">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-default" data-dismiss="modal" @click="closeModal()">关闭</button>
            <button type="button" class="btn btn-primary" @click="save()">保存</button>
        </div>
    </div>
</template>

<script>
    //    import ProcurementAdd from '~/components/storage/stock/ProcurementAdd'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {baseUtil, constUtil, calculateUtil, numberUtil, objectUtil} from '~/util'
    import {mapActions, mapMutations} from 'vuex'

    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'preStock', 'refresh'],
        data() {
            return {
                warehouses: [],
                vendors: [],
                serialSources: [],
                staffs: [],
                skuTypes: [],
                stockTypes: [],
                wareTypes: [],
                processingTypes: [],
                weightUnits: [],
                costPriceAlgorithms: [],
                retailPriceAlgorithms: [], // 售价算法（今日金价， 指定金价， 成本倍率）
                costUnitPrice: 0,
                showCostPriceWayArea: true, // 成本价计价方式（按重计价时为true）
                // 折后价相关
                showRetailPriceRatio: false, // 是否显示倍率
                showRetailGoldPrice: false, //  是否显示金价
                showRetailPriceExtra: false, // 是否显示附加费（元/件）
                showRetailProcessingCharges: false, //  是否显示工费（元/g）
                // 原价相关
                showRegularPriceRatio: false, // 是否显示倍率
                showRegularGoldPrice: false, //  是否显示金价
                showRegularPriceExtra: false, // 是否显示附加费（元/件）
                showRegularProcessingCharges: false, //  是否显示工费（元/g）
                // 表单数据
                wareHouseId$: '',
                vendorId$: '',
                serialSource$: '', // 条码生成规则
                buyerId$: '',
                skuType$: '',
                bargainPrice$: '',
                stockType$: '', // 采购方式
                wareType$: '', // 商品类型
                processingType$: '', // 精品，普货
                weightUnit$: '', // 重量单位
                pkgCost$: '', // 总包成本
                pkgWeight$: '', // 总包质量
                costPriceAlgorithm$: '', // 成本价的确定方式
                retailPriceAlgorithm$: '', // 零售价的确定方式
                bargainPure: {},
                normalPure: {},
                bargainFixed: {},
                normalFixed: {},
                priceObj: {
                    // 折后价
                    retailPriceRatio$: '', // 零售价倍率
                    retailMetalPrice$: '', // 零售金价
                    retailPriceExtra$: '', // 零售价附加费用
                    retailProcessingCharges$: '', // 零售工费
                    // 原价
                    regularPriceRatio$: '', // 零售价倍率
                    regularMetalPrice$: '', // 零售金价
                    regularPriceExtra$: '', // 零售价附加费用
                    regularProcessingCharges$: '' // 零售工费
                }
            }
        },
        watch: {
            costPriceAlgorithm$(value) {
                if (value === constUtil._CONST_COST_PRICE_ALGORITHM[0].value) { // 按重
                    this.showCostPriceWayArea = true
                } else { // 手动输入
                    this.showCostPriceWayArea = false
                }
            },
            pkgCost$() {
                this.calculateCostUnitPrice()
            },
            pkgWeight$() {
                this.calculateCostUnitPrice()
            }
        },
        computed: {
            isPure() {
                return this.wareType$ === 'PURE'
            },
            retailPriceAlgorithmName() {
                let str = '';
                constUtil._CONST_RETAIL_PRICE_ALGORITHM.forEach((item) => {
                    if (item.value === this.retailPriceAlgorithm$) {
                        str = item.name
                    }
                })
                return str
            }
        },
        methods: {
            ...mapMutations('storage/stock/procurementAdd', {
                resetPreStock: 'resetPreStock',
                resetProcurementCanChange: 'resetProcurementCanChange'
            }),
            ...mapMutations('storage/stock/procurement', {
                resetCurrCpn: 'resetCurrCpn'
            }),
            ...mapActions('storage/stock/procurementAddPre', {
                saveStock: 'saveStock'
            }),
            ...mapActions('storage/stock/procurementMain', {
                modifyStock: 'modifyStock'
            }),
            retailPriceAlgorithmChange(value) {
                if (value === constUtil._CONST_RETAIL_PRICE_ALGORITHM[0].value) { // 今日金价
                    this.showRetailProcessingCharges = true;
                    this.showRetailPriceRatio = false;
                    this.showRetailGoldPrice = false;
                    this.showRetailPriceExtra = false;
                } else if (value === constUtil._CONST_RETAIL_PRICE_ALGORITHM[1].value) { // 指定金价
                    this.showRetailProcessingCharges = true;
                    this.showRetailPriceRatio = false;
                    this.showRetailGoldPrice = true;
                    this.showRetailPriceExtra = false;
                } else if (value === constUtil._CONST_RETAIL_PRICE_ALGORITHM[2].value) { // 成本倍率
                    this.showRetailProcessingCharges = false;
                    this.showRetailPriceRatio = true;
                    this.showRetailGoldPrice = false;
                    this.showRetailPriceExtra = true;
                }
            },
            bargainPriceChanging(val) {
                if (val) { // 特价销售
                    if (this.isPure) {
                        this.costPriceAlgorithms = constUtil._CONST_COST_PRICE_ALGORITHM
                        this.costPriceAlgorithm$ = this.costPriceAlgorithms[0].value
                        this.retailPriceAlgorithms = [...constUtil._CONST_RETAIL_PRICE_ALGORITHM].splice(1, 2)
                        this.retailPriceAlgorithm$ = this.retailPriceAlgorithms[0].value
                    } else {
                        this.costPriceAlgorithms = [constUtil._CONST_COST_PRICE_ALGORITHM[1]]
                        this.costPriceAlgorithm$ = this.costPriceAlgorithms[0].value
                        this.retailPriceAlgorithms = constUtil._CONST_RETAIL_PRICE_ALGORITHM
                        this.retailPriceAlgorithm$ = this.retailPriceAlgorithms[2].value
                    }
                } else { // 正价销售
                    if (this.isPure) {
                        this.costPriceAlgorithms = constUtil._CONST_COST_PRICE_ALGORITHM
                        this.costPriceAlgorithm$ = this.costPriceAlgorithms[0].value
                        this.retailPriceAlgorithms = constUtil._CONST_RETAIL_PRICE_ALGORITHM
                        this.retailPriceAlgorithm$ = this.retailPriceAlgorithms[0].value
                    } else {
                        this.costPriceAlgorithms = [constUtil._CONST_COST_PRICE_ALGORITHM[1]]
                        this.costPriceAlgorithm$ = this.costPriceAlgorithms[0].value
                        this.retailPriceAlgorithms = [...constUtil._CONST_RETAIL_PRICE_ALGORITHM]
                        this.retailPriceAlgorithm$ = this.retailPriceAlgorithms[2].value
                    }
                }
            },
            wareTypeChanging(value) {
                if (this.bargainPrice$) { // 特价零售
                    if (value === this.wareTypes[0].value) { // 素金
                        this.costPriceAlgorithms = constUtil._CONST_COST_PRICE_ALGORITHM
                        this.costPriceAlgorithm$ = this.costPriceAlgorithms[0].value
                        this.retailPriceAlgorithms = [...constUtil._CONST_RETAIL_PRICE_ALGORITHM].splice(1, 2)
                        this.retailPriceAlgorithm$ = this.retailPriceAlgorithms[0].value
                    } else { // 镶嵌
                        this.costPriceAlgorithms = [constUtil._CONST_COST_PRICE_ALGORITHM[1]]
                        this.costPriceAlgorithm$ = this.costPriceAlgorithms[0].value
                        this.retailPriceAlgorithms = constUtil._CONST_RETAIL_PRICE_ALGORITHM
                        this.retailPriceAlgorithm$ = this.retailPriceAlgorithms[2].value
                    }
                } else { // 正常
                    if (value === this.wareTypes[0].value) { // 素金
                        this.costPriceAlgorithms = constUtil._CONST_COST_PRICE_ALGORITHM
                        this.costPriceAlgorithm$ = this.costPriceAlgorithms[0].value
                        this.retailPriceAlgorithms = constUtil._CONST_RETAIL_PRICE_ALGORITHM
                        this.retailPriceAlgorithm$ = this.retailPriceAlgorithms[0].value
                    } else { // 镶嵌
                        this.costPriceAlgorithms = [constUtil._CONST_COST_PRICE_ALGORITHM[1]]
                        this.costPriceAlgorithm$ = this.costPriceAlgorithms[0].value
                        this.retailPriceAlgorithms = [...constUtil._CONST_RETAIL_PRICE_ALGORITHM]
                        this.retailPriceAlgorithm$ = this.retailPriceAlgorithms[2].value
                    }
                }
            },
            watchFunc() {
                this.$watch('retailPriceAlgorithm$', function (value) {
                    this.resetPriceObj();
                    this.retailPriceAlgorithmChange(value)
                })
                this.$watch('bargainPrice$', function (val) {
                    this.resetPriceObj();
                    this.bargainPriceChanging(val)
                })
                this.$watch('wareType$', function (value) {
                    this.resetPriceObj();
                    this.wareTypeChanging(value)
                })
            },
            resetPriceObj() {
                let temp = {
                    retailPriceRatio$: '', // 零售价倍率
                    retailMetalPrice$: '', // 零售金价
                    retailPriceExtra$: '', // 零售价附加费用
                    retailProcessingCharges$: '', // 零售工费
                    // 原价
                    regularPriceRatio$: '', // 零售价倍率
                    regularMetalPrice$: '', // 零售金价
                    regularPriceExtra$: '', // 零售价附加费用
                    regularProcessingCharges$: '' // 零售工费
                };
                this.bargainPure = temp;
                this.normalPure = temp;
                this.bargainFixed = temp;
                this.normalFixed = temp;
            },
            closeModal() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            },
            save() {
                let obj = {};
                if (this.wareType$ === 'PURE') {
                    if (this.bargainPrice$) { // 素金特价
                        obj = {...this.bargainPure}
                    } else { // 素金常价
                        obj = {...this.normalPure}
                    }
                } else {
                    if (this.bargainPrice$) {
                        obj = {...this.bargainFixed}
                    } else {
                        obj = {...this.normalFixed}
                    }
                }
                obj.wareHouseId$ = this.wareHouseId$;
                obj.vendorId$ = this.vendorId$;
                obj.serialSource$ = this.serialSource$;
                obj.buyerId$ = this.buyerId$;
                obj.skuType$ = this.skuType$;
                obj.bargainPrice$ = this.bargainPrice$;
                obj.stockType$ = this.stockType$;
                obj.wareType$ = this.wareType$;
                obj.processingType$ = this.processingType$;
                obj.weightUnit$ = this.weightUnit$;
                obj.pkgCost$ = this.pkgCost$;
                obj.pkgWeight$ = this.pkgWeight$;
                obj.costPriceAlgorithm$ = this.costPriceAlgorithm$;
                obj.retailPriceAlgorithm$ = this.retailPriceAlgorithm$;
                objectUtil.removeLastCharOfEveryFields(obj)
//                console.log('pppppppppp', obj);
                obj.billId = this.preStock.id
                this.modifyStock({
                    params: obj,
                    callback: data => {
                        ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                        this.resetPreStock(data.result)
                        this.resetProcurementCanChange(true)
                        this.refresh()
                    }
                })
            },
            initData() {
                // 初始化下拉菜单
                this.warehouses = baseUtil.getMetadataWareHouseByStoreId({enabled: true})
                this.vendors = baseUtil.getMetadataVendors({enabled: true})
                this.serialSources = constUtil._CONST_SERIAL_SOURCE
                if (baseUtil.getMetadataStaffs()) {
                    this.staffs = baseUtil.getMetadataStaffs()
                }
                this.skuTypes = constUtil._CONST_SKU_TYPE
                this.stockTypes = constUtil._CONST_STOCK_TYPE
                this.wareTypes = constUtil._CONST_WARE_TYPE
                this.processingTypes = constUtil._CONST_PROCESSING_TYPE
                this.weightUnits = constUtil._CONST_WEIGHT_UNIT
                this.costPriceAlgorithms = constUtil._CONST_COST_PRICE_ALGORITHM
                this.retailPriceAlgorithms = constUtil._CONST_RETAIL_PRICE_ALGORITHM
                // 初始化选中数据 (preStock)
                this.wareHouseId$ = this.preStock.wareHouseId
                this.vendorId$ = this.preStock.vendorId
                this.serialSource$ = this.preStock.serialSource
                this.buyerId$ = this.preStock.buyerId
                this.skuType$ = this.preStock.skuType
                this.bargainPrice$ = this.preStock.bargainPrice
                this.stockType$ = this.preStock.stockType
                this.wareType$ = this.preStock.wareType
                this.processingType$ = this.preStock.processingType
                this.weightUnit$ = this.preStock.weightUnit
                this.pkgWeight$ = this.preStock.pkgWeight
                this.pkgCost$ = this.preStock.pkgCost
                this.costPriceAlgorithm$ = this.preStock.costPriceAlgorithm
                this.retailPriceAlgorithm$ = this.preStock.retailPriceAlgorithm

                this.retailPriceAlgorithmChange(this.retailPriceAlgorithm$)
                this.bargainPriceChanging(this.bargainPrice$)
                this.wareTypeChanging(this.wareType$)
                this.priceObj.retailPriceRatio$ = this.preStock.retailPriceRatio
                this.priceObj.retailMetalPrice$ = this.preStock.retailMetalPrice
                this.priceObj.retailPriceExtra$ = this.preStock.retailPriceExtra
                this.priceObj.retailProcessingCharges$ = this.preStock.retailProcessingCharges
                this.priceObj.regularPriceRatio$ = this.preStock.regularPriceRatio
                this.priceObj.regularMetalPrice$ = this.preStock.regularMetalPrice
                this.priceObj.regularPriceExtra$ = this.preStock.regularPriceExtra
                this.priceObj.regularProcessingCharges$ = this.preStock.regularProcessingCharges

                let obj = Object.assign({}, this.priceObj)
                this.bargainPure = obj;
                this.normalPure = obj;
                this.bargainFixed = obj;
                this.normalFixed = obj;
            },
            calculateCostUnitPrice() {
                let result = calculateUtil.divide(this.pkgCost$, this.pkgWeight$)
                if (numberUtil.isNumber(result)) {
                    result = numberUtil.toKeepTwoPlacesOfDecimalAndRound(result)
                } else {
                    result = this.costUnitPrice
                }
                this.costUnitPrice = result
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.initData()
                this.watchFunc()
            });
        }
    }
</script>
