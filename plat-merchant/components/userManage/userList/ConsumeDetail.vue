<template>
    <div>
        <div class="modal-body">
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align: center;">
                    质保单
                </div>
                <div class="panel-body">
                    <div class=" line-cls">
                        <KeyValueCom :title="'单号：'" :value="item.billNumber"></KeyValueCom>
                        <KeyValueCom :title="'用户手机号：'" :value="item.customer.telephone"></KeyValueCom>
                    </div>
                    <div class=" line-cls">
                        <KeyValueCom :title="'操作员：'" :value="item.salesmanName"></KeyValueCom>
                        <KeyValueCom :title="'时间：'" :value="item.createTime"></KeyValueCom>
                    </div>
                    <TableCpn :heads="[
                            {propName: 'serial', name: '条码'},
                            {propName: 'amount', name: '件数'},
                            {propName: 'categoryName', name: '品类'},
                            {propName: 'gemName', name: '宝石'},
                            {propName: 'metalName', name: '金属'},
                            {propName: 'weight', name: '总质量'},
                            {propName: 'totalCost', name: '实收金额'},
                            {propName: 'remark', name: '备注'},
                            {tag:'BUTTON',name:'操作'}
                        ]" :items="getWarrantyBillItemList">
                        <div v-for="(i,index) in getWarrantyBillItemList" :slot="'BUTTON'+index">
                            <ButtonWithModal
                                :btnProps="{
                                btnClasses: ['btn btn-sm btn-default'],
                                btnName: '参数'
                            }"
                                :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL_1,
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL_1+index,
                                modalClasses: ['modal-lg'],
                                titleName: '参数'
                            }">
                                <leaseStorageParams
                                    slot="main"
                                    :CONST_CLICK_MODAL="CONST_CLICK_MODAL_1+index"
                                    :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL_1"
                                    :params="i"
                                >
                                </leaseStorageParams>
                            </ButtonWithModal>
                        </div>
                    </TableCpn>
                    <div class=" line-cls">
                        <KeyValueCom :title="'合计：'" :value="''"></KeyValueCom>
                        <KeyValueCom :title="'件数：'" :value="computedAmount"></KeyValueCom>
                        <KeyValueCom :title="'总质量：'" :value="computedWeight"></KeyValueCom>
                        <KeyValueCom :title="'实收金额：'" :value="computedPay"></KeyValueCom>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-success" @click="close">关闭</button>
        </div>
    </div>
</template>

<script>
    import KeyValueCom from '~/components/KeyValueCom'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import leaseStorageParams from '~/components/storage/wearGoods/leaseStorageParams';
    import ButtonWithModal from '~/components/ButtonWithModal'
    import TableCpn from '~/components/Table';
    import {mapActions, mapGetters} from 'vuex'
    import uuid from 'uuid'
    export default {
        components: {
            KeyValueCom,
            ButtonWithModal,
            leaseStorageParams,
            TableCpn
        },
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'item'],
        data() {
            return {
                CONST_CLICK_MODAL_1: uuid(),
                CONST_CLOSE_MODAL_1: uuid()
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/warrantyBillMain', {
                getWarrantyBillItemList: 'getWarrantyBillItemList'
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
            ...mapActions('retail/offlineRetail/warrantyBillMain', {
                apiGetWarrantyBillItem: 'apiGetWarrantyBillItem'
            }),
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            },
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
                            if (item.weight) {
                                weight += item.weight;
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
                            if (item.totalCost) {
                                pay += item.totalCost;
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
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                console.log(this.item)
                this.apiGetWarrantyBillItem({
                    params: {
                        billId: this.item.id
                    },
                    callBack: () => {}
                })
            })
        }
    }
</script>

<style scoped>
    .line-cls{
        text-align: left;
        margin-bottom: 10px;
    }
</style>
