<template>
    <div style="text-align: center;margin: 20px 0;">
        <div>
            <select class="form-control" v-model="merchantId" name="merchantId" style="width: 50%;margin: 20px auto;">
                <option v-for="item in merchants" :value="item.id">{{item.name}}</option>
            </select>
        </div>
        <div>
            <button class="btn btn-primary" @click="asure">确定</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions} from 'vuex'

    export default {
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL'],
        data() {
            return {
                merchantId: '',
                merchants: []
            }
        },
        methods: {
            ...mapActions('login', {
                switchMerchant: 'switchMerchant'
            }),
            asure() {
                this.switchMerchant({
                    params: {
                        'merchantId': this.merchantId
                    },
                    callback: () => {
                        ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                    }
                })
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, (data) => {
                this.merchants = data.chooseMerchant;
                this.merchantId = this.merchants[0].id
            })
        }
    }
</script>
