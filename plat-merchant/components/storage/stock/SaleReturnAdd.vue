<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <label>单号：</label>{{ getSaleReturnBill.billNumber }}
            </div>
            <div class="form-group form-group-margin">
                <label>供货商：</label>{{ getSaleReturnBill.vendorId }}
            </div>
        </div>
        <div class="row">
            <div class="col-md-3">
                <input v-if="passed.canChange" type="text" class="form-control" v-model="serial$" placeholder=""
                       @keydown.enter="addSaleReturnItem()" ref="serial"
                />
            </div>
            <div class="col-md-1">
                <button v-if="passed.canChange" type="button" class="btn btn-w-m btn-info" style="min-width: 80px;"
                        @click="addSaleReturnItem">
                    搜索添加
                </button>
            </div>
            <div class="col-md-8" style="text-align: right">
                <ButtonWithModal
                    v-if="passed.canChange"
                    :btnProps="{
                                btnClasses: ['btn btn-success'],
                                btnStyle: {margin: 10+'px'},
                                btnName: '导入入库单'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                                titleName: '导入入库单',
                                modalClasses: ['modal-lg']
                            }">
                    <SaleReturnImport
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                        :params="'test'"></SaleReturnImport>
                </ButtonWithModal>
                <button type="button" class="btn btn-warning" style="margin-right: 10px;">导出成EXCEL</button>
            </div>
        </div>

        <TableCpn :heads="[
                    {propName:'serial',name:'条码'},
                    {propName:'amount',name:'数量'},
                    {propName:'categoryId',name:'品类'},
                    {propName:'moralName',name:'寓意名'},
                    {propName:'modelCode',name:'版号'},
                    {propName:'gemId',name:'宝石'},
                    {propName:'metalId',name:'金属'},
                    {propName:'craftId',name:'工艺'},
                    {propName:'weight',name:'总质量', unit: 'g'},
                    {propName:'costPrice',name:'成本价', unit: '元'},
                    {propName:'regularPrice',name:'原价', unit: '元'},
                    {propName:'computedProcessingCharges',name:'工费', unit: '元/件'},
                    {tag:'BUTTON',name:'操作'}
                ]" :items="getSaleReturnBillItems">

            <div v-for="(item,index) in getSaleReturnBillItems" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-default btn-sm'],
                                btnName: '详情'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'detail'+index,
                                titleName: '商品详情',
                                modalClasses: ['modal-lg']
                            }">
                    <StockItemsParams slot="main"
                                      :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                      :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'detail'+index"
                                      :item="item"
                                      :canChange="false">
                    </StockItemsParams>
                </ButtonWithModal>
                <button v-if="passed.canChange" type="button" class="btn btn-sm btn-default"
                        @click="deleteSaleReturnItem(item)">删除
                </button>
            </div>
        </TableCpn>

        <div class="form-inline" style="display: flex;justify-content: space-between;">
            <div>
                <div class="form-group form-group-margin">
                    <strong>总件数：</strong><label>{{ totalAmount }}</label>
                </div>
                <div class="form-group form-group-margin">
                    <strong>总质量：</strong><label>{{ totalWeight }}g</label>
                </div>
                <div class="form-group form-group-margin">
                    <strong>总成本：</strong><label>{{ totalCostPrice }}元</label>
                </div>
                <div class="form-group form-group-margin">
                    <strong>总价格：</strong><label>{{ totalRegularPrice }}元</label>
                </div>
                <div class="form-group form-group-margin">
                    <strong>总工费：</strong><label>{{ totalProcessCharging }}元</label>
                </div>
            </div>
            <div>
                <div class="form-group form-group-margin" v-if="passed.canChange" >
                    <button type="button" class="btn btn-info" style="margin-right: 10px" @click="submitReturnBill">
                        提交
                    </button>
                    <button type="button" class="btn btn-success" @click="back">保存并返回</button>
                </div>
                <div class="form-group form-group-margin" v-else >
                    <button type="button" class="btn btn-info" style="margin-right: 10px" @click="submitReturnBill">
                        提交
                    </button>
                    <button type="button" class="btn btn-success" @click="back">返回</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
    import TableCpn from '~/components/Table'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import StockItemsParams from '~/components/storage/stock/StockItemsParams'
    import SaleReturnImport from '~/components/storage/stock/SaleReturnImport'
    import SaleReturnMain from '~/components/storage/stock/SaleReturnMain'
    import uuid from 'uuid'

    export default {
        props: ['passed'],
        components: {
            TableCpn,
            ButtonWithModal,
            StockItemsParams,
            SaleReturnImport
        },
        data () {
            return {
                saleReturnItem: [],
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                serial$: ''
            }
        },
        watch: {},
        computed: {
            ...mapState('storage/stock/saleReturnAdd', {
                totalAmount: 'totalAmount',
                totalWeight: 'totalWeight',
                totalRegularPrice: 'totalRegularPrice',
                totalProcessCharging: 'totalProcessCharging',
                totalCostPrice: 'totalCostPrice'
            }),
            ...mapGetters('storage/stock/saleReturnAdd', {
                getSaleReturnBill: 'getSaleReturnBill',
                getSaleReturnBillItems: 'getSaleReturnBillItems'
            })
        },
        methods: {
            ...mapMutations('storage/stock/saleReturnAdd', {
                clearData: 'clearData'
            }),
            ...mapActions('storage/stock/saleReturnAdd', {
                apiAddSaleReturnItem: 'apiAddSaleReturnItem',
                apiGetSaleReturnItem: 'apiGetSaleReturnItem',
                apiDeleteSaleReturnItem: 'apiDeleteSaleReturnItem',
                apiSubmitSaleReturnItem: 'apiSubmitSaleReturnItem'
            }),
            addSaleReturnItem () {
                this.apiAddSaleReturnItem({
                    params: {
                        billId: this.getSaleReturnBill.id,
                        serial: this.serial$,
                        amount: 1
                    },
                    callback: () => {
                        this.apiGetSaleReturnItem({
                            params: {
                                billId: this.getSaleReturnBill.id
                            },
                            callback: () => {}
                        })
                    }
                })
                this.$refs.serial.select()
            },
            deleteSaleReturnItem (item) {
                this.apiDeleteSaleReturnItem({
                    params: {
                        billId: this.getSaleReturnBill.id,
                        itemId: item.id
                    },
                    callback: () => {}
                })
            },
            submitReturnBill () {
                this.apiSubmitSaleReturnItem({
                    params: {
                        billId: this.getSaleReturnBill.id
                    },
                    callback: () => {
                        this.back()
                    }
                })
            },
            back () {
                this.passed.changeCurrCpn(SaleReturnMain)
            }
        },
        mounted () {
            this.clearData()
            if (!this.passed.canChange) {
                this.apiGetSaleReturnItem({
                    params: {
                        billId: this.getSaleReturnBill.id
                    },
                    callback: () => {}
                })
            }
        }
    }
</script>
