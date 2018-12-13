<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="input-daterange input-group">
                    <span>
                        <DatePicker
                            field="myDate5"
                            placeholder="起始日期"
                            v-model="startYmd$"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                    <span class="input-group-addon" style="display: inline-block">到</span>
                    <span>
                        <DatePicker
                            field="myDate6"
                            placeholder="结束日期"
                            v-model="endYmd$"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                </div>
            </div>
            <!--<div class="form-group form-group-margin">-->
                <!--<label class="titleNameSize">关联单据类型&nbsp;&nbsp;&nbsp;</label>-->
                <!--<select class="form-control">-->
                    <!--<option value="">全部</option>-->
                    <!--<option :value="type.id" v-for="type in billTypeArr">{{type.name}}</option>-->
                <!--</select>-->
            <!--</div>-->
            <!--<div class="form-group form-group-margin">-->
                <!--<label class="titleNameSize">关联员工&nbsp;&nbsp;&nbsp;</label>-->
                <!--<select class="form-control">-->
                    <!--<option v-for="staff in getStaffs" :value="staff.id">{{ staff.nickName }}</option>-->
                <!--</select>-->
            <!--</div>-->
            <div class="form-group form-group-margin">
                <label class="titleNameSize">收银员&nbsp;&nbsp;&nbsp;</label>
                <select class="form-control" v-model="creatorId">
                    <option value="">全部</option>
                    <option v-for="staff in getStaffs" :value="staff.id">{{ staff.nickName }}</option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="col-md-3">
                <input type="text" class="form-control" placeholder="单号" ref="queryInput"
                       v-model="query$" @keyup.enter="search()"></div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="search()">搜索</button>
            </div>
            <div class="col-md-6"></div>
            <div class="col-md-2" style="text-align: right">
                <button class="btn btn-danger" style="minWidth:80px" @click="add">
                    <i class="fa fa-plus-square">&nbsp;&nbsp;新增</i>
                </button>
            </div>
        </div>

        <TableCpn
            :heads="[
                {propName:'billNumber',name:'收银单号'},
                {propName:'totalCost',name:'应收金额'},
                {propName:'paymentOfCash',name:'现金',mergeName:'支付方式'},
                {propName:'paymentOfPos',name:'POS',mergeName:'支付方式'},
                {propName:'paymentOfWeixin',name:'微信',mergeName:'支付方式'},
                {propName:'paymentOfAlipay',name:'支付宝',mergeName:'支付方式'},
                {propName:'paymentOfGold',name:'易戴易美黄金',mergeName:'支付方式'},
                {propName:'paymentOfWallet',name:'易戴易美资金',mergeName:'支付方式'},
                {propName:'cashOddChange',name:'现金找零',mergeName:'支付方式'},
                {propName:'realPrice',name:'实付汇总'},
                {propName:'createTime',name:'收银时间'},
                {propName:'creatorId',name:'收银员'},
                {tag:'BUTTON',name:'操作'}
            ]"
            :items="getPaymentBills">
            <button v-for="(item,index) in getPaymentBills" :slot="'BUTTON'+index"
                    class="btn btn-sm btn-default" @click="clickDetail(item)">详情
            </button>
        </TableCpn>

        <Pagination
            :total="total"
            :limit="10"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        >
        </Pagination>
    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import DatePicker from '~/components/DatePicker'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import TableCpn from '~/components/Table'
    import uuid from 'uuid'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent'
    import PaymentBillAdd from '~/components/retail/offlineRetail/PaymentBillAdd'
    import {baseUtil, dateUtil} from '~/util';

    export default {
        components: {
            DatePicker,
            ButtonWithModal,
            TableCpn,
            Pagination
        },
        props: ['passed'],
        data() {
            return {
                startYmd$: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                endYmd$: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                CONST_CLOSE_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                query$: '',
                storeId$: '',
                creatorId: '',
                billTypeArr: [],
                getStaffs: []
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/paymentBillMain', {
                total: 'getTotal',
                getPaymentBills: 'getPaymentBills'
            })
        },
        methods: {
            ...mapMutations('retail/offlineRetail/paymentBillAdd', {
                resetBillType: 'resetBillType',
                clearData: 'clearData',
                resetExchangeBill: 'resetExchangeBill',
                resetExchangeBillItems: 'resetExchangeBillItems',
                resetCanChange: 'resetCanChange',
                resetUserInfo: 'resetUserInfo',
                resetPaymentBillDetail: 'resetPaymentBillDetail'
            }),
            ...mapActions('retail/offlineRetail/paymentBillMain', {
                apiGetPaymentBill: 'apiGetPaymentBill'
            }),
            ...mapActions('retail/offlineRetail/paymentBillAdd', {
                apiGetPaymentBillDetail: 'apiGetPaymentBillDetail'
            }),
            add() {
                this.resetBillType('')
                this.clearData()
                this.resetExchangeBill({})
                this.resetExchangeBillItems([])
                this.resetCanChange(true)
                this.resetPaymentBillDetail({});
                this.passed.changeCurrCpn(PaymentBillAdd)
            },
            clickDetail(item) {
                console.log(item)
                this.apiGetPaymentBillDetail({
                    params: {
                        billId: item.id
                    },
                    callback: (data) => {
                        this.resetCanChange(false)
                        this.resetUserInfo({})
                        if (data.result.tranBill.customerId) {
                            this.resetUserInfo(data.result.tranBill.customer)
                        }
                        this.passed.changeCurrCpn(PaymentBillAdd)
                    }
                })
            },
            registerPaginationEvent() {
                PaginationEvent.$off(this.CONST_CHANGE_PAGE)
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    this.search(params)
                })
            },
            search(page) {
                let params = {
                    startYmd: this.startYmd$,
                    endYmd: this.endYmd$,
                    storeId: this.storeId$,
                    gold: '',
                    coupon: '',
                    weixin: '',
                    alipay: '',
                    query: this.query$,
                    creatorId: this.creatorId,
                    start: 0,
                    limit: 10
                }
                if (page) {
                    params.start = page.start;
                    params.limit = page.limit;
                }
                this.apiGetPaymentBill(params)
                this.$refs.queryInput.select()
            }
        },
        mounted() {
            this.getStaffs = baseUtil.getMetadataStaffs()
            // this.creatorId = this.getStaffs[0].id
            this.billTypeArr = baseUtil.getEnumsByKey('goodsBillType') || [];
            if (this.billTypeArr.length > 0) {
                this.billTypeArr = this.billTypeArr.filter((item) => {
                    return (item.id === 'RETAIL_OUT' || item.id === 'RETAIL_REJECT' || item.id === 'RECYCLE_IN')
                })
            }
            // this.storeId$ = baseUtil.getStore().id; // 获取当前登录的人的店铺
            // this.wareHouse = baseUtil.getMetadataWareHouseByStoreId(storeId); // 获取当前店铺的所有仓库
            this.$on('paymentBill', () => {
                console.log('点击收银单选项卡');
                this.search({
                    start: 0,
                    limit: 10
                })
            });
            // watch
            this.$watch('startYmd$', function () {
                this.search()
            });
            this.$watch('endYmd$', function () {
                this.search()
            })
            this.$watch('creatorId', function () {
                this.search()
            })
        },
        beforeMount() {
            this.registerPaginationEvent();
        }
    }
</script>
<style>
    .titleNameSize {
        font-size: 14px;
    }
</style>
