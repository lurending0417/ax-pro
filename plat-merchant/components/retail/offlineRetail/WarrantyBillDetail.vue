<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <label>单号：</label>{{getWarrantyBillItem.billNumber}}
            </div>
            <div class="form-group form-group-margin">
                <label>时间</label>{{getWarrantyBillItem.createTime}}
            </div>
            <div class="form-group form-group-margin">
                <label>操作员：</label>{{getWarrantyBillItem.salesmanName}}
            </div>
        </div>

        <fieldset style="width: 60%" v-if="getWarrantyBillItem.customer">
            <legend>客户信息</legend>
            <div class="form-inline" style="margin-bottom: 15px">
                <label class="label label-default m-l-xs" style="margin: 15px">客户昵称：{{ getWarrantyBillItem.customer.nickName }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">手机号码：{{ getWarrantyBillItem.customer.telephone }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">注册日期：{{ getWarrantyBillItem.customer.createTime }}</label>
            </div>
        </fieldset>

        <TableCpn :heads="[
                    {propName:'serial',name:'条码'},
                    {propName:'amount',name:'件数'},
                    {propName:'categoryName',name:'品类'},
                    {propName:'gemName',name:'宝石'},
                    {propName:'metalName',name:'金属'},
                    {propName:'weight',name:'总质量'},
                    {propName:'totalCost',name:'实收金额'},
                    {propName:'remark',name:'备注'},
                    {tag:'BUTTON',name:'操作'}
                    ]"
                  :items="getWarrantyBillItemList">
            <div v-for="(item,index) in getWarrantyBillItemList" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-sm btn-default'],
                                btnName: '参数'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL+index,
                                modalClasses: ['modal-lg'],
                                titleName: '参数'
                            }">
                    <leaseStorageParams
                        slot="main"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+index"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :params="item"
                    >
                    </leaseStorageParams>
                </ButtonWithModal>
            </div>
        </TableCpn>

        <div class="row">
            <div class="col-md-2">
                <label>&nbsp;&nbsp;件数：</label>
                <label>{{computedAmount}}</label>
            </div>
            <div class="col-md-2">
                <label>&nbsp;&nbsp;总质量：</label>
                <label>{{computedWeight}}</label>
            </div>
            <div class="col-md-2">
                <label>&nbsp;&nbsp;实收金额：</label>
                <label>{{computedPay}}</label>
            </div>
            <div class="col-md-3" style=""></div>
            <div class="col-md-3" style="text-align: right">
                <button type="button" class="btn btn-sm btn-default" @click="clickBack">返回</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import {baseUtil} from '~/util';
    import TableCpn from '~/components/Table';
    import leaseStorageParams from '~/components/storage/wearGoods/leaseStorageParams';
    import uuid from 'uuid';
    import WarrantyBillMain from '~/components/retail/offlineRetail/WarrantyBillMain';
    import ButtonWithModal from '~/components/ButtonWithModal';

    export default {
        props: ['passed'],
        components: {
            TableCpn,
            leaseStorageParams,
            ButtonWithModal
        },
        data() {
            return {
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid()
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/warrantyBillMain', {
                getWarrantyBillItemList: 'getWarrantyBillItemList',
                getWarrantyBillItem: 'getWarrantyBillItem'
            }),
            computedAmount() {
                return this.computedFunc('amount')
            },
            computedWeight() {
                return this.computedFunc('weight')
            },
            computedPay() {
                return this.computedFunc('pay')
            }
        },
        methods: {
            ...mapActions('retail/offlineRetail/retailBillAdd', {
                apiGetUser: 'apiGetUser'
            }),
            computedFunc(tag) {
                let amount = 0;
                let weight = 0;
                let pay = 0;
                for (let i = 0, j = this.getWarrantyBillItemList.length; i < j; i++) {
                    let item = this.getWarrantyBillItemList[i]
                    switch (tag) {
                        case 'amount':
                        {
                            amount += item.amount;
                            if (i === j - 1) {
                                return amount;
                            }
                            break
                        }
                        case 'weight':
                        {
                            if (item.totalWeight) {
                                weight += item.totalWeight;
                                if (i === j - 1) {
                                    return weight
                                }
                            } else {
                                return 0
                            }
                            break
                        }
                        case 'pay':
                        {
                            if (item.acturePay) {
                                pay += item.acturePay;
                                if (i === j - 1) {
                                    return pay
                                }
                            } else {
                                return 0
                            }
                            break
                        }
                    }
                }
            },
            clickBack() {
                this.passed.changeCurrCpn(WarrantyBillMain)
            },
            initData() {
                this.salesmanId = this.staffs[0].id
            },
            initArr() {
                this.staffs = baseUtil.getStaffsInDesignStoreByStoreId()
                this.getCategoryArr = baseUtil.getMetadataCategory()
                this.getMetalArr = baseUtil.getMetadataMetal()
                this.getGemArr = baseUtil.getMetadataGem()
            }
        },
        mounted() {
            if (this.gettedWarrantyBillAdd && this.gettedWarrantyBillAdd.length > 0) {
                this.warrantyBillAdd = this.gettedWarrantyBillAdd
            }
            this.initArr()
            this.initData()
        }
    }
</script>

<style scoped>
    .red {
        background: #ec475873;
    }
</style>
