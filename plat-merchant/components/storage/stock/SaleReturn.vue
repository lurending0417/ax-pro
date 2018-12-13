<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed" ref="saleReturn"></component>
    </div>
</template>

<script>
    import SaleReturnMain from '~/components/storage/stock/SaleReturnMain'
    // import { TabsEvent } from '../../../components/TabsEvent'

    export default {
        components: {
            SaleReturnMain
        },
        data() {
            return {
                currCpn: null,
                passed: {
                    pass: 'passpass',
                    changeCurrCpn: this.changeCurrCpn,
                    canChange: true
                }
            }
        },
        methods: {
            changeCurrCpn(cpn) {
                this.currCpn = cpn
            }
        },
        mounted() {
            this.$on('init', () => {
                this.currCpn = SaleReturnMain
                if (this.$refs.saleReturn) {
                    this.$refs.saleReturn.$emit('init')
                }
            });
        }
    }
</script>

<style>

</style>
