<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed"></component>
    </div>
</template>

<script>
    import SaleReturnAuditBillMain from '~/components/audit/stockAudit/SaleReturnAuditBillMain';

    export default {
        components: {
            SaleReturnAuditBillMain
        },
        data () {
            return {
                currCpn: SaleReturnAuditBillMain,
                passed: {
                    pass: 'passpass',
                    changeCurrCpn: this.changeCurrCpn,
                    canChange: true
                }
            }
        },
        methods: {
            changeCurrCpn (cpn) {
                this.currCpn = cpn
            }
        },
        beforeMount() {
            this.currCpn = SaleReturnAuditBillMain
        }
    }
</script>

<style>

</style>
