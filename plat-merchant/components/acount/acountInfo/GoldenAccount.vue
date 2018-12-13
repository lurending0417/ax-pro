<template>
    <div>
        <div class="row">
            <div class="col-lg-6">
                <div class="panel panel-default">
                    <div class="panel-heading text-center">
                        <i class="fa fa-question-circle-o hover-cla text-success" aria-hidden="true" @click="showDetail('goldMarketingMsg', '营销金')"></i>
                        <strong>营销金</strong>
                    </div>
                    <div class="panel-body">
                        <div class="form-inline">
                            <div class=" form-group form-group-margin"><strong>可用重量：{{left.weight}}g</strong></div>
                            <div class="form-group form-group-margin"><strong>市值：{{left.goldPrice}}元</strong></div>
                        </div>
                        <div class="form-inline">
                            <div class="form-group form-group-margin">
                                <div class="input-daterange input-group">
                                    <span>
                                        <DatePicker
                                            field="myDate1"
                                            placeholder="起始日期"
                                            v-model="myGoldAccount.startYmd"
                                            format="yyyy-mm-dd"
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
                                            v-model="myGoldAccount.endYmd"
                                            format="yyyy-mm-dd"
                                            :backward="false"
                                            :no-today="false"
                                            :forward="false">
                                        </DatePicker>
                                    </span>
                                </div>
                            </div>
                            <div class="form-group form-group-margin">
                                <strong>业务类型&nbsp;&nbsp;&nbsp;</strong>
                                <select class="form-control" v-model="myGoldAccount.billType">
                                    <option value="">全部</option>
                                    <option :value="item.id" v-for="item in accountBillTypes">{{item.name}}</option>
                                </select>
                            </div>
                        </div>
                        <TableCpn :heads="[
                            {propName: 'createTime', name: '时间'},
                            {propName: 'billNumber', name: '流水号'},
                            {propName: 'billNumber', name: '关联单号'},
                            {propName: 'billTypeName', name: '业务类型'},
                            {propName: 'amount', name: '重量'},
                            {propName: 'balanceAmount', name: '余量'}
                        ]" :items="left.tableView">
                        </TableCpn>
                        <Pagination
                            :total="left.total"
                            :limit="10"
                            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE+'left'"
                            :CONST_RESTORE="CONST_RESTORE+'left'"
                        >
                        </Pagination>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="panel panel-default">
                    <div class="panel-heading text-center">
                        <i class="fa fa-question-circle-o hover-cla text-success" aria-hidden="true" @click="showDetail('encourageMsg', '补贴金')"></i>
                        <strong>补贴金</strong>
                    </div>
                    <div class="panel-body">
                        <div class="form-inline">
                            <div class=" form-group form-group-margin"><strong>平台补贴：{{right.weight}}g</strong></div>
                            <div class="form-group form-group-margin"><strong>市值：{{right.goldPrice}}元</strong></div>
                        </div>
                        <div class="form-inline">
                            <div class="form-group form-group-margin">
                                <div class="input-daterange input-group">
                                <span>
                                    <DatePicker
                                        field="myDate1"
                                        placeholder="起始日期"
                                        v-model="subsidies.startYmd"
                                        format="yyyy-mm-dd"
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
                                        v-model="subsidies.endYmd"
                                        format="yyyy-mm-dd"
                                        :backward="false"
                                        :no-today="false"
                                        :forward="false">
                                    </DatePicker>
                                </span>
                                </div>
                            </div>
                            <div class="form-group form-group-margin">
                                <strong>业务类型&nbsp;&nbsp;&nbsp;</strong>
                                <select class="form-control" v-model="subsidies.billType">
                                    <option value="">全部</option>
                                    <option :value="item.id" v-for="item in accountBillTypes">{{item.name}}</option>
                                </select>
                            </div>
                        </div>
                        <TableCpn :heads="[
                            {propName: 'createTime', name: '时间'},
                            {propName: 'billNumber', name: '流水号'},
                            {propName: 'billNumber', name: '关联单号'},
                            {propName: 'billTypeName', name: '业务类型'},
                            {propName: 'amount', name: '重量'},
                            {propName: 'balanceAmount', name: '余量'}
                        ]" :items="right.tableView">
                        </TableCpn>
                        <Pagination
                            :total="right.total"
                            :limit="10"
                            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE+'right'"
                            :CONST_RESTORE="CONST_RESTORE+'right'"
                        >
                        </Pagination>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" style="text-align: center">
            <ButtonWithModal
                :btnProps="{
                                btnClasses: ['btn-primary'],
                                btnName: '交易'
                            }"
                :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                                titleName: '交易',
                                modalClasses: ['modal-lg']
                            }">
                <GoldDealDetail slot="main"
                                :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                                :ownerId="ownerId"
                                :refresh="searchAll"
                                :canChange="false">
                </GoldDealDetail>
            </ButtonWithModal>
        </div>

    </div>
</template>

<script>
    import DatePicker from '~/components/DatePicker'
    import GoldDealDetail from '~/components/acount/acountInfo/GoldDealDetail'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import TableCpn from '~/components/Table'
    import {mapActions} from 'vuex'
    // import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent'
    import uuid from 'uuid'
    import {baseUtil, dateUtil, calculateUtil} from '~/util';

    export default {
        components: {
            DatePicker,
            TableCpn,
            Pagination,
            GoldDealDetail,
            ButtonWithModal
        },
        data() {
            return {
                CONST_CLICK_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                ownerId: '',
                price: 0,
                priceId: '',
                // 卖出手续费
                sellCharges: {},
                left: {
                    weight: 0,
                    total: 0,
                    goldPrice: 0,
                    tableView: []
                },
                right: {
                    weight: 0,
                    total: 0,
                    goldPrice: 0,
                    tableView: []
                },
                // 我的黄金
                myGoldAccount: {
                    billType: '',
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    start: 0,
                    limit: 10
                },
                // 补贴池
                subsidies: {
                    billType: '',
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    start: 0,
                    limit: 10
                },
                accountBillTypes: [],
                goldMarketingMsg: '1、为提升商户线下零售业绩，提高用户黏度，易戴易美为商户提供了面向用户赠送黄金的营销工具。2、营销金需商户自行用钱包余额购买。3、当用户线下消费后，系统将按照商户自定义的黄金赠送规则对用户赠金，相关数量将在营销金账户中扣除。',
                encourageMsg: '1、补贴金系易戴易美对商户线下零售赠金活动给予的补贴。2、补贴规则：（1)商户产生线下零售业务后，系统会按照商户自定义的黄金赠送规则，从营销金账户中划转给用户及推荐者。（2）对于从营销金账户中赠送给用户的黄金，系统将从补贴金账户中按每单赠金的50%划转到营销金账户，每单补贴上限为20mg。'
            }
        },
        methods: {
            ...mapActions('account/goldAccount', {
                getGoldAccount: 'getGoldAccount',
                getGoldTranRecored: 'getGoldTranRecored',
                buyGold: 'buyGold'
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
                this.ownerId = baseUtil.getMerchantId()
                this.accountBillTypes = baseUtil.getEnumsByKey('accountBillType');
                this.getGoldAccount({
                    params: {
                        ownerId: this.ownerId
                    },
                    callback: (data) => {
                        let {goldPrice, encourage, marketing, sellCharges} = data.result;
                        this.price = goldPrice.price
                        this.priceId = goldPrice.id
                        this.left.weight = calculateUtil.divide(marketing.balance, 1000);
                        this.left.goldPrice = calculateUtil.multiply(this.left.weight, goldPrice.price);
                        this.right.weight = calculateUtil.divide(encourage.balance, 1000);
                        this.right.goldPrice = calculateUtil.multiply(this.right.weight, goldPrice.price);
                        this.sellCharges = sellCharges
                    }
                });
            },
            search(type, form) {
                let params = {
                    billType: '',
                    ownerId: this.ownerId,
                    accountType: '',
                    start: 0,
                    limit: 10
                }
                if (form) {
                    params.billType = form.billType
                    params.startYmd = form.startYmd
                    params.endYmd = form.endYmd
                    params.start = form.start
                    params.limit = form.limit
                    if (type === 'encourage') {
                        params.accountType = 'GOLD_PLAT_ENCOURAGE'
                    } else if (type === 'marketing') {
                        params.accountType = 'GOLD_MARKETING'
                    }
                    this.searchRequest(params, type);
                    return
                }
                if (type === 'encourage') {
                    params.accountType = 'GOLD_PLAT_ENCOURAGE'
                    params.startYmd = this.subsidies.startYmd
                    params.endYmd = this.subsidies.endYmd
                } else if (type === 'marketing') {
                    params.accountType = 'GOLD_MARKETING'
                    params.startYmd = this.myGoldAccount.startYmd
                    params.endYmd = this.myGoldAccount.endYmd
                }
                this.searchRequest(params, type);
            },
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE + 'left', (params) => {
                    this.search('marketing', {...this.myGoldAccount, start: params.start, limit: params.limit})
                })
                PaginationEvent.$on(this.CONST_CHANGE_PAGE + 'right', (params) => {
                    this.search('encourage', {...this.subsidies, start: params.start, limit: params.limit})
                })
            },
            refresh() {
                this.initData()
            },
            searchAll() {
                this.search('marketing')
                this.search('encourage')
            },
            searchRequest(params, type) {
                this.getGoldTranRecored({
                    params,
                    callback: (data) => {
                        data.rows.map(item => {
                            item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                            item.balanceAmount = 0
                            item.amount = item.amount / 1000 + 'g'
                            if (item.balance) {
                                item.balanceAmount = item.balance / 1000
                            }
                            item.balanceAmount += 'g';
                            item.billTypeName = this.accountBillTypes.find(ele => ele.id === item.billType).name
                            return item
                        })
                        if (type === 'encourage') {
                            this.right.tableView = data.rows
                            this.right.total = data.total
                        } else if (type === 'marketing') {
                            this.left.tableView = data.rows
                            this.left.total = data.total
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
                this.initData();
                this.search('encourage')
                this.search('marketing')
            })
            this.$watch('myGoldAccount', function (val) {
                this.search('marketing', val)
            }, {deep: true})
            this.$watch('subsidies', function (val) {
                this.search('encourage', val)
            }, {deep: true})
        }
    }
</script>

<style scoped>
    .flex-style {
        display: flex;
    }
    .hover-cla:hover{
        cursor: pointer;
        color: red;
    }
</style>
