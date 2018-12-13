<template>
    <div>
        <component v-bind:is="currCpn" ref="procurement"></component>
    </div>
</template>

<script>
    import ProcurementMain from '~/components/storage/stock/ProcurementMain'
    import { mapGetters, mapMutations } from 'vuex'
    // import { TabsEvent } from '../../../components/TabsEvent'

    export default {
        components: {
            ProcurementMain
        },
        computed: {
            ...mapGetters('storage/stock/procurement', {
                currCpn: 'getCurrCpn'
            })
        },
        methods: {
            ...mapMutations('storage/stock/procurement', {
                resetCurrCpn: 'resetCurrCpn'
            })
        },
        mounted() {
            this.$on('init', () => {
                this.resetCurrCpn(ProcurementMain)
                if (this.$refs.procurement) {
                    this.$refs.procurement.$emit('init')
                }
            });
            //
            // TabsEvent.$on('procurement', () => {
            //     this.resetCurrCpn(ProcurementMain)
            // });
        }
    }
</script>
