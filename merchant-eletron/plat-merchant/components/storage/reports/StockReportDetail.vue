<template>
    <div>
        <div class="modal-body">
            <div class="form-inline">
                <div class="form-group form-group-margin">
                    <label>当前门店：</label><label>{{parentParams.item.storeName}}</label>
                </div>
                <div class="form-group form-group-margin">
                    <label>当前仓库：</label><label>{{parentParams.item.wareHouseName}}</label>
                </div>
            </div>
            <div v-if="type=== 'IN' || type=== 'OUT'" class="form-inline">
                <SelectItem v-model="form.billType" :selectTitle="type === 'IN'?'入库类型':'出库类型'"
                            :selectItems="billTypes"></SelectItem>
                <SelectItem v-model="form.stockType" selectTitle="买/借" :selectItems="stockTypes"></SelectItem>
                <SelectItem v-model="form.vendorId" selectTitle="供货商" :selectItems="vendors"></SelectItem>
            </div>
            <TableCpn :heads="heads" :items="tableView"> </TableCpn>
            <div class="form-inline" style="text-align: left; padding-left: 20px;">
                <div class="form-group form-group-margin">
                    <label>数量：</label><label>{{getSumTotal.changeAmount}}</label>
                </div>
                <div class="form-group form-group-margin">
                    <label>总质量：</label><label>{{getSumTotal.weight}}</label>
                </div>
                <div class="form-group form-group-margin">
                    <label>原价：</label><label>{{getSumTotal.regularPrice}}</label>
                </div>
                <div class="form-group form-group-margin">
                    <label>优惠价：</label><label>{{getSumTotal.retailPrice}}</label>
                </div>
                <div class="form-group form-group-margin">
                    <label>工费：</label><label>{{getSumTotal.computedProcessingCharges}}</label>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="back">返回</button>
        </div>
    </div>
</template>
<script>
    import SelectItem from '~/components/SelectItem'
    import TableCpn from '~/components/Table'
    import {baseUtil, constUtil, dateUtil, componentUtil} from '~/util'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import api from '~/api'

    export default {
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'type'],
        components: {
            SelectItem,
            TableCpn
        },
        data() {
            return {
                parentParams: {
                    item: {
                        storeName: '',
                        wareHouseName: ''
                    }
                },
                tableView: [],
                billTypes: [],
                stockTypes: [],
                heads: [],
                vendors: [],
                form: {
                    billType: '',
                    stockType: '',
                    vendorId: ''
                },
                getSumTotal: {
                    weight: 0,
                    changeAmount: 0,
                    regularPrice: 0,
                    retailPrice: 0,
                    computedProcessingCharges: 0
                }
            }
        },
        methods: {
            back() {
                ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            },
            initData() {
                this.heads = [
                    {propName: 'createTime', name: '日期'},
                    {propName: 'serial', name: '条码'},
                    {propName: 'stockTypeName', name: '买/借'},
                    {propName: 'vendorName', name: '供货商'},
                    {propName: 'changeAmount', name: '数量'},
                    {propName: 'metalName', name: '金属'},
                    {propName: 'gemName', name: '宝石'},
                    {propName: 'categoryName', name: '品类'},
                    {propName: 'weight', name: '总质量', unit: 'g'},
                    {propName: 'regularPrice', name: '原价', unit: '元'},
                    {propName: 'retailPrice', name: '优惠价', unit: '元'},
                    {propName: 'computedProcessingCharges', name: '工费', unit: '元'}
                ];
                this.vendors = baseUtil.getMetadataVendors()
                this.billTypes = componentUtil.getStockTypeByIN(this.type === 'IN')
                this.stockTypes = constUtil._CONST_WARE_GETTYPE_ID
                if (this.type === 'IN') {
                    this.heads.splice(2, 0, {propName: 'billTypeName', name: '入库类型'})
                } else if (this.type === 'OUT') {
                    this.heads.splice(2, 0, {propName: 'billTypeName', name: '出库类型'})
                }
                this.form = {
                    billType: '',
                    stockType: '',
                    vendorId: ''
                }
            },
            search(obj) {
                let {form, item} = obj
                form.wareHouseId = item.wareHouseId
                delete form.storeId
                api.request({
                    url: api.consts._REPORT_STORAGE_CHECKOUT_DETAIL,
                    params: {
                        ...form,
                        ...this.form,
                        type: this.type
                    },
                    success: (data) => {
                        this.tableView = data.rows.map((item, index) => {
                            item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                            if (item.stockType) {
                                item.stockTypeName = this.stockTypes.filter(ele => ele.id === item.stockType)[0].name
                            }
                            if (item.billType) {
                                item.billTypeName = this.billTypes.filter(ele => ele.id === item.billType)[0].name
                            }
                            return item
                        })
                        this.getSumTotal = data.sum.total
                    }
                })
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, (obj) => {
                this.parentParams = obj
                this.initData()
            })
            this.$watch('form', function (val) {
                this.search(this.parentParams)
            }, {deep: true})
        }
    }
</script>
