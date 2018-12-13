<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed"></component>
    </div>
</template>

<script>
    import SaleManManageMain from '~/components/merchant/SaleManManageMain'

    export default {
        components: {
            SaleManManageMain
        },
        data () {
            return {
                currCpn: SaleManManageMain,
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
        }
    }
</script>

<style>

</style>
