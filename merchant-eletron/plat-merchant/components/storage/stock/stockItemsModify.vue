<template>
    <div>
        <div class="modal-body">
            <fieldset :disabled="pageReadOnly">
                <legend>基本信息修改</legend>
                <div class="form-inline" style="text-align: left; padding-left: 20px;">
                    <div class="form-group form-group-margin">
                        <label>供货商：</label>
                        <select class="form-control" v-model="basic.vendorId">
                            <option v-for="item in vendors" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>素金/非素：</label>
                        <select class="form-control" v-model="basic.wareType">
                            <option v-for="item in wareTypes" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>宝石：</label>
                        <select class="form-control" v-model="basic.gemId">
                            <option v-for="item in gems" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>金属：</label>
                        <select class="form-control" v-model="basic.metalId">
                            <option v-for="item in metals" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>品类：</label>
                        <select class="form-control" v-model="basic.categoryId">
                            <option v-for="item in categorys" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>工艺：</label>
                        <select class="form-control" v-model="basic.craftId">
                            <option v-for="item in crafts" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>版号：</label>
                        <input type="text" class="form-control max_width" v-model="basic.modelCode"/>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>寓意名：</label>
                        <input type="text" class="form-control max_width" v-model="basic.moralName"/>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>重量：</label>
                        <input type="text" class="form-control max_width" v-model="basic.weight"/>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>总质量备注：</label>
                        <input type="text" class="form-control max_width" v-model="basic.weightRemark"/>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>宝石质量：</label>
                        <input type="text" class="form-control max_width" v-model="basic.mainGemWeight"/>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>宝石数量：</label>
                        <input type="text" class="form-control max_width" v-model="basic.mainGemAmount"/>
                    </div>
                    <div class="form-group form-group-margin ">
                        <label>价格：</label>
                        <input type="text" class="form-control max_width" v-model="basic.retailPrice"/>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>工费：</label>
                        <input type="text" class="form-control max_width" v-model="basic.processingCharges"/>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>精品/普货：</label>
                        <select class="form-control" v-model="basic.processingType">
                            <option v-for="item in processingTypes" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>是否特价商品：</label>
                        <select class="form-control" v-model="basic.bargainPrice">
                            <option :value="true">是</option>
                            <option :value="false">否</option>
                        </select>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>计价方式：</label>
                        <select class="form-control" v-model="basic.priceType">
                            <option v-for="item in priceTypes" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>重量单位：</label>
                        <select class="form-control" v-model="basic.weightUnit">
                            <option v-for="item in weightUnits" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend>商品参数信息修改</legend>
                <div>
                    <div v-if="categoryParams.props && categoryParams.props.length > 0">
                        <fieldset>
                            <legend>{{categoryParams.name}}</legend>
                            <div v-for="props in categoryParams.props" class="form-group" style="padding: 7px" v-if="!props.isNotShow">
                                <label class="control-label form-control-static col-md-2">{{props.name}}</label>
                                <div class="form-control-static col-md-10" style="text-align: left">
                                <span v-for="(value, index) in props.preValues" class="normal m-r">
                                    <span v-if="props.inputType === 'INPUT'">
                                        <input type="text" :name="props.id" :placeholder="value"
                                               v-model="props.gettedValue" :disabled="pageReadOnly || props.disabled"
                                        />
                                    </span>
                                    <span v-else-if="props.inputType === 'RADIO'">
                                        <input type="radio" v-bind:value="value" v-model="props.gettedValue" :name="props.id" :key="index"
                                               :disabled="pageReadOnly || props.disabled"
                                        />{{value}}
                                    </span>
                                    <span v-else-if="props.inputType === 'CHECKBOX'">
                                        <input type="checkbox" :name="props.id" v-bind:value="value" v-model="props.gettedValue"
                                               :disabled="pageReadOnly || props.disabled"
                                        />{{value}}
                                    </span>
                                </span>
                                    <span v-if="!props.preValues">
                                    <span v-if="props.inputType === 'INPUT'">
                                        <input type="text" :name="props.id" v-model="props.gettedValue" :disabled="pageReadOnly || props.disabled"/>
                                    </span>
                                </span>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div v-if="gemParams.props && gemParams.props.length > 0">
                        <fieldset>
                            <legend>{{gemParams.name}}</legend>
                            <div v-for="props in gemParams.props" class="form-group" style="padding: 7px" v-if="!props.isNotShow">
                                <label class="control-label form-control-static col-md-2">{{props.name}}</label>
                                <div class="form-control-static col-md-10" style="text-align: left">
                                <span v-for="(value, index) in props.preValues" class="normal m-r">
                                    <span v-if="props.inputType === 'INPUT'">
                                        <input type="text" :name="props.id" :placeholder="value" v-model="props.gettedValue"
                                               :disabled="pageReadOnly || props.disabled"
                                        />
                                    </span>
                                    <span v-else-if="props.inputType === 'RADIO'">
                                        <input type="radio" v-bind:value="value" v-model="props.gettedValue" :name="props.id" :key="index"
                                               :disabled="pageReadOnly || props.disabled"
                                        />{{value}}
                                    </span>
                                    <span v-else-if="props.inputType === 'CHECKBOX'">
                                        <input type="checkbox" :name="props.id" v-bind:value="value" v-model="props.gettedValue"
                                               :disabled="pageReadOnly || props.disabled"
                                        />{{value}}
                                    </span>
                                </span>
                                    <span v-if="!props.preValues">
                                    <span v-if="props.inputType === 'INPUT'">
                                        <input type="text" :name="props.id" v-model="props.gettedValue"
                                               :disabled="pageReadOnly || props.disabled"/>
                                    </span>
                                </span>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div v-if="metalParams.props && metalParams.props.length > 0">
                        <fieldset>
                            <legend>{{metalParams.name}}</legend>
                            <div v-for="props in metalParams.props" class="form-group" style="padding: 7px" v-if="!props.isNotShow">
                                <label class="control-label form-control-static col-md-2">{{props.name}}</label>
                                <div class="form-control-static col-md-10" style="text-align: left">
                                <span v-for="(value, index) in props.preValues" class="normal m-r">
                                    <span v-if="props.inputType === 'INPUT'">
                                        <input type="text" :name="props.id" :placeholder="value" v-model="props.gettedValue"
                                               :disabled="pageReadOnly || props.disabled"/>
                                    </span>
                                    <span v-else-if="props.inputType === 'RADIO'">
                                        <input type="radio" v-bind:value="value" v-model="props.gettedValue" :name="props.id" :key="index"
                                               :disabled="pageReadOnly || props.disabled"
                                        />{{value}}
                                    </span>
                                    <span v-else-if="props.inputType === 'CHECKBOX'">
                                        <input type="checkbox" :name="props.id" v-bind:value="value" v-model="props.gettedValue"
                                               :disabled="pageReadOnly || props.disabled"
                                        />{{value}}
                                    </span>
                                </span>
                                    <span v-if="!props.preValues">
                                    <span v-if="props.inputType === 'INPUT'">
                                        <input type="text" :name="props.id" v-model="props.gettedValue"
                                               :disabled="pageReadOnly || props.disabled"/>
                                    </span>
                                </span>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </fieldset>
        </div>

        <div class="modal-footer">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-default" data-dismiss="modal" @click="closeModal('addModal')">关闭
            </button>
            <button type="button" class="btn btn-primary" @click="clickPutParams" v-if="!pageReadOnly">保存</button>
        </div>
    </div>
</template>

<script>
    import { mapMutations, mapActions, mapGetters } from 'vuex'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import TableCpn from '~/components/Table'
    import ParamItemGroup from '~/components/ParamItemGroup'
    import {baseUtil, objectUtil, constUtil} from '~/util'

    export default {
        components: {
            TableCpn,
            ParamItemGroup
        },
        props: ['item', 'CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'index', 'refreshTable', 'pageReadOnly'],
        data () {
            return {
                isShow: false,
                params: {
                    storageId: '',
                    propsId: []
                },
                basic: {
                    storageId: '',
                    vendorId: '',
                    wareType: '',
                    metalId: '',
                    gemId: '',
                    categoryId: '',
                    craftId: '',
                    modelCode: '',
                    moralName: '',
                    weightUnit: '',
                    weight: '',
                    mainGemWeight: '',
                    mainGemAmount: '',
                    priceType: '',
                    processingType: '',
                    bargainPrice: '',
                    retailPriceAlgorithm: '',
                    retailPrice: '',
                    processingCharges: ''
                },
                storageItem: {}, // 当前item
                wareTypes: [],
                vendors: [], // 供货商
                processingTypes: [],
                metals: [],
                gems: [],
                categorys: [],
                crafts: [],
                weightUnits: [],
                priceTypes: [],
                metalParams: [],
                categoryParams: [],
                gemParams: []
            }
        },
        computed: {
            ...mapGetters('storage/wearStorage/leaseStorageParams', {
                getStockItemParams: 'getStockItemParams',
                getCategoryParams: 'getCategoryParams',
                getGemParams: 'getGemParams',
                getMetalParams: 'getMetalParams'
            })
        },
        methods: {
            ...mapMutations('storage/wearStorage/leaseStorageParams', {
                resetCategoryParams: 'resetCategoryParams',
                resetGemParams: 'resetGemParams',
                resetMetalParams: 'resetMetalParams'
            }),
            ...mapActions('storage/wearStorage/leaseStorageParams', {
                apiGetStockItemParams: 'apiGetStockItemParams',
                apiPutStorageParams: 'apiPutStorageParams',
                apiPutStockItemParams: 'apiPutStockItemParams'
            }),
            ...mapActions('storage/wearStorage/wearGoodsMain', {
                apiLeaseConfigModify: 'apiLeaseConfigModify'
            }),
            ...mapActions('storage/wearStorage/leaseManageMain', {
                apiPutGoodsStorage: 'apiPutGoodsStorage'
            }),
            ...mapActions('storage/stock/stockItemsParams', {
                apiPutStockItemParams: 'apiPutStockItemParams',
                apiGetStockItemParams_1: 'apiGetStockItemParams_1'
            }),
            closeModal (name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
            },
            modifyParams() {
                let props = this.handleParams(this.getCategoryParams).concat(this.handleParams(this.getGemParams), this.handleParams(this.getMetalParams))
                this.apiPutStockItemParams({
                    storageId: this.item.id,
                    props: JSON.stringify(props),
                    callback: () => {
                        ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                        this.refreshTable()
                    }
                })
            },
            handleParams(obj) {
                let arr = []
                if (obj.props && obj.props.length > 0) {
                    obj.props.forEach(item => {
                        if (item.gettedValue) {
                            if (item.gettedValue instanceof Array) {
                                console.log('item.gettedValue', item.gettedValue.length, item.gettedValue);
                                item.gettedValue = item.gettedValue.join()
                            }
                            arr.push({
                                fieldId: item.id,
                                value: item.gettedValue
                            });
                        }
                    })
                }
                console.log('arr', arr);
                return arr
            },
            modifyStorageConfig() {
                let vm = this;
                this.basic.storageId = this.item.id;
                this.apiPutGoodsStorage({
                    params: this.basic,
                    callBack: () => {
                        vm.modifyParams()
                    }
                });
            },
            initBasic() {
                objectUtil.replaceSameFieldsValue_2(this.item, this.basic);
            },
            initProps() {
                let curItem = this.item
                let gettedArr = []
                this.storageItem.forEach(item => {
                    gettedArr.push({
                        fieldId: item.fieldId,
                        value: item.fieldValue
                    });
                })
                if (curItem.categoryId) {
                    this.resetCategoryParams({
                        categoryId: curItem.categoryId,
                        gettedArr
                    })
                }
                if (curItem.metalId) {
                    this.resetMetalParams({
                        metalId: curItem.metalId,
                        gettedArr
                    })
                }
                if (curItem.gemId) {
                    this.resetGemParams({
                        gemId: curItem.gemId,
                        gettedArr
                    })
                }
            },
            initData () {
                this.initBasic()
                this.initProps()
                this.metalParams = this.getMetalParams;
                this.categoryParams = this.getCategoryParams;
                this.gemParams = this.getGemParams;
            },
            initArr() {
                this.wareTypes = baseUtil.getEnumsByKey('wareType')
                this.vendors = baseUtil.getMetadataVendors({enabled: true})
                this.processingTypes = constUtil._CONST_PROCESSING_TYPE
                this.weightUnits = baseUtil.getEnumsByKey('weightUnit')
                this.priceTypes = baseUtil.getEnumsByKey('priceType')
                this.metals = baseUtil.getMetadataArrFromKey('metal')
                this.gems = baseUtil.getMetadataArrFromKey('gem')
                this.categorys = baseUtil.getMetadataArrFromKey('category')
                this.crafts = baseUtil.getMetadataArrFromKey('craft')
            },
            clickPutParams() {
                this.modifyStorageConfig();
            }
        },
        beforeMount () {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.apiGetStockItemParams_1({
                    storageId: this.item.id,
                    callBack: data => {
                        this.storageItem = data.rows
                        this.initArr()
                        this.initData()
                    }
                })
            })
        }
    }
</script>

<style>
    .max_width{
        max-width: 100px;
    }
    input[type=text]::-webkit-input-placeholder{
        color:#abacad;
    }
</style>
