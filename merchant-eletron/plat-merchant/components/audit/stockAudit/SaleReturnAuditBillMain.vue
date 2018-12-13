<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="input-daterange input-group">
                    <div style="display: inline-block;">
                        <DatePicker
                            field="startDate"
                            placeholder="起始日期"
                            v-model="form.startYmd"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false"
                        >
                        </DatePicker>
                    </div>
                    <span class="input-group-addon" style="display: inline-block">到</span>
                    <div style="display: inline-block">
                        <DatePicker
                            field="endDate"
                            placeholder="结束日期"
                            v-model="form.endYmd"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false"
                        >
                        </DatePicker>
                    </div>
                </div>
            </div>
            <div class="form-group form-group-margin">
                <select class="form-control" v-model="form.status">
                    <option value="">审批状态</option>
                    <option :value="item.value" v-for="item in statusArr">{{item.name}}</option>
                </select>
            </div>
        </div>

        <TableCpn :heads="[
            {propName:'billNumber',name:'出库单号'},
            {propName:'createTime',name:'创建时间'},
            {propName:'vendorId',name:'供货商'},
            {propName:'weight',name:'总质量', unit: 'g'},
            {propName:'amount',name:'件数'},
            {propName:'costPrice',name:'采购成本', unit: '元'},
            {propName:'updaterId',name:'出库人'},
            {propName:'status',name:'状态'},
            {tag:'BUTTON',name:'操作'}
            ]" :items="stocksView">
            <div v-for="(item,index) in stocksView" :slot="'BUTTON'+index">
                <button type="button" class="btn btn-sm btn-default" @click="detailSaleReturnBill(item)">详情</button>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn', 'btn-primary'],
                                btnName: '审批情况'
                            }"
                    :modalProps="{
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+index+'detail',
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                titleName: '审批情况'
                            }"
                >
                    <AuditDetail
                        slot="main"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+index+'detail'"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :item="item"
                    >
                    </AuditDetail>
                </ButtonWithModal>
            </div>
        </TableCpn>

        <Pagination
            :total="total"
            :limit="20"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        >
        </Pagination>
    </div>
</template>

<script>
    import DatePicker from '~/components/DatePicker'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import SaleReturnAuditBillItemDetail from '~/components/audit/stockAudit/SaleReturnAuditBillItemDetail';
    import SaleReturnAddPre from '~/components/storage/stock/SaleReturnAddPre'
    import {dateUtil, constUtil} from '~/util'
    import {mapGetters, mapState, mapMutations, mapActions} from 'vuex'
    import uuid from 'uuid'
    import TableCpn from '~/components/Table'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent'
    import AuditDetail from '~/components/audit/stockAudit/AuditDetail';

    export default {
        components: {
            DatePicker,
            ButtonWithModal,
            SaleReturnAddPre,
            TableCpn,
            SaleReturnAuditBillItemDetail,
            AuditDetail,
            Pagination
        },
        props: ['passed'],
        data() {
            return {
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    type: 'GOODS_STOCK_REJECT',
                    status: '',
                    limit: 20,
                    start: 0
                },
                statusArr: [],
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid()
            }
        },
        watch: {
            'form': {
                handler() {
                    this.search()
                },
                deep: true
            }
        },
        computed: {
            ...mapState('storage/stock/saleReturnMain', {}),
            ...mapGetters('audit/stockAudit/stockAuditBillMain', {
                stocksView: 'stocksView',
                stocksAuditView: 'stocksAuditView',
                total: 'getTotal'
            })
        },
        methods: {
            ...mapMutations('storage/stock/saleReturnAdd', {
                resetSaleReturnBill: 'resetSaleReturnBill'
            }),
            ...mapMutations('audit/stockAudit/stockAuditBillMain', {
                resetStockAuditDetail: 'resetStockAuditDetail'
            }),
            ...mapMutations('audit/stockAudit/stockAuditBill', {
                resetCurrCpn: 'resetCurrCpn'
            }),
            ...mapActions('storage/stock/saleReturnMain', {
                apiGetSaleReturnItems: 'apiGetSaleReturnItems',
                apiDeleteSaleReturnBill: 'apiDeleteSaleReturnBill'
            }),
            ...mapActions('audit/stockAudit/stockAuditBillMain', {
                auditRecordListGet: 'auditRecordListGet'
            }),

            search() {
                this.auditRecordListGet(this.form)
            },
            detailSaleReturnBill(item) {
                this.resetSaleReturnBill(item)
                this.resetStockAuditDetail(item) // 设置点击详情的审批记录对象
                this.passed.canChange = false
                this.passed.changeCurrCpn(SaleReturnAuditBillItemDetail)
                // this.resetCurrCpn(StockAuditBillItemDetail)
            },
            deleteSaleReturnBill(item) {
                this.apiDeleteSaleReturnBill({
                    params: {
                        billId: item.id
                    },
                    callback: () => {
                        this.search({limit: 20})
                    }
                })
            },
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, pager => {
                    let {limit, start} = pager;
                    this.form.limit = limit;
                    this.form.start = start;
                    this.auditRecordListGet(this.form)
                })
            },
            initData() {
                this.statusArr = constUtil._CONST_AUDIT_STATUS;
                this.form.status = this.statusArr[0].value
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
        },
        mounted() {
            this.initData();
        }
    }
</script>
