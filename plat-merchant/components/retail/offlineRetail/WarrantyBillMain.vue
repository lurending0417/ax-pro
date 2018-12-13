<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="input-daterange input-group">
                    <span>
                        <DatePicker
                            field="myDate5"
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
                            field="myDate6"
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
                <input v-model="query" type="text" class="form-control"
                       style="display: inline-block; max-width: 150px" @keyup.enter="search()" ref="query"
                       placeholder="单号">
                <button class="btn btn-info" style="margin: 0 10px 3px" @click="search()">搜索</button>
            </div>
            <div class="col-md-8" style="text-align: right">
                <button type="button" class="btn btn-danger" @click="add">
                    <i class="fa fa-plus-square">&nbsp;&nbsp;新增</i>
                </button>
            </div>
        </div>
        <TableCpn
            :heads="[
                {propName:'billNumber',name:'质保单号'},
                {propName:'createTime',name:'日期'},
                {propName:'storeName',name:'门店'},
                {propName:'telephone',name:'客户手机号'},
                {propName:'remark',name:'备注'},
                {name:'操作', tag:'BUTTON'}
            ]"
            :items="getWarrantyBills">
            <div v-for="(item,index) in getWarrantyBills" :slot="'BUTTON'+index">
                <button type="button" class="btn btn-sm btn-default"
                        @click="clickDetailWarrantyBill(item)">详情
                </button>
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
    import {mapActions, mapGetters, mapMutations} from 'vuex'
    import WarrantyBillAdd from '~/components/retail/offlineRetail/WarrantyBillAdd'
    import WarrantyBillDetail from '~/components/retail/offlineRetail/WarrantyBillDetail'
    import TableCpn from '~/components/Table'
    import Pagination from '~/components/Pagination';
    import {PaginationEvent} from '~/components/PaginationEvent';
    import uuid from 'uuid'
    import DatePicker from '~/components/DatePicker'
    import {dateUtil} from '~/util'
    // import {TabsEvent} from '~/components/TabsEvent'

    export default {
        props: ['passed'],
        components: {
            DatePicker,
            TableCpn,
            Pagination
        },
        data() {
            return {
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                query: '',
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-')
                }
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/warrantyBillMain', {
                getWarrantyBills: 'getWarrantyBills',
                total: 'getTotal'
            })
        },
        methods: {
            ...mapMutations('retail/offlineRetail/warrantyBillMain', {
                resetWarrantyBillItem: 'resetWarrantyBillItem'
            }),
            ...mapActions('retail/offlineRetail/warrantyBillMain', {
                apiGetWarrantyBills: 'apiGetWarrantyBills',
                apiGetWarrantyBillItem: 'apiGetWarrantyBillItem'
            }),
            add() {
                this.passed.changeCurrCpn(WarrantyBillAdd)
            },
            clickDetailWarrantyBill(item) {
                this.resetWarrantyBillItem(item);
                this.apiGetWarrantyBillItem({
                    params: {
                        billId: item.id
                    },
                    callBack: () => {
                        this.passed.changeCurrCpn(WarrantyBillDetail)
                    }
                })
            },
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, pager => {
                    this.search(pager)
                })
            },
            search(page) {
                let params = {...this.form, limit: 10, start: 0, query: this.query}
                if (page) {
                    params.limit = page.limit
                    params.start = page.start
                }
                this.apiGetWarrantyBills(params)
                this.$refs.query.select()
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
            this.initData();
            this.$on('warrantyBill', () => {
                this.search()
            });
            this.$watch('form', function () {
                this.search()
            }, {deep: true})
        }
    }
</script>

<style>

</style>
