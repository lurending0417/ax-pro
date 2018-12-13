<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed"></component>
    </div>
</template>

<script>
    import InventoryAuditMain from '~/components/audit/stockAudit/InventoryAuditMain';

    export default {
        components: {
            InventoryAuditMain
        },
        data() {
            return {
                currCpn: InventoryAuditMain,
                passed: {
                    pass: 'passpass',
                    changeCurrCpn: this.changeCurrCpn
                }
            }
        },
        methods: {
            changeCurrCpn(cpn) {
                this.currCpn = cpn
            }
        }
    }
</script>

<style>

</style>
