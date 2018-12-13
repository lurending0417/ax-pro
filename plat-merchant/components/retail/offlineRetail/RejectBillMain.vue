<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="input-daterange input-group">
                    <span>
                        <DatePicker
                            field="reject_start_date"
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
                            field="reject_end_date"
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
                <label class="titleNameSize">退货仓库</label>
                <select class="form-control" style="margin-left: 15px" v-model="form.wareHouseId">
                    <option value="">全部</option>
                    <option v-for="wareHouse in getRejectWareHouse" :value="wareHouse.id">{{ wareHouse.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <label class="titleNameSize">退款状态</label>
                <select class="form-control" style="margin-left: 15px" v-model="form.paid">
                    <option value="">全部</option>
                    <option value="true">已退款</option>
                    <option value="false">未退款</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <label class="titleNameSize">退款员工</label>
                <select class="form-control" style="margin-left: 15px" v-model="form.salesmanId">
                    <option value="">全部</option>
                    <option v-for="staff in getStaffs" :value="staff.id">{{ staff.nickName }}</option>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <input type="text" class="form-control" style="display: inline-block; max-width: 150px" ref="queryInput"
                       placeholder="单号" v-model="query" @keyup.enter="search()">
                <button class="btn btn-info" style="margin: 0 10px 3px" @click="search()">搜索</button>
            </div>
            <div class="col-md-8" style="text-align: right">
                <button type="button" class="btn btn-danger" @click="add"><i
                    class="fa fa-plus-square">&nbsp;&nbsp;新增</i></button>
            </div>
        </div>
        <TableCpn
            :heads="[
                {propName:'billNumber',name:'退货单号'},
                {propName:'wareHouseId',name:'退货仓库'},
                {propName:'amount',name:'商品数量'},
                {propName:'refundCost',name:'退款金额'},
                {propName:'paid',name:'退款状态'},
                {propName:'salesmanId',name:'退货员工'},
                {tag:'BUTTON',name:'操作'}
            ]"
            :items="getRejectBills">
            <button v-for="(item,index) in getRejectBills" class="btn btn-sm btn-default"
                    :slot="'BUTTON'+index" @click="clickDetailRejectBill(item)">详情
            </button>
            <button v-for="(item,index) in getRejectBills" class="btn btn-sm btn-default" v-if="item.paid === '未退款'"
                    :slot="'BUTTON'+index" @click="jump2payment(item.billNumber)">收银
            </button>
            <button v-for="(item,index) in getRejectBills" class="btn btn-sm btn-default" v-if="item.paid === '未退款'"
                    :slot="'BUTTON'+index" @click="clickDeleteRejectBill(item)">删除
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
    import {mapActions, mapGetters, mapMutations} from 'vuex'
    import RejectBillAdd from '~/components/retail/offlineRetail/RejectBillAdd'
    import TableCpn from '~/components/Table'
    import DatePicker from '~/components/DatePicker';
    import {dateUtil, baseUtil} from '~/util'
    import uuid from 'uuid'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent';
    import {ChangeTabEvent} from '~/components/ChangeTabEvent'
    // import {TabsEvent} from '~/components/TabsEvent'

    export default {
        props: ['passed'],
        components: {
            TableCpn,
            DatePicker,
            Pagination
        },
        data() {
            return {
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                getStaffs: [],
                getRejectWareHouse: [],
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    wareHouseId: '',
                    paid: '',
                    salesmanId: ''
                },
                query: ''
            }
        },
        watch: {
            'form': {
                handler: function () {
                    this.search()
                },
                deep: true
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/rejectBillMain', {
                getRejectBills: 'getRejectBills',
                total: 'getTotal'
            })
        },
        methods: {
            ...mapMutations('retail/offlineRetail/rejectBillAdd', {
                resetCanChange: 'resetCanChange',
                clearData: 'clearData',
                resetPaymentBills: 'resetPaymentBills',
                resetRejectDetailInfo: 'resetRejectDetailInfo'
            }),
            ...mapActions('retail/offlineRetail/rejectBillMain', {
                apiGetRejectBill: 'apiGetRejectBill',
                apiDeleteRejectBill: 'apiDeleteRejectBill'
            }),
            ...mapActions('retail/offlineRetail/rejectBillAdd', {
                apiGetRejectBillItem: 'apiGetRejectBillItem'
            }),
            jump2payment(billId) {
                // 跳转到收银页面，进行收银操作
                ChangeTabEvent.$emit('JUMP_TO_PAYMENT', billId)
            },
            add() {
                this.clearData()
                this.resetPaymentBills([])
                this.resetCanChange(true)
                this.resetRejectDetailInfo({})
                this.passed.changeCurrCpn(RejectBillAdd)
            },
            search(page, initParams) {
                let params = {...this.form, limit: 10, start: 0, query: this.query}
                if (page) {
                    params.start = page.start;
                    params.limit = page.limit;
                }
                if (initParams) {
                    params = {...initParams}
                }
                this.apiGetRejectBill(params)
                this.$refs.queryInput.select()
            },
            clickDetailRejectBill(item) {
                this.apiGetRejectBillItem({
                    params: {
                        billId: item.id
                    },
                    callback: () => {
                        this.resetCanChange(false)
                        this.resetRejectDetailInfo(item)
                        this.passed.changeCurrCpn(RejectBillAdd)
                    }
                })
            },
            clickDeleteRejectBill(item) {
                this.apiDeleteRejectBill({
                    params: {
                        billId: item.id
                    },
                    callback: () => {
                        this.search()
                    }
                })
            },
            registerPaginationEvent() {
                PaginationEvent.$off(this.CONST_CHANGE_PAGE)
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, pager => {
                    this.search(pager)
                })
            },
            initData() {
                let recycleWareHouse = []
                baseUtil.getStore() && baseUtil.getMetadataWareHouseByStoreId(baseUtil.getStore().id).forEach(wareHouse => {
                    if (wareHouse.recycle === true) {
                        recycleWareHouse.push(wareHouse)
                    }
                })
                this.getRejectWareHouse = recycleWareHouse
                this.getStaffs = baseUtil.getMetadataStaffs()
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
        },
        mounted() {
            console.log('退货单上层组件  mounted');
            this.initData()
            this.$on('rejectBill', () => {
                this.search({
                    start: 0,
                    limit: 10,
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    wareHouseId: '',
                    paid: '',
                    salesmanId: '',
                    query: ''
                })
            });
        }
    }
</script>

<style>

</style>
