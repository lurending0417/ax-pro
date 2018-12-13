<template>
    <table class="table table-bordered table-cls">
        <thead>
        <tr>
            <th colspan="14">线下收银单列表</th>
        </tr>
        <tr>
            <th rowspan="2">序号</th>
            <th rowspan="2">日期</th>
            <th rowspan="2">门店</th>
            <th rowspan="2">收银单号</th>
            <th colspan="7">支付方式</th>
            <th rowspan="2">实付汇总</th>
            <th rowspan="2">收银员</th>
            <th rowspan="2">操作</th>
        </tr>
        <tr>
            <th>现金</th>
            <th>POS</th>
            <th>微信</th>
            <th>支付宝</th>
            <th>黄金</th>
            <th>钱包</th>
            <th>找零</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in getPaymentBills">
            <td>{{index + 1}}</td>
            <td>{{item.createTime}}</td>
            <td>{{item.storeName}}</td>
            <td>{{item.billNumber}}</td>
            <td>{{item.paymentOfCash}}</td>
            <td>{{item.paymentOfPos}}</td>
            <td>{{item.paymentOfWeixin}}</td>
            <td>{{item.paymentOfAlipay}}</td>
            <td>{{item.paymentOfGold}}</td>
            <td>{{item.paymentOfWallet}}</td>
            <td>{{item.cashOddChange}}</td>
            <td>{{item.realPrice}}</td>
            <td>{{item.creatorName}}</td>
            <td>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-sm btn-primary'],
                                btnName: '详情'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL+index,
                                modalClasses: ['modal-lg'],
                                titleName: '详情'
                            }">
                    <RetailDetail
                        slot="main"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+index"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :item="item">
                    </RetailDetail>
                </ButtonWithModal>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
    import ButtonWithModal from '~/components/ButtonWithModal'
    import RetailDetail from './RetailDetail'
    import {mapGetters, mapActions} from 'vuex';
    import uuid from 'uuid'
    export default {
        props: ['passed'],
        components: {
            ButtonWithModal,
            RetailDetail
        },
        data() {
            return {
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid()
            }
        },
        computed: {
            ...mapGetters('userManage/userList', {
                customerId: 'getCustomerId'
            }),
            ...mapGetters('retail/offlineRetail/paymentBillMain', {
                getPaymentBills: 'getPaymentBills'
            })
        },
        methods: {
            ...mapActions('retail/offlineRetail/paymentBillMain', {
                apiGetPaymentBill: 'apiGetPaymentBill'
            })
        },
        mounted() {
            this.apiGetPaymentBill({customerId: this.customerId})
        }
    }
</script>

<style scoped>
    .table-cls td,.table-cls th{
        text-align: center;
        vertical-align: middle;
    }
</style>
