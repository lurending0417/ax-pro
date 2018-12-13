<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed" ref="rejectBill"></component>
    </div>
</template>

<script>
    import RejectBillMain from '~/components/retail/offlineRetail/RejectBillMain'

    export default {
        props: ['index'],
        components: {
            RejectBillMain
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
                this.currCpn = RejectBillMain
            }
            this.$on('init', () => {
                this.currCpn = RejectBillMain
                if (this.$refs.rejectBill) {
                    this.$refs.rejectBill.$emit('rejectBill');
                }
            });
        }
    }
</script>

<style>

</style>
