<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="input-daterange input-group">
                    <span>
                        <DatePicker
                            field="myDate1"
                            placeholder="起始日期"
                            v-model="form.startYmd"
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
                            v-model="form.endYmd"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                </div>
            </div>
            <div class="form-group form-group-margin">
                <select class="form-control" v-model="form.vendorId">
                    <option value="">供货商</option>
                    <option v-for="vendor in vendors" :value="vendor.id">{{ vendor.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <select class="form-control" v-model="form.creatorId">
                    <option value="">出库人</option>
                    <option v-for="staff in staffs" :value="staff.id">{{ staff.nickName }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <select class="form-control" v-model="form.status">
                    <option value="">状态</option>
                    <option v-for="statu in status" :value="statu.value">{{ statu.name }}</option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="col-md-4">
                <input type="text" class="form-control" style="display: inline-block; max-width: 150px"
                       v-model="query" @keyup.enter="search()" ref="query"
                       placeholder="单号、质量"/>
                <button class="btn btn-info" style="margin: 0 10px 3px" @click="search()">搜索</button>
                <button class="btn btn-warning" style="margin-bottom: 3px" @click="restore">重置</button>
            </div>
            <div class="col-md-8" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-danger'],
                                btnName: '新增'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                titleName:'新增'
                            }">
                    <SaleReturnAddPre slot="main"
                                      :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                      :passed="passed"
                    ></SaleReturnAddPre>
                </ButtonWithModal>
            </div>
        </div>

        <TableCpn :heads="[
            {propName:'billNumber',name:'出库单号'},
            {propName:'createTime',name:'创建时间'},
            {propName:'vendorId',name:'供货商'},
            {propName:'weight',name:'总质量', unit: 'g'},
            {propName:'amount',name:'件数'},
            {propName:'costPrice',name:'采购成本', unit: '元'},
            {propName:'regularPrice',name:'原价', unit: '元'},
            {propName:'computedProcessingCharges',name:'工费', unit: '元/件'},
            {propName:'creatorId',name:'出库人'},
            {propName:'status',name:'状态'},
            {tag:'BUTTON',name:'操作'}
            ]" :items="getSaleReturnItems">
            <div v-for="(item,index) in getSaleReturnItems" :slot="'BUTTON'+index">
                <button type="button" class="btn btn-sm btn-default" @click="detailSaleReturnBill(item)">详情</button>
                <button type="button" class="btn btn-sm btn-default" @click="deleteSaleReturnBill(item)">删除</button>
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
    import DatePicker from '~/components/DatePicker'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import SaleReturnAdd from '~/components/storage/stock/SaleReturnAdd'
    import SaleReturnAddPre from '~/components/storage/stock/SaleReturnAddPre'
    import {dateUtil, baseUtil, constUtil} from '~/util'
    import {mapGetters, mapState, mapMutations, mapActions} from 'vuex'
    import uuid from 'uuid'
    import TableCpn from '~/components/Table'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent'

    export default {
        components: {
            DatePicker,
            ButtonWithModal,
            SaleReturnAddPre,
            TableCpn,
            Pagination
        },
        props: ['passed'],
        data() {
            return {
                vendors: [],
                staffs: [],
                status: constUtil._CONST_RETURN_BILL_TYPE,
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                // 参数
                form: {
                    storeId: '',
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    vendorId: '',
                    status: '',
                    creatorId: ''
                },
                query: ''
            }
        },
        computed: {
            ...mapState('storage/stock/saleReturnMain', {}),
            ...mapGetters('storage/stock/saleReturnMain', {
                total: 'getTotal',
                getSaleReturnItems: 'getSaleReturnItems'
            })
        },
        methods: {
            ...mapMutations('storage/stock/saleReturnAdd', {
                resetSaleReturnBill: 'resetSaleReturnBill'
            }),
            ...mapActions('storage/stock/saleReturnMain', {
                apiGetSaleReturnItems: 'apiGetSaleReturnItems',
                apiDeleteSaleReturnBill: 'apiDeleteSaleReturnBill'
            }),
            initData() {
                this.vendors = baseUtil.getMetadataVendors()
                this.staffs = baseUtil.getMetadataStaffs()
                this.form = {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    vendorId: '',
                    storeId: baseUtil.getStore().id,
                    status: '',
                    creatorId: ''
                }
            },
            search(page) {
                let params = {...this.form, limit: 10, start: 0, query: this.query}
                if (page) {
                    let {start, limit} = page
                    params.limit = limit;
                    params.start = start;
                }
                this.apiGetSaleReturnItems(params)
                this.$refs.query.select()
            },
            restore() {
                this.form = {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    vendorId: '',
                    storeId: baseUtil.getStore().id,
                    status: '',
                    creatorId: ''
                }
                this.query = ''
            },
            detailSaleReturnBill(item) {
                console.log(item)
                this.resetSaleReturnBill(item)
                this.passed.canChange = false
                this.passed.changeCurrCpn(SaleReturnAdd)
            },
            deleteSaleReturnBill(item) {
                this.apiDeleteSaleReturnBill({
                    params: {
                        billId: item.id
                    },
                    callback: () => {
                        this.search({limit: 10, start: 0})
                    }
                })
            },
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, pager => {
                    this.search(pager)
                })
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
        },
        mounted() {
            this.initData()
            this.$on('init', () => {
                this.restore();
            });
            this.$watch('form', function () {
                this.search()
            }, {deep: true});
        }
    }
</script>
