<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed" ref="paymentBill"></component>
    </div>
</template>

<script>
    import PaymentBillMain from '~/components/retail/offlineRetail/PaymentBillMain'
    import { TabsEvent } from '../../../components/TabsEvent'
    import PaymentBillAdd from '~/components/retail/offlineRetail/PaymentBillAdd'
    import { ChangeTabEvent } from '~/components/ChangeTabEvent'

    export default {
        components: {
            PaymentBillMain
        },
        data () {
            return {
                currCpn: null,
                passed: {
                    pass: 'passpass',
                    changeCurrCpn: this.changeCurrCpn,
                    billId: null,
                    isFirst: true
                }
            }
        },
        methods: {
            changeCurrCpn (cpn) {
                this.currCpn = cpn
            }
        },
        beforeMount () {
            TabsEvent.$off('paymentBill');
            TabsEvent.$on('paymentBill', () => {
                this.currCpn = PaymentBillMain
                if (this.$refs.paymentBill) {
                    this.$refs.paymentBill.$emit('paymentBill');
                }
            });
            // 接收从其他页面直接通过按钮直接跳转到 新增收银单页面 的广播事件
            console.log('@@@ PaymentBill beforeMount');
            ChangeTabEvent.$off('JUMP_TO_PAYMENT_ADD')
            ChangeTabEvent.$on('JUMP_TO_PAYMENT_ADD', (billId) => {
                console.log('跳转收银，JUMP_TO_PAYMENT_ADD', billId)
                this.changeCurrCpn(PaymentBillAdd)
                // 清除 新增收银页面 已有数据，并填写新增收银的单号查询数据
                this.passed.billId = billId
                ChangeTabEvent.$emit('JUMP_TO_PAYMENT_ADD_SEARCH', billId)
            })
        }
    }
</script>

<style>

</style>
