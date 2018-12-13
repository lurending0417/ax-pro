<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed"></component>
    </div>
</template>

<script>
    import StoreManageMain from '~/components/merchant/StoreManageMain'

    export default {
        components: {
            StoreManageMain
        },
        data () {
            return {
                currCpn: StoreManageMain,
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
