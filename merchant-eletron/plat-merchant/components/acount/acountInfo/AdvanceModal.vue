<template>
    <div>
        <div class="modal-body">
            <div class="row">
                <div class="col-lg-3 left-config">
                    <div>可用额度:</div>
                    <div style="line-height: 34px">预支金额:</div>
                    <div>注:</div>
                </div>
                <div class="col-lg-9 right-config">
                    <div>{{advancedQuota}}元</div>
                    <div><input type="text" class="form-control" placeholder="1000元" v-model.number="amount"/></div>
                    <div>预支成功后，资金将转入钱包余额。</div>
                </div>
            </div>
        </div>

        <div class="modal-footer" style="text-align: center;">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="add">确定</button>
            <button type="button" class="btn btn-default" @click="cancle">取消</button>
        </div>
    </div>
</template>

<script>
    // import { mapActions, mapGetters, mapMutations } from 'vuex'
    import { mapActions } from 'vuex'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent';

    export default {
        components: {},
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'ownerId', 'advancedQuota'],
        data() {
            return {
                amount: 0
            }
        },
        computed: {
            // ...mapGetters('retail/offlineRetail/retailRecycleBillMain', {
            //     getRetailRecycleBillsView: 'getRetailRecycleBillsView',
            //     total: 'getTotal'
            // })
        },
        methods: {
            ...mapActions('account/walletAccount', {
                advancedCashWallet: 'advancedCashWallet'
            }),
            add() {
                console.log(this.form);
                this.advancedCashWallet({
                    params: {
                        ownerId: this.ownerId,
                        amount: this.amount
                    },
                    callback: data => {
                        console.log(data)
                        ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL);
                    }
                });
            },
            cancle() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL);
            },
            setWithdrawals() {
                this.form.withdrawals = event.target.dataset.num;
            },
            sendValidateNum() {
                event.preventDefault();
                console.log();
            }
        },
        mounted() {
        }
    }
</script>

<style>
    .margin-style {
        margin: 10px 0;
    }

    .display-flex {
        display: flex;
    }

    .left-config {
        font-weight: 600;
        text-align: right;
    }

    .left-config > div,.right-config > div {
        margin:10px 0;
    }
</style>
