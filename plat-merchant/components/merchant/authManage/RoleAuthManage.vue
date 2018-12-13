<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed"></component>
    </div>
</template>

<script>
    import RoleAuthManageMain from '~/components/merchant/authManage/RoleAuthManageMain'

    export default {
        components: {
            RoleAuthManageMain
        },
        data () {
            return {
                currCpn: RoleAuthManageMain,
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
