<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed"></component>
    </div>
</template>

<script>
    import ResourceManageMain from '~/components/auth/actionPageTplManage/ResourceManageMain'

    export default {
        components: {
            ResourceManageMain
        },
        data () {
            return {
                currCpn: ResourceManageMain,
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
