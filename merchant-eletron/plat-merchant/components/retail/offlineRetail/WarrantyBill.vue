<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed" ref="warrantyBill"></component>
    </div>
</template>

<script>
    import WarrantyBillMain from '~/components/retail/offlineRetail/WarrantyBillMain'

    export default {
        props: ['index'],
        components: {
            WarrantyBillMain
        },
        data () {
            return {
                currCpn: null,
                passed: {
                    pass: 'passpass',
                    changeCurrCpn: this.changeCurrCpn
                }
            }
        },
        methods: {
            changeCurrCpn (cpn) {
                this.currCpn = cpn
            }
        },
        mounted() {
            if (this.index === 0) {
                this.currCpn = WarrantyBillMain
            }
            this.$on('init', () => {
                this.currCpn = WarrantyBillMain
                if (this.$refs.warrantyBill) {
                    this.$refs.warrantyBill.$emit('warrantyBill');
                }
            });
        }
    }
</script>

<style>

</style>
