<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="input-daterange input-group">
                    <div style="display: inline-block;">
                        <DatePicker
                            field="startDate"
                            placeholder="起始日期"
                            v-model="searchForm.startYmd"
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
                            v-model="searchForm.endYmd"
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
                <select class="form-control" v-model="searchForm.vendorId">
                    <option value="">供货商</option>
                    <option v-for="vendor in vendors" :value="vendor.id">{{ vendor.name }}</option>
                </select>
            </div>
            <!--<div class="form-group form-group-margin">-->
                <!--<select class="form-control" v-model="searchForm.retailPriceType">-->
                    <!--<option value="">计价方式</option>-->
                    <!--<option v-for="priceType in retailPriceTypes" :value="priceType.value">{{ priceType.name }}</option>-->
                <!--</select>-->
            <!--</div>-->
            <div class="form-group form-group-margin">
                <select class="form-control" v-model="searchForm.stockType">
                    <option value="">采购方式</option>
                    <option v-for="stockType in stockTypes" :value="stockType.value">{{ stockType.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <select class="form-control" v-model="searchForm.creatorId">
                    <option value="">入库人</option>
                    <option v-for="staff in staffs" :value="staff.id">{{ staff.nickName }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <select class="form-control" v-model="searchForm.wareHouseId">
                    <option value="">仓库</option>
                    <option v-for="warehouse in warehouses" :value="warehouse.id">{{ warehouse.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <select class="form-control" v-model="searchForm.status">
                    <option value="">状态</option>
                    <option v-for="procurementBillType in procurementBillTypes" :value="procurementBillType.value">
                        {{ procurementBillType.name }}
                    </option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="col-md-3"><input type="text" class="form-control" placeholder="单号、质量"
                                         @keyup.enter="search()" ref="query"
                                         v-model="query"/></div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="search()">搜索</button>
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-warning" style="min-width: 80px;" @click="restore()">重置</button>
            </div>
            <div class="col-md-5"></div>
            <div class="col-md-2" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                        btnClasses: ['btn-danger'],
                        btnStyle: { minWidth: 80 + 'px' },
                        btnName: '新增'
                    }"
                    :modalProps="{
                        CONST_CLOSE_MODAL: addModalName,
                        titleName: '新增库存'
                    }"
                >
                    <ProcurementAddPre
                        slot="main"
                        :CONST_CLOSE_MODAL="addModalName"
                    >
                    </ProcurementAddPre>
                </ButtonWithModal>
            </div>
        </div>

        <TableCpn
            :heads="[
                { propName: 'billNumber', name: '入库单号' },
                { propName: 'createTime', name: '创建时间' },
                { propName: 'wareHouseName', name: '仓库' },
                { propName: 'vendorName', name: '供应商' },
                { propName: 'totalWeight', name: '总质量', unit: 'g' },
                { propName: 'totalAmount', name: '件数' },
                { propName: 'totalCost', name: '成本', unit: '元' },
                { propName: 'costPriceTypeShow', name: '成本计价方式' },
                { propName: 'stockTypeShow', name: '采购方式' },
                { propName: 'creatorName', name: '入库人' },
                { propName: 'status', name: '状态' },
                { name: '操作', tag: 'BUTTON' }
            ]"
            :items="stocksView"
        >
            <div v-for="(item,index) in stocksView" :slot="'BUTTON'+index">
                <button type="button" class="btn btn-sm btn-default" :value="item.id" @click="clickWatch">查看</button>
                <button v-if="item.status === '待提交' || item.status === '审核失败'" type="button" :value="item.id" class="btn btn-sm btn-default"
                        @click="clickModify">修改
                </button>
                <button v-if="item.status === '待提交'|| item.status === '审核失败'" type="button" class="btn btn-sm btn-default" :value="item.id"
                        @click="clickDeleteBill">删除
                </button>
            </div>
        </TableCpn>

        <div class="form-inline" style="text-align: left; padding-left: 20px;">
            <div class="form-group form-group-margin">
                <label>件数：</label><label>{{getSumTotal.amount}}</label>
            </div>
            <div class="form-group form-group-margin">
                <label>总质量：</label><label>{{getSumTotal.weight}}</label>
            </div>
            <div class="form-group form-group-margin">
                <label>成本：</label><label>{{getSumTotal.cost}}</label>
            </div>
            <div class="form-group form-group-margin">
                <label>原价：</label><label>{{getSumTotal.regularPrice}}</label>
            </div>
            <div class="form-group form-group-margin">
                <label>优惠价：</label><label>{{getSumTotal.retailPrice}}</label>
            </div>
            <div class="form-group form-group-margin">
                <label>工费：</label><label>{{getSumTotal.processingCharges}}</label>
            </div>
        </div>

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
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import DatePicker from '~/components/DatePicker'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent'
    import ProcurementAddPre from '~/components/storage/stock/ProcurementAddPre'
    import uuid from 'uuid'
    import TableCpn from '~/components/Table'
    import ProcurementAdd from '~/components/storage/stock/ProcurementAdd'
    import {constUtil, baseUtil, dateUtil} from '~/util'

    export default {
        components: {
            DatePicker,
            ButtonWithModal,
            Pagination,
            ProcurementAddPre,
            TableCpn
        },
        data() {
            return {
                authorizedAction: false,
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
                query: '',
                searchForm: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    vendorId: '',
                    retailPriceType: '',
                    stockType: '',
                    creatorId: '',
                    status: '',
                    wareHouseId: '',
                    limit: 20,
                    start: 0
                }
            }
        },
        watch: {
            searchForm: {
                handler() {
                    this.search()
                },
                deep: true
            }
        },
        computed: {
            ...mapGetters('storage/stock/procurementMain', {
                stocksView: 'stocksView',
                total: 'getTotal',
                getSumTotal: 'getSumTotal'
            })
        },
        methods: {
            ...mapMutations('storage/stock/procurementMain', {
                resetStockBillId: 'resetStockBillId'
            }),
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
            search(page) {
                let params = {...this.searchForm, limit: 20, start: 0, query: this.query}
                if (page) {
                    let {start, limit} = page;
                    params.limit = limit;
                    params.start = start;
                }
                this.searchStock(params)
                this.$refs.query.select()
            },
            restore() {
                this.searchForm = {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    vendorId: '',
                    retailPriceType: '',
                    stockType: '',
                    creatorId: '',
                    status: '',
                    wareHouseId: '',
                    limit: 0,
                    start: 0
                };
                this.query = '';
            },
            clickWatch(event) {
                this.watchStock({
                    billId: event.target.value,
                    callback: (data) => {
                        this.resetStockBillId(event.target.value)
                        this.resetPreStock(data.result)
                        this.resetProcurementCanChange(false)
                        this.resetCurrCpn(ProcurementAdd)
                    }
                })
            },
            clickModify(event) {
                this.watchStock({
                    billId: event.target.value,
                    callback: (data) => {
                        this.resetStockBillId(event.target.value)
                        this.resetPreStock(data.result)
                        this.resetProcurementCanChange(true)
                        this.resetCurrCpn(ProcurementAdd)
                    }
                })
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
            initArr() {
                this.vendors = baseUtil.getMetadataVendors()
                this.staffs = baseUtil.getMetadataStaffs()
                this.retailPriceTypes = [
                    {name: '自动计算（按重）', value: 'WEIGHTED'},
                    {name: '手动输入', value: 'FIXED'}
                ]
                this.stockTypes = constUtil._CONST_STOCK_TYPE
                this.procurementBillTypes = constUtil._CONST_PROCUREMENT_BILL_TYPE
                this.warehouses = baseUtil.getMetadataWareHouseByStoreId()
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
        },
        mounted() {
            this.initArr()
            this.$on('init', () => {
                this.restore()
            });
        }
    }
</script>
