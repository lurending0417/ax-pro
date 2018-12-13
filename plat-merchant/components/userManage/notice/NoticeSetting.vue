<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed" ref="noticeSetting"></component>
    </div>
</template>

<script>
    import NoticeSettingMain from './NoticeSettingMain'
    import NoticeAdd from './NoticeAdd'

    export default {
        props: ['index'],
        components: {
            NoticeSettingMain,
            NoticeAdd
        },
        data () {
            return {
                currCpn: null,
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
        },
        beforeMount() {
            if (this.index === 0) {
                this.currCpn = NoticeSettingMain
            }
            this.$on('init', () => {
                this.currCpn = NoticeSettingMain
                if (this.$refs.noticeSetting) {
                    this.$refs.noticeSetting.$emit('noticeSetting');
                }
            });
        }
    }
</script>

<style>

</style>
