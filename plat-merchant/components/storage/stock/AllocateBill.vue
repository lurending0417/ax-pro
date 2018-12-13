<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed" ref="allocate"></component>
    </div>
</template>

<script>
    import AllocateBillMain from '~/components/storage/stock/AllocateBillMain'
    // import { TabsEvent } from '../../../components/TabsEvent'

    export default {
        components: {
            AllocateBillMain
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
        mounted() {
            this.$on('init', () => {
                this.currCpn = AllocateBillMain
                if (this.$refs.allocate) {
                    this.$refs.allocate.$emit('init')
                }
            });
            // TabsEvent.$on('allocateBill', () => {
            //     this.currCpn = AllocateBillMain
            // });
        }
    }
</script>

<style>

</style>
