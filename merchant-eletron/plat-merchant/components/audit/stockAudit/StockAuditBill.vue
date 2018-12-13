<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed"></component>
    </div>
</template>

<script>
    import StockAuditBillMain from '~/components/audit/stockAudit/StockAuditBillMain';
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        components: {
            StockAuditBillMain
        },
        data() {
            return {
                passed: {
                    pass: 'passpass',
                    changeCurrCpn: this.changeCurrCpn
                }
            }
        },
        computed: {
            ...mapGetters('audit/stockAudit/stockAuditBill', {
                currCpn: 'getCurrCpn'
            })
        },
        methods: {
            ...mapMutations('audit/stockAudit/stockAuditBill', {
                resetCurrCpn: 'resetCurrCpn'
            }),
            changeCurrCpn(cpn) {
                this.resetCurrCpn(cpn)
            }
        },
        mounted () {
            this.resetCurrCpn(StockAuditBillMain)
        }
    }
</script>

<style>

</style>
