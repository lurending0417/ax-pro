<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed"></component>
    </div>
</template>

<script>
    import WareHouseItemsMain from '~/components/storage/warehouse/WareHouseItemsMain';

    export default {
        components: {
            WareHouseItemsMain
        },
        data() {
            return {
                currCpn: WareHouseItemsMain,
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
            console.log(3333333333);
        }
    };
</script>

<style>

</style>
