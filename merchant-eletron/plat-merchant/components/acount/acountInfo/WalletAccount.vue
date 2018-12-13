<template>
    <div>
        <div class="col-lg-6">
            <div class="form-inline">
                <div class="form-group form-group-margin">
                    <button class="btn-warning btn form-group-margin" @click="refresh">刷新列表</button>
                    <strong>钱包余额:&nbsp;&nbsp;&nbsp;</strong><strong>{{topTextMsg.cashWallet}}元</strong>
                </div>
            </div>

            <div class="form-inline">
                <div class="form-group form-group-margin">
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn', 'btn-primary', 'form-group-margin'],
                                btnName: '充值'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL+'recharge',
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'recharge',
                                titleName: '充值'
                            }"
                    >
                        <RechargeModal
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL+'recharge'"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'recharge'"
                            :ownerId="ownerId"
                        >
                        </RechargeModal>
                    </ButtonWithModal>
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn', 'btn-primary', 'form-group-margin'],
                                btnName: '充值记录'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL+'rechargeRecord',
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'rechargeRecord',
                                titleName: '充值记录'
                            }"
                    >
                        <RecordsModal
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL+'rechargeRecord'"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'rechargeRecord'"
                            :tag="'rechargeRecord'"
                            :ownerId="ownerId"
                        >
                        </RecordsModal>
                    </ButtonWithModal>
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn', 'btn-primary' , 'form-group-margin'],
                                btnName: '提现'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL+'withdrawal',
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'withdrawal',
                                titleName: '提现'
                            }"
                    >
                        <Withdrawals
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL+'withdrawal'"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'withdrawal'"
                            :cashWallet="topTextMsg.cashWallet"
                            :ownerId="ownerId"
                            :withdrawCharges="withdrawCharges"
                        >
                        </Withdrawals>
                    </ButtonWithModal>
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn', 'btn-primary', 'form-group-margin'],
                                btnName: '提现记录'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL+'withdrawalRecord',
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'withdrawalRecord',
                                titleName: '提现记录'
                            }"
                    >
                        <RecordsModal
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL+'withdrawalRecord'"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'withdrawalRecord'"
                            :tag="'withdrawalRecord'"
                            :ownerId="ownerId"
                        >
                        </RecordsModal>
                    </ButtonWithModal>
                </div>
            </div>
            <div class="form-inline">
                <div class="input-daterange input-group">
                    <span>
                        <DatePicker
                            field="myDate1"
                            placeholder="起始日期"
                            format="yyyy-mm-dd"
                            v-model="left.startYmd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                    <span class="input-group-addon" style="display: inline-block">到</span>
                    <span>
                        <DatePicker
                            field="myDate2"
                            placeholder="结束日期"
                            format="yyyy-mm-dd"
                            v-model="left.endYmd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                </div>
                <div class="form-group" style="width: 20%;margin-left: 20px;">
                    <!--<strong>摘要&nbsp;&nbsp;&nbsp;&nbsp;</strong>-->
                    <select class="form-control" v-model="left.billType">
                        <option value="">全部</option>
                        <option :value="item.id" v-for="item in accountBillTypes">{{item.name}}</option>
                    </select>
                </div>
            </div>
            <TableCpn :heads="[
                    {propName: 'createTime', name: '时间'},
                    {propName: 'billNumber', name: '单号'},
                    {propName: 'billTypeName', name: '摘要'},
                    {propName: 'amount', name: '发生金额'},
                    {propName: 'balance', name: '余额'}
                ]"
                      :items="leftTabObjArr">
            </TableCpn>
            <Pagination
                :total="left.total"
                :limit="20"
                :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE+'left'"
                :CONST_RESTORE="CONST_RESTORE+'left'"
            >
            </Pagination>
        </div>

        <div class="col-lg-6">
            <div class="form-inline">
                <div class="form-group form-group-margin">
                    <strong>发出商品总额（押金）:&nbsp;&nbsp;&nbsp;</strong><strong>{{topTextMsg.leaseDeposit}}元</strong>
                </div>
                <div class="form-group form-group-margin">
                    <strong>
                        <i class="fa fa-question-circle-o hover-cla text-success" aria-hidden="true" @click="showDetail('advancedQuotaMsg', '可预支额度')"></i>可预支额度:&nbsp;&nbsp;&nbsp;</strong>
                    <strong>{{topTextMsg.advancedQuota}}元</strong>
                </div>
                <div class="form-group form-group-margin">
                    <strong>已预支:&nbsp;&nbsp;&nbsp;</strong><strong>{{topTextMsg.hasAdvanced}}元</strong>
                </div>
                <div class="form-group form-group-margin">
                    <strong>
                        <i class="fa fa-question-circle-o hover-cla text-success" aria-hidden="true" @click="showDetail('advancedMoneyMsg', '剩余额度')"></i>剩余额度:&nbsp;&nbsp;&nbsp;</strong>
                    <strong :class="topTextMsg.advancedMoney < 0 ?'text-danger': ''">{{topTextMsg.advancedMoney}}元</strong>
                </div>
                <div class="form-group form-group-margin">
                    <strong>
                        <i class="fa fa-question-circle-o hover-cla text-success" aria-hidden="true" @click="showDetail('forfeitMsg', '违约金')"></i>违约金:&nbsp;&nbsp;&nbsp;</strong>
                    <strong>{{topTextMsg.forfeit}}元</strong>
                </div>
            </div>
            <div class="form-inline">
                <div class="form-group form-group-margin">
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn', 'btn-primary', 'form-group-margin'],
                                btnName: '预支'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL+'advance',
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'advance',
                                titleName: '预支'
                            }"
                    >
                        <AdvanceModal
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL+'advance'"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'advance'"
                            :ownerId="ownerId"
                            :advancedQuota="topTextMsg.advancedQuota"
                        >
                        </AdvanceModal>
                    </ButtonWithModal>
                    <ButtonWithModal
                        :btnProps="{
                                    btnClasses: ['btn', 'btn-primary', 'form-group-margin'],
                                    btnName: '还款'
                                }"
                        :modalProps="{
                                    CONST_CLOSE_MODAL: CONST_CLOSE_MODAL+'repayment',
                                    CONST_CLICK_MODAL: CONST_CLICK_MODAL+'repayment',
                                    titleName: '还款'
                                }"
                    >
                        <RepaymentModal
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL+'repayment'"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'repayment'"
                            :ownerId="ownerId"
                            :forfeit="topTextMsg.forfeit"
                            :cashWallet="topTextMsg.cashWallet"
                        >
                        </RepaymentModal>
                    </ButtonWithModal>
                </div>
            </div>
            <div class="form-inline">
                <div class="input-daterange input-group">
                    <span>
                        <DatePicker
                            field="myDate3"
                            placeholder="起始日期"
                            format="yyyy-mm-dd"
                            v-model="right.startYmd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                    <span class="input-group-addon" style="display: inline-block">到</span>
                    <span>
                        <DatePicker
                            field="myDate4"
                            placeholder="结束日期"
                            format="yyyy-mm-dd"
                            v-model="right.endYmd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                </div>
                <div class="form-group" style="width: 20%;margin-left: 20px;">
                    <!--<span class="titleNameSize">摘要&nbsp;&nbsp;&nbsp;&nbsp;</span>-->
                    <select class="form-control" ref="warehouse" v-model="right.billType">
                        <option value="">全部</option>
                        <option :value="item.id" v-for="item in accountBillTypes">{{item.name}}</option>
                    </select>
                </div>
            </div>
            <TableCpn :heads="[
                    {propName: 'createTime', name: '时间'},
                    {propName: 'billNumber', name: '单号'},
                    {propName: 'billTypeName', name: '摘要'},
                    {propName: 'amount', name: '发生金额'},
                    {propName: 'balance', name: '累计金额'}
                ]"
                      :items="rightTabObjArr">
            </TableCpn>
            <Pagination
                :total="right.total"
                :limit="20"
                :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE+'right'"
                :CONST_RESTORE="CONST_RESTORE+'right'"
            >
            </Pagination>
        </div>
        <div style="text-align: center;">
            <!--<span style="margin:0 10px">-->
            <!--<ButtonWithModal-->
            <!--:btnProps="{-->
            <!--btnClasses: ['btn', 'btn-primary'],-->
            <!--btnName: '发出商品总额'-->
            <!--}"-->
            <!--:modalProps="{-->
            <!--CONST_CLOSE_MODAL: CONST_CLOSE_MODAL+'depositRecord',-->
            <!--CONST_CLICK_MODAL: CONST_CLICK_MODAL+'depositRecord',-->
            <!--titleName: '发出商品总额'-->
            <!--}"-->
            <!--&gt;-->
            <!--<RecordsModal-->
            <!--slot="main"-->
            <!--:CONST_CLOSE_MODAL="CONST_CLOSE_MODAL+'depositRecord'"-->
            <!--:CONST_CLICK_MODAL="CONST_CLICK_MODAL+'depositRecord'"-->
            <!--:tag="'depositRecord'"-->
            <!--&gt;-->
            <!--</RecordsModal>-->
            <!--</ButtonWithModal>-->
            <!--</span>-->
            <!--<button class="btn-primary btn" style="margin:0 10px">违约金</button>-->
        </div>
    </div>
</template>

<script>
    // import { mapActions, mapGetters, mapMutations } from 'vuex'
    import {mapActions} from 'vuex'
    import Pagination from '~/components/Pagination'
     import {PaginationEvent} from '~/components/PaginationEvent';
    import ButtonWithModal from '~/components/ButtonWithModal';
    import TableCpn from '~/components/Table';
    import uuid from 'uuid';
    import Withdrawals from '~/components/acount/acountInfo/Withdrawals';
    import RechargeModal from '~/components/acount/acountInfo/RechargeModal';
    import AdvanceModal from '~/components/acount/acountInfo/AdvanceModal';
    import RepaymentModal from '~/components/acount/acountInfo/RepaymentModal';
    import RecordsModal from '~/components/acount/acountInfo/RecordsModal';
    import DatePicker from '~/components/DatePicker';
    import {dateUtil, baseUtil, componentUtil} from '~/util';

    export default {
        components: {
            ButtonWithModal,
            DatePicker,
            Pagination,
            TableCpn,
            AdvanceModal, // 预支
            RechargeModal, // 充值
            RepaymentModal, // 还款
            RecordsModal, // 汇总记录弹窗
            Withdrawals // 提现
        },
        data() {
            return {
                withdrawCharges: {},
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                ownerId: '',
                left: { // wallet
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    billType: '',
                    total: 0
                },
                right: { // advanced
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    billType: '',
                    total: 0
                },
                leftTabObjArr: [],
                rightTabObjArr: [],
                accountBillTypes: [],
                topTextMsg: {
                    cashWallet: 0,
                    leaseDeposit: 0,
                    advancedQuota: 0,
                    hasAdvanced: 0,
                    advancedMoney: 0,
                    forfeit: 0
                },
                advancedQuotaMsg: '用户所交押金的50%即为商户可预支额度。',
                forfeitMsg: '1、当剩余额度出现负数后，商户须及时将负数部分归还；2、当剩余额度为负数时，易贷易美将自动从商户钱包余额中扣款用于归还，不足部分，则于T+1天起，按0.05%/日计算违约金。',
                advancedMoneyMsg: '商户可预支额度扣除已预支金额后，为剩余额度。'
            }
        },
        methods: {
            ...mapActions('account/walletAccount', {
                getCashConfig: 'getCashConfig',
                getGoldTranRecored: 'getGoldTranRecored'
            }),
            showDetail(symbol, title) {
                this.$msgBox.showMsgBox({
                    title,
                    content: this[symbol],
                    defineStyle: {
                        bottom: (document.body.clientHeight - event.screenY + 90) + 'px',
                        left: event.screenX - 5 + 'px'
                    }
                })
            },
            initData() {
                this.ownerId = baseUtil.getMerchantId();
                this.accountBillTypes = baseUtil.getEnumsByKey('accountBillType');
                this.getCash()
            },
            getCash() {
                let vm = this;
                this.getCashConfig({
                    params: {
                        ownerId: this.ownerId
                    },
                    callback: (data) => {
                        let {advanced, advancedAvailable, advancedQuota, bankCard, forfeit, leaseDeposit, wallet, withdrawCharges} = data.result;
                        vm.topTextMsg.cashWallet = wallet.balance;
                        vm.topTextMsg.leaseDeposit = leaseDeposit;
                        vm.topTextMsg.advancedQuota = advancedQuota;
                        vm.topTextMsg.hasAdvanced = advanced.balance;
                        vm.topTextMsg.advancedMoney = advancedAvailable;
                        vm.topTextMsg.forfeit = forfeit.balance;
                        vm.withdrawCharges = withdrawCharges
                        console.log(advanced, advancedAvailable, advancedQuota, bankCard, forfeit, leaseDeposit, wallet, withdrawCharges);
                    }
                });
            },
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE + 'right', (params) => {
                    this.search('advanced', {...this.right, start: params.start, limit: params.limit})
                })
                PaginationEvent.$on(this.CONST_CHANGE_PAGE + 'left', (params) => {
                    this.search('wallet', {...this.left, start: params.start, limit: params.limit})
                })
            },
            refresh() {
                this.initData();
                this.search('advanced');
                this.search('wallet');
            },
            search(type, form) {
                let params = {
                    billType: '',
                    ownerId: this.ownerId,
                    start: 0,
                    limit: 20
                }
                if (form) {
                    params.billType = form.billType
                    params.startYmd = form.startYmd
                    params.endYmd = form.endYmd
                    params.start = form.start
                    params.limit = form.limit
                    if (type === 'advanced') {
                        params.accountType = 'CASH_ADVANCED'
                    } else if (type === 'wallet') {
                        params.accountType = 'CASH_WALLET'
                    } else if (type === 'forfeit') {
                        params.accountType = 'CASH_FORFEIT'
                    }
                    this.searchRequest(params, type);
                    return
                }
                if (type === 'advanced') {
                    params.accountType = 'CASH_ADVANCED'
                    params.startYmd = this.left.startYmd
                    params.endYmd = this.left.endYmd
                } else if (type === 'wallet') {
                    params.accountType = 'CASH_WALLET'
                    params.startYmd = this.right.startYmd
                    params.endYmd = this.right.endYmd
                } else if (type === 'forfeit') {
                    params.accountType = 'CASH_FORFEIT'
                }
                this.searchRequest(params, type);
            },
            searchRequest(params, type) {
                let vm = this;
                this.getGoldTranRecored({
                    params,
                    callback: (data) => {
                        data.rows.map(item => {
                            item.billTypeName = this.accountBillTypes.find(ele => ele.id === item.billType).name
                            item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                            return item
                        })
                        if (type === 'wallet') {
                            vm.leftTabObjArr = componentUtil.handleUnit(data.rows, {
                                amount: '元',
                                balance: '元'
                            })
                            vm.left.total = data.total
                        } else if (type === 'advanced') {
                            vm.rightTabObjArr = componentUtil.handleUnit(data.rows, {
                                amount: '元',
                                balance: '元'
                            })
                            vm.right.total = data.total
                        }
                    }
                })
            }
        },
        beforeMount() {
            this.initData();
            this.registerPaginationEvent()
        },
        mounted() {
            this.$on('init', () => {
                this.refresh()
            })
            this.$watch('left', function (val) {
                this.search('wallet', val)
            }, {deep: true})
            this.$watch('right', function (val) {
                this.search('advanced', val)
            }, {deep: true})
        }
    }
</script>

<style scoped>
    .hover-cla:hover{
        cursor: pointer;
        color: red;
    }
</style>
