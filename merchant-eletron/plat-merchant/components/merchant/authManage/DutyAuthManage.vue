<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed"></component>
    </div>
</template>

<script>
    import DutyAuthManageMain from '~/components/merchant/authManage/DutyAuthManageMain'

    export default {
        components: {
            DutyAuthManageMain
        },
        data () {
            return {
                currCpn: DutyAuthManageMain,
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
