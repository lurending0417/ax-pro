<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed"></component>
    </div>
</template>

<script>
    import RoleAuthTplManageMain from '~/components/auth/roleDutyTplManage/RoleAuthTplManageMain'

    export default {
        components: {
            RoleAuthTplManageMain
        },
        data () {
            return {
                currCpn: RoleAuthTplManageMain,
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
