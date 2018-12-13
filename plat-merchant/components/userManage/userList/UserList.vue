<template>
    <div>
        <component v-bind:is="currCpn" :passed="passed" ref="paymentBill"></component>
    </div>
</template>

<script>
    import UserListMain from './UserListMain'
    import ListWrap from './ListWrap'

    export default {
        components: {
            UserListMain,
            ListWrap
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
        beforeMount () {
            this.changeCurrCpn(UserListMain)
        }
    }
</script>

<style>

</style>
