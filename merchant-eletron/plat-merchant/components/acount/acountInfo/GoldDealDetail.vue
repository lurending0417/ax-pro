<template>
    <div>
        <div class="modal-body">
            <div>
                <label class="radio-inline">
                    <input type="radio" name="type" value="buy"
                           v-model="form.type">买入</label>
                <label class="radio-inline">
                    <input type="radio" name="type" value="sell"
                           v-model="form.type">卖出</label>
            </div>
            <div v-if="form.type === 'sell'">
                <div class="flex-style" style="margin:15px 0;">
                    <div class="flex-items-style">
                        <div style="display: flex;align-items: center">
                            <label class="control-label label-width">交易重量</label>
                            <input type="text" class="form-control input-style" v-model="form.dealWeight"/>
                            <span class="">g</span>
                        </div>
                    </div>

                    <div class="flex-items-style">
                        <div style="display: flex;align-items: center">
                            <label class="control-label label-width">今日金价</label>
                            <input type="text" class="form-control input-style" v-model="metalPrice" disabled/>
                            <span class="">g/元</span>
                        </div>
                    </div>

                    <div class="flex-items-style">
                        <div style="display: flex;align-items: center">
                            <label class="control-label label-width">交易金额</label>
                            <input type="text" class="form-control input-style" v-model="sellDealPrice" disabled/>
                            <span class="">元</span>
                        </div>
                    </div>
                </div>
                <div class="flex-style" style="margin:15px 0;">
                    <div class="flex-items-style">
                        <div style="display: flex;align-items: center">
                            <label class="control-label label-width">已有重量：</label>
                            <span class="">{{form.weight}}g</span>
                        </div>
                    </div>

                    <div class="flex-items-style">
                        <div style="display: flex;align-items: center">
                            <label class="control-label label-width">市值：</label>
                            <span class="span-width">{{form.price}}元</span>
                        </div>
                    </div>
                    <div class="flex-items-style">
                        <div style="display: flex;align-items: center">
                            <label class="control-label label-width">手续费：</label>
                            <span class="span-width">{{computedCharges}}元</span>
                        </div>
                    </div>
                </div>
            </div>


            <div v-else>
                <div class="flex-style" style="margin:15px 0;">
                    <div class="flex-items-style">
                        <div style="display: flex;align-items: center">
                            <label class="control-label label-width">交易重量</label>
                            <input type="text" class="form-control input-style" v-model.number="buyForm.dealWeight"/>
                            <span class="">g</span>
                        </div>
                    </div>

                    <div class="flex-items-style">
                        <div style="display: flex;align-items: center">
                            <label class="control-label label-width">今日金价</label>
                            <input type="text" class="form-control input-style" v-model="metalPrice" disabled/>
                            <span class="">g/元</span>
                        </div>
                    </div>

                    <div class="flex-items-style">
                        <div style="display: flex;align-items: center">
                            <label class="control-label label-width">交易金额</label>
                            <input type="text" class="form-control input-style" v-model="buyDealPrice" disabled/>
                            <span class="">元</span>
                        </div>
                    </div>
                </div>
                <div class="flex-style" style="margin:15px 0;">
                    <div class="flex-items-style">
                        <div style="display: flex;align-items: center">
                            <label class="control-label label-width">钱包可用账户：</label>
                            <span class="span-width">{{buyForm.price}}元</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="modal-footer" style="text-align: center">
            <button type="button" class="btn btn-primary" @click="save('sell')" v-if="form.type === 'sell'">确定卖出
            </button>
            <button type="button" class="btn btn-primary" @click="save('buy')" v-else>确定买入</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions} from 'vuex'
    import {calculateUtil} from '~/util'

    export default {
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'ownerId', 'refresh'],
        data() {
            return {
                metalPrice: 0,
                metalPriceId: 0,
                form: {
                    type: 'buy',
                    weight: 0,
                    price: 0,
                    dealWeight: 0,
                    dealPrice: 0,
                    processingCharges: '' // 手续费
                },
                buyForm: {
                    weight: 0,
                    price: 0,
                    dealWeight: 0,
                    dealPrice: 0
                }
            }
        },
        computed: {
            buyDealPrice() {
                if (this.buyForm.dealWeight) {
                    return calculateUtil.multiply(this.buyForm.dealWeight, this.metalPrice)
                } else {
                    return 0
                }
            },
            sellDealPrice() {
                if (this.form.dealWeight) {
                    return calculateUtil.multiply(this.form.dealWeight, this.metalPrice)
                } else {
                    return 0
                }
            },
            computedCharges() {
                if (this.form.dealWeight) {
                    return calculateUtil.multiply(this.form.dealWeight, this.form.processingCharges)
                } else {
                    return 0
                }
            }
        },
        methods: {
            ...mapActions('account/goldAccount', {
                getGoldAccount: 'getGoldAccount',
                sellGold: 'sellGold',
                buyGold: 'buyGold'
            }),
            ...mapActions('account/walletAccount', {
                getCashConfig: 'getCashConfig'
            }),
            save(type) {
                let vm = this;
                console.log('type', type);
                let params = {
                    ownerId: this.ownerId,
                    accountType: 'GOLD_MARKETING',
                    goldPriceId: this.metalPriceId,
                    goldPrice: this.metalPrice,
                    tradeCharges: 0
                }
                if (type === 'sell') {
                    if (this.form.dealWeight > this.form.weight) {
                        alert('账户黄金不足')
                        return
                    } else if (this.form.dealWeight < 0) {
                        alert('卖出数量不能小于0')
                        return
                    }
                    console.log('type', type);
                    params.weight = this.form.dealWeight * 1000
                    params.tradeCharges = this.computedCharges
                    params.totalCost = calculateUtil.subtract(this.sellDealPrice, this.computedCharges)
                    console.log('params.tradeCharges', this.computedCharges, this.sellDealPrice);
                    this.sellGold({
                        params,
                        callback: (data) => {
                            console.log(data);
                            vm.refresh()
                            ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL);
                        }
                    });
                } else {
                    console.log('type', type);
                    params.weight = this.buyForm.dealWeight * 1000
                    params.totalCost = this.buyDealPrice
                    this.buyGold({
                        params,
                        callback: (data) => {
                            console.log(data);
                            vm.refresh()
                            ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL);
                        }
                    })
                }
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                let vm = this;
                this.getGoldAccount({
                    params: {
                        ownerId: this.ownerId
                    },
                    callback: (data) => {
                        let {goldPrice, marketing, sellCharges} = data.result;
                        this.metalPrice = goldPrice.price
                        this.metalPriceId = goldPrice.id
                        this.form.weight = calculateUtil.divide(marketing.balance, 1000)
                        this.form.price = calculateUtil.multiply(this.form.weight, this.metalPrice);
                        this.form.processingCharges = sellCharges.amount // 每g
                    }
                });
                if (this.form.type === 'buy') {
                    this.getCashConfig({
                        params: {
                            ownerId: this.ownerId
                        },
                        callback: data => {
                            console.log(data);
                            vm.buyForm.price = data.result.wallet.balance;
                        }
                    });
                }
            })
        }
    }
</script>

<style scoped>
    .flex-style {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .flex-items-style {
        flex-grow: 1;
    }

    .label-width {
        max-width: 100px;
    }

    .input-style {
        margin: 0 10px;
        width: 40%;
    }

    .span-width {
        max-width: 200px;
    }
</style>
