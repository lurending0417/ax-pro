<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed" ref="leaseManage"></component>
    </div>
</template>

<script>
    import LeaseManageMain from '~/components/storage/wearGoods/LeaseManageMain'

    export default {
        props: ['index'],
        data() {
            return {
                currCpn: null,
                passed: {
                    pass: 'passpass',
                    changeCurrCpn: this.changeCurrCpn
                }
            }
        },
        methods: {
            changeCurrCpn(currCpn) {
                this.currCpn = currCpn
            }
        },
        mounted() {
            if (this.index === 0) {
                this.currCpn = LeaseManageMain
            }
            this.$on('init', () => {
                this.currCpn = LeaseManageMain
                if (this.$refs.leaseManage) {
                    this.$refs.leaseManage.$emit('init');
                }
            });
        }
    }
</script>

<style>

</style>


