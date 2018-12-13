<template>
    <div>
        <div class="modal-body">
            <div class="row">
                <div class="col-lg-3 left-config">
                    <div>可提现余额:</div>
                    <div>开户行:</div>
                    <div>开户名:</div>
                    <div>开户账号:</div>
                    <div style="line-height: 34px">提现金额:</div>
                    <div>手续费:</div>
                </div>
                <div class="col-lg-9 right-config">
                    <div style="height: 19px;">{{cashWallet}}元</div>
                    <div style="height: 19px;">{{account.bankName}}</div>
                    <div style="height: 19px;">{{account.accountName}}</div>
                    <div style="height: 19px;">{{account.accountNumber}}</div>
                    <div><input type="text" class="form-control" placeholder="1000元" v-model.number="amount"/></div>
                    <div>{{computedCharges}}元</div>
                </div>
            </div>
        </div>

        <div class="modal-footer" style="text-align: center;">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="add">确定</button>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent';
    import {calculateUtil, baseUtil} from '~/util';

    export default {
        components: {},
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'cashWallet', 'ownerId', 'withdrawCharges'],
        data() {
            return {
                amount: '',
                account: {
                    bankName: '',
                    accountName: '',
                    accountNumber: ''
                }
            }
        },
        computed: {
            computedCharges() {
                if (this.withdrawCharges.type === 'FIXED') {
                    return this.withdrawCharges.amount
                } else if (this.withdrawCharges.type === 'RATIO') {
                    return calculateUtil.multiply(this.amount, this.withdrawCharges.amount)
                }
            }
        },
        methods: {
            ...mapActions('account/walletAccount', {
                withdrawCashWallet: 'withdrawCashWallet',
                getMerchantAccountBaseInfo: 'getMerchantAccountBaseInfo'
            }),
            add() {
                if (this.amount > this.cashWallet) {
                    alert('提现金额不能超过钱包余额');
                    return
                } else if (this.amount < 0) {
                    alert('提现金额不能小于0');
                    return
                }
                console.log(this.form);
                this.withdrawCashWallet({
                    params: {
                        ownerId: this.ownerId,
                        tradeCharges: this.computedCharges,
                        totalCost: calculateUtil.add(this.computedCharges, this.amount),
                        amount: this.amount
                    },
                    callback: data => {
                        console.log(data)
                        ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL);
                    }
                });
            },
            setWithdrawals() {
                this.amount = event.target.dataset.num;
            },
            sendValidateNum() {
                event.preventDefault();
                console.log();
            },
            getAccount() {
                this.getMerchantAccountBaseInfo({
                    params: {
                        merchantId: baseUtil.getMerchantId()
                    },
                    callback: data => {
                        this.account = {
                            bankName: data.result.bankName,
                            accountName: data.result.accountName,
                            accountNumber: data.result.accountNumber
                        }
                    }
                })
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.amount = '';
                this.getAccount()
            })
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

    .left-config > div, .right-config > div {
        margin: 10px 0;
    }
</style>
