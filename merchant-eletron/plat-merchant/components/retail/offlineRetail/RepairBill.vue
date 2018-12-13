<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed" ref="repairBill"></component>
    </div>
</template>

<script>
    import RepairBillMain from '~/components/retail/offlineRetail/RepairBillMain'

    export default {
        props: ['index'],
        components: {
            RepairBillMain
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
        beforeMount() {
            if (this.index === 0) {
                this.currCpn = RepairBillMain
            }
            this.$on('init', () => {
                this.currCpn = RepairBillMain
                if (this.$refs.repairBill) {
                    this.$refs.repairBill.$emit('rejectBill');
                }
            });
        }
    }
</script>

<style>

</style>
