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

        <div class="row">
            <!--<div class="col-md-3"><input type="text" class="form-control" placeholder="单号、质量" v-model="query$"></div>-->
            <!--<div class="col-md-1">-->
            <!--<button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="search">搜索</button>-->
            <!--</div>-->
            <!--<div class="col-md-1">-->
            <!--<button type="button" class="btn btn-warning" style="min-width: 80px;" @click="test()">重置</button>-->
            <!--</div>-->
            <!--<div class="col-md-7"></div>-->
        </div>
        <TableCpn
            :heads="[
                { propName: 'billNumber', name: '入库单号' },
                { propName: 'createTime', name: '创建时间' },
                { propName: 'wareHouseName', name: '仓库' },
                { propName: 'vendorName', name: '供应商' },
                { propName: 'totalWeight', name: '总质量' },
                { propName: 'totalAmount', name: '件数' },
                { propName: 'totalCost', name: '成本' },
                { propName: 'costPriceTypeShow', name: '成本计价方式' },
                { propName: 'stockTypeShow', name: '采购方式' },
                { propName: 'buyerName', name: '入库人' },
                { propName: 'status', name: '状态' },
                { propName: 'nodeUserName', name: '审批人' },
                { name: '操作', tag: 'BUTTON' }
            ]"
            :items="stocksView"
        >
            <div v-for="(item,index) in stocksView" :slot="'BUTTON'+index">
                <button type="button" class="btn btn-sm btn-default" :value="item.id" :data-recordid="item.recordId"
                        @click="clickWatch(item)">详情
                </button>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn', 'btn-sm', 'btn-info'],
                                btnName: '审批情况'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+index+'detail',
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
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent'
    import uuid from 'uuid'
    import TableCpn from '~/components/Table'
    import Test from '~/components/Test'
    import TableButton from '~/components/TableButton';
    import StockAuditBillItemDetail from '~/components/audit/stockAudit/StockAuditBillItemDetail';
    import {dateUtil, constUtil} from '~/util'
    import AuditDetail from '~/components/audit/stockAudit/AuditDetail';

    export default {
        components: {
            DatePicker,
            ButtonWithModal,
            Pagination,
            Test,
            AuditDetail,
            TableButton,
            StockAuditBillItemDetail,
            TableCpn
        },
        data() {
            return {
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    type: 'GOODS_STOCK',
                    status: ''
                },
                statusArr: [],
                addModalName: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_CLICK_PAGE: uuid(),
                CONST_RESTORE: uuid()
            }
        },
        computed: {
            ...mapGetters('audit/stockAudit/stockAuditBillMain', {
                stocksView: 'stocksView',
                stocksAuditView: 'stocksAuditView',
                total: 'getTotal'
            })
        },
        methods: {
            ...mapMutations('audit/stockAudit/stockAuditBillMain', {
                resetStockAuditDetail: 'resetStockAuditDetail'
            }),
            ...mapMutations('audit/stockAudit/stockAuditBill', {
                resetCurrCpn: 'resetCurrCpn'
            }),
            ...mapMutations('storage/stock/procurementAdd', {
                resetPreStock: 'resetPreStock',
                resetProcurementCanChange: 'resetProcurementCanChange'
            }),
            ...mapActions('storage/stock/procurementMain', {
                getStocks: 'getStocks',
                searchStock: 'searchStock',
                deleteStock: 'deleteStock',
                watchStock: 'watchStock'
            }),
            ...mapActions('audit/stockAudit/stockAuditBillMain', {
                auditRecordListGet: 'auditRecordListGet'
            }),
            clickDetail() {
                // ButtonWithModalEvent.$emit(this.CONST_CLICK_MODAL)
                this.resetCurrCpn(StockAuditBillItemDetail);
            },
            clickWatch(item) {
                this.watchStock({ // 根据id获取采购入库单
                    billId: event.target.value,
                    callback: (data) => {
                        this.resetPreStock(data.result) // 设置采购入库对象
                        this.resetStockAuditDetail(item) // 设置点击详情的审批记录对象id
                        this.resetProcurementCanChange(false)
                        this.resetCurrCpn(StockAuditBillItemDetail)
                    }
                })
            },
            search(page) {
                let params = {...this.form, limit: 10, start: 0}
                if (page) {
                    params.limit = page.limit;
                    params.start = page.start;
                }
                this.auditRecordListGet(params)
            },
            clickDeleteBill(event) {
                this.deleteStock({
                    deleteId: event.target.value,
                    callback: () => {
                        this.search()
                    }
                })
            },
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, pager => {
                    this.search(pager)
                })
            },
            initData() {
                this.statusArr = constUtil._CONST_AUDIT_STATUS;
                this.form.status = this.statusArr[0].value
            }
        },
        beforeMount() {
            this.initData()
            this.registerPaginationEvent()
        },
        mounted() {
            this.$watch('form', function () {
                this.search();
            }, {deep: true})
        }
    }
</script>
