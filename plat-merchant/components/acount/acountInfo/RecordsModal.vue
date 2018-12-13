<template>
    <div>
        <div class="modal-body">
            <div v-if="isRechargeRecord">
                <TableCpn :heads="[
                    {propName:'amount',name:'金额'},
                    {propName:'createTime',name:'发起时间'},
                    {propName:'updateTime',name:'充值成功时间'},
                    {propName:'transactionId',name:'银行流水号'}
                ]" :items="tableView">
                </TableCpn>
            </div>
            <div v-if="isWithdrawalRecord">
                <TableCpn :heads="[
                    {propName:'withdrawAmount',name:'金额'},
                    {propName:'createTime',name:'发起时间'},
                    {propName:'doneTime',name:'转账确认时间'}
                ]" :items="tableView">
                </TableCpn>
            </div>
            <div v-if="isDepositRecord">
                <TableCpn :heads="[
                    {propName:'storeId',name:'下单时间'},
                    {propName:'wareHouseId',name:'订单号'},
                    {propName:'serial',name:'条码'},
                    {propName:'amount',name:'押金'},
                    {propName:'categoryId',name:'用户收货时间'},
                    {propName:'categoryId',name:'到期时间'},
                    {tag:'BUTTON',name:'操作'}
                ]" :items="tableView">
                    <div v-for="(item,index) in tableView" :slot="'BUTTON'+index">
                        <button type="button" class="btn btn-sm btn-default">详情</button>
                    </div>
                </TableCpn>
            </div>
            <div style="text-align: left" v-if="isDepositRecord">
                合计：
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn-primary btn" style="margin:0 10px" @click="close">关闭</button>
        </div>
    </div>
</template>

<script>
    import TableCpn from '~/components/Table'
    import {ButtonWithModalEvent} from '../../ButtonWithModalEvent';
    import {mapActions} from 'vuex'
    import {dateUtil} from '~/util';

    export default {
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'tag', 'ownerId'],
        components: {
            TableCpn
        },
        data() {
            return {
                tableView: [],
                isRechargeRecord: false,
                isWithdrawalRecord: false,
                isDepositRecord: false
            }
        },
        methods: {
            ...mapActions('account/walletAccount', {
                withdrawCashWalletRecord: 'withdrawCashWalletRecord',
                rechargeCashWalletRecord: 'rechargeCashWalletRecord'
            }),
            getWithdrawRecord() {
                this.withdrawCashWalletRecord({
                    params: {
                        ownerId: this.ownerId,
                        status: ''
                    },
                    callback: data => {
                        data.rows.forEach(item => {
                            item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                            if (item.doneTime || item.doneTime === 0) {
                                item.doneTime = dateUtil.pattern(new Date(item.doneTime), 'yyyy-MM-dd HH:mm:ss')
                                console.log('item.doneTime', item.doneTime);
                            }
                            return item
                        })
                        this.tableView = data.rows
                    }
                });
            },
            getRechargeRecord() {
                this.rechargeCashWalletRecord({
                    params: {
                        ownerId: this.ownerId,
                        startYmd: '',
                        endYmd: '',
                        confirmed: '',
                        query: '',
                        start: '',
                        limit: ''
                    },
                    callback: data => {
                        let temp = [];
                        data.rows.forEach(item => {
                            item.record.createTime = dateUtil.pattern(new Date(item.record.createTime), 'yyyy-MM-dd HH:mm:ss')
                            item.record.updateTime = dateUtil.pattern(new Date(item.record.updateTime), 'yyyy-MM-dd HH:mm:ss')
                            temp.push(item.record)
                        })
                        this.tableView = temp
                    }
                });
            },
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.tableView = [];
                this.isRechargeRecord = false;
                this.isWithdrawalRecord = false;
                this.isDepositRecord = false;
                if (this.tag === 'rechargeRecord') { // 充值记录
                    this.isRechargeRecord = true
                    this.getRechargeRecord();
                } else if (this.tag === 'withdrawalRecord') { // 提现记录
                    this.isWithdrawalRecord = true
                    this.getWithdrawRecord()
                } else if (this.tag === 'depositRecord') { // 发出商品总额（押金）
                    this.isDepositRecord = true
                }
            })
        }
    }
</script>
