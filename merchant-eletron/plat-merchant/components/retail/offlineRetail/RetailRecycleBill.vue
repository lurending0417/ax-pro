<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed" ref="recycleBill"></component>
    </div>
</template>

<script>
    import RetailRecycleBillMain from '~/components/retail/offlineRetail/RetailRecycleBillMain'
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        props: ['index'],
        components: {
            RetailRecycleBillMain
        },
        data() {
            return {
                passed: {
                    pass: 'passpass',
                    changeCurrCpn: this.changeCurrCpn,
                    wareBill: null
                }
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/retailRecycleBill', {
                currCpn: 'getCurrCpn'
            })
        },
        methods: {
            ...mapMutations('retail/offlineRetail/retailRecycleBill', {
                resetCurrCpn: 'resetCurrCpn'
            }),
            changeCurrCpn(cpn) {
                this.resetCurrCpn(cpn)
            }
        },
        mounted () {
            if (this.index === 0) {
                this.resetCurrCpn(RetailRecycleBillMain)
            }
            this.$on('init', () => {
                this.resetCurrCpn(RetailRecycleBillMain)
                if (this.$refs.recycleBill) {
                    this.$refs.recycleBill.$emit('retailRecycleBill');
                }
            });
        }
    }
</script>

<style>

</style>


