<template>
    <div>
        <div class="modal-body">
            <div class="line-cls">
                <KeyValueCom :title="'单号：'" :value="item.billNumber"></KeyValueCom>
                <KeyValueCom :title="'用户手机号码：'" :value="getUserInfo.telephone || '暂无相关信息'"></KeyValueCom>
            </div>
            <div class="line-cls">
                <KeyValueCom :title="'关联单号：'" :value="getBill.billNumber"></KeyValueCom>
                <KeyValueCom :title="'出货门店：'" :value="getBill.storeId"></KeyValueCom>
                <KeyValueCom :title="'出货仓库：'" :value="getBill.wareHouseId"></KeyValueCom>
                <KeyValueCom :title="'销售员：'" :value="getBill.salesmanId"></KeyValueCom>
            </div>
            <!--关联置换单-->
            <div v-if="hasExchangeBill || getHasExchangeBill">
                <div class="hr-line-dashed"></div>
                <div class="line-cls">
                    <KeyValueCom :title="'关联置换单'" :value="''"></KeyValueCom>
                </div>
                <div class="line-cls">
                    <KeyValueCom :title="'单据编号：'" :value="getExchangeBill.billNumber"></KeyValueCom>
                </div>
                <TableCpn
                    :heads="[
                            {propName:'metalId',name:'金属'},
                            {propName:'priceType',name:'计价方式'},
                            {propName:'roughWeight',name:'毛重'},
                            {propName:'depreciationRate',name:'折旧率'},
                            {propName:'netWeight',name:'净重'},
                            {propName:'processingCharges',name:'工费'},
                            {propName:'metalPrice',name:'金价'},
                            {propName:'originalPrice',name:'原价金额'},
                            {propName:'forfeit',name:'其他扣除'},
                            {propName:'totalCost',name:'实付金额'}
                        ]"
                    :items="getExchangeBillItems">
                </TableCpn>
            </div>

            <div class="hr-line-dashed"></div>

            <div v-if="getBillType === 'RETAIL_OUT'">
                <!--零售单-->
                <TableCpn :heads="[
              {propName:'serial',name:'条码'},
              {propName:'categoryId',name:'品类'},
              {propName:'gemId',name:'宝石'},
              {propName:'metalId',name:'金属'},
              {propName:'priceType',name:'计价方式'},
              {propName:'weight',name:'总质量'},
              {propName:'computedProcessingCharges',name:'工费'},
              {propName:'metalPrice',name:'金价'},
              {propName:'retailPrice',name:'原价金额'},
              {propName:'discountRate',name:'折扣比例'},
              {propName:'extraDiscount',name:'其他优惠'},
              {propName:'totalCost',name:'实收金额'},
          ]" :items="getItems">
                </TableCpn>
            </div>
            <div v-else-if="getBillType === 'RECYCLE_IN'">
                <!--回收单-->
                <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>金属</th>
                        <th>计价方式</th>
                        <th>毛重</th>
                        <th>折旧率</th>
                        <th>净重</th>
                        <th>工费（元/克）</th>
                        <th>金价（元/克）</th>
                        <th>其他扣除</th>
                        <th>回收金额</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in getItems">
                        <td class="table-bordered">{{ index + 1 }}</td>
                        <td class="table-bordered">{{item.metalId}}</td>
                        <td class="table-bordered">{{item.priceType}}</td>
                        <td class="table-bordered">{{item.roughWeight}}</td>
                        <td class="table-bordered">
                            {{item.netWeight / item.roughWeight ? item.netWeight / item.roughWeight : 0}}
                        </td>
                        <td class="table-bordered">{{item.netWeight}}</td>
                        <td class="table-bordered">{{item.processingCharges}}</td>
                        <td class="table-bordered">{{item.metalPrice}}</td>
                        <td class="table-bordered">{{item.forfeit}}</td>
                        <td class="table-bordered">{{item.totalCost}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div v-else-if="getBillType === 'RETAIL_REJECT'">
                <!--退货单-->
                <TableCpn
                    :heads="[
                        {propName:'serial',name:'条码'},
                        {propName:'amount',name:'件数'},
                        {propName:'categoryId',name:'品类'},
                        {propName:'gemId',name:'宝石'},
                        {propName:'metalId',name:'金属'},
                        {propName:'priceType',name:'计价方式'},
                        {propName:'weight',name:'总质量'},
                        {propName:'totalCost',name:'原实收金额'},
                        {propName:'refundCost',name:'退款金额'}
                    ]"
                    :items="getItems">
                </TableCpn>
            </div>

            <div class="line-cls">
                <KeyValueCom :title="'原价金额：'" :value="getBill.originalCost"></KeyValueCom>
                <KeyValueCom :title="'减免金额：'" :value="getBill.discountCost"></KeyValueCom>
                <KeyValueCom :title="payMoneyText+'：'" :value="lastPrice"></KeyValueCom>
            </div>

            <div class="hr-line-dashed"></div>

            <div class="line-cls">
                <KeyValueCom :title="'实收'" :value="''"></KeyValueCom>
            </div>
            <div class="line-cls">
                <KeyValueCom :title="'现金：'" :value="getPaymentBillDetail.paymentOfCash"></KeyValueCom>
                <KeyValueCom :title="'POS：'" :value="getPaymentBillDetail.paymentOfPos"></KeyValueCom>
                <KeyValueCom :title="'支付宝：'" :value="getPaymentBillDetail.paymentOfAlipay"></KeyValueCom>
                <KeyValueCom :title="'微信：'" :value="getPaymentBillDetail.paymentOfWeixin"></KeyValueCom>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" style="margin: 10px" class="btn btn-primary" data-dismiss="modal">
                打印票据
            </button>
            <button class="btn btn-success" @click="close">关闭</button>
        </div>

    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import TableCpn from '~/components/Table'
    import KeyValueCom from '~/components/KeyValueCom'
    import PaymentBillMain from '~/components/retail/offlineRetail/PaymentBillMain'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import PrintTemplate from '~/components/storage/stock/PrintTemplate'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'

    export default {
        components: {
            TableCpn,
            KeyValueCom,
            ButtonWithModal,
            PrintTemplate
        },
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'item'],
        data() {
            return {
                hasExchangeBill: false
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/paymentBillAdd', {
                getCanChange: 'getCanChange',
                getUserInfo: 'getUserInfo',
                getBill: 'getBill',
                getBillType: 'getBillType',
                getItems: 'getItems',
                getExchangeBillItems: 'getExchangeBillItems',
                getExchangeBill: 'getExchangeBill',
                getHasExchangeBill: 'getHasExchangeBill',
                getPaymentBillDetail: 'getPaymentBillDetail'
            }),
            payMoneyText() {
                switch (this.getBillType) {
                    case 'RETAIL_OUT' :
                        return '应收金额'
                    case 'RETAIL_REJECT' :
                        return '退款金额'
                    case 'RECYCLE_IN' :
                        return '回收金额'
                }
            },
            lastPrice() {
                switch (this.getBillType) {
                    case 'RETAIL_OUT' :
                        return this.getBill.totalCost
                    case 'RETAIL_REJECT' :
                        return this.getBill.refundCost
                    case 'RECYCLE_IN' :
                        return this.getBill.totalCost
                }
            }
        },
        methods: {
            ...mapMutations('retail/offlineRetail/paymentBillAdd', {
                clearData: 'clearData',
                resetUserInfo: 'resetUserInfo',
                resetCanChange: 'resetCanChange'
            }),
            ...mapActions('retail/offlineRetail/paymentBillAdd', {
                apiGetToPay: 'apiGetToPay',
                apiGetPaymentBillDetail: 'apiGetPaymentBillDetail',
                apiAddPaymentBill: 'apiAddPaymentBill'
            }),
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            },
            // 打印标签
            print(item) {
                console.log('打印标签ing:', item)
                console.log('=====')
            },
            back() {
                this.initData()
                this.passed.changeCurrCpn(PaymentBillMain)
            },
            initData() {
                this.clearData()
                this.resetCanChange(true)
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.apiGetPaymentBillDetail({
                    params: {
                        billId: this.item.id
                    },
                    callback: (data) => {
                        this.resetUserInfo({})
                        if (data.result.tranBill.customerId) {
                            this.resetUserInfo(data.result.tranBill.customer)
                        }
                    }
                })
            })
        }
    }
</script>
<style>
</style>
