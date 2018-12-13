<template>
    <div>
        <div class="modal-body">
            <div class="form-inline" style="text-align: left;">
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
                    <select class="form-control" v-model="form.vendorId">
                        <option value="">供货商</option>
                        <option v-for="vendor in vendors" :value="vendor.id">{{ vendor.name }}</option>
                    </select>
                </div>
                <div class="form-group form-group-margin">
                    <select class="form-control" v-model="form.retailPriceType">
                        <option value="">计价方式</option>
                        <option v-for="priceType in retailPriceTypes" :value="priceType.value">{{ priceType.name }}
                        </option>
                    </select>
                </div>
                <div class="form-group form-group-margin">
                    <select class="form-control" v-model="form.stockType">
                        <option value="">采购方式</option>
                        <option v-for="stockType in stockTypes" :value="stockType.value">{{ stockType.name }}</option>
                    </select>
                </div>
                <div class="form-group form-group-margin">
                    <select class="form-control" v-model="form.creatorId">
                        <option value="">入库人</option>
                        <option v-for="staff in staffs" :value="staff.id">{{ staff.nickName }}</option>
                    </select>
                </div>
                <div class="form-group form-group-margin">
                    <select class="form-control" v-model="form.wareHouseId">
                        <option value="">仓库</option>
                        <option v-for="warehouse in warehouses" :value="warehouse.id">{{ warehouse.name }}</option>
                    </select>
                </div>
                <div class="form-group form-group-margin">
                    <select class="form-control" v-model="form.status">
                        <option value="">状态</option>
                        <option v-for="procurementBillType in procurementBillTypes" :value="procurementBillType.value">
                            {{ procurementBillType.name }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="row">
                <div class="col-md-3">
                    <input type="text" class="form-control" placeholder="单号、质量" v-model="query" @keydown.enter="search()">
                </div>
                <div class="col-md-1" style="margin-right: 30px;">
                    <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="search()">搜索
                    </button>
                </div>
                <div class="col-md-1">
                    <button type="button" class="btn btn-warning" style="min-width: 80px;" @click="test()">重置</button>
                </div>
                <div class="col-md-7"></div>
            </div>

                <TableCpn
                    :heads="[
                        { name: '', tag: 'CheckBox' },
                        { propName: 'billNumber', name: '入库单号' },
                        { propName: 'createYmd', name: '创建时间' },
                        { propName: 'wareHouseName', name: '仓库' },
                        { propName: 'vendorName', name: '供应商' },
                        { propName: 'pkgWeightShow', name: '总质量'},
                        { propName: 'totalAmount', name: '件数' },
                        { propName: 'pkgCostShow', name: '成本', unit: '元' },
                        { propName: 'costPriceTypeShow', name: '成本计价方式' },
                        { propName: 'stockTypeShow', name: '采购方式' },
                        { propName: 'buyerName', name: '入库人' },
                        { propName: 'status', name: '状态' },
                        { name: '操作', tag: 'BUTTON' }
                    ]"
                    :items="stocksView"
                    :hasLeft="true"
                >
                    <div v-for="(item,index) in stocksView" :slot="'CheckBox'+index">
                        <input type="checkbox"/>
                    </div>
                </TableCpn>
                <Pagination
                    :total="total"
                    :limit="10"
                    :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
                    :CONST_RESTORE="CONST_RESTORE">
                </Pagination>
        </div>
        <div class="modal-footer">
            <button>导入</button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import DatePicker from '~/components/DatePicker'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import Pagination from '~/components/Pagination'
    import { PaginationEvent } from '~/components/PaginationEvent'
    import ProcurementAddPre from '~/components/storage/stock/ProcurementAddPre'
    import uuid from 'uuid'
    import TableCpn from '~/components/Table'
    import Test from '~/components/Test'
    import ProcurementAdd from '~/components/storage/stock/ProcurementAdd'
    import { constUtil, baseUtil, dateUtil } from '~/util'

    export default {
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL'],
        components: {
            DatePicker,
            ButtonWithModal,
            Pagination,
            ProcurementAddPre,
            Test,
            TableCpn
        },
        data () {
            return {
                addModalName: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                startDateId: uuid(),
                endDateId: uuid(),
                vendors: [],
                staffs: [],
                retailPriceTypes: [],
                stockTypes: [],
                warehouses: [],
                procurementBillTypes: [],
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    vendorId: '',
                    retailPriceType: '',
                    stockType: '',
                    creatorId: '',
                    status: 'AUDIT_APPROVED',
                    wareHouseId: ''
                },
                query: '',
                limit: 0,
                start: 0,
                initStatus: true
            }
        },
        computed: {
            ...mapGetters('storage/stock/procurementMain', {
                stocksView: 'stocksView',
                total: 'getTotal'
            })
        },
        methods: {
            ...mapMutations('storage/stock/procurementMain', {}),
            ...mapMutations('storage/stock/procurement', {
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
            search (page) {
                let params = {
                    ...this.form,
                    limit: 10,
                    start: 0
                }
                if (page) {
                    params.limit = page.limit;
                    params.start = page.start;
                }
                this.searchStock(params)
            },
            clickWatch (event) {
                this.watchStock({
                    billId: event.target.value,
                    callback: (data) => {
                        this.resetPreStock(data.result)
                        this.resetProcurementCanChange(false)
                        this.resetCurrCpn(ProcurementAdd)
                    }
                })
            },
            clickModify (event) {
                this.watchStock({
                    billId: event.target.value,
                    callback: (data) => {
                        this.resetPreStock(data.result)
                        this.resetProcurementCanChange(true)
                        this.resetCurrCpn(ProcurementAdd)
                    }
                })
            },
            clickDeleteBill (event) {
                this.deleteStock({
                    deleteId: event.target.value,
                    callback: () => {
                        this.search()
                    }
                })
            },
            registerPaginationEvent () {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, pager => {
                    if (!this.initStatus) {
                        this.searchStock(pager)
                    }
                })
            },
            initData () {
                this.vendors = baseUtil.getMetadataVendors()
                this.staffs = baseUtil.getMetadataStaffs()
                this.retailPriceTypes = [
                    {name: '自动计算（按重）', value: 'WEIGHTED'},
                    {name: '手动输入', value: 'FIXED'}
                ]
                this.stockTypes = constUtil._CONST_STOCK_TYPE
                this.procurementBillTypes = constUtil._CONST_PROCUREMENT_BILL_TYPE
                this.warehouses = baseUtil.getMetadataWareHouse()
                this.form = {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    vendorId: '',
                    retailPriceType: '',
                    stockType: '',
                    creatorId: '',
                    status: 'AUDIT_APPROVED',
                    wareHouseId: ''
                }
            }
        },
        beforeMount () {
            this.registerPaginationEvent()
        },
        mounted () {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.initData()
                this.initStatus && (this.initStatus = false);
                this.search({limit: 10, start: 0})
            })
            this.$watch('form', function () {
                this.search()
            }, {deep: true})
        }
    }
</script>
