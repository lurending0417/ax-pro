<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed"></component>
    </div>
</template>

<script>
    import PageManageMain from '~/components/auth/actionPageTplManage/PageManageMain'

    export default {
        components: {
            PageManageMain
        },
        data () {
            return {
                currCpn: PageManageMain,
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
