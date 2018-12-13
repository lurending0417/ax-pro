<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed" ref="wearGoodsList"></component>
    </div>
</template>

<script>
    import WearGoodsListMain from '~/components/storage/wearGoods/WearGoodsListMain'

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
                this.currCpn = WearGoodsListMain
            }
            this.$on('init', () => {
                this.currCpn = WearGoodsListMain
                if (this.$refs.wearGoodsList) {
                    this.$refs.wearGoodsList.$emit('init');
                }
            });
        }
    }
</script>



