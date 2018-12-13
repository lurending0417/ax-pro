<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed" ref="retailBill" @changeWareBill="changeWareBill"></component>
    </div>
</template>

<script>
    import RetailBillMain from '~/components/retail/offlineRetail/RetailBillMain'
    import RetailBillAdd from '~/components/retail/offlineRetail/RetailBillAdd'
    import { mapGetters, mapMutations } from 'vuex';
    import { TabsEvent } from '../../../components/TabsEvent'

    export default {
        data () {
            return {
                passed: {
                    pass: 'passpass',
                    changeCurrCpn: this.changeCurrCpn,
                    wareBill: {},
                    isFirst: true
                }
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/retailBill', {
                currCpn: 'getCurrCpn',
                getIsFromExchange: 'getIsFromExchange'
            })
        },
        methods: {
            ...mapMutations('retail/offlineRetail/retailBill', {
                resetCurrCpn: 'resetCurrCpn'
            }),
            changeCurrCpn (cpn) {
                this.resetCurrCpn(cpn)
            },
            changeWareBill(wareBill) {
                this.passed.wareBill = wareBill
            }
        },
        mounted() {
            if (!this.getIsFromExchange) {
                this.resetCurrCpn(RetailBillMain)
            } else {
                this.resetCurrCpn(RetailBillAdd)
            }
            TabsEvent.$on('retailBill', () => {
                this.resetCurrCpn(RetailBillMain)
                if (this.$refs.retailBill) {
                    this.$refs.retailBill.$emit('retailBill');
                }
            })
        }
    }
</script>

<style>

</style>
