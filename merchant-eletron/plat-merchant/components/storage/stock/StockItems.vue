<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed" ref="stockItems"></component>
    </div>
</template>

<script>
    import StockItemsMain from '~/components/storage/stock/StockItemsMain';

    export default {
        components: {
            StockItemsMain
        },
        data() {
            return {
                currCpn: StockItemsMain,
                passed: {
                    pass: 'passpass',
                    changeCurrCpn: this.changeCurrCpn
                }
            };
        },
        methods: {
            changeCurrCpn(cpn) {
                this.currCpn = cpn;
            }
        },
        mounted() {
            console.log('库存明细 底层组件 mounted');
            this.$on('init', () => {
                console.log('库存明细 底层组件 $on');
                if (this.$refs.stockItems) {
                    this.$refs.stockItems.$emit('init')
                }
            });
        }
    };
</script>

<style>

</style>
