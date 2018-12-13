<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed"></component>
    </div>
</template>

<script>
    import PrintTemplateMain from '~/components/systemSetting/printTemplate/PrintTemplateMain'

    export default {
        components: {
            PrintTemplateMain
        },
        data () {
            return {
                currCpn: PrintTemplateMain,
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
