<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed"></component>
    </div>
</template>

<script>
    import DutyAuthTplManageMain from '~/components/auth/roleDutyTplManage/DutyAuthTplManageMain'

    export default {
        components: {
            DutyAuthTplManageMain
        },
        data () {
            return {
                currCpn: DutyAuthTplManageMain,
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
