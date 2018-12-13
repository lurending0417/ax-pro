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
            <SelectItem v-model="storeId" selectTitle="收货门店" :selectItems="stores"></SelectItem>
            <SelectItem v-model="form.wareHouseId" selectTitle="收货仓库" :selectItems="wareHouses"></SelectItem>
            <SelectItem v-model="form.gemId" selectTitle="宝石" :selectItems="gems"></SelectItem>
            <SelectItem v-model="form.metalId" selectTitle="金属" :selectItems="metals"></SelectItem>
            <SelectItem v-model="form.categoryId" selectTitle="品类" :selectItems="categories"></SelectItem>
        </div>

        <div class="row">
            <div class="col-md-3"><input type="text" class="form-control" v-model="query"  @keyup.enter="search()"
            placeholder="条码"/></div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="search()">搜索</button>
            </div>
            <div class="col-md-7">
                <!--<button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="test()">test</button>-->
            </div>
        </div>

        <TableCpn
            :heads="[
                { propName: 'billTime', name: '收货时间' },
                { propName: 'billNumber', name: '订单号' },
                { propName: 'createTime', name: '下单时间' },
                { propName: 'shipperName', name: '快递公司' },
                { propName: 'logisticsCode', name: '快递单号' },
                { propName: 'serial', name: '条码' },
                { propName: 'metalName', name: '金属' },
                { propName: 'gemName', name: '宝石' },
                { propName: 'categoryName', name: '品类' },
                { propName: 'storeName', name: '收货门店' },
                { propName: 'wareHouseName', name: '收货仓库' },
                { propName: 'depositCost', name: '押金' },
                { propName: 'rentCost', name: '租金' },
                { propName: 'leaseDays', name: '租期' },
                { name: '操作', tag: 'BUTTON' }
            ]"
            :items="tableView"
        >
            <div v-for="(item,index) in tableView" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-sm btn-default'],
                                btnName: '详情'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: addModalName+index,
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL+index+'detail',
                                titleName: '详情',
                                modalClasses: ['modal-lg']
                            }">
                    <DeliverListDetail
                        slot="main"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+index+'detail'"
                        :CONST_CLOSE_MODAL="addModalName+index"
                        :item="item"
                        :refreshTable="refreshTable"
                    >
                    </DeliverListDetail>
                </ButtonWithModal>
            </div>
        </TableCpn>
        <div class="row">
            <div class="col-lg-4"><span class="span_title">当前页合计</span>订单量：{{currentCount.amount}}</div>
            <div class="col-lg-4">押金：{{currentCount.depositPrice}}</div>
        </div>
        <div class="row">
            <div class="col-lg-4"><span class="span_title">全部页合计</span>订单量：{{totalCount.amount}}</div>
            <div class="col-lg-4">押金：{{totalCount.depositPrice}}</div>
        </div>
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
    import api from '~/api'
    import {dateUtil, baseUtil} from '~/util'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import SelectItem from '~/components/SelectItem'
    import DatePicker from '~/components/DatePicker'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent'
    import uuid from 'uuid'
    import TableCpn from '~/components/Table'
    import Test from '~/components/Test'
    import DeliverListDetail from './DeliverListDetail';

    function Count(amount, depositPrice) { // 构造函数加属性
        this.amount = amount || 0;
        this.depositPrice = depositPrice || 0;
    }

    Count.prototype.amount = function () { // 原型加方法
        alert(this.amount)
    }

    export default {
        components: {
            ButtonWithModal,
            SelectItem,
            DatePicker,
            DeliverListDetail,
            Pagination,
            Test,
            TableCpn
        },
        data() {
            return {
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                addModalName: uuid(),
                CONST_RESTORE: uuid(),
                stores: [],
                wareHouses: [],
                gems: [],
                metals: [],
                categories: [],
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    wareHouseId: '',
                    gemId: '',
                    metalId: '',
                    categoryId: ''
                },
                query: '',
                storeId: '',
                total: 0,
                tableView: [],
                currentCount: new Count(),
                totalCount: new Count(),
                initStatus: true
            }
        },
        methods: {
            handleTableView(rows) {
                return rows.map(item => {
                    item.billTime = dateUtil.pattern(new Date(item.billTime), 'yyyy-MM-dd HH:mm:ss')
                    item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                    return item
                });
            },
            searchDeliverReport(params) {
                api.request({
                    url: api.consts._LEASE_STORAGE_STAT_IN,
                    params,
                    success: (data) => {
                        this.tableView = this.handleTableView(data.result.rows);

                        let {page, total} = data.result.sum;
                        this.total = total.rows;
                        this.currentCount = new Count(page.rows, page.depositCost)
                        this.totalCount = new Count(total.rows, total.depositCost)
                    }
                })
                this.tableView = []
            },
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, pager => {
                    if (!this.initStatus) {
                        this.search(pager)
                    }
                })
                this.$on('init', () => {
                    this.initStatus && (this.initStatus = false);
                    this.search({limit: 10, start: 0})
                })
            },
            search(page) {
                let params = {
                    ...this.form,
                    start: 0,
                    limit: 10,
                    query: this.query,
                    storeId: this.storeId
                }
                if (page) {
                    params.limit = page.limit;
                    params.start = page.start;
                }
                this.searchDeliverReport(params)
            },
            initData() {
                this.stores = baseUtil.getMetadata().stores
                this.categories = baseUtil.getMetadataCategory()
                this.gems = baseUtil.getMetadataGem()
                this.metals = baseUtil.getMetadataMetal()
                this.form = {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    wareHouseId: '',
                    gemId: '',
                    metalId: '',
                    categoryId: ''
                };
                this.query = ''
            },
            refreshTable() {
                PaginationEvent.$emit(this.CONST_RESTORE)
            },
            watchFun() {
                this.$watch('form', function () {
                    this.search()
                }, {deep: true})
                this.$watch('storeId', function (val) {
                    this.wareHouses = baseUtil.getMetadataWareHouseByStoreId(val);
                    this.search()
                })
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
        },
        mounted() {
            this.stores = baseUtil.getMetadataStore();
            this.initData()
            this.watchFun();
        }
    }
</script>
<style scoped>
    .span_title {
        margin-right: 10px;
        font-weight: bold;
    }
</style>
