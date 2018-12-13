<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed"></component>
    </div>
</template>

<script>
    import InventoryBillMain from '~/components/storage/stock/InventoryBillMain';
    import { TabsEvent } from '../../../components/TabsEvent'
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        components: {
            InventoryBillMain
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
            ...mapGetters('storage/stock/inventoryBill', {
                currCpn: 'getCurrCpn'
            })
        },
        methods: {
            ...mapMutations('storage/stock/inventoryBill', {
                resetCurrCpn: 'resetCurrCpn'
            }),
            changeCurrCpn(cpn) {
                this.resetCurrCpn(cpn)
            }
        },
        mounted() {
            TabsEvent.$on('inventoryBill', () => {
                this.resetCurrCpn(InventoryBillMain)
            });
        }
    }
</script>

<style>

</style>
