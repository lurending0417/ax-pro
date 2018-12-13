<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed" :changeTab="changeTab" ref="exchangeBill"></component>
    </div>
</template>

<script>
    import ExchangeBillMain from '~/components/retail/offlineRetail/ExchangeBillMain'

    export default {
        props: ['changeTab', 'index'],
        components: {
            ExchangeBillMain
        },
        data () {
            return {
                currCpn: null,
                passed: {
                    pass: 'passpass',
                    changeCurrCpn: this.changeCurrCpn,
                    item: ''
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
                this.currCpn = ExchangeBillMain
            }
            this.$on('init', () => {
                this.currCpn = ExchangeBillMain
                if (this.$refs.exchangeBill) {
                    this.$refs.exchangeBill.$emit('exchangeBill');
                }
            });
        }
    }
</script>

<style>

</style>
