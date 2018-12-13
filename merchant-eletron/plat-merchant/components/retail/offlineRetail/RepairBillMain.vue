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
        </div>
        <div class="row">
            <div class="col-md-4">
                <input type="text" class="form-control" style="display: inline-block; max-width: 150px" ref="query"
                       placeholder="单号" v-model="query" @keyup.enter="search()">
                <button class="btn btn-info" style="margin: 0 10px 3px" @click="search()">搜索</button>
            </div>
            <div class="col-md-8" style="text-align: right">
                <button type="button" class="btn btn-danger" @click="add">
                    <i class="fa fa-plus-square">&nbsp;&nbsp;新增</i></button>
            </div>
        </div>
        <TableCpn
            :heads="[
                {propName:'createTime',name:'日期'},
                {propName:'telephone',name:'用户手机号'},
                {propName:'billNumber',name:'维修单号'},
                {propName:'serial',name:'商品条码'},
                {propName:'repairDetail',name:'维修详情'},
                {tag:'BUTTON',name:'操作'}
            ]"
            :items="getRepairBills">
            <span v-for="(item,index) in getRepairBills" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-sm btn-primary'],
                                btnName: '修改'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'update'+index,
                                titleName: '修改维修信息'
                            }">
                    <ModifyRepairDetail
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'update'+index"
                        :item="item"
                        :refreshTable="refreshTable"
                    >
                    </ModifyRepairDetail>
                </ButtonWithModal>
            </span>
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
    import {mapActions, mapGetters, mapMutations} from 'vuex'
    import RepairBillAdd from '~/components/retail/offlineRetail/RepairBillAdd'
    import ModifyRepairDetail from '~/components/retail/offlineRetail/ModifyRepairDetail'
    import TableCpn from '~/components/Table'
    import DatePicker from '~/components/DatePicker';
    import {dateUtil} from '~/util'
    import uuid from 'uuid'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent';
    import ButtonWithModal from '~/components/ButtonWithModal'

    export default {
        props: ['passed'],
        components: {
            TableCpn,
            ButtonWithModal,
            DatePicker,
            ModifyRepairDetail,
            Pagination
        },
        data() {
            return {
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-')
                },
                query: ''
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/repairBillMain', {
                getRepairBills: 'getRepairBills',
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
            ...mapActions('retail/offlineRetail/repairBillMain', {
                apiGetRepairBill: 'apiGetRepairBill'
            }),
            add() {
                this.passed.changeCurrCpn(RepairBillAdd)
            },
            search(page, initParams) {
                let params = {...this.form, limit: 20, start: 0, query: this.query}
                if (page) {
                    params.start = page.start;
                    params.limit = page.limit;
                }
                if (initParams) {
                    params = {...initParams}
                }
                this.apiGetRepairBill({params})
                this.$refs.query.select()
            },
            clickModify(item) {
                this.passed.changeCurrCpn(RepairBillAdd)
                // todo
            },
            registerPaginationEvent() {
                PaginationEvent.$off(this.CONST_CHANGE_PAGE)
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, pager => {
                    this.search(pager)
                })
            },
            refreshTable() {
                this.search();
            },
            initData() {
                this.form = {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-')
                }
                this.query = ''
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
        },
        mounted() {
            this.initData()
            this.$on('init', () => {
                this.search({
                    start: 0,
                    limit: 20
                })
            });
            this.$watch('form', function () {
                this.search();
            }, {deep: true})
        }
    }
</script>

<style>

</style>
